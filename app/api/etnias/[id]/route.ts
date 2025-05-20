import { type NextRequest, NextResponse } from "next/server"
import { sql, updateEtnia, deleteEtnia } from "@/lib/db"

interface Params {
  params: {
    id: string
  }
}

// GET - Buscar uma etnia pelo ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const result = await sql`SELECT * FROM etnias WHERE id = ${id}`

    if (!result[0]) {
      return NextResponse.json({ error: "Etnia não encontrada" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Erro ao buscar etnia:", error)
    return NextResponse.json({ error: "Erro ao buscar etnia" }, { status: 500 })
  }
}

// PUT - Atualizar uma etnia
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const body = await request.json()
    const { nome } = body

    if (!nome) {
      return NextResponse.json({ error: "Nome da etnia é obrigatório" }, { status: 400 })
    }

    const result = await updateEtnia(id, nome)

    if (!result) {
      return NextResponse.json({ error: "Etnia não encontrada" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erro ao atualizar etnia:", error)
    return NextResponse.json({ error: "Erro ao atualizar etnia" }, { status: 500 })
  }
}

// DELETE - Excluir uma etnia
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    await deleteEtnia(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir etnia:", error)
    return NextResponse.json({ error: "Erro ao excluir etnia" }, { status: 500 })
  }
}
