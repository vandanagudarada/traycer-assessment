import dotenv from "dotenv"
dotenv.config() // Load environment variables first

import express from "express"
import cors from "cors"
import plansRouter from "./routes/plans"
import analyzeRouter from "./routes/analyze"
import templatesRouter from "./routes/templates"

const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.get("/", (req, res) => res.json({
  message: "Traycer AI Planning Layer API",
  version: "1.0.0",
  endpoints: {
    plans: "/api/plans",
    analyze: "/api/analyze",
    templates: "/api/templates"
  }
}))

app.use("/api/plans", plansRouter)
app.use("/api/analyze", analyzeRouter)
app.use("/api/templates", templatesRouter)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`🚀 Traycer Backend running on port ${PORT}`)
})