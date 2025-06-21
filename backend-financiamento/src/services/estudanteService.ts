import prisma from "../utils/database"
import { hashPassword, comparePassword } from "../utils/password"
import { generateToken } from "../utils/jwt"
import type { EstudanteResponse } from "../types"

export class EstudanteService {
  async register(data: {
    nome: string
    sobrenome: string
    email: string
    senha: string
  }) {
    const hashedPassword = await hashPassword(data.senha)

    const estudante = await prisma.estudante.create({
      data: {
        nome: data.nome,
        sobrenome: data.sobrenome,
        email: data.email,
        senha: hashedPassword,
      },
      select: {
        id: true,
        nome: true,
        sobrenome: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    const token = generateToken({
      id: estudante.id,
      email: estudante.email,
    })

    return { estudante, token }
  }

  async login(email: string, senha: string) {

    console.log(email, senha, 'aaa');
    const estudante = await prisma.estudante.findUnique({
      where: { email },
    })

    if (!estudante) {
      throw new Error("Credenciais inválidas")
    }

    const isPasswordValid = await comparePassword(senha, estudante.senha)

    if (!isPasswordValid) {
      throw new Error("Credenciais inválidas")
    }

    const token = generateToken({
      id: estudante.id,
      email: estudante.email,
    })

    const estudanteResponse: EstudanteResponse = {
      id: estudante.id,
      nome: estudante.nome,
      sobrenome: estudante.sobrenome,
      email: estudante.email,
      createdAt: estudante.createdAt,
      updatedAt: estudante.updatedAt,
    }

    return { estudante: estudanteResponse, token }
  }

  async getProfile(id: string): Promise<EstudanteResponse> {
    const estudante = await prisma.estudante.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        sobrenome: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!estudante) {
      throw new Error("Estudante não encontrado")
    }

    return estudante
  }

  async updateProfile(
    id: string,
    data: {
      nome?: string
      sobrenome?: string
      email?: string
      senha?: string
    },
  ): Promise<EstudanteResponse> {
    const updateData: any = {}

    if (data.nome) updateData.nome = data.nome
    if (data.sobrenome) updateData.sobrenome = data.sobrenome
    if (data.email) updateData.email = data.email
    if (data.senha) updateData.senha = await hashPassword(data.senha)

    const estudante = await prisma.estudante.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        nome: true,
        sobrenome: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return estudante
  }
}
