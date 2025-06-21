"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Sidebar } from "@/components/layout/sidebar"
import { useSimulations } from "@/contexts/simulation-context"
import { useToast } from "@/hooks/use-toast"
import type { SimulationFormData } from "@/types"
import { Calculator, Save } from "lucide-react"

const simulationSchema = z.object({
  totalValue: z.number().min(1000, "Valor mínimo de R$ 1.000"),
  installments: z.number().min(6, "Mínimo de 6 parcelas").max(120, "Máximo de 120 parcelas"),
  interestRate: z.number().min(0.1, "Taxa mínima de 0,1%").max(10, "Taxa máxima de 10%"),
})

export default function SimulationPage() {
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const { addSimulation, isLoading } = useSimulations()
  const { toast } = useToast()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SimulationFormData>({
    resolver: zodResolver(simulationSchema),
    defaultValues: {
      totalValue: 50000,
      installments: 60,
      interestRate: 1.2,
    },
  })

  const watchedValues = watch()

  // Calcular parcela em tempo real
  useEffect(() => {
    const { totalValue, installments, interestRate } = watchedValues

    if (totalValue && installments && interestRate) {
      // Fórmula de juros compostos para financiamento
      const monthlyRate = interestRate / 100
      const payment =
        (totalValue * monthlyRate * Math.pow(1 + monthlyRate, installments)) /
        (Math.pow(1 + monthlyRate, installments) - 1)

      setMonthlyPayment(payment)
      setTotalAmount(payment * installments)
    }
  }, [watchedValues])

  const onSubmit = async (data: SimulationFormData) => {
    try {
      await addSimulation({
        ...data,
        monthlyPayment,
      })

      toast({
        title: "Simulação salva!",
        description: "Sua simulação foi salva com sucesso.",
      })

      router.push("/history")
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar simulação. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Nova Simulação</h1>
              <p className="text-gray-600 mt-2">Simule seu financiamento estudantil</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Formulário */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Dados da Simulação
                  </CardTitle>
                  <CardDescription>Preencha os dados para calcular seu financiamento</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="totalValue">Valor Total do Curso</Label>
                      <Input
                        id="totalValue"
                        type="number"
                        step="0.01"
                        placeholder="50000"
                        {...register("totalValue", { valueAsNumber: true })}
                      />
                      {errors.totalValue && <p className="text-sm text-red-600">{errors.totalValue.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="installments">Quantidade de Parcelas</Label>
                      <Input
                        id="installments"
                        type="number"
                        placeholder="60"
                        {...register("installments", { valueAsNumber: true })}
                      />
                      {errors.installments && <p className="text-sm text-red-600">{errors.installments.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interestRate">Taxa de Juros Mensal (%)</Label>
                      <Input
                        id="interestRate"
                        type="number"
                        step="0.01"
                        placeholder="1.2"
                        {...register("interestRate", { valueAsNumber: true })}
                      />
                      {errors.interestRate && <p className="text-sm text-red-600">{errors.interestRate.message}</p>}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Salvando..." : "Salvar Simulação"}
                    </Button>
                  </CardContent>
                </form>
              </Card>

              {/* Resultado */}
              <Card>
                <CardHeader>
                  <CardTitle>Resultado da Simulação</CardTitle>
                  <CardDescription>Valores calculados em tempo real</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-blue-600 font-medium">Parcela Mensal</p>
                      <p className="text-3xl font-bold text-blue-700">
                        {monthlyPayment.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-gray-600">Valor Financiado</p>
                      <p className="text-xl font-semibold">
                        {(watchedValues.totalValue || 0).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-gray-600">Total a Pagar</p>
                      <p className="text-xl font-semibold">
                        {totalAmount.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-gray-600">Juros Totais</p>
                      <p className="text-xl font-semibold text-red-600">
                        {(totalAmount - (watchedValues.totalValue || 0)).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-gray-600">Prazo</p>
                      <p className="text-xl font-semibold">{watchedValues.installments || 0} meses</p>
                    </div>
                  </div>

                  <Alert>
                    <AlertDescription>
                      <strong>Importante:</strong> Esta é uma simulação. Os valores reais podem variar conforme as
                      condições do financiamento e análise de crédito.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
