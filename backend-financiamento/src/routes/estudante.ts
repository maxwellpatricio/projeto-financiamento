import { Router } from "express"
import { EstudanteController } from "../controllers/estudanteController"
import { authMiddleware } from "../middlewares/auth"

const router = Router()
const estudanteController = new EstudanteController()

// Rotas públicas
router.post("/register", estudanteController.register)
router.post("/login", estudanteController.login)

// Rotas protegidas
router.get("/me", authMiddleware, estudanteController.getProfile)
router.put("/me", authMiddleware, estudanteController.updateProfile)

export default router
