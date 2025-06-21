import prisma from "../utils/database"
import { calcularParcelaMensal } from "../utils/financialCalculations"
import type { SimulacaoResponse } from "../types"

export class SimulacaoService {
  async createSimulacao(
    idEstudante: string,
    valorTotal: number,
    quantidadeParcelas: number,
    jurosAoMes: number

  ): Promise<SimulacaoResponse> {
    const valorParcelaMensal = calcularParcelaMensal(valorTotal, jurosAoMes, quantidadeParcelas)

    const simulacao = await prisma.simulacaoFinanciamento.create({
      data: {
        idEstudante,
        valorTotal: valorTotal,
        quantidadeParcelas: quantidadeParcelas,
        jurosAoMes: jurosAoMes,
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
