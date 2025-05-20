import { NextResponse } from "next/server"
import {
  getUserWithPasswordByEmail,
  comparePasswords,
  generateToken,
  setAuthCookie,
  registerActivity,
} from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, senha } = body

    console.log("Tentativa de login:", { email })

    // Buscar usuário pelo email
    const user = await getUserWithPasswordByEmail(email)
    if (!user) {
      console.log("Usuário não encontrado:", email)
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    console.log("Usuário encontrado, verificando senha")

    // Verificar senha
    const isPasswordValid = await comparePasswords(senha, user.senha)
    console.log("Senha válida?", isPasswordValid)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    // Gerar token JWT
    const userData = {
      id: user.id,
      nome: user.nome,
      usuario: user.usuario,
      email: user.email,
      role: user.role,
    }

    const token = generateToken(userData)

    // Registrar atividade de login
    try {
      await registerActivity(user.id, "login", "usuario", user.id, `Login realizado por ${user.nome} (${user.email})`)
    } catch (activityError) {
      console.error("Erro ao registrar atividade de login:", activityError)
      // Continuar mesmo se falhar o registro de atividade
    }

    // Criar resposta com cookie
    const response = NextResponse.json({
      success: true,
      user: userData,
      redirectTo: "/",
    })

    // Definir cookie de autenticação
    setAuthCookie(response, token)

    return response
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    return NextResponse.json({ error: "Erro ao fazer login. Por favor, tente novamente." }, { status: 500 })
  }
}
