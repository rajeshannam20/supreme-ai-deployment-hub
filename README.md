
# Supreme AI Deployment Hub

A comprehensive cloud deployment and AI agent management platform built with React, TypeScript, and modern web technologies.

## Features

### 🚀 Cloud Deployment Management
- **Multi-Cloud Support**: AWS, Google Cloud Platform, and Microsoft Azure
- **Kubernetes Integration**: Manage EKS, GKE, and AKS clusters
- **Infrastructure as Code**: Deploy and manage cloud resources
- **Real-time Monitoring**: Track deployment status and health

### 🤖 AI Agent Platform
- **Multi-Provider LLM Support**: OpenAI, Anthropic, Google, and more
- **Agent Orchestration**: Create and manage intelligent workflows
- **Memory Management**: Persistent conversation and context storage
- **Tool Integration**: Extensible agent capabilities

### 🔧 Development Tools
- **Git Repository Management**: Complete Git workflow integration
- **Code Analysis**: Intelligent code review and suggestions
- **API Management**: Centralized API key and endpoint management
- **Chrome Extension**: Browser-based AI assistant

### 📊 Monitoring & Analytics
- **Real-time Dashboards**: Deployment and agent performance metrics
- **Logging System**: Comprehensive logging with filtering
- **Cost Optimization**: Track and optimize cloud spending
- **Security Monitoring**: Threat detection and compliance

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/wesship/supreme-ai-deployment-hub.git
cd supreme-ai-deployment-hub

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables

Configure the following environment variables for cloud providers:

```bash
# AWS Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-west-2

# Google Cloud Platform
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json

# Microsoft Azure
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_SUBSCRIPTION_ID=your-subscription-id

# AI Model APIs
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
GOOGLE_AI_API_KEY=your-google-ai-key
```

## Architecture

### Cloud Provider Integration
- **AWS Provider**: Full EKS and EC2 support with boto3 SDK simulation
- **GCP Provider**: Complete GKE and Compute Engine integration
- **Azure Provider**: Comprehensive AKS and VM management

### Git Management
- **Repository Operations**: Clone, pull, push, and branch management
- **Commit History**: Advanced filtering and visualization
- **Stash Management**: Save and restore work-in-progress changes
- **Diff Visualization**: Side-by-side code comparison

### Chrome Extension
- **Background Workers**: Persistent AI agent communication
- **Settings Management**: Secure credential storage
- **Notification System**: Real-time task updates
- **Cross-tab Communication**: Seamless browser integration

## Development

### Project Structure
```
src/
├── components/           # React UI components
│   ├── git/             # Git management components
│   ├── deployment/      # Cloud deployment UI
│   └── ui/              # Reusable UI components
├── services/            # Business logic and API clients
│   ├── git/             # Git operations
│   ├── deployment/      # Cloud provider clients
│   └── api/             # External API integrations
├── pages/               # Application pages
├── contexts/            # React context providers
└── extension/           # Chrome extension code

tests/                   # Test suites
docs/                    # Documentation
```

### Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run cloud provider tests
npm run test src/services/deployment/cloud/providers/
```

## Cloud Providers

### AWS Integration
- **Services**: EKS, EC2, S3, Lambda
- **Authentication**: IAM roles and access keys
- **Regions**: Multi-region deployment support

### Google Cloud Platform
- **Services**: GKE, Compute Engine, Cloud Storage
- **Authentication**: Service account credentials
- **Zones**: Multi-zone cluster management

### Microsoft Azure
- **Services**: AKS, Virtual Machines, Storage
- **Authentication**: Service principal and managed identity
- **Regions**: Global Azure region support

## Chrome Extension

The included Chrome extension provides:
- **Agent Dashboard**: Quick access to AI agents
- **Memory Search**: Find previous conversations
- **Tool Integration**: Browser-based productivity tools
- **Settings Panel**: Configure API endpoints and credentials

To install the extension:
1. Build the project: `npm run build`
2. Open Chrome Extensions: `chrome://extensions/`
3. Enable Developer Mode
4. Load unpacked: Select the `dist` folder

## API Documentation

Once the server is running, visit:
- Application: http://localhost:3000
- API Documentation: Available in the app under `/documentation`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation at `/documentation`
- Review the test files for usage examples
