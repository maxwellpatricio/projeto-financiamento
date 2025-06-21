export interface User {
  id: string
  nome: string
  sobrenome: string
  email: string
  createdAt: string
}

export interface Simulation {
  id: string
  userId: string
  totalValue: number
  installments: number
  interestRate: number
  monthlyPayment: number
  createdAt: string
  updatedAt: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<void>
  isLoading: boolean
}

export interface SimulationContextType {
  simulations: Simulation[]
  addSimulation: (simulation: Omit<Simulation, "id" | "userId" | "createdAt" | "updatedAt">) => void
  getSimulations: () => void
  isLoading: boolean
}

export interface RegisterData {
  nome: string
  sobrenome: string
  email: string
  senha: string
}

export interface LoginData {
  email: string
  password: string
}

export interface SimulationFormData {
  totalValue: number
  installments: number
  interestRate: number
}
