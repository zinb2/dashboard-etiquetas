import { NextResponse } from "next/server"
import { getCurrentUser, registerActivity } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const movimentacoes = await sql`
      SELECT m.*, 
             e.codigo as etiqueta_codigo, 
             e.etnia as etiqueta_etnia, 
             e.tipo as etiqueta_tipo, 
             e.recipiente as etiqueta_recipiente, 
             e.gramatura as etiqueta_gramatura,
             u.nome as usuario_nome
      FROM movimentacoes m
      JOIN etiquetas e ON m.etiqueta_id = e.id
      JOIN usuarios u ON m.usuario_id = u.id
      ORDER BY m.data_hora DESC
    `

    // Formatar os dados para o frontend
    const formattedMovimentacoes = movimentacoes.map((m: any) => ({
      id: m.id,
      etiqueta_id: m.etiqueta_id,
      etiqueta: {
        codigo: m.etiqueta_codigo,
        etnia: m.etiqueta_etnia,
        tipo: m.etiqueta_tipo,
        recipiente: m.etiqueta_recipiente,
        gramatura: m.etiqueta_gramatura,
      },
      usuario: {
        nome: m.usuario_nome,
      },
      tipo: m.tipo,
      quantidade: m.quantidade,
      data_hora: m.data_hora,
      observacao: m.observacao,
    }))

    return NextResponse.json(formattedMovimentacoes)
  } catch (error) {
    console.error("Erro ao obter movimentações:", error)
    return NextResponse.json({ error: "Erro ao obter movimentações" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const { etiqueta_id, tipo, quantidade, observacao } = body

    // Verificar se a etiqueta existe
    const etiquetaResult = await sql`SELECT * FROM etiquetas WHERE id = ${etiqueta_id}`
    const etiqueta = etiquetaResult[0]

    if (!etiqueta) {
      return NextResponse.json({ error: "Etiqueta não encontrada" }, { status: 404 })
    }

    // Verificar se a quantidade é válida para saída
    if (tipo === "saida" && quantidade > etiqueta.total_etiquetas) {
      return NextResponse.json({ error: "Quantidade insuficiente em estoque" }, { status: 400 })
    }

    // Registrar movimentação
    await sql`
      INSERT INTO movimentacoes (etiqueta_id, usuario_id, tipo, quantidade, observacao)
      VALUES (${etiqueta_id}, ${user.id}, ${tipo}, ${quantidade}, ${observacao})
    `

    // Atualizar estoque da etiqueta
    const novoTotal = tipo === "entrada" ? etiqueta.total_etiquetas + quantidade : etiqueta.total_etiquetas - quantidade

    await sql`
      UPDATE etiquetas 
      SET total_etiquetas = ${novoTotal},
          reposicao = ${novoTotal < 100} -- Simplificado, idealmente usaria a função verificarReposicao
      WHERE id = ${etiqueta_id}
    `

    // Registrar atividade
    await registerActivity(
      user.id,
      tipo,
      "etiqueta",
      etiqueta_id,
      `${tipo === "entrada" ? "Adicionou" : "Removeu"} ${quantidade} etiquetas de ${etiqueta.codigo}`,
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao registrar movimentação:", error)
    return NextResponse.json({ error: "Erro ao registrar movimentação" }, { status: 500 })
  }
}
