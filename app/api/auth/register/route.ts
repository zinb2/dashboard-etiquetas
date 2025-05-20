// Adicionar mais logs para depuração

import { NextResponse } from "next/server"
import { createUser, getUserByEmail, getUserByUsername } from "@/lib/user"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome, usuario, email, senha } = body

    console.log("Recebido pedido de registro:", { nome, usuario, email })

    // Verificar se o email já está em uso
    const existingUserByEmail = await getUserByEmail(email)
    if (existingUserByEmail) {
      console.log("Email já em uso:", email)
      return NextResponse.json({ error: "Email já está em uso" }, { status: 400 })
    }

    // Verificar se o nome de usuário já está em uso
    const existingUserByUsername = await getUserByUsername(usuario)
    if (existingUserByUsername) {
      console.log("Nome de usuário já em uso:", usuario)
      return NextResponse.json({ error: "Nome de usuário já está em uso" }, { status: 400 })
    }

    // Criar o usuário
    console.log("Criando usuário...")
    const user = await createUser(nome, usuario, email, senha)
    console.log("Usuário criado com sucesso:", user)

    return NextResponse.json({ user: { id: user.id, nome: user.nome, email: user.email } }, { status: 201 })
  } catch (error) {
    console.error("Erro ao registrar usuário:", error)
    return NextResponse.json(
      { error: "Erro ao registrar usuário: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}
