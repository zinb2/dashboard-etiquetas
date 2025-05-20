"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Movimentacao {
  id: number
  etiqueta_id: number
  etiqueta: {
    codigo: string
    etnia: string
    tipo: string
    recipiente: string
    gramatura: string
  }
  usuario: {
    nome: string
  }
  tipo: string
  quantidade: number
  data_hora: string
  observacao?: string
}

export function MovimentacoesTable() {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState("")
  const [tipoFiltro, setTipoFiltro] = useState("all")

  // Carregar movimentações
  useEffect(() => {
    async function loadMovimentacoes() {
      try {
        const response = await fetch("/api/movimentacoes")
        if (!response.ok) throw new Error("Falha ao carregar movimentações")
        const data = await response.json()
        setMovimentacoes(data)
      } catch (error) {
        console.error("Erro ao carregar movimentações:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar as movimentações",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadMovimentacoes()
  }, [])

  // Filtrar movimentações
  const movimentacoesFiltradas = movimentacoes.filter((movimentacao) => {
    const termoLower = filtro.toLowerCase()
    const matchesTermo =
      movimentacao.etiqueta.codigo.toLowerCase().includes(termoLower) ||
      movimentacao.etiqueta.etnia.toLowerCase().includes(termoLower) ||
      movimentacao.etiqueta.tipo.toLowerCase().includes(termoLower) ||
      movimentacao.usuario.nome.toLowerCase().includes(termoLower)

    const matchesTipo = tipoFiltro === "all" || movimentacao.tipo === tipoFiltro

    return matchesTermo && matchesTipo
  })

  // Limpar filtros
  function limparFiltros() {
    setFiltro("")
    setTipoFiltro("all")
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col space-y-4">
        <CardTitle>Histórico de Movimentações</CardTitle>
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar..."
                className="w-full pl-8 md:w-[200px]"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
            <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="entrada">Entrada</SelectItem>
                <SelectItem value="saida">Saída</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={limparFiltros}>
              Limpar filtros
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <p>Carregando movimentações...</p>
          </div>
        ) : movimentacoesFiltradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="mb-2 text-muted-foreground">Nenhuma movimentação encontrada</p>
            {(filtro || tipoFiltro !== "all") && (
              <p className="text-sm text-muted-foreground">Tente ajustar seus filtros</p>
            )}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Etnia</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Recipiente/Gramatura</TableHead>
                  <TableHead>Movimentação</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Data/Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movimentacoesFiltradas.map((movimentacao) => (
                  <TableRow key={movimentacao.id}>
                    <TableCell className="font-medium">{movimentacao.etiqueta.codigo}</TableCell>
                    <TableCell>{movimentacao.etiqueta.etnia}</TableCell>
                    <TableCell>{movimentacao.etiqueta.tipo}</TableCell>
                    <TableCell>
                      {movimentacao.etiqueta.recipiente} / {movimentacao.etiqueta.gramatura}
                    </TableCell>
                    <TableCell>
                      <Badge variant={movimentacao.tipo === "entrada" ? "outline" : "destructive"}>
                        {movimentacao.tipo === "entrada" ? "Entrada" : "Saída"}
                      </Badge>
                    </TableCell>
                    <TableCell>{movimentacao.quantidade}</TableCell>
                    <TableCell>{movimentacao.usuario.nome}</TableCell>
                    <TableCell>{formatDate(movimentacao.data_hora)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
