import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("pt-BR")
}

export function calculateMonthlyPayment(totalValue: number, installments: number, interestRate: number): number {
  const monthlyRate = interestRate / 100
  return (
    (totalValue * monthlyRate * Math.pow(1 + monthlyRate, installments)) / (Math.pow(1 + monthlyRate, installments) - 1)
  )
}
