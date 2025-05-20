import { neon } from "@neondatabase/serverless"
import { serverEnv } from "./env"

// Inicializar conexão com o banco de dados
const DATABASE_URL = serverEnv.DATABASE_URL
if (!DATABASE_URL) {
  console.error("DATABASE_URL não está definida nas variáveis de ambiente!")
}

console.log(
  "Conectando ao banco de dados com URL:",
  DATABASE_URL ? DATABASE_URL.replace(/:[^:]*@/, ":****@") : "Não definido",
)

export const sql = neon(DATABASE_URL!)

// Função para testar a conexão com o banco de dados
export async function testConnection() {
  try {
    const result = await sql`SELECT current_database(), current_user`
    console.log("Conexão com o banco de dados bem-sucedida:", result[0])
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error)
    return { success: false, error }
  }
}

// Funções para etiquetas
export async function getEtiquetas(filters: any = {}) {
  try {
    let query = `
      SELECT * FROM etiquetas
      WHERE 1=1
    `
    const params: any[] = []

    if (filters.codigo) {
      params.push(filters.codigo)
      query += ` AND codigo = $${params.length}`
    }

    if (filters.etnia) {
      params.push(filters.etnia)
      query += ` AND etnia = $${params.length}`
    }

    if (filters.tipo) {
      params.push(filters.tipo)
      query += ` AND tipo = $${params.length}`
    }

    query += ` ORDER BY data_hora DESC`

    if (filters.limit) {
      params.push(filters.limit)
      query += ` LIMIT $${params.length}`
    }

    const result = await sql.query(query, params)
    return result.rows
  } catch (error) {
    console.error("Erro ao buscar etiquetas:", error)
    return []
  }
}

export async function createEtiqueta(data: any) {
  try {
    const {
      codigo,
      etnia,
      tipo,
      recipiente,
      gramatura,
      etiquetas,
      total_etiquetas,
      folhas,
      folhas_calculadas,
      usuario,
      obs,
      reposicao,
    } = data

    const result = await sql`
      INSERT INTO etiquetas (
        codigo, etnia, tipo, recipiente, gramatura, etiquetas, 
        total_etiquetas, folhas, folhas_calculadas, usuario, obs, reposicao
      )
      VALUES (
        ${codigo}, ${etnia}, ${tipo}, ${recipiente}, ${gramatura}, ${JSON.stringify(etiquetas)}, 
        ${total_etiquetas}, ${folhas}, ${folhas_calculadas}, ${usuario}, ${obs || null}, ${reposicao}
      )
      RETURNING *
    `

    return result[0]
  } catch (error) {
    console.error("Erro ao criar etiqueta:", error)
    throw error
  }
}

export async function updateEtiqueta(id: number, data: any) {
  try {
    const {
      codigo,
      etnia,
      tipo,
      recipiente,
      gramatura,
      etiquetas,
      total_etiquetas,
      folhas,
      folhas_calculadas,
      usuario,
      obs,
      reposicao,
    } = data

    const result = await sql`
      UPDATE etiquetas
      SET 
        codigo = ${codigo},
        etnia = ${etnia},
        tipo = ${tipo},
        recipiente = ${recipiente},
        gramatura = ${gramatura},
        etiquetas = ${JSON.stringify(etiquetas)},
        total_etiquetas = ${total_etiquetas},
        folhas = ${folhas},
        folhas_calculadas = ${folhas_calculadas},
        usuario = ${usuario},
        obs = ${obs || null},
        reposicao = ${reposicao},
        data_hora = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    return result[0]
  } catch (error) {
    console.error("Erro ao atualizar etiqueta:", error)
    throw error
  }
}

export async function deleteEtiqueta(id: number) {
  try {
    await sql`DELETE FROM etiquetas WHERE id = ${id}`
    return true
  } catch (error) {
    console.error("Erro ao excluir etiqueta:", error)
    throw error
  }
}

// Funções para etnias
export async function getEtnias() {
  try {
    const result = await sql`SELECT * FROM etnias ORDER BY nome`
    return result
  } catch (error) {
    console.error("Erro ao buscar etnias:", error)
    return []
  }
}

export async function createEtnia(nome: string) {
  try {
    const result = await sql`
      INSERT INTO etnias (nome)
      VALUES (${nome})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Erro ao criar etnia:", error)
    throw error
  }
}

export async function updateEtnia(id: number, nome: string) {
  try {
    const result = await sql`
      UPDATE etnias
      SET nome = ${nome}
      WHERE id = ${id}
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Erro ao atualizar etnia:", error)
    throw error
  }
}

export async function deleteEtnia(id: number) {
  try {
    // Primeiro excluir tipos relacionados
    await sql`DELETE FROM tipos WHERE etnia_id = ${id}`
    // Depois excluir a etnia
    await sql`DELETE FROM etnias WHERE id = ${id}`
    return true
  } catch (error) {
    console.error("Erro ao excluir etnia:", error)
    throw error
  }
}

// Funções para tipos
export async function getTiposByEtnia(etniaId: number) {
  try {
    const result = await sql`
      SELECT * FROM tipos 
      WHERE etnia_id = ${etniaId}
      ORDER BY nome
    `
    return result
  } catch (error) {
    console.error("Erro ao buscar tipos por etnia:", error)
    return []
  }
}

export async function createTipo(nome: string, etniaId: number) {
  try {
    const result = await sql`
      INSERT INTO tipos (nome, etnia_id)
      VALUES (${nome}, ${etniaId})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Erro ao criar tipo:", error)
    throw error
  }
}

export async function updateTipo(id: number, nome: string, etniaId: number) {
  try {
    const result = await sql`
      UPDATE tipos
      SET nome = ${nome}, etnia_id = ${etniaId}
      WHERE id = ${id}
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Erro ao atualizar tipo:", error)
    throw error
  }
}

export async function deleteTipo(id: number) {
  try {
    await sql`DELETE FROM tipos WHERE id = ${id}`
    return true
  } catch (error) {
    console.error("Erro ao excluir tipo:", error)
    throw error
  }
}

// Função para estatísticas
export async function getEstatisticas() {
  try {
    // Total de etiquetas
    const totalEtiquetas = await sql`
      SELECT SUM(total_etiquetas) as total
      FROM etiquetas
    `

    // Total de etiquetas que precisam de reposição
    const totalReposicao = await sql`
      SELECT COUNT(*) as total
      FROM etiquetas
      WHERE reposicao = true
    `

    // Total por etnia
    const totalPorEtnia = await sql`
      SELECT etnia, SUM(total_etiquetas) as total
      FROM etiquetas
      GROUP BY etnia
      ORDER BY total DESC
    `

    // Total por gramatura
    const totalPorGramatura = await sql`
      SELECT gramatura, SUM(total_etiquetas) as total
      FROM etiquetas
      GROUP BY gramatura
      ORDER BY total DESC
    `

    return {
      totalEtiquetas: totalEtiquetas[0]?.total || 0,
      totalReposicao: totalReposicao[0]?.total || 0,
      totalPorEtnia,
      totalPorGramatura,
    }
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error)
    return {
      totalEtiquetas: 0,
      totalReposicao: 0,
      totalPorEtnia: [],
      totalPorGramatura: [],
    }
  }
}

// Função para criar usuário
export async function createUserDb(nome: string, usuario: string, email: string, senhaHash: string) {
  try {
    console.log("Tentando criar usuário:", { nome, usuario, email })

    // Verificar se a tabela existe
    const checkTable = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'usuarios'
      );
    `

    console.log("Tabela existe?", checkTable)

    // Se a tabela não existir, criá-la
    if (!checkTable[0]?.exists) {
      console.log("Criando tabela usuarios...")
      await sql`
        CREATE TABLE IF NOT EXISTS usuarios (
          id SERIAL PRIMARY KEY,
          nome VARCHAR(255) NOT NULL,
          usuario VARCHAR(255) NOT NULL UNIQUE,
          email VARCHAR(255) NOT NULL UNIQUE,
          senha VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'user',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `
    }

    // Inserir o usuário
    const result = await sql`
      INSERT INTO usuarios (nome, usuario, email, senha)
      VALUES (${nome}, ${usuario}, ${email}, ${senhaHash})
      RETURNING id, nome, usuario, email, role;
    `

    console.log("Usuário criado:", result[0])
    return result[0]
  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    throw error
  }
}
