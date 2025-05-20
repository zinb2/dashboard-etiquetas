import { sql } from "./db"
import { hashPassword } from "./hashPassword"

export interface User {
  id: number
  nome: string
  usuario: string
  email: string
  role: string
}

// Buscar usuário por email
export async function getUserByEmail(email: string) {
  try {
    const result = await sql`
      SELECT id, nome, usuario, email, role
      FROM usuarios
      WHERE email = ${email}
    `
    return result[0] || null
  } catch (error) {
    console.error("Erro ao buscar usuário por email:", error)
    return null
  }
}

// Buscar usuário por nome de usuário
export async function getUserByUsername(username: string) {
  try {
    const result = await sql`
      SELECT id, nome, usuario, email, role
      FROM usuarios
      WHERE usuario = ${username}
    `
    return result[0] || null
  } catch (error) {
    console.error("Erro ao buscar usuário por nome de usuário:", error)
    return null
  }
}

// Criar usuário
export async function createUser(nome: string, usuario: string, email: string, senha: string): Promise<User> {
  const hashedPassword = await hashPassword(senha)

  try {
    const result = await sql`
      INSERT INTO usuarios (nome, usuario, email, senha)
      VALUES (${nome}, ${usuario}, ${email}, ${hashedPassword})
      RETURNING id, nome, usuario, email, role
    `
    return result[0]
  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    throw error
  }
}
