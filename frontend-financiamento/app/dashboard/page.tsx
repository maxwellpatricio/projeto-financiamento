"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Sidebar } from "@/components/layout/sidebar"
import { useSimulations } from "@/contexts/simulation-context"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Calculator, TrendingUp, DollarSign, Clock } from "lucide-react"

export default function DashboardPage() {
  const { simulations } = useSimulations()

  const stats = useMemo(() => {
    const totalSimulations = simulations.length
    const averagePayment =
      simulations.length > 0 ? simulations.reduce((sum, sim) => sum , 0) / simulations.length : 0
    const totalValue = simulations.reduce((sum, sim) => sum + sim.valorTotal, 0)

    return {
      totalSimulations,
      averagePayment,
      totalValue,
      recentSimulations: simulations.slice(0, 5),
    }
  }, [simulations])

  const chartData = useMemo(() => {
    return simulations
      .map((sim, index) => ({
        name: `Sim ${index + 1}`,
        valor: sim.valorTotal
      }))
  }, [simulations])

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">Acompanhe suas simulações de financiamento</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Simulações</CardTitle>
                  <Calculator className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSimulations}</div>
                  <p className="text-xs text-muted-foreground">simulações realizadas</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Parcela Média</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.averagePayment.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">valor médio mensal</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalValue.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">em simulações</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Última Simulação</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.recentSimulations.length > 0
                      ? new Date(stats.recentSimulations[0].createdAt).toLocaleDateString("pt-BR")
                      : "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">data da última</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Evolução das Simulações</CardTitle>
                  <CardDescription>Valores das simulações ao longo do tempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value, name) => [
                            typeof value === "number"
                              ? value.toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                })
                              : value,
                            name === "valor" ? "Valor Total" : "Parcela Mensal",
                          ]}
                        />
                        <Line type="monotone" dataKey="valor" stroke="#3b82f6" strokeWidth={2} name="valor" />
                        <Line type="monotone" dataKey="parcela" stroke="#10b981" strokeWidth={2} name="parcela" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Simulations */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Simulações Recentes</CardTitle>
                  <CardDescription>Suas últimas 5 simulações</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recentSimulations.map((simulation) => (
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">
                              {simulation.valorTotal.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm text-gray-600">
                              {simulation.quantidadeParcelas}x
                            </p>
                            <p className="text-sm text-gray-500">Taxa: {simulation.jurosAoMes}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {stats.recentSimulations.length === 0 && (
                      <p className="text-center text-gray-500 py-8">Nenhuma simulação encontrada</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
