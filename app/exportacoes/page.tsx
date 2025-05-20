"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download } from "lucide-react"
import { exportToCSV } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

export default function ExportacoesPage() {
  const [loading, setLoading] = useState(false)
  const [etnias, setEtnias] = useState<string[]>([])
  const [tipos, setTipos] = useState<string[]>([])
  const [etniaFiltro, setEtniaFiltro] = useState("all")
  const [tipoFiltro, setTipoFiltro] = useState("all")

  useEffect(() => {
    async function loadFiltros() {
      try {
        // Carregar etiquetas para extrair etnias e tipos únicos
        const response = await fetch("/api/etiquetas")
        if (!response.ok) throw new Error("Falha ao carregar dados")
        const data = await response.json()

        // Extrair etnias e tipos únicos
        const uniqueEtnias = Array.from(new Set(data.map((e: any) => e.etnia)))
        const uniqueTipos = Array.from(new Set(data.map((e: any) => e.tipo)))
        setEtnias(uniqueEtnias as string[])
        setTipos(uniqueTipos as string[])
      } catch (error) {
        console.error("Erro ao carregar filtros:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os filtros",
          variant: "destructive",
        })
      }
    }

    loadFiltros()
  }, [])

  async function handleExportCSV() {
    setLoading(true)
    try {
      // Construir URL com filtros
      let url = "/api/etiquetas"
      const params = new URLSearchParams()
      if (etniaFiltro !== "all") params.append("etnia", etniaFiltro)
      if (tipoFiltro !== "all") params.append("tipo", tipoFiltro)
      if (params.toString()) url += `?${params.toString()}`

      // Buscar dados filtrados
      const response = await fetch(url)
      if (!response.ok) throw new Error("Falha ao carregar dados")
      const data = await response.json()

      // Formatar dados para CSV
      const dataToExport = data.map((etiqueta: any) => ({
        Código: etiqueta.codigo,
        Etnia: etiqueta.etnia,
        Tipo: etiqueta.tipo,
        Recipiente: etiqueta.recipiente,
        Gramatura: etiqueta.gramatura,
        "Total de Etiquetas": etiqueta.total_etiquetas,
        Folhas: etiqueta.folhas,
        "Folhas Calculadas": etiqueta.folhas_calculadas.toFixed(2),
        Responsável: etiqueta.usuario,
        "Data/Hora": new Date(etiqueta.data_hora).toLocaleString("pt-BR"),
        Observações: etiqueta.obs || "",
        Reposição: etiqueta.reposicao ? "Sim" : "Não",
      }))

      // Gerar nome do arquivo com filtros
      let filename = "etiquetas-rape"
      if (etniaFiltro !== "all") filename += `-${etniaFiltro}`
      if (tipoFiltro !== "all") filename += `-${tipoFiltro}`
      filename += `.csv`

      // Exportar para CSV
      exportToCSV(dataToExport, filename)

      toast({
        title: "Sucesso",
        description: `Exportação concluída com ${data.length} registros`,
      })
    } catch (error) {
      console.error("Erro ao exportar dados:", error)
      toast({
        title: "Erro",
        description: "Não foi possível exportar os dados",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Exportações</h1>

      <Card>
        <CardHeader>
          <CardTitle>Exportar Etiquetas</CardTitle>
          <CardDescription>Exporte os dados de etiquetas para um arquivo CSV</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Filtrar por Etnia</label>
                <Select value={etniaFiltro} onValueChange={setEtniaFiltro}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as etnias" />
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
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Filtrar por Tipo</label>
                <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os tipos" />
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
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleExportCSV} disabled={loading}>
                <Download className="mr-2 h-4 w-4" />
                {loading ? "Exportando..." : "Exportar CSV"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
