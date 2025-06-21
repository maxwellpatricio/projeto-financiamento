"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, AuthContextType, RegisterData } from "@/types"
import { useRouter } from "next/navigation"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth necessita do AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (email: string, senha: string) => {
    setIsLoading(true)
    try {

      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const result = await response.json();

      const { estudante, token } = result.data;

      const user: User = {
        id: estudante.id,
        nome: estudante.nome,
        sobrenome: estudante.sobrenome,
        email: estudante.email,
        createdAt: estudante.createdAt
      }

      setUser(user)
      setToken(token)
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
    } catch (error) {
      throw new Error("Credenciais inválidas")
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    setIsLoading(true)
    try {

      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( userData ),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const result = await response.json();
      const { estudante, token } = result.data;

      const user: User = {
        id: estudante.id,
        nome: `${estudante.nome}`,
        sobrenome: `${estudante.sobrenome}`,
        email: estudante.email,
        createdAt: estudante.createdAt
      }

      setUser(user)
      setToken(token)
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
    } catch (error) {
      throw new Error("Erro ao criar conta")
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (userData: Partial<User>) => {
    setIsLoading(true)
    try {

      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await fetch('http://localhost:3000/api/me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify( userData ),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const result = await response.json();
      const { estudante } = result.data;

      const user: User = {
        id: estudante.id,
        nome: `${estudante.nome}`,
        sobrenome: `${estudante.sobrenome}`,
        email: estudante.email,
        createdAt: estudante.createdAt
      }

      if (user) {
        const updatedUser = { ...user, ...userData }
        setUser(updatedUser)
        localStorage.setItem("user", JSON.stringify(updatedUser))
      }
    } catch (error) {
      throw new Error("Erro ao atualizar perfil")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        updateProfile,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
