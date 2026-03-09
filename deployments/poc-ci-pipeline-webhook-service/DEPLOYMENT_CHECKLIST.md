# GitHub Actions Deployment Setup Checklist

## Pre-Deployment Checklist

### 1. AWS Infrastructure Setup

- [ ] Create AWS account (if not exists)
- [ ] Create ECR repository named `ai-failure-analyzer`
- [ ] Note down ECR URI: `____________________________________________`
- [ ] Create/identify Lightsail instance
- [ ] Note down Lightsail IP: `____________________________________________`
- [ ] Open port 8000 on Lightsail firewall
- [ ] Install Docker on Lightsail instance
- [ ] Install AWS CLI on Lightsail instance
- [ ] Download Lightsail SSH key

### 2. GitHub Secrets Configuration

Navigate to: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

#### AWS Secrets

- [ ] Add `AWS_ACCESS_KEY_ID_VIKUM`
- [ ] Add `AWS_SECRET_ACCESS_KEY_VIKUM`
- [ ] Add `AWS_REGION` (e.g., `us-east-1`)
- [ ] Add `AWS_ECR_LOGIN_URI_VIKUM` (ECR registry URI without repo name)

#### Lightsail Secrets

- [ ] Add `LIGHTSAIL_HOST_VIKUM` (IP address or hostname)
- [ ] Add `LIGHTSAIL_USER_UBUNTU` (usually `ubuntu`)
- [ ] Add `LIGHTSAIL_SSH_KEY_VIKUM` (entire private key file content)

#### Application Secrets

- [ ] Add `OPENAI_API_KEY` (from https://platform.openai.com)
- [ ] Add `GITHUB_TOKEN` (PAT with repo, workflow permissions)
- [ ] Add `GITHUB_ORG` (your GitHub username)

#### Monitoring Secrets (Optional)

- [ ] Add `GRAFANA_LOKI_USER_CLOUD`
- [ ] Add `GRAFANA_LOKI_TKN_CLOUD`
- [ ] Add `PERSONAL_GITHUB_TOKEN_VIKUM`

### 3. Repository Setup

- [ ] Workflow file created at `.github/workflows/deployment-pipeline-for-alert-webhook.yml`
- [ ] Application code in `GitHub-Action/poc-ci-pipeline-webhook-service/`
- [ ] Commit and push changes to trigger pipeline

### 4. Testing

- [ ] Pipeline runs successfully on push
- [ ] Integration tests pass
- [ ] Docker build succeeds
- [ ] Deployment to Lightsail completes
- [ ] Health check endpoint responds: `http://LIGHTSAIL_IP:8000/health`
- [ ] Webhook endpoint accessible: `http://LIGHTSAIL_IP:8000/pipeline-failure`

## Quick Start Commands

### Create ECR Repository

```bash
aws ecr create-repository --repository-name ai-failure-analyzer --region us-east-1
```

### Get ECR URI

```bash
aws ecr describe-repositories --repository-names ai-failure-analyzer --query 'repositories[0].repositoryUri' --output text
```

### Test Lightsail SSH Connection

```bash
ssh -i lightsail-key.pem ubuntu@YOUR_LIGHTSAIL_IP
```

### Verify Service After Deployment

```bash
# Health check
curl http://YOUR_LIGHTSAIL_IP:8000/health

# Test webhook
curl -X POST http://YOUR_LIGHTSAIL_IP:8000/pipeline-failure \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "test/repo",
    "branch": "main",
    "commit": "abc123",
    "error_log": "Test error"
  }'
```

## Monitoring

### Check Container Status

```bash
ssh ubuntu@YOUR_LIGHTSAIL_IP
docker ps | grep ai-failure-analyzer
docker logs -f ai-failure-analyzer
```

### View GitHub Actions

- Go to: `Actions` tab in your repository
- Click on latest workflow run
- Review each job for status

### Grafana Dashboard (if configured)

- Login to Grafana Cloud
- Search for logs: `{service_name="ai-failure-analyzer"}`

## Troubleshooting

### Pipeline Fails

1. Check GitHub Actions logs
2. Verify all secrets are correctly added
3. Test AWS credentials locally
4. Ensure ECR repository exists

### Deployment Succeeds but Service Not Accessible

1. Check Lightsail firewall (port 8000 open)
2. SSH into instance and check container: `docker logs ai-failure-analyzer`
3. Verify environment variables are set correctly
4. Test locally: `curl http://localhost:8000/health`

### Container Keeps Restarting

1. Check logs: `docker logs ai-failure-analyzer`
2. Verify OpenAI and GitHub tokens are valid
3. Check for missing environment variables

## Notes

- First deployment may take 5-10 minutes
- Each subsequent deployment is faster (~3-5 minutes)
- Service runs on port 8000
- Auto-restarts on failure (`--restart unless-stopped`)
- Logs retained in container (access via `docker logs`)

## Success Criteria

When everything is working:

- ✓ GitHub Actions workflow shows green checkmarks
- ✓ Container running on Lightsail: `docker ps | grep ai-failure-analyzer`
- ✓ Health endpoint returns JSON: `curl http://IP:8000/health`
- ✓ Service logs show successful startup
- ✓ Webhook endpoint accepts POST requests

---

**Ready to deploy?** Push changes to trigger the pipeline!
