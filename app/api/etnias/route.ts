import { NextResponse } from "next/server"
import { getEtnias, createEtnia } from "@/lib/db"

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

// GET - Listar todas as etnias
export async function GET() {
  try {
    const etnias = await getEtnias()
    return NextResponse.json(makeSerializable(etnias))
  } catch (error) {
    console.error("Erro ao buscar etnias:", error)
    return NextResponse.json({ error: "Erro ao buscar etnias" }, { status: 500 })
  }
}

// POST - Criar uma nova etnia
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome } = body

    if (!nome) {
      return NextResponse.json({ error: "Nome da etnia é obrigatório" }, { status: 400 })
    }

    const result = await createEtnia(nome)
    return NextResponse.json(makeSerializable(result), { status: 201 })
  } catch (error) {
    console.error("Erro ao criar etnia:", error)
    return NextResponse.json({ error: "Erro ao criar etnia" }, { status: 500 })
  }
}
