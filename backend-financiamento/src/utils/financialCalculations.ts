export const calcularParcelaMensal = (valorTotal: number, jurosAoMes: number, quantidadeParcelas: number): number => {
  // Se não há juros, divide igualmente
  if (jurosAoMes === 0) {
    return valorTotal / quantidadeParcelas
  }

  // Fórmula Price: PMT = PV * (i / (1 - (1 + i)^-n))
  const denominador = 1 - Math.pow(1 + jurosAoMes, -quantidadeParcelas)
  const parcela = valorTotal * (jurosAoMes / denominador)

  // Arredonda para 2 casas decimais
  return Math.round(parcela * 100) / 100
}
