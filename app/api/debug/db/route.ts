import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Verificar a conexão com o banco de dados
    const connectionTest = await sql`SELECT current_database(), current_user`

    // Listar todas as tabelas no esquema público
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    return NextResponse.json({
      connection: connectionTest[0],
      tables: tables.map((t: any) => t.table_name),
      databaseUrl: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:[^:]*@/, ":****@") : "Não definido",
    })
  } catch (error) {
    console.error("Erro ao verificar banco de dados:", error)
    return NextResponse.json(
      {
        error: "Erro ao conectar ao banco de dados",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
