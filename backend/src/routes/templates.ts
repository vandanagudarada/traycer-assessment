import express, { Request, Response } from 'express'

const router = express.Router()

interface Template {
  id: string
  name: string
  description: string
  category: string
  requirements: string
  icon: string
}

const templates: Template[] = [
  {
    id: 'auth-system',
    name: 'Authentication System',
    description: 'Complete user authentication with JWT, login, signup, and password reset',
    category: 'Backend',
    requirements: `Build a secure authentication system with the following features:
- User registration with email and password
- Login functionality with JWT tokens
- Password reset via email
- Protected API routes
- Session management
- Input validation and error handling`,
    icon: 'mdi-shield-account'
  },
  {
    id: 'crud-api',
    name: 'RESTful CRUD API',
    description: 'Complete REST API with Create, Read, Update, Delete operations',
    category: 'Backend',
    requirements: `Create a RESTful API with:
- GET endpoint to retrieve all items
- GET endpoint to retrieve single item by ID
- POST endpoint to create new items
- PUT endpoint to update existing items
- DELETE endpoint to remove items
- Input validation
- Error handling
- Pagination support`,
    icon: 'mdi-api'
  },
  {
    id: 'dashboard-ui',
    name: 'Admin Dashboard',
    description: 'Modern admin dashboard with charts, tables, and data visualization',
    category: 'Frontend',
    requirements: `Build an admin dashboard with:
- Responsive layout with sidebar navigation
- Data tables with sorting and filtering
- Charts and graphs for data visualization
- User management interface
- Settings page
- Dark mode support
- Mobile-friendly design`,
    icon: 'mdi-view-dashboard'
  },
  {
    id: 'form-wizard',
    name: 'Multi-Step Form',
    description: 'Step-by-step form with validation and progress tracking',
    category: 'Frontend',
    requirements: `Create a multi-step form wizard with:
- Multiple steps with progress indicator
- Form validation for each step
- Save progress functionality
- Previous/Next navigation
- Summary review page
- Submit functionality
- Responsive design`,
    icon: 'mdi-form-select'
  },
  {
    id: 'file-upload',
    name: 'File Upload System',
    description: 'Secure file upload with preview and validation',
    category: 'Full Stack',
    requirements: `Implement file upload system with:
- Drag and drop file upload interface
- File type and size validation
- Image preview before upload
- Progress bar during upload
- Backend storage handling
- File management (list, download, delete)
- Secure file access`,
    icon: 'mdi-cloud-upload'
  },
  {
    id: 'search-filter',
    name: 'Advanced Search & Filter',
    description: 'Powerful search with multiple filters and sorting',
    category: 'Full Stack',
    requirements: `Build advanced search functionality with:
- Real-time search as user types
- Multiple filter options (category, date, tags)
- Sort by various criteria
- Pagination of results
- Clear filters option
- Search suggestions
- Backend API integration`,
    icon: 'mdi-magnify'
  },
  {
    id: 'notification-system',
    name: 'Notification System',
    description: 'Real-time notifications with WebSocket support',
    category: 'Full Stack',
    requirements: `Create notification system with:
- Real-time notifications using WebSocket
- Notification bell icon with count
- Notification list dropdown
- Mark as read functionality
- Different notification types (info, success, warning, error)
- Notification preferences
- Backend notification storage`,
    icon: 'mdi-bell'
  },
  {
    id: 'chat-interface',
    name: 'Chat Interface',
    description: 'Real-time chat with message history',
    category: 'Full Stack',
    requirements: `Build a chat interface with:
- Real-time messaging using WebSocket
- Message history
- Typing indicators
- Online/offline status
- Message read receipts
- File sharing in chat
- User profiles`,
    icon: 'mdi-chat'
  }
]

/**
 * GET /api/templates
 * Get all templates
 */
router.get('/', (req: Request, res: Response) => {
  const { category } = req.query

  if (category) {
    const filtered = templates.filter(t => t.category === category)
    return res.json(filtered)
  }

  res.json(templates)
})

/**
 * GET /api/templates/:id
 * Get a specific template
 */
router.get('/:id', (req: Request, res: Response) => {
  const template = templates.find(t => t.id === req.params.id)

  if (!template) {
    return res.status(404).json({ error: 'Template not found' })
  }

  res.json(template)
})

/**
 * GET /api/templates/categories
 * Get all template categories
 */
router.get('/meta/categories', (req: Request, res: Response) => {
  const categories = [...new Set(templates.map(t => t.category))]
  res.json(categories)
})

export default router