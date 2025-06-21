"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Sidebar } from "@/components/layout/sidebar"
import { useSimulations } from "@/contexts/simulation-context"
import { Search, Filter, Calendar, DollarSign } from "lucide-react"

export default function HistoryPage() {
  const { simulations } = useSimulations()
  const [searchTerm, setSearchTerm] = useState("")
  const [minValue, setMinValue] = useState("")
  const [maxValue, setMaxValue] = useState("")
  const [minInstallments, setMinInstallments] = useState("")
  const [maxInstallments, setMaxInstallments] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filteredSimulations = useMemo(() => {
    return simulations.filter((simulation) => {
      const matchesValue =
        (!minValue || simulation.valorTotal >= Number(minValue)) &&
        (!maxValue || simulation.valorTotal <= Number(maxValue))

      const matchesInstallments =
        (!minInstallments || simulation.quantidadeParcelas >= Number(minInstallments)) &&
        (!maxInstallments || simulation.quantidadeParcelas <= Number(maxInstallments))

      const matchesSearch =
        !searchTerm ||
        simulation.valorTotal.toString().includes(searchTerm) ||
        simulation.quantidadeParcelas.toString().includes(searchTerm)

      return matchesValue && matchesInstallments && matchesSearch
    })
  }, [simulations, searchTerm, minValue, maxValue, minInstallments, maxInstallments])

  const paginatedSimulations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredSimulations.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredSimulations, currentPage])

  const totalPages = Math.ceil(filteredSimulations.length / itemsPerPage)

  const clearFilters = () => {
    setSearchTerm("")
    setMinValue("")
    setMaxValue("")
    setMinInstallments("")
    setMaxInstallments("")
    setCurrentPage(1)
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Histórico de Simulações</h1>
              <p className="text-gray-600 mt-2">Visualize e filtre todas as suas simulações</p>
            </div>

            {/* Filtros */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros
                </CardTitle>
                <CardDescription>Use os filtros para encontrar simulações específicas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Buscar</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="search"
                        placeholder="Buscar por valor ou parcelas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Valor Mínimo</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={minValue}
                      onChange={(e) => setMinValue(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Valor Máximo</Label>
                    <Input
                      type="number"
                      placeholder="100000"
                      value={maxValue}
                      onChange={(e) => setMaxValue(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Parcelas Mínimas</Label>
                    <Input
                      type="number"
                      placeholder="6"
                      value={minInstallments}
                      onChange={(e) => setMinInstallments(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Parcelas Máximas</Label>
                    <Input
                      type="number"
                      placeholder="120"
                      value={maxInstallments}
                      onChange={(e) => setMaxInstallments(e.target.value)}
                    />
                  </div>

                  <div className="flex items-end">
                    <Button variant="outline" onClick={clearFilters} className="w-full">
                      Limpar Filtros
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabela de Simulações */}
            <Card>
              <CardHeader>
                <CardTitle>Simulações ({filteredSimulations.length})</CardTitle>
                <CardDescription>Lista de todas as suas simulações de financiamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paginatedSimulations.map((simulation) => (
                    <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold">
                              {simulation.valorTotal.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </p>
                            <p className="text-sm text-gray-500">Valor Total</p>
                          </div>
                        </div>

                        <div>
                          <p className="font-semibold">{simulation.quantidadeParcelas}x</p>
                          <p className="text-sm text-gray-500">Parcelas</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Taxa: {simulation.jurosAoMes}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {paginatedSimulations.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">Nenhuma simulação encontrada</p>
                      <p className="text-gray-400 mt-2">Tente ajustar os filtros ou criar uma nova simulação</p>
                    </div>
                  )}
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      Página {currentPage} de {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Próxima
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
