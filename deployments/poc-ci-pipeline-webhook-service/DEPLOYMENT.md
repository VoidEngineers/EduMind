# AI Failure Analyzer - Deployment Guide

## GitHub Actions CI/CD Pipeline

This guide explains the automated deployment pipeline for the AI Failure Analyzer webhook service.

## Pipeline Overview

The deployment pipeline (`deployment-pipeline-for-alert-webhook.yml`) consists of 4 main stages:

### 1. **Integration** (CI)

- Python 3.11 setup
- Dependency installation
- Code linting with flake8
- Code formatting check with black
- Import validation tests
- Configuration validation

### 2. **Build & Push** (CD)

- Docker image build
- Push to AWS ECR
- Tag with commit SHA and `latest`

### 3. **Deployment**

- Deploy to AWS Lightsail
- Pull latest image from ECR
- Stop existing container
- Start new container with environment variables
- Health check verification
- Automatic cleanup

### 4. **Logging**

- Send logs to Grafana Loki
- Track success/failure metrics
- Detailed error reporting

## Required GitHub Secrets

Add these secrets to your GitHub repository:

### AWS Configuration

| Secret Name                   | Description           | Example                                        |
| ----------------------------- | --------------------- | ---------------------------------------------- |
| `AWS_ACCESS_KEY_ID_VIKUM`     | AWS access key ID     | `AKIAIOSFODNN7EXAMPLE`                         |
| `AWS_SECRET_ACCESS_KEY_VIKUM` | AWS secret access key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`     |
| `AWS_REGION`                  | AWS region            | `us-east-1`                                    |
| `AWS_ECR_LOGIN_URI_VIKUM`     | ECR registry URI      | `123456789012.dkr.ecr.us-east-1.amazonaws.com` |

### Lightsail Configuration

| Secret Name               | Description                    | Example                              |
| ------------------------- | ------------------------------ | ------------------------------------ |
| `LIGHTSAIL_HOST_VIKUM`    | Lightsail instance IP/hostname | `12.34.56.78`                        |
| `LIGHTSAIL_USER_UBUNTU`   | SSH username                   | `ubuntu`                             |
| `LIGHTSAIL_SSH_KEY_VIKUM` | SSH private key                | `-----BEGIN RSA PRIVATE KEY-----...` |

### Application Configuration

| Secret Name      | Description                 | Example        |
| ---------------- | --------------------------- | -------------- |
| `OPENAI_API_KEY` | OpenAI API key              | `sk-proj-...`  |
| `GITHUB_TOKEN`   | GitHub PAT with repo access | `ghp_...`      |
| `GITHUB_ORG`     | Your GitHub username        | `yourusername` |

### Logging Configuration

| Secret Name                   | Description              | Example   |
| ----------------------------- | ------------------------ | --------- |
| `GRAFANA_LOKI_USER_CLOUD`     | Grafana Loki username    | `123456`  |
| `GRAFANA_LOKI_TKN_CLOUD`      | Grafana Loki token       | `glc_...` |
| `PERSONAL_GITHUB_TOKEN_VIKUM` | GitHub token for actions | `ghp_...` |

## AWS Infrastructure Setup

### 1. Create ECR Repository

```bash
# Create ECR repository for the webhook service
aws ecr create-repository \
    --repository-name ai-failure-analyzer \
    --region us-east-1

# Get the repository URI (add to GitHub secrets)
aws ecr describe-repositories \
    --repository-names ai-failure-analyzer \
    --query 'repositories[0].repositoryUri' \
    --output text
```

### 2. Set up AWS Lightsail Instance

```bash
# Create a Lightsail instance (or use existing)
# Minimum recommended: 2GB RAM, 1 vCPU

# Example using AWS CLI:
aws lightsail create-instances \
    --instance-names ai-webhook-server \
    --availability-zone us-east-1a \
    --blueprint-id ubuntu_20_04 \
    --bundle-id medium_2_0

# Open port 8000 for the webhook service
aws lightsail put-instance-public-ports \
    --instance-name ai-webhook-server \
    --port-infos fromPort=8000,toPort=8000,protocol=TCP
```

### 3. Configure SSH Access

```bash
# Download the SSH key from Lightsail console
# Add it to GitHub Secrets as LIGHTSAIL_SSH_KEY_VIKUM
```

### 4. Install Docker on Lightsail

```bash
# SSH into your Lightsail instance
ssh -i lightsail-key.pem ubuntu@YOUR_INSTANCE_IP

# Install Docker
sudo apt-get update
sudo apt-get install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# Log out and log back in for group changes to take effect
```

## Pipeline Triggers

The pipeline runs on:

1. **Push to main or develop branch** with changes in:
   - `GitHub-Action/poc-ci-pipeline-webhook-service/**`
   - `.github/workflows/deployment-pipeline-for-alert-webhook.yml`

2. **Pull requests to main branch** with changes in:
   - `GitHub-Action/poc-ci-pipeline-webhook-service/**`

## Monitoring with Grafana

### Loki Labels

```
service_name=ai-failure-analyzer
repo=MLOps-Bootcamp
project=webhook-service
status=success|failure|separator
workflow=<workflow_name>
run_id=<github_run_id>
commit_sha=<github_sha>
actor=<github_actor>
branch=<branch_name>
```

### Example Grafana LogQL Queries

```logql
# All logs for AI Failure Analyzer
{service_name="ai-failure-analyzer"}

# Only failures
{service_name="ai-failure-analyzer", status="failure"}

# Specific workflow run
{service_name="ai-failure-analyzer", run_id="123456789"}

# Failures by actor
sum by (actor) (count_over_time({service_name="ai-failure-analyzer", status="failure"}[24h]))
```

## Testing the Pipeline

### Local Testing

```bash
# Test Docker build locally
cd "GitHub-Action/poc-ci-pipeline-webhook-service"
docker build -t ai-failure-analyzer:test .

# Test run locally
docker run -p 8000:8000 \
  -e OPENAI_API_KEY=your-key \
  -e GITHUB_TOKEN=your-token \
  -e GITHUB_ORG=your-username \
  ai-failure-analyzer:test

# Test health endpoint
curl http://localhost:8000/health
```

### Trigger Pipeline

```bash
# Make a change and push
cd "GitHub-Action/poc-ci-pipeline-webhook-service"
echo "# Test change" >> README.md
git add .
git commit -m "test: trigger deployment pipeline"
git push origin main
```

## Troubleshooting

### Pipeline Fails at Integration

- Check Python syntax errors
- Verify all imports are correct
- Ensure requirements.txt is up to date

### Pipeline Fails at Build

- Verify AWS credentials are correct
- Check ECR repository exists
- Ensure Docker build completes locally

### Pipeline Fails at Deployment

- Check SSH key is correct
- Verify Lightsail instance is running
- Check Docker is installed on Lightsail
- Verify environment variables in secrets

### Container Not Starting

```bash
# SSH into Lightsail and check logs
ssh ubuntu@YOUR_INSTANCE_IP
docker logs ai-failure-analyzer

# Check if port is in use
sudo netstat -tlnp | grep 8000

# Manually test the container
docker run --rm -it ai-failure-analyzer:latest /bin/bash
```

### Health Check Fails

```bash
# Check container status
docker ps | grep ai-failure-analyzer

# Check service logs
docker logs -f ai-failure-analyzer

# Test health endpoint
curl http://localhost:8000/health
```

## Deployment Metrics

Track these metrics in Grafana:

1. **Deployment Frequency**: How often deployments occur
2. **Success Rate**: Percentage of successful deployments
3. **Deployment Duration**: Time from push to live
4. **Failure Rate**: Failed deployments by stage
5. **Recovery Time**: Time to fix and redeploy after failure

## Rollback Procedure

If deployment fails:

```bash
# SSH into Lightsail
ssh ubuntu@YOUR_INSTANCE_IP

# Stop current container
docker stop ai-failure-analyzer
docker rm ai-failure-analyzer

# Pull previous working version (by tag)
docker pull YOUR_ECR_URI/ai-failure-analyzer:PREVIOUS_SHA

# Run previous version
docker run -d -p 8000:8000 --name=ai-failure-analyzer \
  --restart unless-stopped \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  -e GITHUB_TOKEN=$GITHUB_TOKEN \
  -e GITHUB_ORG=$GITHUB_ORG \
  YOUR_ECR_URI/ai-failure-analyzer:PREVIOUS_SHA
```

## Best Practices

1. **Always test locally before pushing**
2. **Use feature branches for development**
3. **Monitor Grafana logs after deployment**
4. **Keep secrets up to date**
5. **Test rollback procedure periodically**
6. **Document any infrastructure changes**

## Future Enhancements

- [ ] Add integration tests
- [ ] Implement blue-green deployment
- [ ] Add staging environment
- [ ] Implement canary deployments
- [ ] Add performance testing
- [ ] Set up automatic rollback on health check failure
- [ ] Add Slack/Discord notifications
- [ ] Implement deployment approval gates

---

**Last Updated**: March 9, 2026
