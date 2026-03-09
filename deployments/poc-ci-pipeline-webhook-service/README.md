# AI Failure Analyzer Service

A production-ready webhook service that analyzes CI/CD pipeline failures and automatically creates GitHub Pull Requests with AI-generated fixes.

## Overview

The AI Failure Analyzer Service receives failure alerts from monitoring systems (like Grafana), analyzes the error using AI, and automatically creates a PR with a proposed fix.

### Workflow

```
Webhook → Error Parser → Fetch Repo → LLM Analysis → Generate Patch → Apply Patch → Create PR
```

## Features

- **Automated Error Analysis**: Parses error logs to extract meaningful failure information
- **AI-Powered Fixes**: Uses OpenAI to generate intelligent fixes
- **Safe Operations**: Only modifies allowed configuration files with safety limits
- **GitHub Integration**: Automatically creates well-formatted pull requests
- **Production Ready**: Comprehensive error handling, logging, and type hints
- **CI/CD Pipeline**: Automated deployment to AWS with GitHub Actions
- **Monitoring**: Integrated Grafana Loki logging

## Tech Stack

- **Python 3.11**
- **FastAPI** - Modern web framework
- **GitPython** - Git operations
- **OpenAI API** - LLM-powered fix generation
- **GitHub REST API** - PR creation
- **Pydantic** - Data validation
- **requests** - HTTP client

## Project Structure

```
ai-failure-analyzer/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration management
│   ├── models.py            # Pydantic models
│   ├── error_parser.py      # Error log parsing
│   ├── repo_service.py      # Git operations
│   ├── llm_service.py       # OpenAI integration
│   ├── patch_service.py     # Patch application
│   └── github_service.py    # GitHub API operations
├── requirements.txt
└── README.md
```

## Installation

### Prerequisites

- Python 3.11+
- Git
- GitHub Personal Access Token
- OpenAI API Key

### Setup

1. **Clone the repository**

```bash
cd "MLOps/End-to-End MLOps Bootcamp Build Deploy and Automate ML with Data Science Projects/GitHub-Action/poc-ci-pipeline-webhook-service"
```

2. **Create virtual environment**

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

4. **Configure environment variables**

Create a `.env` file:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4
OPENAI_TEMPERATURE=0.2

# GitHub Configuration
GITHUB_TOKEN=ghp_your-github-token
# For personal repos, use your GitHub username
# Example: If your repo is github.com/yourusername/repo, use:
GITHUB_ORG=yourusername

# Application Configuration
CLONE_DIRECTORY=/tmp/repos
LOG_LEVEL=INFO
SERVICE_PORT=8000
MAX_FILES_TO_MODIFY=3
```

## Configuration

### Environment Variables

| Variable              | Description                             | Default      |
| --------------------- | --------------------------------------- | ------------ |
| `OPENAI_API_KEY`      | OpenAI API key (required)               | -            |
| `OPENAI_MODEL`        | OpenAI model to use                     | `gpt-4`      |
| `OPENAI_TEMPERATURE`  | LLM temperature setting                 | `0.2`        |
| `GITHUB_TOKEN`        | GitHub personal access token (required) | -            |
| `GITHUB_ORG`          | GitHub username or org name (optional)  | -            |
| `CLONE_DIRECTORY`     | Directory for cloning repos             | `/tmp/repos` |
| `LOG_LEVEL`           | Logging level                           | `INFO`       |
| `SERVICE_PORT`        | Service port                            | `8000`       |
| `MAX_FILES_TO_MODIFY` | Max files to modify per fix             | `3`          |

### GitHub Token Permissions

Your GitHub token needs these permissions:

- `repo` (Full control of private repositories)
- `workflow` (Update GitHub Action workflows)

### OpenAI API Key

Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

## Usage

### Running the Service

```bash
# Development mode
python -m app.main

# Production mode with uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### API Endpoints

#### Health Check

```bash
GET /
GET /health
```

#### Pipeline Failure Webhook

```bash
POST /pipeline-failure
```

**Request Body:**

```json
{
  "repo": "org/repository-name",
  "branch": "main",
  "commit": "abc123def456",
  "error_log": "ModuleNotFoundError: No module named 'pandas'"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Successfully created PR #42",
  "pr_url": "https://github.com/org/repo/pull/42"
}
```

### Example cURL Request

```bash
curl -X POST http://localhost:8000/pipeline-failure \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "myorg/myrepo",
    "branch": "main",
    "commit": "abc123",
    "error_log": "ModuleNotFoundError: No module named '\''pandas'\''"
  }'
```

## Safety Features

The service implements multiple safety mechanisms:

1. **File Restrictions**: Only modifies allowed file types:
   - `requirements.txt`
   - `Dockerfile`
   - `pipeline.yml` / workflow files
   - `build.gradle` / `pom.xml`
   - `package.json`
   - `setup.py` / `pyproject.toml`

2. **Modification Limits**: Maximum 3 files per fix

3. **No Direct Commits**: Always creates a PR (never commits to main)

4. **Validation**: All changes are validated before application

## CI/CD Deployment

The service includes a complete GitHub Actions pipeline for automated deployment to AWS.

### Pipeline Stages

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Integration  │ --> │ Build & Push │ --> │  Deployment  │ --> │   Logging    │
│   (CI)       │     │    (ECR)     │     │ (Lightsail)  │     │   (Loki)     │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
     │                     │                     │                     │
     ├─ Lint              ├─ Build Docker       ├─ Pull Image        ├─ Success Log
     ├─ Format Check      ├─ Tag with SHA       ├─ Stop Old          └─ Failure Log
     ├─ Import Tests      └─ Push to ECR        ├─ Start New
     └─ Config Check                             └─ Health Check
```

### Quick Deployment Setup

1. **Configure GitHub Secrets** (see [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md))
   - AWS credentials
   - Lightsail SSH access
   - Application secrets

2. **Push to trigger deployment**

   ```bash
   git add .
   git commit -m "feat: deploy webhook service"
   git push origin main
   ```

3. **Monitor deployment** in GitHub Actions tab

For detailed deployment guide, see:

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment documentation
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Step-by-step setup checklist

### Accessing Deployed Service

After successful deployment:

```bash
# Health check
curl http://YOUR_LIGHTSAIL_IP:8000/health

# Webhook endpoint
curl -X POST http://YOUR_LIGHTSAIL_IP:8000/pipeline-failure \
  -H "Content-Type: application/json" \
  -d '{"repo":"user/repo","branch":"main","commit":"abc123","error_log":"Error message"}'
```

## Logging

The service provides comprehensive logging:

- Webhook received
- Repository cloned
- LLM response received
- Patch applied
- PR created
- All errors and warnings

Logs are formatted with timestamps and severity levels.

## How It Works

### 1. Error Parsing

The service extracts:

- Error type (e.g., `ModuleNotFoundError`)
- Missing modules
- File paths and line numbers
- Relevant keywords

### 2. Repository Analysis

- Clones the repository
- Checks out the failing branch/commit
- Collects relevant configuration files

### 3. AI Analysis

Sends to OpenAI:

- Error log
- Parsed error details
- Repository context
- Relevant files

### 4. Fix Generation

LLM provides:

- Root cause analysis
- Files to modify
- Unified diff patch
- Summary of changes

### 5. Patch Application

- Validates safety rules
- Applies patch to local repository
- Commits changes

### 6. PR Creation

- Pushes new branch
- Creates pull request with:
  - Root cause explanation
  - Changes summary
  - Original error log
  - AI-generated labels

## Development

### Code Style

- Type hints throughout
- Comprehensive docstrings
- Modular architecture
- Clean separation of concerns

### Error Handling

- Proper exception handling
- Graceful degradation
- Detailed error messages
- Automatic cleanup on failure

### Testing

Create a test webhook payload:

```python
import requests

response = requests.post(
    "http://localhost:8000/pipeline-failure",
    json={
        "repo": "your-org/your-repo",
        "branch": "main",
        "commit": "abc123",
        "error_log": "ModuleNotFoundError: No module named 'pandas'"
    }
)

print(response.json())
```

## Example Use Cases

### Python Dependency Error

**Error**: `ModuleNotFoundError: No module named 'pandas'`
**Fix**: Adds `pandas` to `requirements.txt`

### Docker Build Failure

**Error**: `ERROR: Could not find a version that satisfies requirement`
**Fix**: Updates `Dockerfile` with correct Python version

### Workflow Syntax Error

**Error**: `Invalid workflow file`
**Fix**: Corrects YAML syntax in `.github/workflows/*.yml`

### Build Tool Error

**Error**: `Could not resolve dependencies`
**Fix**: Updates `pom.xml` or `build.gradle` dependencies

## Troubleshooting

### Common Issues

**Issue**: Failed to clone repository

- Check GitHub token permissions
- Verify repository name format (`org/repo`)

**Issue**: LLM timeout

- Reduce context size
- Increase timeout settings
- Check OpenAI API status

**Issue**: Patch application failed

- Review patch format
- Check file permissions
- Verify target files exist

## Security Considerations

- Store secrets in environment variables
- Never commit `.env` file
- Use read-only GitHub tokens when possible
- Review AI-generated changes before merging
- Implement rate limiting for production

## License

This project is for educational purposes as part of the MLOps Bootcamp.

## Contributing

This is a proof-of-concept service. For production use, consider:

- Adding authentication
- Implementing rate limiting
- Adding metrics and monitoring
- Implementing retry logic
- Adding comprehensive test suite
- Setting up CI/CD pipeline

## Support

For issues or questions:

1. Check the logs for detailed error messages
2. Verify environment configuration
3. Review the error parsing logic
4. Test with simpler error cases first

## Learning Outcomes

This project demonstrates:

- FastAPI web service development
- Git automation with GitPython
- LLM integration patterns
- GitHub API usage
- Production-ready Python code
- Error handling and logging
- Configuration management
- Service orchestration

---

**Built for MLOps Engineers**
