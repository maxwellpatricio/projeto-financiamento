import type { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"
import { Prisma } from "@prisma/client"

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", error)

  // Erro de validação do Zod
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: "Dados inválidos",
      details: error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    })
  }

  // Erro de violação de constraint única do Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({
        error: "Dados já existem",
        message: "Email já está em uso",
      })
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Registro não encontrado",
      })
    }
  }

  // Erro genérico
  return res.status(500).json({
    error: "Erro interno do servidor",
    message: process.env.NODE_ENV === "development" ? error.message : "Algo deu errado",
  })
}
