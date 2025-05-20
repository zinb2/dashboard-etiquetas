import type { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { sql } from "./db"
import { serverEnv } from "./env"

const JWT_SECRET = serverEnv.JWT_SECRET || "seu_jwt_secret_padrao"
const TOKEN_EXPIRY = "7d"

export interface User {
  id: number
  nome: string
  usuario: string
  email: string
  role: string
}

// Gerar token JWT
export function generateToken(user: Omit<User, "senha">) {
  try {
    // Garantir que estamos passando um objeto válido para o jwt.sign
    const payload = {
      id: user.id,
      nome: user.nome,
      usuario: user.usuario,
      email: user.email,
      role: user.role || "user",
    }
    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
  } catch (error) {
    console.error("Erro ao gerar token:", error)
    throw new Error("Falha ao gerar token de autenticação")
  }
}

// Verificar token JWT
export function verifyToken(token: string) {
  try {
    // Verificar se o token é válido
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded
  } catch (error) {
    console.error("Erro ao verificar token:", error)
    return null
  }
}

// Definir cookie de autenticação
export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  })
}

// Remover cookie de autenticação
export function removeAuthCookie(response: NextResponse) {
  response.cookies.set({
    name: "auth_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
}

// Obter usuário atual a partir do token
export async function getCurrentUser() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return null
    }

    const decoded = verifyToken(token) as User | null

    if (!decoded) {
      return null
    }

    // Buscar usuário atualizado do banco de dados
    const result = await sql`
      SELECT id, nome, usuario, email, role
      FROM usuarios
      WHERE id = ${decoded.id}
    `

    return result[0] || null
  } catch (error) {
    console.error("Erro ao obter usuário atual:", error)
    return null
  }
}

// Hash de senha
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Comparar senhas
export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword)
  } catch (error) {
    console.error("Erro ao comparar senhas:", error)
    return false
  }
}

// Buscar usuário por email com senha
export async function getUserWithPasswordByEmail(email: string) {
  try {
    console.log("Buscando usuário por email:", email)
    const result = await sql`
      SELECT id, nome, usuario, email, role, senha
      FROM usuarios
      WHERE email = ${email}
    `
    console.log("Resultado da busca:", result.length > 0 ? "Usuário encontrado" : "Usuário não encontrado")
    return result[0] || null
  } catch (error) {
    console.error("Erro ao buscar usuário por email:", error)
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

// Registrar atividade
export async function registerActivity(
  userId: number,
  tipo: string,
  entidade: string,
  entidadeId?: number,
  descricao?: string,
) {
  try {
    await sql`
      INSERT INTO atividades (usuario_id, tipo, entidade, entidade_id, descricao)
      VALUES (${userId}, ${tipo}, ${entidade}, ${entidadeId || null}, ${descricao || ""})
    `
    return true
  } catch (error) {
    console.error("Erro ao registrar atividade:", error)
    return false
  }
}

// Obter atividades do usuário
export async function getUserActivities(userId: number) {
  try {
    const result = await sql`
      SELECT id, tipo, entidade, entidade_id, descricao, data_hora
      FROM atividades
      WHERE usuario_id = ${userId}
      ORDER BY data_hora DESC
      LIMIT 20
    `
    return result
  } catch (error) {
    console.error("Erro ao obter atividades do usuário:", error)
    return []
  }
}
