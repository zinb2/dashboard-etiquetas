import { NextResponse } from "next/server"
import { getCurrentUser, getUserActivities, registerActivity } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const activities = await getUserActivities(user.id)
    return NextResponse.json(activities)
  } catch (error) {
    console.error("Erro ao obter atividades:", error)
    return NextResponse.json({ error: "Erro ao obter atividades" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const { tipo, entidade, entidade_id, descricao } = body

    await registerActivity(user.id, tipo, entidade, entidade_id, descricao)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao registrar atividade:", error)
    return NextResponse.json({ error: "Erro ao registrar atividade" }, { status: 500 })
  }
}
