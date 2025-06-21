"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Simulation, SimulationContextType } from "@/types"
import { useAuth } from "./auth-context"

const SimulationContext = createContext<SimulationContextType | undefined>(undefined)

export const useSimulations = () => {
  const context = useContext(SimulationContext)
  if (!context) {
    throw new Error("useSimulations must be used within a SimulationProvider")
  }
  return context
}

interface SimulationProviderProps {
  children: ReactNode
}

export const SimulationProvider: React.FC<SimulationProviderProps> = ({ children }) => {
  const [simulations, setSimulations] = useState<Simulation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      getSimulations()
    }
  }, [user])

  const getSimulations = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      // Simulação de API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock data
      const mockSimulations: Simulation[] = [
        {
          id: "1",
          userId: user.id,
          totalValue: 50000,
          installments: 60,
          interestRate: 1.2,
          monthlyPayment: 1045.67,
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-15T10:30:00Z",
        },
        {
          id: "2",
          userId: user.id,
          totalValue: 75000,
          installments: 84,
          interestRate: 1.1,
          monthlyPayment: 1234.56,
          createdAt: "2024-01-10T14:20:00Z",
          updatedAt: "2024-01-10T14:20:00Z",
        },
        {
          id: "3",
          userId: user.id,
          totalValue: 30000,
          installments: 36,
          interestRate: 1.5,
          monthlyPayment: 1089.23,
          createdAt: "2024-01-05T09:15:00Z",
          updatedAt: "2024-01-05T09:15:00Z",
        },
      ]

      setSimulations(mockSimulations)
    } catch (error) {
      console.error("Erro ao carregar simulações:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addSimulation = async (simulationData: Omit<Simulation, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!user) return

    setIsLoading(true)
    try {
      // Simulação de API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newSimulation: Simulation = {
        id: Date.now().toString(),
        userId: user.id,
        ...simulationData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setSimulations((prev) => [newSimulation, ...prev])
    } catch (error) {
      throw new Error("Erro ao salvar simulação")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SimulationContext.Provider
      value={{
        simulations,
        addSimulation,
        getSimulations,
        isLoading,
      }}
    >
      {children}
    </SimulationContext.Provider>
  )
}
