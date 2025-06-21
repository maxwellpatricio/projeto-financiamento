import { Router } from "express"
import { SimulacaoController } from "../controllers/simulacaoController"
import { authMiddleware } from "../middlewares/auth"

const router = Router()
const simulacaoController = new SimulacaoController()

// Todas as rotas de simulação requerem autenticação
router.use(authMiddleware)

router.post("/simulations", simulacaoController.createSimulacao)
router.get("/simulations", simulacaoController.getSimulacoes)

export default router
