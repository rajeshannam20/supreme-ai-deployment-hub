
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

## Vercel Preview Integration Testing

This repository includes automated integration testing for Vercel preview deployments. Here's how it works:

### Automatic Preview Testing

When you create a pull request or push to a feature branch (non-main), the system automatically:

1. **Deploys to Vercel**: Creates a preview deployment using Vercel's platform
2. **Extracts Preview URL**: Captures the live preview URL from Vercel
3. **Runs Integration Tests**: Executes comprehensive tests against the live deployment
4. **Reports Results**: Posts results as PR comments and commit status checks

### What Gets Tested

The integration tests verify:
- ✅ **Health Check** (`/health`) - API availability
- ✅ **Root Endpoint** (`/`) - Basic API information
- ✅ **Documentation** (`/docs`) - Swagger UI accessibility  
- ✅ **OpenAPI Schema** (`/openapi.json`) - API specification
- ✅ **Authentication** - Admin endpoints require proper auth
- ✅ **Error Handling** - Graceful handling of invalid requests
- ✅ **Response Times** - Performance requirements
- ✅ **CORS Configuration** - Cross-origin request support

### Integration Test Configuration

The tests are configured via environment variables:

```bash
# Run integration tests locally against a deployment
INTEGRATION_TEST_URL=https://your-preview-url.vercel.app python -m pytest tests/integration_test.py -v
```

### Required Secrets

To enable Vercel preview integration testing, configure these repository secrets:

- `VERCEL_TOKEN` - Your Vercel authentication token
- `VERCEL_ORG_ID` - Your Vercel organization ID  
- `VERCEL_PROJECT_ID` - Your Vercel project ID

### Preview Test Results

After each deployment, you'll see:
- 🔗 **Live Preview Link** - Direct access to the deployed application
- 📖 **API Documentation** - Link to the deployed Swagger UI
- ✅/❌ **Test Status** - Pass/fail status for all integration tests
- 📊 **Detailed Results** - Individual test results and timing

### Local Testing

You can run the same integration tests locally:

```bash
# Start the server
uvicorn src.main:app --reload

# In another terminal, run integration tests
INTEGRATION_TEST_URL=http://localhost:8000 python -m pytest tests/integration_test.py -v
```

### Troubleshooting Preview Tests

If preview tests fail:

1. **Check Deployment Logs**: View Vercel deployment logs for build errors
2. **Verify Configuration**: Ensure `vercel.json` is properly configured
3. **Test Locally**: Run integration tests against local server first
4. **Check Dependencies**: Verify all Python dependencies are in `requirements.txt`

The preview testing workflow is designed to catch integration issues early and ensure that every change works correctly in a production-like environment.

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

## License

[Insert your license information here]
