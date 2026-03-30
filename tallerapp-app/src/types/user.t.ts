export interface User {
  id: number
  name: string
  email: string
  rol: "ADMIN" | "TECHNICIAN"
  phone?: string
}