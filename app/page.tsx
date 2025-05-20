import { Suspense } from "react"
import { Package, AlertCircle, Users, FileText } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { ChartCard } from "@/components/dashboard/chart-card"
import { RecentEtiquetas } from "@/components/dashboard/recent-etiquetas"
import { getEstatisticas, getEtiquetas } from "@/lib/db"

export default async function DashboardPage() {
  const estatisticas = await getEstatisticas()
  const etiquetasRecentes = await getEtiquetas({ limit: 5 })

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
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Etiquetas"
          value={estatisticas.totalEtiquetas || 0}
          icon={Package}
          description="Etiquetas cadastradas no sistema"
        />
        <StatsCard
          title="Reposição Necessária"
          value={estatisticas.totalReposicao || 0}
          icon={AlertCircle}
          description="Etiquetas que precisam ser repostas"
        />
        <StatsCard
          title="Etnias"
          value={estatisticas.totalPorEtnia?.length || 0}
          icon={Users}
          description="Etnias cadastradas no sistema"
        />
        <StatsCard
          title="Tipos"
          value={estatisticas.totalPorGramatura?.length || 0}
          icon={FileText}
          description="Gramaturas diferentes cadastradas"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Suspense fallback={<div>Carregando gráfico...</div>}>
          <ChartCard title="Etiquetas por Etnia" description="Distribuição de etiquetas por etnia" data={dadosEtnia} />
        </Suspense>
        <Suspense fallback={<div>Carregando gráfico...</div>}>
          <ChartCard
            title="Etiquetas por Gramatura"
            description="Distribuição de etiquetas por gramatura"
            data={dadosGramatura}
          />
        </Suspense>
      </div>

      <Suspense fallback={<div>Carregando etiquetas recentes...</div>}>
        <RecentEtiquetas etiquetas={etiquetasRecentes || []} />
      </Suspense>
    </div>
  )
}
