import { type NextRequest, NextResponse } from "next/server"
import { getEtiquetas, createEtiqueta } from "@/lib/db"

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

// GET - Listar todas as etiquetas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const codigo = searchParams.get("codigo")
    const etnia = searchParams.get("etnia")
    const tipo = searchParams.get("tipo")
    const limit = searchParams.get("limit")

    const filters: any = {
      codigo: codigo || undefined,
      etnia: etnia || undefined,
      tipo: tipo || undefined,
    }

    if (limit) {
      filters.limit = Number.parseInt(limit)
    }

    const etiquetas = await getEtiquetas(filters)

    // Make the data JSON serializable before returning
    const serializableEtiquetas = makeSerializable(etiquetas)

    return NextResponse.json(serializableEtiquetas)
  } catch (error) {
    console.error("Erro ao buscar etiquetas:", error)
    return NextResponse.json({ error: "Erro ao buscar etiquetas" }, { status: 500 })
  }
}

// POST - Criar uma nova etiqueta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await createEtiqueta(body)

    // Make the result JSON serializable
    const serializableResult = makeSerializable(result)

    return NextResponse.json(serializableResult, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar etiqueta:", error)
    return NextResponse.json({ error: "Erro ao criar etiqueta" }, { status: 500 })
  }
}
