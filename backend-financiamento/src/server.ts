import express from "express"
import cors from "cors"
import routes from "./routes"
import { errorHandler } from "./middlewares/errorHandler"

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors())
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Rotas
app.use(routes)

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler)

// Rota 404
app.use("*", (req, res) => {
  res.status(404).json({ error: "Rota não encontrada" })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/health`)
})

export default app