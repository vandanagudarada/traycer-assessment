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
  id: number
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
  id: number
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

export interface Template {
  id: number
  name: string
  description: string
  category: string
  requirements: string
  icon: string
}

