import { Router } from "express"
import estudanteRoutes from "./estudante"
import simulacaoRoutes from "./simulacao"

const router = Router()

// Rotas de estudantes
router.use("/api", estudanteRoutes)

// Rotas de simulações
router.use("/api", simulacaoRoutes)

// Rota de health check
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
})

export default router
