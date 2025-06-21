import { z } from "zod"

export const createSimulacaoSchema = z.object({
  valorTotal: z.number().positive("Valor total deve ser positivo").min(1000, "Valor mínimo é R$ 1.000"),
  quantidadeParcelas: z
    .number()
    .int("Quantidade de parcelas deve ser um número inteiro")
    .min(1, "Mínimo 1 parcela")
    .max(360, "Máximo 360 parcelas"),
  jurosAoMes: z.number().min(0, "Juros não pode ser negativo").max(0.1, "Juros máximo é 10% ao mês"),
})
