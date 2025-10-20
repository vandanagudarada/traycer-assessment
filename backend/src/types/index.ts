export interface TaskDependency {
  taskId: string
  type: 'blocks' | 'relates_to' | 'requires'
}

export interface FileChange {
  filePath: string
  action: 'create' | 'modify' | 'delete'
  description: string
  codeSnippet?: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'blocked'
  priority: 'low' | 'medium' | 'high' | 'critical'
  estimatedComplexity: 1 | 2 | 3 | 5 | 8
  dependencies: TaskDependency[]
  fileChanges: FileChange[]
  acceptanceCriteria: string[]
  tags: string[]
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Plan {
  id: string
  title: string
  description: string
  requirements: string
  tasks: Task[]
  status: 'draft' | 'active' | 'completed' | 'archived'
  metadata: {
    totalTasks: number
    completedTasks: number
    estimatedEffort: number
    complexity: 'simple' | 'moderate' | 'complex'
  }
  createdAt: Date
  updatedAt: Date
}

export interface CreatePlanRequest {
  title: string
  requirements: string
  useAI?: boolean
}

export interface UpdateTaskRequest {
  status?: Task['status']
  priority?: Task['priority']
  description?: string
  acceptanceCriteria?: string[]
}

export interface AnalyzeRequest {
  requirements: string
  context?: string
}

export interface AnalyzeResponse {
  tasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[]
  suggestions: string[]
  complexity: 'simple' | 'moderate' | 'complex'
}