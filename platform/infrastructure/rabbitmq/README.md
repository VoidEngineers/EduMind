# 🐰 EduMind RabbitMQ Cluster

Production-ready RabbitMQ cluster configuration for EduMind microservices.

## 📋 Table of Contents

- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Security](#security)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    EduMind RabbitMQ Cluster                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐        │
│  │  Node 1      │   │  Node 2      │   │  Node 3      │        │
│  │  (Primary)   │◄─►│  (Replica)   │◄─►│  (Replica)   │        │
│  │  :5672       │   │  :5673       │   │  :5674       │        │
│  │  :15672 (UI) │   │  :15673 (UI) │   │  :15674 (UI) │        │
│  └──────────────┘   └──────────────┘   └──────────────┘        │
│          ▲                 ▲                  ▲                 │
│          │                 │                  │                 │
│          └─────────────────┼──────────────────┘                 │
│                            │                                    │
│                    Quorum Queues                                │
│                   (Replicated Data)                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EduMind Services                           │
├──────────────┬──────────────┬──────────────┬───────────────────┤
│ User Service │ XAI Service  │ Engagement   │ Learning Style    │
│              │              │ Service      │ Service           │
└──────────────┴──────────────┴──────────────┴───────────────────┘
```

## 🚀 Quick Start

### Development Setup

```bash
# 1. Navigate to the RabbitMQ infrastructure directory
cd infra/rabbitmq

# 2. Create the external network (if not exists)
docker network create edumind-network 2>/dev/null || true

# 3. Start the cluster
docker-compose up -d

# 4. Wait for nodes to be healthy (about 60 seconds)
docker-compose ps

# 5. Run the cluster setup script
chmod +x scripts/setup-cluster.sh
./scripts/setup-cluster.sh
```

### Single Node (Simple Development)

If you just need a single node for local development:

```bash
# Use the main docker-compose.yml in the project root
cd /path/to/EduMind
docker-compose up -d rabbitmq
```

## ⚙️ Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `RABBITMQ_ERLANG_COOKIE` | Cluster secret (must match on all nodes) | `edumind_secret_cookie...` |
| `RABBITMQ_ADMIN_USER` | Admin username | `edumind_admin` |
| `RABBITMQ_ADMIN_PASS` | Admin password | `EduM1nd_Adm!n_2024` |

### Virtual Hosts

| VHost | Purpose |
|-------|---------|
| `edumind` | Production/main environment |
| `edumind_dev` | Development environment |
| `edumind_test` | Testing environment |

### Exchanges

| Exchange | Type | Purpose |
|----------|------|---------|
| `edumind.events` | topic | Domain events (user.created, prediction.completed, etc.) |
| `edumind.commands` | direct | Service commands (sync operations) |
| `edumind.dlx` | fanout | Dead letter exchange for failed messages |

### Queues

| Queue | Purpose | Routing Key |
|-------|---------|-------------|
| `edumind.events.user` | User-related events | `user.#` |
| `edumind.events.prediction` | XAI prediction events | `prediction.#` |
| `edumind.events.engagement` | Engagement tracking events | `engagement.#` |
| `edumind.events.learning-style` | Learning style events | `learning-style.#` |
| `edumind.dlq` | Dead letter queue | All failed messages |

## 🔐 Security

### Best Practices Implemented

1. **Per-Service Users**: Each microservice has its own user with limited permissions
2. **Virtual Host Isolation**: Services are isolated to the `edumind` vhost
3. **Permission Patterns**: Regex-based permissions limit what each service can access
4. **Strong Passwords**: Default passwords are complex (change in production!)
5. **No Guest User**: The default guest user is disabled

### Service Users & Permissions

| User | Configure | Write | Read |
|------|-----------|-------|------|
| `edumind_user_service` | `^(user\|edumind\.user\.).*` | `+events` | `+events` |
| `edumind_xai_service` | `^(xai\|edumind\.xai\.).*` | `+events` | `+events` |
| `edumind_engagement_service` | `^(engagement\|edumind\.engagement\.).*` | `+events` | `+events` |
| `edumind_learning_style_service` | `^(learning_style\|edumind\.learning_style\.).*` | `+events` | `+events` |

### Connection Strings for Services

```python
# User Service
RABBITMQ_URL = "amqp://edumind_user_service:UserSvc_P@ss_2024@rabbitmq-node1:5672/edumind"

# XAI Service  
RABBITMQ_URL = "amqp://edumind_xai_service:XaiSvc_P@ss_2024@rabbitmq-node1:5672/edumind"

# Engagement Service
RABBITMQ_URL = "amqp://edumind_engagement_service:EngSvc_P@ss_2024@rabbitmq-node1:5672/edumind"

# Learning Style Service
RABBITMQ_URL = "amqp://edumind_learning_style_service:LsSvc_P@ss_2024@rabbitmq-node1:5672/edumind"
```

## 📊 Monitoring

### Management UI

- **Node 1**: http://localhost:15672
- **Node 2**: http://localhost:15673
- **Node 3**: http://localhost:15674

### Prometheus Metrics

Metrics endpoint: `http://localhost:15692/metrics`

Key metrics to monitor:
- `rabbitmq_queue_messages` - Messages in queues
- `rabbitmq_queue_messages_ready` - Messages ready to be delivered
- `rabbitmq_connections` - Active connections
- `rabbitmq_channels` - Active channels
- `rabbitmq_consumers` - Active consumers

### Health Checks

```bash
# Check cluster status
docker exec edumind-rabbitmq-node1 rabbitmqctl cluster_status

# Check node health
docker exec edumind-rabbitmq-node1 rabbitmq-diagnostics check_running

# List queues
docker exec edumind-rabbitmq-node1 rabbitmqctl list_queues -p edumind name messages consumers
```

## 🔧 Troubleshooting

### Common Issues

#### Nodes won't join cluster

```bash
# Check Erlang cookie is the same on all nodes
docker exec edumind-rabbitmq-node1 cat /var/lib/rabbitmq/.erlang.cookie
docker exec edumind-rabbitmq-node2 cat /var/lib/rabbitmq/.erlang.cookie

# Reset and rejoin
docker exec edumind-rabbitmq-node2 rabbitmqctl stop_app
docker exec edumind-rabbitmq-node2 rabbitmqctl reset
docker exec edumind-rabbitmq-node2 rabbitmqctl join_cluster rabbit@rabbitmq-node1
docker exec edumind-rabbitmq-node2 rabbitmqctl start_app
```

#### Authentication failures

```bash
# Check user exists
docker exec edumind-rabbitmq-node1 rabbitmqctl list_users

# Check permissions
docker exec edumind-rabbitmq-node1 rabbitmqctl list_permissions -p edumind

# Reset password
docker exec edumind-rabbitmq-node1 rabbitmqctl change_password <user> <new_password>
```

#### Queue not replicating

```bash
# Check queue type (should be quorum)
docker exec edumind-rabbitmq-node1 rabbitmqctl list_queues -p edumind name type

# Check quorum queue members
docker exec edumind-rabbitmq-node1 rabbitmqctl list_queues -p edumind name type members
```

### Logs

```bash
# View logs
docker logs edumind-rabbitmq-node1 -f

# Check for errors
docker logs edumind-rabbitmq-node1 2>&1 | grep -i error
```

## 📚 Additional Resources

- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [Quorum Queues](https://www.rabbitmq.com/quorum-queues.html)
- [Clustering Guide](https://www.rabbitmq.com/clustering.html)
- [Production Checklist](https://www.rabbitmq.com/production-checklist.html)
