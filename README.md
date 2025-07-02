
# Model Control Panel (MCP) API

A unified FastAPI gateway for AI model services.

## Features

- **Centralized API Key Management**: Secure storage and retrieval
- **Authentication**: JWT-based authentication
- **Model Proxies**:
  - OpenAI Chat Completions
  - Hugging Face Text Generation
  - Eleven Labs Text-to-Speech
  - Vector Database Search

## Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd mcp-api

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn src.main:app --reload
```

### Environment Variables

Configure the following environment variables:

```
JWT_SECRET=your-secure-jwt-secret
ENCRYPTION_KEY=your-secure-encryption-key
KEYS_FILE=path/to/keys.json
```

You can also directly set API keys as environment variables:

```
OPENAI_API_KEY=your-openai-key
HUGGINGFACE_API_KEY=your-huggingface-key
ELEVENLABS_API_KEY=your-elevenlabs-key
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Usage Examples

### Chat Completion

```bash
curl -X POST "http://localhost:8000/proxy/openai/chat" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"What is the capital of France?", "model":"gpt-4o-mini"}'
```

### Text to Speech

```bash
curl -X POST "http://localhost:8000/proxy/elevenlabs/tts" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world", "voice_id":"EXAVITQu4vr4xnSDxMaL"}'
```

## Key Management API

Add or update an API key:

```bash
curl -X PUT "http://localhost:8000/admin/keys/OPENAI_API_KEY" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"key":"your-openai-key", "service":"OPENAI_API_KEY"}'
```

List available keys:

```bash
curl -X GET "http://localhost:8000/admin/keys" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

## Testing

### Running Tests

The project includes comprehensive test coverage for all API endpoints and functionality.

#### Prerequisites

Install test dependencies:
```bash
pip install -r requirements.txt
```

#### Running the Test Suite

Run all tests:
```bash
# Set Python path and run tests
PYTHONPATH=src pytest tests/ -v

# Run with coverage report
PYTHONPATH=src pytest tests/ --cov=src --cov-report=html

# Run specific test files
PYTHONPATH=src pytest tests/test_auth.py -v
PYTHONPATH=src pytest tests/test_schedule.py -v
```

#### Test Structure

- `tests/conftest.py` - Pytest fixtures and test configuration
- `tests/test_auth.py` - Authentication and authorization tests
- `tests/test_schedule.py` - Schedule CRUD operation tests
- `tests/api/test_main.py` - Basic API endpoint tests

#### Linting and Code Quality

Run code quality checks:
```bash
# Check code formatting
black --check src/ tests/

# Format code
black src/ tests/

# Run linting
flake8 src/ --count --select=E9,F63,F7,F82 --show-source --statistics
flake8 src/ --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics
```

## CI/CD Pipeline

### GitHub Actions Workflow

The project includes an automated CI/CD pipeline that runs on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

#### Pipeline Stages

1. **Testing** (Python 3.9, 3.10, 3.11, 3.12)
   - Install dependencies
   - Run linting (flake8)
   - Check code formatting (black)
   - Execute test suite with pytest
   - Generate coverage reports

2. **Security Scanning**
   - Safety check for known vulnerabilities
   - Bandit security analysis

3. **Build & Deploy** (main branch only)
   - Test server startup
   - Build Docker image (if Dockerfile exists)
   - Create deployment artifacts

#### Workflow Configuration

The CI/CD pipeline is defined in `.github/workflows/ci.yml` and includes:

- **Multi-Python version testing**: Ensures compatibility across Python versions
- **Code quality enforcement**: Automatic linting and formatting checks
- **Security scanning**: Vulnerability detection in dependencies
- **Automated deployment**: Creates deployment-ready artifacts
- **Coverage reporting**: Integration with Codecov for coverage tracking

#### Setting up CI/CD

1. **Environment Variables**: Set required secrets in GitHub repository settings:
   - `CODECOV_TOKEN` (optional, for coverage reporting)

2. **Branch Protection**: Configure branch protection rules for `main`:
   - Require status checks to pass
   - Require branches to be up to date
   - Require linear history

3. **Deployment**: The pipeline creates deployment artifacts that can be used with your preferred deployment platform.

### Local Development Workflow

1. **Setup Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   pip install -r requirements.txt
   ```

2. **Development Cycle**:
   ```bash
   # Make changes to code
   # Format code
   black src/ tests/
   
   # Run tests
   PYTHONPATH=src pytest tests/ -v
   
   # Run linting
   flake8 src/
   
   # Commit changes
   git add .
   git commit -m "feat: your changes"
   git push
   ```

3. **The CI/CD pipeline will automatically**:
   - Run all tests
   - Check code quality
   - Run security scans
   - Create deployment artifacts (on main branch)

## Security Notes

- In production, use proper secret management (AWS Secrets Manager, HashiCorp Vault, etc.)
- Rotate the JWT and encryption keys regularly
- Set up proper CORS restrictions for production environments

## License

[Insert your license information here]
