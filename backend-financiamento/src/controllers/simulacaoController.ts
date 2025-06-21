import type { Request, Response, NextFunction } from "express"
import { SimulacaoService } from "../services/simulacaoService"
import { createSimulacaoSchema } from "../validations/simulacao"
import type { AuthenticatedRequest } from "../types"

const simulacaoService = new SimulacaoService()

export class SimulacaoController {
  async createSimulacao(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as AuthenticatedRequest
      const validatedData = createSimulacaoSchema.parse(req.body)

      const simulacao = await simulacaoService.createSimulacao(user!.id, validatedData)

      res.status(201).json({
        message: "Simulação criada com sucesso",
        data: simulacao,
      })
    } catch (error) {
      next(error)
    }
  }

  async getSimulacoes(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as AuthenticatedRequest
      const simulacoes = await simulacaoService.getSimulacoesByEstudante(user!.id)

      res.json({
        message: "Simulações recuperadas com sucesso",
        data: simulacoes,
      })
    } catch (error) {
      next(error)
    }
  }
}
