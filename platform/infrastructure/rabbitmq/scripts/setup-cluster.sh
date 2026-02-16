#!/bin/bash
# ===========================================
# EduMind RabbitMQ Cluster Setup Script
# ===========================================
# This script initializes the RabbitMQ cluster
# Run this after all nodes are healthy
# ===========================================

set -e

echo "🐰 EduMind RabbitMQ Cluster Setup"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ADMIN_USER="${RABBITMQ_ADMIN_USER:-edumind_admin}"
ADMIN_PASS="${RABBITMQ_ADMIN_PASS:-EduM1nd_Adm!n_2024}"
VHOST="edumind"

# Wait for nodes to be ready
echo "⏳ Waiting for RabbitMQ nodes to be ready..."

wait_for_node() {
    local node=$1
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if docker exec $node rabbitmq-diagnostics -q check_running 2>/dev/null; then
            echo -e "${GREEN}✓${NC} $node is ready"
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 2
    done
    
    echo -e "${RED}✗${NC} $node failed to start"
    return 1
}

wait_for_node "edumind-rabbitmq-node1"
wait_for_node "edumind-rabbitmq-node2"
wait_for_node "edumind-rabbitmq-node3"

echo ""
echo "🔗 Joining nodes to cluster..."

# Join node2 to the cluster
echo "Joining node2 to cluster..."
docker exec edumind-rabbitmq-node2 rabbitmqctl stop_app
docker exec edumind-rabbitmq-node2 rabbitmqctl reset
docker exec edumind-rabbitmq-node2 rabbitmqctl join_cluster rabbit@rabbitmq-node1
docker exec edumind-rabbitmq-node2 rabbitmqctl start_app
echo -e "${GREEN}✓${NC} Node2 joined cluster"

# Join node3 to the cluster
echo "Joining node3 to cluster..."
docker exec edumind-rabbitmq-node3 rabbitmqctl stop_app
docker exec edumind-rabbitmq-node3 rabbitmqctl reset
docker exec edumind-rabbitmq-node3 rabbitmqctl join_cluster rabbit@rabbitmq-node1
docker exec edumind-rabbitmq-node3 rabbitmqctl start_app
echo -e "${GREEN}✓${NC} Node3 joined cluster"

echo ""
echo "📊 Cluster Status:"
docker exec edumind-rabbitmq-node1 rabbitmqctl cluster_status

echo ""
echo "👥 Creating service users..."

# Function to create user with permissions
create_service_user() {
    local username=$1
    local password=$2
    local configure_pattern=$3
    local write_pattern=$4
    local read_pattern=$5
    
    echo "Creating user: $username"
    docker exec edumind-rabbitmq-node1 rabbitmqctl add_user "$username" "$password" 2>/dev/null || \
        docker exec edumind-rabbitmq-node1 rabbitmqctl change_password "$username" "$password"
    
    docker exec edumind-rabbitmq-node1 rabbitmqctl set_permissions -p "$VHOST" "$username" \
        "$configure_pattern" "$write_pattern" "$read_pattern"
    
    echo -e "${GREEN}✓${NC} User $username created"
}

# Create service-specific users
create_service_user "edumind_user_service" \
    "${RABBITMQ_USER_SERVICE_PASS:-UserSvc_P@ss_2024}" \
    "^(user\\.|edumind\\.user\\.).*" \
    "^(user\\.|edumind\\.user\\.|edumind\\.events\\.).*" \
    "^(user\\.|edumind\\.user\\.|edumind\\.events\\.).*"

create_service_user "edumind_xai_service" \
    "${RABBITMQ_XAI_SERVICE_PASS:-XaiSvc_P@ss_2024}" \
    "^(xai\\.|edumind\\.xai\\.).*" \
    "^(xai\\.|edumind\\.xai\\.|edumind\\.events\\.).*" \
    "^(xai\\.|edumind\\.xai\\.|edumind\\.events\\.).*"

create_service_user "edumind_engagement_service" \
    "${RABBITMQ_ENGAGEMENT_SERVICE_PASS:-EngSvc_P@ss_2024}" \
    "^(engagement\\.|edumind\\.engagement\\.).*" \
    "^(engagement\\.|edumind\\.engagement\\.|edumind\\.events\\.).*" \
    "^(engagement\\.|edumind\\.engagement\\.|edumind\\.events\\.).*"

create_service_user "edumind_learning_style_service" \
    "${RABBITMQ_LEARNING_STYLE_SERVICE_PASS:-LsSvc_P@ss_2024}" \
    "^(learning_style\\.|edumind\\.learning_style\\.).*" \
    "^(learning_style\\.|edumind\\.learning_style\\.|edumind\\.events\\.).*" \
    "^(learning_style\\.|edumind\\.learning_style\\.|edumind\\.events\\.).*"

echo ""
echo "📬 Creating exchanges and queues..."

# Create exchanges
docker exec edumind-rabbitmq-node1 rabbitmqadmin -u "$ADMIN_USER" -p "$ADMIN_PASS" -V "$VHOST" \
    declare exchange name=edumind.events type=topic durable=true

docker exec edumind-rabbitmq-node1 rabbitmqadmin -u "$ADMIN_USER" -p "$ADMIN_PASS" -V "$VHOST" \
    declare exchange name=edumind.commands type=direct durable=true

docker exec edumind-rabbitmq-node1 rabbitmqadmin -u "$ADMIN_USER" -p "$ADMIN_PASS" -V "$VHOST" \
    declare exchange name=edumind.dlx type=fanout durable=true

echo -e "${GREEN}✓${NC} Exchanges created"

# Create queues (quorum queues for high availability)
create_queue() {
    local queue_name=$1
    docker exec edumind-rabbitmq-node1 rabbitmqadmin -u "$ADMIN_USER" -p "$ADMIN_PASS" -V "$VHOST" \
        declare queue name="$queue_name" durable=true arguments='{"x-queue-type":"quorum"}'
    echo -e "${GREEN}✓${NC} Queue $queue_name created"
}

create_queue "edumind.events.user"
create_queue "edumind.events.prediction"
create_queue "edumind.events.engagement"
create_queue "edumind.events.learning-style"
create_queue "edumind.dlq"

echo ""
echo "🔗 Creating bindings..."

# Create bindings
docker exec edumind-rabbitmq-node1 rabbitmqadmin -u "$ADMIN_USER" -p "$ADMIN_PASS" -V "$VHOST" \
    declare binding source=edumind.events destination=edumind.events.user routing_key="user.#"

docker exec edumind-rabbitmq-node1 rabbitmqadmin -u "$ADMIN_USER" -p "$ADMIN_PASS" -V "$VHOST" \
    declare binding source=edumind.events destination=edumind.events.prediction routing_key="prediction.#"

docker exec edumind-rabbitmq-node1 rabbitmqadmin -u "$ADMIN_USER" -p "$ADMIN_PASS" -V "$VHOST" \
    declare binding source=edumind.events destination=edumind.events.engagement routing_key="engagement.#"

docker exec edumind-rabbitmq-node1 rabbitmqadmin -u "$ADMIN_USER" -p "$ADMIN_PASS" -V "$VHOST" \
    declare binding source=edumind.events destination=edumind.events.learning-style routing_key="learning-style.#"

docker exec edumind-rabbitmq-node1 rabbitmqadmin -u "$ADMIN_USER" -p "$ADMIN_PASS" -V "$VHOST" \
    declare binding source=edumind.dlx destination=edumind.dlq

echo -e "${GREEN}✓${NC} Bindings created"

echo ""
echo "📋 Setting up policies..."

# Set HA policy for all queues
docker exec edumind-rabbitmq-node1 rabbitmqctl set_policy -p "$VHOST" \
    "ha-all" "^edumind\\." \
    '{"ha-mode":"all","ha-sync-mode":"automatic"}' \
    --priority 0 --apply-to queues

echo -e "${GREEN}✓${NC} HA policy applied"

# Set DLX policy
docker exec edumind-rabbitmq-node1 rabbitmqctl set_policy -p "$VHOST" \
    "dlx" "^(user|xai|engagement|learning_style)\\." \
    '{"dead-letter-exchange":"edumind.dlx","dead-letter-routing-key":"dead-letter"}' \
    --priority 1 --apply-to queues

echo -e "${GREEN}✓${NC} DLX policy applied"

echo ""
echo "=========================================="
echo -e "${GREEN}🎉 EduMind RabbitMQ Cluster Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "📊 Management UI:"
echo "   - Node 1: http://localhost:15672"
echo "   - Node 2: http://localhost:15673"
echo "   - Node 3: http://localhost:15674"
echo ""
echo "🔐 Admin Credentials:"
echo "   - Username: $ADMIN_USER"
echo "   - Password: $ADMIN_PASS"
echo ""
echo "🔗 Connection URLs for services:"
echo "   - Primary:  amqp://edumind_<service>:<password>@localhost:5672/edumind"
echo "   - Failover: amqp://edumind_<service>:<password>@localhost:5673/edumind"
echo ""
echo "📈 Prometheus Metrics: http://localhost:15692/metrics"
echo ""
