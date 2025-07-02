
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

## Security Notes

- In production, use proper secret management (AWS Secrets Manager, HashiCorp Vault, etc.)
- Rotate the JWT and encryption keys regularly
- Set up proper CORS restrictions for production environments

## Deployment

### Vercel Deployment

This FastAPI application is configured for deployment on Vercel. The project includes the necessary configuration files:

- `vercel.json` - Vercel deployment configuration
- `app/main.py` - Vercel entry point that imports the main FastAPI app

#### Deploy to Vercel

1. **Prerequisites**:
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Link your project**:
   ```bash
   vercel link
   ```

3. **Set environment variables** in Vercel dashboard:
   - Copy values from `.env.example`
   - Set production values for sensitive keys

4. **Deploy**:
   ```bash
   # Deploy to preview
   vercel
   
   # Deploy to production
   vercel --prod
   ```

#### CI/CD with GitHub Actions

The project includes automated deployment via GitHub Actions (`.github/workflows/ci.yml`).

**Required Secrets** (set in GitHub repository settings):
- `VERCEL_TOKEN` - Your Vercel API token
- `VERCEL_ORG_ID` - Your Vercel organization ID  
- `VERCEL_PROJECT_ID` - Your Vercel project ID

Get these values:
1. **VERCEL_TOKEN**: Visit https://vercel.com/account/tokens
2. **VERCEL_ORG_ID & VERCEL_PROJECT_ID**: Found in your Vercel project settings

### Manual Deployment

For other deployment platforms, ensure Python 3.11+ and install dependencies:

```bash
pip install -r requirements.txt
uvicorn src.main:app --host 0.0.0.0 --port 8000
```

## Local Development

### Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd supreme-ai-deployment-hub
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. **Run the development server**:
   ```bash
   uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
   ```

5. **Access the API**:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc
   - API: http://localhost:8000

### Development Tools

#### Linting and Formatting

```bash
# Format code with Black
black src/ app/ tests/ --line-length=88

# Check with flake8
flake8 src/ app/ tests/ --max-line-length=88 --extend-ignore=E203,W503
```

#### Running Tests

```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ -v --cov=src --cov-report=html

# Run specific test file
pytest tests/api/test_main.py -v
```

## Testing

### Test Structure

- `tests/api/` - API endpoint tests
- `tests/unit/` - Unit tests for individual modules
- `tests/integration/` - Integration tests

### Integration Test Workflow

The CI/CD pipeline automatically runs:
1. **Linting** - Code style checks with Black and flake8
2. **Unit Tests** - Fast isolated tests
3. **Integration Tests** - Full API testing with test database
4. **Coverage Reports** - Code coverage analysis

### Running Integration Tests Locally

```bash
# Set test environment
export ENVIRONMENT=test
export JWT_SECRET=test-secret
export ENCRYPTION_KEY=test-key

# Run integration tests
pytest tests/integration/ -v
```

## Rollback

### Vercel Rollback

1. **Via Vercel Dashboard**:
   - Go to your project deployments
   - Click on a previous deployment
   - Click "Promote to Production"

2. **Via CLI**:
   ```bash
   # List deployments
   vercel ls
   
   # Promote specific deployment
   vercel alias set <deployment-url> <your-domain>
   ```

### Git-based Rollback

1. **Revert to previous commit**:
   ```bash
   git log --oneline  # Find commit to revert to
   git revert <commit-hash>
   git push origin main
   ```

2. **Create hotfix branch**:
   ```bash
   git checkout -b hotfix/rollback-issue main~1
   git push origin hotfix/rollback-issue
   # Create PR to main branch
   ```

## Environment Variables

### Required Variables

Copy `.env.example` to `.env` and configure:

#### Security
- `JWT_SECRET` - Secret key for JWT token signing (generate with `openssl rand -hex 32`)
- `ENCRYPTION_KEY` - Key for encrypting stored API keys (generate with `python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"`)

#### External APIs
- `OPENAI_API_KEY` - OpenAI API key for GPT models
- `HUGGINGFACE_API_KEY` - Hugging Face API key
- `ELEVENLABS_API_KEY` - ElevenLabs API key for text-to-speech

#### Database (Optional)
- `DATABASE_URL` - Database connection string if using external database

#### Application Settings
- `ENVIRONMENT` - `development`, `staging`, or `production`
- `DEBUG` - `true` for development, `false` for production
- `LOG_LEVEL` - `debug`, `info`, `warning`, or `error`

### Production Environment Variables

For production deployment, ensure:
1. Strong, unique secrets for `JWT_SECRET` and `ENCRYPTION_KEY`
2. Restricted CORS origins in `ALLOWED_ORIGINS`
3. Appropriate log levels (`info` or `warning`)
4. Database URL for persistent storage (if needed)

### Environment-Specific Configurations

#### Development
```bash
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=debug
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

#### Production
```bash
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=info
ALLOWED_ORIGINS=https://yourdomain.com
```

## License

[Insert your license information here]
