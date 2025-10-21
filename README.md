# TaskFlow AI

A planning layer for AI-powered development that transforms high-level requirements into structured, actionable development plans.

## What It Does

TaskFlow AI acts as a bridge between user requirements and AI coding agents. It takes natural language descriptions of what you want to build and breaks them down into:

- **Structured Tasks**: Clear, actionable development tasks with priorities and complexity estimates
- **File Changes**: Shows exactly which files need to be created or modified
- **Dependencies**: Maps relationships between tasks
- **Templates**: Pre-built plans for common patterns (auth, CRUD, dashboards, etc.)

## Tech Stack

- **Frontend**: Vue 3 + Vuetify 3 + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **AI Integration**: OpenAI GPT-4 (optional)
- **Data Storage**: In-memory (no database required)

## Quick Start

1. **Clone and start**:
   ```bash
   ./start.sh
   ```

2. **Or manually**:
   ```bash
   # Backend
   cd backend && npm install && npm run dev

   # Frontend (new terminal)
   cd frontend && npm install --legacy-peer-deps && npm run serve
   ```

3. **Access**: http://localhost:3000

## Data Storage

**Important**: This application uses **in-memory storage** and does **not require any database setup**.

- ✅ **No database installation needed**
- ✅ **No database configuration required**
- ✅ **Works out of the box**
- 🔄 **Data resets when server restarts** (perfect for demos and testing)

## Features

- 🧠 **Smart Planning**: Rule-based + optional AI enhancement
- 📊 **Multiple Views**: List, Kanban, and Graph views
- 📋 **Template Library**: 8 pre-built templates
- 🎨 **Modern UI**: Material Design with dark mode
- 📱 **Responsive**: Works on all devices

## AI Features (Optional)

### Option 1: Azure OpenAI
Create `backend/.env`:
```env
# Server Configuration
PORT=3001

# Azure OpenAI Configuration
OPEN_AI_AZURE_ENDPOINT=your-azure-endpoint
OPEN_AI_API_KEY=your-azure-openai-api-key
OPEN_AI_API_VERSION=your-azure-open-ai-version
OPEN_AI_DEPLOYMENT_NAME=your-deployment-name

The app works perfectly without AI using intelligent rule-based planning.

---

**Built for Traycer AI Assessment** - Demonstrates understanding of planning layer concepts for AI development workflows.