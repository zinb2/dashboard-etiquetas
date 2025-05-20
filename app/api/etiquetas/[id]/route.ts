import { type NextRequest, NextResponse } from "next/server"
import { sql, updateEtiqueta, deleteEtiqueta } from "@/lib/db"

// Helper function to make data JSON serializable
function makeSerializable(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(makeSerializable)
  }

  if (typeof obj === "bigint") {
    return obj.toString()
  }

  if (obj instanceof Date) {
    return obj.toISOString()
  }

  if (typeof obj === "object") {
    const result: Record<string, any> = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = makeSerializable(obj[key])
      }
    }
    return result
  }

  return obj
}

interface Params {
  params: {
    id: string
  }
}

// GET - Buscar uma etiqueta pelo ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const result = await sql`SELECT * FROM etiquetas WHERE id = ${id}`

    if (!result[0]) {
      return NextResponse.json({ error: "Etiqueta não encontrada" }, { status: 404 })
    }

    // Make the result JSON serializable
    const serializableResult = makeSerializable(result[0])

    return NextResponse.json(serializableResult)
  } catch (error) {
    console.error("Erro ao buscar etiqueta:", error)
    return NextResponse.json({ error: "Erro ao buscar etiqueta" }, { status: 500 })
  }
}

// PUT - Atualizar uma etiqueta
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const body = await request.json()
    const result = await updateEtiqueta(id, body)

    if (!result) {
      return NextResponse.json({ error: "Etiqueta não encontrada" }, { status: 404 })
    }

    // Make the result JSON serializable
    const serializableResult = makeSerializable(result)

    return NextResponse.json(serializableResult)
  } catch (error) {
    console.error("Erro ao atualizar etiqueta:", error)
    return NextResponse.json({ error: "Erro ao atualizar etiqueta" }, { status: 500 })
  }
}

// DELETE - Excluir uma etiqueta
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    await deleteEtiqueta(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir etiqueta:", error)
    return NextResponse.json({ error: "Erro ao excluir etiqueta" }, { status: 500 })
  }
}
