import express, { Request, Response } from 'express'
import { PlanningService } from '../services/planningService'
import { LLMService } from '../services/llmService'
import { CreatePlanRequest, UpdateTaskRequest, Plan } from '../types/index'

const router = express.Router()
const llmService = new LLMService()

const plansStore = new Map<string, Plan>()

/**
 * GET /api/plans
 * Get all plans
 */
router.get('/', (req: Request, res: Response) => {
  const plans = Array.from(plansStore.values()).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  )
  res.json(plans)
})

/**
 * GET /api/plans/:id
 * Get a specific plan
 */
router.get('/:id', (req: Request, res: Response) => {
  const plan = plansStore.get(req.params.id)

  if (!plan) {
    return res.status(404).json({ error: 'Plan not found' })
  }

  res.json(plan)
})

/**
 * POST /api/plans
 * Create a new plan
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, requirements, useAI }: CreatePlanRequest = req.body
    
    if (!title || !requirements) {
      return res.status(400).json({ error: 'Title and requirements are required' })
    }

    let plan: Plan

    if (useAI) {
      try {
        // Use AI-enhanced planning
        const analysis = await llmService.analyzeWithAI(requirements)
        const now = new Date()

        const tasks = analysis.tasks.map((task, index) => ({
          ...task,
          id: `task_${Date.now()}_${index}`,
          createdAt: now,
          updatedAt: now
        }))

        plan = {
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
      } catch (aiError) {
        console.error('AI planning failed, falling back to rule-based:', aiError)
        // Fallback to rule-based planning
        plan = PlanningService.createPlan(title, requirements)
      }
    } else {
      // Use rule-based planning
      plan = PlanningService.createPlan(title, requirements)
    }

    plansStore.set(plan.id, plan)
    res.status(200).json(plan)
  } catch (error) {
    console.error('Error creating plan:', error)
    res.status(500).json({ error: 'Failed to create plan' })
  }
})

/**
 * PUT /api/plans/:id
 * Update a plan
 */
router.put('/:id', (req: Request, res: Response) => {
  const plan = plansStore.get(req.params.id)

  if (!plan) {
    return res.status(404).json({ error: 'Plan not found' })
  }

  const updates = req.body
  const updatedPlan = {
    ...plan,
    ...updates,
    updatedAt: new Date()
  }

  plansStore.set(plan.id, updatedPlan)
  res.status(204).send()
})

/**
 * PUT /api/plans/:planId/tasks/:taskId
 * Update a specific task
 */
router.put('/:planId/tasks/:taskId', (req: Request, res: Response) => {
  const plan = plansStore.get(req.params.planId)

  if (!plan) {
    return res.status(404).json({ error: 'Plan not found' })
  }

  const taskIndex = plan.tasks.findIndex(t => t.id === req.params.taskId)

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' })
  }

  const updates: UpdateTaskRequest = req.body
  plan.tasks[taskIndex] = {
    ...plan.tasks[taskIndex],
    ...updates,
    updatedAt: new Date()
  }

  plan.metadata.completedTasks = plan.tasks.filter(t => t.status === 'completed').length
  plan.updatedAt = new Date()

  plansStore.set(plan.id, plan)
  res.status(204).send()
})

/**
 * DELETE /api/plans/:id
 * Delete a plan
 */
router.delete('/:id', (req: Request, res: Response) => {
  const plan = plansStore.get(req.params.id)

  if (!plan) {
    return res.status(404).json({ error: 'Plan not found' })
  }

  plansStore.delete(req.params.id)
  res.status(204).send()
})

/**
 * POST /api/plans/:planId/tasks/:taskId/code-suggestion
 * Generate code suggestion for a task
 */
router.post('/:planId/tasks/:taskId/code-suggestion', async (req: Request, res: Response) => {
  try {
    const plan = plansStore.get(req.params.planId)

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' })
    }

    const task = plan.tasks.find(t => t.id === req.params.taskId)

    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }

    const { filePath } = req.body

    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' })
    }

    const codeSuggestion = await llmService.generateCodeSuggestion(
      task.description,
      filePath
    )

    res.status(200).json({ code: codeSuggestion })
  } catch (error) {
    console.error('Error generating code suggestion:', error)
    res.status(500).json({ error: 'Failed to generate code suggestion' })
  }
})

export default router