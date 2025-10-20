import express, { Request, Response } from 'express'
import { PlanningService } from '../services/planningService'
import { LLMService } from '../services/llmService'
import { AnalyzeRequest } from '../types/index'

const router = express.Router()
const llmService = new LLMService()

/**
 * POST /api/analyze
 * Analyze requirements without creating a plan
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { requirements, context }: AnalyzeRequest = req.body

    if (!requirements) {
      return res.status(400).json({ error: 'Requirements are required' })
    }

    // Try AI analysis first if API key is available
    try {
      const analysis = await llmService.analyzeWithAI(requirements, context)
      res.status(200).json({ ...analysis, method: 'ai' })
    } catch (aiError) {
      // Fallback to rule-based analysis
      const analysis = PlanningService.analyzeRequirements(requirements)
      res.status(200).json({ ...analysis, method: 'rule-based' })
    }
  } catch (error) {
    console.error('Error analyzing requirements:', error)
    res.status(500).json({ error: 'Failed to analyze requirements' })
  }
})

/**
 * POST /api/analyze/quick
 * Quick analysis for real-time feedback (rule-based only)
 */
router.post('/quick', (req: Request, res: Response) => {
  try {
    const { requirements }: AnalyzeRequest = req.body

    if (!requirements) {
      return res.status(400).json({ error: 'Requirements are required' })
    }

    const analysis = PlanningService.analyzeRequirements(requirements)
    res.status(200).json(analysis)
  } catch (error) {
    console.error('Error in quick analysis:', error)
    res.status(500).json({ error: 'Failed to analyze requirements' })
  }
})

export default router