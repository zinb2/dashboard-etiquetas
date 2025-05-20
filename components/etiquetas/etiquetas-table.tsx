"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Download, Edit, Search, Trash2 } from "lucide-react"
import { formatDate, exportToCSV } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAbsoluteUrl } from "@/lib/url"

interface Etiqueta {
  id: number
  codigo: string
  etnia: string
  tipo: string
  recipiente: string
  gramatura: string
  etiquetas: number[]
  total_etiquetas: number
  folhas: number
  folhas_calculadas: number
  usuario: string
  data_hora: string
  obs?: string
  reposicao: boolean
}

export function EtiquetasTable() {
  const router = useRouter()
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState("")
  const [etniaFiltro, setEtniaFiltro] = useState("")
  const [tipoFiltro, setTipoFiltro] = useState("")
  const [etiquetaParaExcluir, setEtiquetaParaExcluir] = useState<number | null>(null)
  const [etnias, setEtnias] = useState<string[]>([])
  const [tipos, setTipos] = useState<string[]>([])

  // Carregar etiquetas
  useEffect(() => {
    async function loadEtiquetas() {
      try {
        setLoading(true)
        const response = await fetch(getAbsoluteUrl("/api/etiquetas"))
        if (!response.ok) throw new Error("Falha ao carregar etiquetas")
        const data = await response.json()
        setEtiquetas(data)

        // Extrair etnias e tipos únicos para os filtros
        const uniqueEtnias = Array.from(new Set(data.map((e: Etiqueta) => e.etnia)))
        const uniqueTipos = Array.from(new Set(data.map((e: Etiqueta) => e.tipo)))
        setEtnias(uniqueEtnias as string[])
        setTipos(uniqueTipos as string[])
      } catch (error) {
        console.error("Erro ao carregar etiquetas:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar as etiquetas",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadEtiquetas()
  }, [])

  // Filtrar etiquetas
  const etiquetasFiltradas = etiquetas.filter((etiqueta) => {
    const termoLower = filtro.toLowerCase()
    const matchesTermo =
      etiqueta.codigo.toLowerCase().includes(termoLower) ||
      etiqueta.etnia.toLowerCase().includes(termoLower) ||
      etiqueta.tipo.toLowerCase().includes(termoLower)

    const matchesEtnia = etniaFiltro ? etiqueta.etnia === etniaFiltro : true
    const matchesTipo = tipoFiltro ? etiqueta.tipo === tipoFiltro : true

    return matchesTermo && matchesEtnia && matchesTipo
  })

  // Função para excluir etiqueta
  async function excluirEtiqueta(id: number) {
    try {
      const response = await fetch(getAbsoluteUrl(`/api/etiquetas/${id}`), {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Falha ao excluir etiqueta")

      // Atualizar a lista de etiquetas
      setEtiquetas(etiquetas.filter((etiqueta) => etiqueta.id !== id))

      toast({
        title: "Sucesso",
        description: "Etiqueta excluída com sucesso",
      })
    } catch (error) {
      console.error("Erro ao excluir etiqueta:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a etiqueta",
        variant: "destructive",
      })
    }
  }

  // Função para exportar para CSV
  function handleExportCSV() {
    const dataToExport = etiquetasFiltradas.map((etiqueta) => ({
      Código: etiqueta.codigo,
      Etnia: etiqueta.etnia,
      Tipo: etiqueta.tipo,
      Recipiente: etiqueta.recipiente,
      Gramatura: etiqueta.gramatura,
      "Total de Etiquetas": etiqueta.total_etiquetas,
      Folhas: etiqueta.folhas,
      "Folhas Calculadas": etiqueta.folhas_calculadas.toFixed(2),
      Responsável: etiqueta.usuario,
      "Data/Hora": formatDate(etiqueta.data_hora),
      Observações: etiqueta.obs || "",
      Reposição: etiqueta.reposicao ? "Sim" : "Não",
    }))

    exportToCSV(dataToExport, "etiquetas-rape.csv")
  }

  // Limpar filtros
  function limparFiltros() {
    setFiltro("")
    setEtniaFiltro("")
    setTipoFiltro("")
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col space-y-4">
        <CardTitle>Etiquetas Cadastradas</CardTitle>
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
            <Select value={etniaFiltro} onValueChange={setEtniaFiltro}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por etnia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as etnias</SelectItem>
                {etnias.map((etnia) => (
                  <SelectItem key={etnia} value={etnia}>
                    {etnia}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {tipos.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={limparFiltros}>
              Limpar filtros
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
            <Button onClick={() => router.push("/registrar")}>Nova Etiqueta</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <p>Carregando etiquetas...</p>
          </div>
        ) : etiquetasFiltradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="mb-2 text-muted-foreground">Nenhuma etiqueta encontrada</p>
            {(filtro || etniaFiltro || tipoFiltro) && (
              <p className="text-sm text-muted-foreground">Tente ajustar seus filtros ou cadastre uma nova etiqueta</p>
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
                  <TableHead>Recipiente</TableHead>
                  <TableHead>Gramatura</TableHead>
                  <TableHead>Total Etiquetas</TableHead>
                  <TableHead>Folhas</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {etiquetasFiltradas.map((etiqueta) => (
                  <TableRow key={etiqueta.id}>
                    <TableCell className="font-medium">{etiqueta.codigo}</TableCell>
                    <TableCell>{etiqueta.etnia}</TableCell>
                    <TableCell>{etiqueta.tipo}</TableCell>
                    <TableCell>{etiqueta.recipiente}</TableCell>
                    <TableCell>{etiqueta.gramatura}</TableCell>
                    <TableCell>{etiqueta.total_etiquetas}</TableCell>
                    <TableCell>
                      {etiqueta.folhas} ({etiqueta.folhas_calculadas.toFixed(2)})
                    </TableCell>
                    <TableCell>{etiqueta.usuario}</TableCell>
                    <TableCell>{formatDate(etiqueta.data_hora)}</TableCell>
                    <TableCell>
                      {etiqueta.reposicao ? (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Repor
                        </Badge>
                      ) : (
                        <Badge variant="outline">OK</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="icon" onClick={() => router.push(`/editar/${etiqueta.id}`)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive"
                              onClick={() => setEtiquetaParaExcluir(etiqueta.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir esta etiqueta? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground"
                                onClick={() => etiquetaParaExcluir && excluirEtiqueta(etiquetaParaExcluir)}
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
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
