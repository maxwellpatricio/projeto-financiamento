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
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  cpf: z.string().min(11, "CPF inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  address: z.object({
    street: z.string().min(1, "Rua é obrigatória"),
    number: z.string().min(1, "Número é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória"),
    state: z.string().min(2, "Estado é obrigatório"),
    zipCode: z.string().min(8, "CEP inválido"),
  }),
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
          name: user.name,
          email: user.email,
          cpf: user.cpf,
          phone: user.phone,
          birthDate: user.birthDate,
          address: user.address,
        }
      : undefined,
  })

  const onSubmit = async (data: ProfileFormData) => {
    try {
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
                {/* Dados Pessoais */}
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
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input id="name" {...register("name")} disabled={!isEditing} />
                        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" {...register("email")} disabled={!isEditing} />
                        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cpf">CPF</Label>
                        <Input id="cpf" {...register("cpf")} disabled={!isEditing} />
                        {errors.cpf && <p className="text-sm text-red-600">{errors.cpf.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" {...register("phone")} disabled={!isEditing} />
                        {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="birthDate">Data de Nascimento</Label>
                        <Input id="birthDate" type="date" {...register("birthDate")} disabled={!isEditing} />
                        {errors.birthDate && <p className="text-sm text-red-600">{errors.birthDate.message}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Endereço */}
                <Card>
                  <CardHeader>
                    <CardTitle>Endereço</CardTitle>
                    <CardDescription>Suas informações de endereço</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="street">Rua</Label>
                        <Input id="street" {...register("address.street")} disabled={!isEditing} />
                        {errors.address?.street && (
                          <p className="text-sm text-red-600">{errors.address.street.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="number">Número</Label>
                        <Input id="number" {...register("address.number")} disabled={!isEditing} />
                        {errors.address?.number && (
                          <p className="text-sm text-red-600">{errors.address.number.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input id="city" {...register("address.city")} disabled={!isEditing} />
                        {errors.address?.city && <p className="text-sm text-red-600">{errors.address.city.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">Estado</Label>
                        <Input id="state" {...register("address.state")} disabled={!isEditing} />
                        {errors.address?.state && (
                          <p className="text-sm text-red-600">{errors.address.state.message}</p>
                        )}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="zipCode">CEP</Label>
                        <Input id="zipCode" {...register("address.zipCode")} disabled={!isEditing} />
                        {errors.address?.zipCode && (
                          <p className="text-sm text-red-600">{errors.address.zipCode.message}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Informações da Conta */}
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
