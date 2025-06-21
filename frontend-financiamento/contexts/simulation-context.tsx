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
      // Mock data
      const mockSimulations: Simulation[] = [
        {
          userId: user.id,
          valorTotal: 50000,
          quantidadeParcelas: 60,
          jurosAoMes: 1.2
        },
        {
          userId: user.id,
          valorTotal: 75000,
          quantidadeParcelas: 84,
          jurosAoMes: 1.1
        }
      ]

      setSimulations(mockSimulations)
    } catch (error) {
      console.error("Erro ao carregar simulações:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addSimulation = async (simulationData: Omit<Simulation, "userId" | "createdAt" | "updatedAt">) => {
    if (!user) return

    setIsLoading(true)
    try {
      const token = localStorage.getItem("token");
      if (!token) return

      const newSimulation: Simulation = {
        userId: user.id,
        ...simulationData
      }

      const response = await fetch('http://localhost:3000/api/simulations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(newSimulation),
      });

      if (response.status != 200) {
        throw new Error('Credenciais inválidas');
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
