import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { SimulationProvider } from "@/contexts/simulation-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FinanceEdu - Simulador de Financiamento Estudantil",
  description: "Sistema de simulação de financiamento estudantil",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <SimulationProvider>
            {children}
            <Toaster />
          </SimulationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
