import { Plan, Task, TaskDependency, FileChange, AnalyzeResponse } from '../types/index'

export class PlanningService {
  /**
   * Analyzes requirements and decomposes them into tasks
   * This is a rule-based approach that can be enhanced with LLM
   */
  static analyzeRequirements(requirements: string): AnalyzeResponse {
    const tasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[] = []
    const suggestions: string[] = []

    // Extract key features and actions from requirements
    const features = this.extractFeatures(requirements)
    const complexity = this.assessComplexity(requirements)
    // Generate tasks based on common patterns
    if (this.mentionsAuthentication(requirements)) {
      tasks.push(...this.generateAuthTasks())
    }
    if (this.mentionsDatabase(requirements)) {
      tasks.push(...this.generateDatabaseTasks())
    }
    if (this.mentionsAPI(requirements)) {
      tasks.push(...this.generateAPITasks())
    }
    if (this.mentionsUI(requirements)) {
      tasks.push(...this.generateUITasks())
    }
    if (tasks.length === 0) {
      tasks.push(...this.generateGenericTasks(requirements, features))
    }
    suggestions.push('Consider breaking down large tasks into smaller, testable units')
    suggestions.push('Add error handling and validation for each component')
    suggestions.push('Include unit tests for critical functionality')
    return { tasks, suggestions, complexity }
  }

  private static extractFeatures(requirements: string): string[] {
    const features: string[] = []
    const keywords = [
      'authentication', 'login', 'signup', 'database', 'API', 'endpoint',
      'UI', 'interface', 'frontend', 'backend', 'component', 'service',
      'validation', 'testing', 'deployment'
    ]
    keywords.forEach(keyword => {
      if (requirements.toLowerCase().includes(keyword.toLowerCase())) {
        features.push(keyword)
      }
    })
    return features
  }

  private static assessComplexity(requirements: string): 'simple' | 'moderate' | 'complex' {
    const wordCount = requirements.split(/\s+/).length
    const features = this.extractFeatures(requirements)
    if (wordCount < 50 && features.length <= 2) return 'simple'
    if (wordCount < 150 && features.length <= 5) return 'moderate'
    return 'complex'
  }

  private static mentionsAuthentication(text: string): boolean {
    return /\b(auth|login|signup|register|password|session|jwt|token)\b/i.test(text)
  }

  private static mentionsDatabase(text: string): boolean {
    return /\b(database|db|mongo|postgres|sql|schema|model|collection)\b/i.test(text)
  }

  private static mentionsAPI(text: string): boolean {
    return /\b(api|endpoint|rest|graphql|route|controller)\b/i.test(text)
  }

  private static mentionsUI(text: string): boolean {
    return /\b(ui|interface|frontend|component|view|page|form|button)\b/i.test(text)
  }

  private static generateAuthTasks(): Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[] {
    return [
      {
        title: 'Set up authentication system',
        description: 'Implement user authentication with secure password hashing',
        status: 'pending',
        priority: 'high',
        estimatedComplexity: 5,
        dependencies: [],
        fileChanges: [
          {
            filePath: 'backend/src/models/User.ts',
            action: 'create',
            description: 'Create User model with password hashing'
          },
          {
            filePath: 'backend/src/routes/auth.ts',
            action: 'create',
            description: 'Create authentication routes'
          }
        ],
        acceptanceCriteria: [
          'Users can register with email and password',
          'Passwords are hashed using bcrypt',
          'JWT tokens are generated on successful login',
          'Protected routes verify JWT tokens'
        ],
        tags: ['authentication', 'security'],
        order: 1
      },
      {
        title: 'Create login UI component',
        description: 'Build user-friendly login form with validation',
        status: 'pending',
        priority: 'high',
        estimatedComplexity: 3,
        dependencies: [{ taskId: 'AUTH_BACKEND', type: 'requires' }],
        fileChanges: [
          {
            filePath: 'frontend/src/components/LoginForm.vue',
            action: 'create',
            description: 'Create login form component'
          }
        ],
        acceptanceCriteria: [
          'Form validates email format',
          'Shows error messages for invalid credentials',
          'Redirects to dashboard on successful login'
        ],
        tags: ['ui', 'authentication'],
        order: 2
      }
    ]
  }

  private static generateDatabaseTasks(): Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[] {
    return [
      {
        title: 'Design database schema',
        description: 'Create database models and relationships',
        status: 'pending',
        priority: 'high',
        estimatedComplexity: 5,
        dependencies: [],
        fileChanges: [
          {
            filePath: 'backend/src/models/',
            action: 'create',
            description: 'Create data models'
          }
        ],
        acceptanceCriteria: [
          'Schema supports all required entities',
          'Proper indexing for performance',
          'Relationships are correctly defined'
        ],
        tags: ['database', 'backend'],
        order: 1
      }
    ]
  }

  private static generateAPITasks(): Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[] {
    return [
      {
        title: 'Implement RESTful API endpoints',
        description: 'Create API routes with proper error handling',
        status: 'pending',
        priority: 'high',
        estimatedComplexity: 5,
        dependencies: [],
        fileChanges: [
          {
            filePath: 'backend/src/routes/',
            action: 'create',
            description: 'Create API route handlers'
          }
        ],
        acceptanceCriteria: [
          'All CRUD operations are available',
          'Proper HTTP status codes',
          'Input validation is implemented',
          'Error responses are standardized'
        ],
        tags: ['api', 'backend'],
        order: 2
      }
    ]
  }

  private static generateUITasks(): Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[] {
    return [
      {
        title: 'Create UI components',
        description: 'Build reusable frontend components',
        status: 'pending',
        priority: 'medium',
        estimatedComplexity: 3,
        dependencies: [],
        fileChanges: [
          {
            filePath: 'frontend/src/components/',
            action: 'create',
            description: 'Create Vue components'
          }
        ],
        acceptanceCriteria: [
          'Components are responsive',
          'Consistent styling across the app',
          'Proper state management'
        ],
        tags: ['ui', 'frontend'],
        order: 3
      }
    ]
  }

  private static generateGenericTasks(
    requirements: string,
    features: string[]
  ): Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[] {
    const sentences = requirements.split(/[.!?]+/).filter(s => s.trim().length > 0)
    return sentences.slice(0, 5).map((sentence, index) => ({
      title: `Implement: ${sentence.trim().substring(0, 50)}...`,
      description: sentence.trim(),
      status: 'pending' as const,
      priority: 'medium' as const,
      estimatedComplexity: 3 as const,
      dependencies: [],
      fileChanges: [],
      acceptanceCriteria: ['Feature is implemented', 'Code is tested', 'Documentation is updated'],
      tags: features.slice(0, 3),
      order: index + 1
    }))
  }

  /**
   * Creates a complete plan from requirements
   */
  static createPlan(title: string, requirements: string): Plan {
    const analysis = this.analyzeRequirements(requirements)
    const now = new Date()
    const tasks: Task[] = analysis.tasks.map((task, index) => ({
      ...task,
      id: `task_${Date.now()}_${index}`,
      createdAt: now,
      updatedAt: now
    }))
    const plan: Plan = {
      id: `plan_${Date.now()}`,
      title,
      description: requirements.substring(0, 200),
      requirements,
      tasks,
      status: 'draft',
      metadata: {
        totalTasks: tasks.length,
        completedTasks: 0,
        estimatedEffort: tasks.reduce((sum, t) => sum + t.estimatedComplexity, 0),
        complexity: analysis.complexity
      },
      createdAt: now,
      updatedAt: now
    }
    return plan
  }
}