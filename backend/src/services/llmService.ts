import OpenAI from "openai"
import dotenv from "dotenv"
import { AnalyzeResponse } from '../types/index'

dotenv.config()

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
  baseURL: process.env.OPEN_AI_AZURE_ENDPOINT + "/openai/deployments/" + process.env.OPEN_AI_DEPLOYMENT_NAME,
  defaultQuery: { 'api-version': process.env.OPEN_AI_API_VERSION },
  defaultHeaders: {
    'api-key': process.env.OPEN_AI_API_KEY,
  },
})

export class LLMService {
  private apiKey: string | undefined
  private endpoint: string | undefined
  private apiVersion: string | undefined
  private deploymentName: string | undefined

  constructor() {
    this.apiKey = process.env.OPEN_AI_API_KEY
    this.endpoint = process.env.OPEN_AI_AZURE_ENDPOINT
    this.apiVersion = process.env.OPEN_AI_API_VERSION
    this.deploymentName = process.env.OPEN_AI_DEPLOYMENT_NAME
  }

  /**
   * Uses Azure OpenAI to analyze requirements and generate tasks
   */
  async analyzeWithAI(requirements: string, context?: string): Promise<AnalyzeResponse> {
    if (!this.apiKey || !this.endpoint || !this.apiVersion || !this.deploymentName) {
      throw new Error('Azure OpenAI not configured. Set OPEN_AI_API_KEY, OPEN_AI_AZURE_ENDPOINT, OPEN_AI_API_VERSION, and OPEN_AI_DEPLOYMENT_NAME in environment variables')
    }

    try {
      const prompt = this.buildPrompt(requirements, context)

      const response = await client.chat.completions.create({
        model: this.deploymentName,
        messages: [
          {
            role: "system",
            content: "You are an expert software architect and project planner. Analyze requirements and break them down into actionable development tasks with clear dependencies, file changes, and acceptance criteria. Respond in JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      })

      const content = JSON.parse(response.choices[0].message.content || '{}')
      return this.parseAIResponse(content)
    } catch (error) {
      console.error('Azure OpenAI Service error:', error)
      throw error
    }
  }

  private buildPrompt(requirements: string, context?: string): string {
    return `
Analyze the following software requirements and break them down into actionable development tasks.

Requirements:
${requirements}

${context ? `Additional Context:\n${context}` : ''}

Please provide a JSON response with the following structure:
{
  "complexity": "simple" | "moderate" | "complex",
  "tasks": [
    {
      "title": "Task title",
      "description": "Detailed description",
      "priority": "low" | "medium" | "high" | "critical",
      "estimatedComplexity": 1 | 2 | 3 | 5 | 8,
      "dependencies": [
        {
          "taskId": "reference to another task by title",
          "type": "blocks" | "relates_to" | "requires"
        }
      ],
      "fileChanges": [
        {
          "filePath": "relative/path/to/file",
          "action": "create" | "modify" | "delete",
          "description": "What changes to make",
          "codeSnippet": "optional code example"
        }
      ],
      "acceptanceCriteria": ["criterion 1", "criterion 2"],
      "tags": ["tag1", "tag2"],
      "order": 1
    }
  ],
  "suggestions": ["suggestion 1", "suggestion 2"]
}

Focus on:
- Clear, actionable tasks
- Proper task ordering and dependencies
- Specific file changes needed
- Realistic complexity estimates
- Comprehensive acceptance criteria
`
  }

  private parseAIResponse(content: any): AnalyzeResponse {
    const tasks = content.tasks.map((task: any) => ({
      ...task,
      status: 'pending' as const,
      dependencies: task.dependencies || [],
      fileChanges: task.fileChanges || [],
      acceptanceCriteria: task.acceptanceCriteria || [],
      tags: task.tags || []
    }))

    return {
      tasks,
      suggestions: content.suggestions || [],
      complexity: content.complexity || 'moderate'
    }
  }
  /**
   * Generates code suggestions for a specific task using Azure OpenAI
   */
  async generateCodeSuggestion(taskDescription: string, filePath: string): Promise<string> {
    if (!this.apiKey || !this.endpoint || !this.apiVersion || !this.deploymentName) {
      throw new Error('Azure OpenAI not configured')
    }

    try {
      const response = await client.chat.completions.create({
        model: this.deploymentName,
        messages: [
          {
            role: "system",
            content: "You are an expert programmer. Generate clean, well-documented code based on task descriptions."
          },
          {
            role: "user",
            content: `Generate code for the following task:\n\nTask: ${taskDescription}\nFile: ${filePath}\n\nProvide clean, production-ready code with comments.`
          }
        ]
      })

      return response.choices[0].message.content || ''
    } catch (error) {
      console.error('Code generation error:', error)
      throw error
    }
  }
}