import prisma from "../utils/database"
import { calcularParcelaMensal } from "../utils/financialCalculations"
import type { SimulacaoResponse } from "../types"

export class SimulacaoService {
  async createSimulacao(
    idEstudante: string,
    data: {
      valorTotal: number
      quantidadeParcelas: number
      jurosAoMes: number
    },
  ): Promise<SimulacaoResponse> {
    const valorParcelaMensal = calcularParcelaMensal(data.valorTotal, data.jurosAoMes, data.quantidadeParcelas)

    const simulacao = await prisma.simulacaoFinanciamento.create({
      data: {
        idEstudante,
        valorTotal: data.valorTotal,
        quantidadeParcelas: data.quantidadeParcelas,
        jurosAoMes: data.jurosAoMes,
        valorParcelaMensal,
      },
      select: {
        id: true,
        valorTotal: true,
        quantidadeParcelas: true,
        jurosAoMes: true,
        valorParcelaMensal: true,
        dataCriacao: true,
      },
    })

    return simulacao
  }

  async getSimulacoesByEstudante(idEstudante: string): Promise<SimulacaoResponse[]> {
    const simulacoes = await prisma.simulacaoFinanciamento.findMany({
      where: { idEstudante },
      select: {
        id: true,
        valorTotal: true,
        quantidadeParcelas: true,
        jurosAoMes: true,
        valorParcelaMensal: true,
        dataCriacao: true,
      },
      orderBy: { dataCriacao: "desc" },
    })

    return simulacoes
  }
}
