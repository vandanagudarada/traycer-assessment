# Setup Guide

## Prerequisites
- Node.js 16+
- npm or yarn

## Quick Start

### Option 1: Automated Setup
```bash
./start.sh
```

### Option 2: Manual Setup

**Backend**:
```bash
cd backend
npm install
npm run dev or yarn run dev
```

**Frontend** (new terminal):
```bash
cd frontend
npm install --legacy-peer-deps
npm run serve or yarn run serve
```

## Access
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## AI Features (Optional)

### Option 1: Azure OpenAI
1. Get Azure OpenAI credentials from [Azure Portal](https://portal.azure.com)
2. Create `backend/.env`:
   ```env
   # Server Configuration
   PORT=3001

   # Azure OpenAI Configuration
   OPEN_AI_AZURE_ENDPOINT=your-azure-endpoint
   OPEN_AI_API_KEY=your-azure-openai-api-key
   OPEN_AI_API_VERSION=your-azure-open-ai-version
   OPEN_AI_DEPLOYMENT_NAME=your-deployment-name
   ```
3. Restart backend server
4. Toggle "Use AI Enhancement" in Planning Studio

**Note**: App works perfectly without AI using rule-based planning.

## Troubleshooting

**Port conflicts**: Change ports in respective `.env` files
**Dependency issues**:
```bash
# Frontend
npm install --legacy-peer-deps

# Backend
npm install
```

## Testing
1. Open http://localhost:8080
2. Click "Create New Plan"
3. Enter requirements (e.g., "Build user authentication")
4. Generate plan and explore different views
5. Try templates for quick starts