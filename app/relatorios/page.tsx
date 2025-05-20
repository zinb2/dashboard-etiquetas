import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getEstatisticas } from "@/lib/db"
import { ChartCard } from "@/components/dashboard/chart-card"

export default async function RelatoriosPage() {
  const estatisticas = await getEstatisticas()

  // Preparar dados para os gráficos com verificação de dados
  const dadosEtnia = estatisticas.totalPorEtnia
    ? estatisticas.totalPorEtnia.map((item: any) => ({
        name: item.etnia || "Desconhecido",
        value: Number(item.total) || 0,
      }))
    : []

  const dadosGramatura = estatisticas.totalPorGramatura
    ? estatisticas.totalPorGramatura.map((item: any) => ({
        name: item.gramatura || "Desconhecido",
        value: Number(item.total) || 0,
      }))
    : []

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Relatórios</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumo de Etiquetas</CardTitle>
            <CardDescription>Visão geral das etiquetas cadastradas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-lg font-medium">Por Etnia</h3>
                <div className="space-y-2">
                  {estatisticas.totalPorEtnia && estatisticas.totalPorEtnia.length > 0 ? (
                    estatisticas.totalPorEtnia.map((item: any) => (
                      <div key={item.etnia} className="flex items-center justify-between">
                        <span>{item.etnia}</span>
                        <span className="font-medium">{item.total}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum dado disponível</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="mb-4 text-lg font-medium">Por Gramatura</h3>
                <div className="space-y-2">
                  {estatisticas.totalPorGramatura && estatisticas.totalPorGramatura.length > 0 ? (
                    estatisticas.totalPorGramatura.map((item: any) => (
                      <div key={item.gramatura} className="flex items-center justify-between">
                        <span>{item.gramatura}</span>
                        <span className="font-medium">{item.total}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum dado disponível</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Suspense fallback={<div>Carregando gráfico...</div>}>
            <ChartCard
              title="Etiquetas por Etnia"
              description="Distribuição de etiquetas por etnia"
              data={dadosEtnia}
            />
          </Suspense>
          <Suspense fallback={<div>Carregando gráfico...</div>}>
            <ChartCard
              title="Etiquetas por Gramatura"
              description="Distribuição de etiquetas por gramatura"
              data={dadosGramatura}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
