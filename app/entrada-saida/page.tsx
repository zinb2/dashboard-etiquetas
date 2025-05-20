import { MovimentacaoForm } from "@/components/movimentacao/movimentacao-form"
import { MovimentacoesTable } from "@/components/movimentacao/movimentacoes-table"

export default function EntradaSaidaPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Entrada/Saída</h1>
      <MovimentacaoForm />
      <MovimentacoesTable />
    </div>
  )
}
