import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST() {
  try {
    // Criar tabela de usuários se não existir
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
      )
    `

    // Criar tabela de etnias se não existir
    await sql`
      CREATE TABLE IF NOT EXISTS etnias (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL UNIQUE
      )
    `

    // Criar tabela de tipos se não existir
    await sql`
      CREATE TABLE IF NOT EXISTS tipos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        etnia_id INTEGER NOT NULL REFERENCES etnias(id),
        codigo VARCHAR(50),
        UNIQUE(nome, etnia_id)
      )
    `

    // Criar tabela de etiquetas se não existir
    await sql`
      CREATE TABLE IF NOT EXISTS etiquetas (
        id SERIAL PRIMARY KEY,
        codigo VARCHAR(255) NOT NULL,
        etnia VARCHAR(255) NOT NULL,
        tipo VARCHAR(255) NOT NULL,
        recipiente VARCHAR(255) NOT NULL,
        gramatura VARCHAR(50) NOT NULL,
        etiquetas JSONB NOT NULL,
        total_etiquetas INTEGER NOT NULL,
        folhas INTEGER NOT NULL,
        folhas_calculadas FLOAT NOT NULL,
        usuario VARCHAR(255) NOT NULL,
        data_hora TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        obs TEXT,
        reposicao BOOLEAN DEFAULT FALSE
      )
    `

    // Criar tabela de atividades se não existir
    await sql`
      CREATE TABLE IF NOT EXISTS atividades (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id),
        tipo VARCHAR(50) NOT NULL,
        entidade VARCHAR(50) NOT NULL,
        entidade_id INTEGER,
        descricao TEXT NOT NULL,
        data_hora TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Criar tabela de movimentações se não existir
    await sql`
      CREATE TABLE IF NOT EXISTS movimentacoes (
        id SERIAL PRIMARY KEY,
        etiqueta_id INTEGER REFERENCES etiquetas(id),
        usuario_id INTEGER REFERENCES usuarios(id),
        tipo VARCHAR(50) NOT NULL,
        quantidade INTEGER NOT NULL,
        data_hora TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        observacao TEXT
      )
    `

    return NextResponse.json({
      success: true,
      message: "Tabelas criadas com sucesso",
    })
  } catch (error) {
    console.error("Erro ao criar tabelas:", error)
    return NextResponse.json(
      {
        error: "Erro ao criar tabelas",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
