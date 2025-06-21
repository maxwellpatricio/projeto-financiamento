import type { Request, Response, NextFunction } from "express"
import { verifyToken } from "../utils/jwt"
import type { AuthenticatedRequest } from "../types"

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ error: "Token de acesso não fornecido" })
    }

    const token = authHeader.split(" ")[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: "Token de acesso inválido" })
    }

    const decoded = verifyToken(token)
    ;(req as AuthenticatedRequest).user = decoded

    next()
  } catch (error) {
    return res.status(401).json({ error: "Token de acesso inválido ou expirado" })
  }
}
