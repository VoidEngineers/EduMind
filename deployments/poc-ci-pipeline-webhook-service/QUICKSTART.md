# AI Failure Analyzer Service - Quick Reference

## Project Overview

Production-ready webhook service that uses AI to automatically fix CI/CD pipeline failures.

## What's Included

### Core Application (`app/`)

- **main.py** - FastAPI application with webhook endpoint
- **config.py** - Environment-based configuration
- **models.py** - Pydantic data models
- **error_parser.py** - Error log parsing logic
- **repo_service.py** - Git operations (clone, branch, commit)
- **llm_service.py** - OpenAI integration for fix generation
- **patch_service.py** - Patch application with safety checks
- **github_service.py** - GitHub PR creation

### Configuration Files

- **requirements.txt** - Python dependencies
- **.env.example** - Environment variables template
- **.gitignore** - Git ignore patterns

### Deployment Files

- **Dockerfile** - Container image definition
- **docker-compose.yml** - Docker Compose orchestration

### Setup Scripts

- **setup.sh** - Linux/Mac setup script
- **setup.bat** - Windows setup script
- **test_service.py** - Service testing script

### Documentation

- **README.md** - Comprehensive documentation

## Quick Start

### Option 1: Python Virtual Environment (Recommended for Development)

```bash
# Windows
setup.bat

# Linux/Mac
chmod +x setup.sh
./setup.sh
```

Then edit `.env` with your API keys and run:

```bash
python -m app.main
```

### Option 2: Docker (Recommended for Production)

1. Copy `.env.example` to `.env` and configure
2. Run:

```bash
docker-compose up --build
```

## Required API Keys

1. **OpenAI API Key**
   - Get from: https://platform.openai.com/api-keys
   - Add to `.env` as: `OPENAI_API_KEY=sk-...`

2. **GitHub Personal Access Token**
   - Get from: https://github.com/settings/tokens
   - Permissions needed: `repo`, `workflow`
   - Add to `.env` as: `GITHUB_TOKEN=ghp_...`
3. **GitHub Username/Org**
   - For personal repos: Use your GitHub username
   - For org repos: Use your organization name
   - Example: If your repo is `github.com/johndoe/myrepo`, use `GITHUB_ORG=johndoe`

## Testing

1. Start the service:

```bash
python -m app.main
```

2. In another terminal, run tests:

```bash
python test_service.py
```

3. Or manually test with curl:

```bash
curl -X POST http://localhost:8000/pipeline-failure \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "owner/repo-name",
    "branch": "main",
    "commit": "abc123",
    "error_log": "ModuleNotFoundError: No module named '\''pandas'\''"
  }'
```

## API Endpoints

| Endpoint            | Method | Description                   |
| ------------------- | ------ | ----------------------------- |
| `/`                 | GET    | Root health check             |
| `/health`           | GET    | Detailed health status        |
| `/pipeline-failure` | POST   | Webhook for pipeline failures |

## Safety Features

✓ Only modifies configuration files (requirements.txt, Dockerfile, etc.)
✓ Maximum 3 files per fix
✓ Always creates PR (never commits to main)
✓ Comprehensive validation and error handling
✓ Detailed logging of all operations

## Workflow

```
Grafana Alert → POST /pipeline-failure
    ↓
Parse Error Log (error_parser.py)
    ↓
Clone Repository (repo_service.py)
    ↓
Fetch Relevant Files (repo_service.py)
    ↓
Generate Fix via OpenAI (llm_service.py)
    ↓
Apply Patch (patch_service.py)
    ↓
Commit Changes (patch_service.py)
    ↓
Push Branch & Create PR (github_service.py)
```

## Common Issues

**Port already in use:**

```bash
# Change SERVICE_PORT in .env
SERVICE_PORT=8001
```

**Cannot clone repository:**

- Verify GITHUB_TOKEN has correct permissions
- Check repository name format: `org/repo`

**OpenAI timeout:**

- Error logs might be too long
- Increase timeout or reduce context

## Learning Points

This project demonstrates:

- ✓ FastAPI web service development
- ✓ Git automation with GitPython
- ✓ OpenAI/LLM integration
- ✓ GitHub API usage
- ✓ Production-ready Python patterns
- ✓ Docker containerization
- ✓ Environment-based configuration
- ✓ Comprehensive error handling
- ✓ Type hints and Pydantic validation
- ✓ Modular architecture

## Next Steps

1. ✓ Test with actual failing pipelines
2. ✓ Customize allowed file patterns
3. ✓ Add authentication middleware
4. ✓ Implement rate limiting
5. ✓ Add metrics/monitoring (Prometheus)
6. ✓ Create comprehensive test suite
7. ✓ Set up CI/CD for the service itself
8. ✓ Deploy to cloud (AWS/GCP/Azure)

## Integration Examples

### Grafana Alert Webhook

```json
{
  "repo": "${repo_name}",
  "branch": "${branch}",
  "commit": "${commit_sha}",
  "error_log": "${alert_message}"
}
```

### GitHub Actions

```yaml
- name: Notify Failure Analyzer
  if: failure()
  run: |
    curl -X POST http://your-service:8000/pipeline-failure \
      -H "Content-Type: application/json" \
      -d "{\"repo\":\"$GITHUB_REPOSITORY\",\"branch\":\"$GITHUB_REF_NAME\",\"commit\":\"$GITHUB_SHA\",\"error_log\":\"${{ steps.build.outputs.error }}\"}"
```

---

**Built for MLOps Engineers** | Version 1.0.0
