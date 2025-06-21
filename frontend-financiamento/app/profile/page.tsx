"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Sidebar } from "@/components/layout/sidebar"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { User, Edit, Save, X } from "lucide-react"

const profileSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  sobrenome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  id: z.string().email("ID não encontrado, refaça o login!"),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const { user, updateProfile, isLoading } = useAuth()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: user
      ? {
        nome: user.nome,
        sobrenome: user.sobrenome,
        email: user.email,
        id: user.id
      }
      : undefined,
  })

  const onSubmit = async (data: ProfileFormData) => {
    try {
      console.log('veio')
      await updateProfile(data)
      setIsEditing(false)
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram atualizadas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar perfil. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  if (!user) return null

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
              <p className="text-gray-600 mt-2">Visualize e edite suas informações pessoais</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Dados Pessoais
                        </CardTitle>
                        <CardDescription>Suas informações básicas</CardDescription>
                      </div>
                      {!isEditing ? (
                        <Button type="button" variant="outline" onClick={() => setIsEditing(true)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button type="button" variant="outline" onClick={handleCancel}>
                            <X className="w-4 h-4 mr-2" />
                            Cancelar
                          </Button>
                          <Button type="submit" disabled={isLoading}>
                            <Save className="w-4 h-4 mr-2" />
                            {isLoading ? "Salvando..." : "Salvar"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome Completo</Label>
                        <Input id="nome" {...register("nome")} disabled={!isEditing} />
                        {errors.nome && <p className="text-sm text-red-600">{errors.nome.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sobrenome">Sobrenome</Label>
                        <Input id="sobrenome" {...register("sobrenome")} disabled={!isEditing} />
                        {errors.sobrenome && <p className="text-sm text-red-600">{errors.sobrenome.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" {...register("email")} disabled={!isEditing} />
                        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Informações da Conta</CardTitle>
                    <CardDescription>Detalhes sobre sua conta</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Data de Cadastro</Label>
                        <Input value={new Date(user.createdAt).toLocaleDateString("pt-BR")} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>Status da Conta</Label>
                        <Input value="Ativa" disabled />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </form>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
