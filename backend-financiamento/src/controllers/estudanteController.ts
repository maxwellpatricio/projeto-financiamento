import type { Request, Response, NextFunction } from "express"
import { EstudanteService } from "../services/estudanteService"
import { registerSchema, loginSchema, updateProfileSchema } from "../validations/estudante"
import type { AuthenticatedRequest } from "../types"

const estudanteService = new EstudanteService()

export class EstudanteController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = registerSchema.parse(req.body)
      const result = await estudanteService.register(validatedData)

      res.status(201).json({
        message: "Estudante criado com sucesso",
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, senha } = loginSchema.parse(req.body)
      const result = await estudanteService.login(email, senha)
      res.json({
        message: "Login realizado com sucesso",
        data: result,
      })
    } catch (error) {
      if (error instanceof Error && error.message === "Credenciais inválidas") {
        return res.status(401).json({ error: "Credenciais inválidas" })
      }
      next(error)
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req.body;
      const estudante = await estudanteService.getProfile(user!.id)

      res.json({
        message: "Perfil recuperado com sucesso",
        data: estudante,
      })
    } catch (error) {
      if (error instanceof Error && error.message === "Estudante não encontrado") {
        return res.status(404).json({ error: "Estudante não encontrado" })
      }
      next(error)
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req.body;
      const validatedData = updateProfileSchema.parse(req.body)

      const estudante = await estudanteService.updateProfile(user!.id, validatedData)

      res.json({
        message: "Perfil atualizado com sucesso",
        data: estudante,
      })
    } catch (error) {
      next(error)
    }
  }
}
