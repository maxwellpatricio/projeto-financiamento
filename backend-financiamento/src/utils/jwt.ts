import jwt from "jsonwebtoken"
import type { JWTPayload } from "../types"

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = "5m" // 5 minutos

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET) as JWTPayload
}
