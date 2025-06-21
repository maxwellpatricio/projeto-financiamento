export interface JWTPayload {
  id: string
  email: string
}

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload
}

export interface EstudanteResponse {
  id: string
  nome: string
  sobrenome: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface SimulacaoResponse {
  id: string
  valorTotal: number
  quantidadeParcelas: number
  jurosAoMes: number
  valorParcelaMensal: number
  dataCriacao: Date
}
