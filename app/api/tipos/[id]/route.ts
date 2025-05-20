import { type NextRequest, NextResponse } from "next/server"
import { sql, updateTipo, deleteTipo } from "@/lib/db"

interface Params {
  params: {
    id: string
  }
}

// GET - Buscar um tipo pelo ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const result = await sql`
      SELECT t.id, t.nome, t.etnia_id, e.nome as etnia_nome
      FROM tipos t
      JOIN etnias e ON t.etnia_id = e.id
      WHERE t.id = ${id}
    `

    if (!result[0]) {
      return NextResponse.json({ error: "Tipo não encontrado" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Erro ao buscar tipo:", error)
    return NextResponse.json({ error: "Erro ao buscar tipo" }, { status: 500 })
  }
}

// PUT - Atualizar um tipo
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const body = await request.json()
    const { nome, etniaId } = body

    if (!nome || !etniaId) {
      return NextResponse.json({ error: "Nome e ID da etnia são obrigatórios" }, { status: 400 })
    }

    const result = await updateTipo(id, nome, etniaId)

    if (!result) {
      return NextResponse.json({ error: "Tipo não encontrado" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erro ao atualizar tipo:", error)
    return NextResponse.json({ error: "Erro ao atualizar tipo" }, { status: 500 })
  }
}

// DELETE - Excluir um tipo
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    await deleteTipo(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir tipo:", error)
    return NextResponse.json({ error: "Erro ao excluir tipo" }, { status: 500 })
  }
}
