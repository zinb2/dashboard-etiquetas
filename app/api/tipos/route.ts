import { type NextRequest, NextResponse } from "next/server"
import { getTiposByEtnia, createTipo, sql } from "@/lib/db"

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

// GET - Listar tipos (todos ou por etnia)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const etniaId = searchParams.get("etniaId")

    if (etniaId) {
      // Buscar tipos por etnia
      const tipos = await getTiposByEtnia(Number.parseInt(etniaId))
      return NextResponse.json(makeSerializable(tipos))
    } else {
      // Buscar todos os tipos com nome da etnia
      const tipos = await sql`
        SELECT t.id, t.nome, t.etnia_id, e.nome as etnia_nome
        FROM tipos t
        JOIN etnias e ON t.etnia_id = e.id
        ORDER BY e.nome, t.nome
      `
      return NextResponse.json(makeSerializable(tipos))
    }
  } catch (error) {
    console.error("Erro ao buscar tipos:", error)
    return NextResponse.json({ error: "Erro ao buscar tipos" }, { status: 500 })
  }
}

// POST - Criar um novo tipo
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome, etniaId } = body

    if (!nome || !etniaId) {
      return NextResponse.json({ error: "Nome e ID da etnia são obrigatórios" }, { status: 400 })
    }

    const result = await createTipo(nome, etniaId)
    return NextResponse.json(makeSerializable(result), { status: 201 })
  } catch (error) {
    console.error("Erro ao criar tipo:", error)
    return NextResponse.json({ error: "Erro ao criar tipo" }, { status: 500 })
  }
}
