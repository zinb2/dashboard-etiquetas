import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Função para combinar classes do Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Função para calcular o número de folhas com base na quantidade de etiquetas
export function calcularFolhas(etiquetas: number[], recipiente: string, gramatura: string): number {
  const totalEtiquetas = etiquetas.reduce((sum, val) => sum + val, 0)

  // Número de etiquetas por folha para cada combinação
  const etiquetasPorFolha: Record<string, Record<string, number>> = {
    Lata: {
      "5g": 48,
      "10g": 38,
      "20g": 20,
      "50g": 14,
    },
    Pote: {
      "7g": 80,
      "14g": 52,
      "28g": 47,
    },
    "Fundo de lata": {
      "5g": 160,
      "10g": 160,
      "20g": 77,
      "50g": 77,
    },
  }

  const etiquetasPorFolhaValor = etiquetasPorFolha[recipiente]?.[gramatura] || 1
  return totalEtiquetas / etiquetasPorFolhaValor
}

// Função para verificar se é necessário repor estoque
export function verificarReposicao(totalEtiquetas: number, recipiente: string, gramatura: string): boolean {
  // Limites mínimos para cada combinação (equivalente a 2 folhas)
  const limitesReposicao: Record<string, Record<string, number>> = {
    Lata: {
      "5g": 96,
      "10g": 77,
      "20g": 40,
      "50g": 28,
    },
    Pote: {
      "7g": 161,
      "14g": 105,
      "28g": 95,
    },
    "Fundo de lata": {
      "5g": 320,
      "10g": 320,
      "20g": 154,
      "50g": 154,
    },
  }

  const limite = limitesReposicao[recipiente]?.[gramatura] || 0
  return totalEtiquetas < limite
}

// Função para exportar dados para CSV
export function exportToCSV(data: any[], filename: string) {
  if (!data || !data.length) {
    return
  }

  const headers = Object.keys(data[0])
  const csvRows = []

  // Adicionar cabeçalhos
  csvRows.push(headers.join(","))

  // Adicionar linhas
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header]
      // Lidar com arrays e valores que precisam de aspas
      if (Array.isArray(value)) {
        return `"${value.join(";")}"`
      }
      const cellValue = value === null || value === undefined ? "" : value.toString()
      return cellValue.includes(",") ? `"${cellValue}"` : cellValue
    })
    csvRows.push(values.join(","))
  }

  // Criar blob e download
  const csvString = csvRows.join("\n")
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })

  if (typeof window !== "undefined") {
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Função para formatar data
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR")
}
