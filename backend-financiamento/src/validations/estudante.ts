import { z } from "zod"

export const registerSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(50, "Nome deve ter no máximo 50 caracteres"),
  sobrenome: z
    .string()
    .min(2, "Sobrenome deve ter pelo menos 2 caracteres")
    .max(50, "Sobrenome deve ter no máximo 50 caracteres"),
  email: z.string().email("Email inválido"),
  senha: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres"),
})

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(1, "Senha é obrigatória"),
})

export const updateProfileSchema = z.object({
  nome: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres")
    .optional(),
  sobrenome: z
    .string()
    .min(2, "Sobrenome deve ter pelo menos 2 caracteres")
    .max(50, "Sobrenome deve ter no máximo 50 caracteres")
    .optional(),
  email: z.string().email("Email inválido").optional(),
  senha: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres")
    .optional(),
  id: z
    .string()
    .min(6, "Id de usuário invalido!")
    .max(100, "Id de usuário invalido!")
    .optional(),
})
