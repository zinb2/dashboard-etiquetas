import { EtiquetasTable } from "@/components/etiquetas/etiquetas-table"

export default function EstoquePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Estoque de Etiquetas</h1>
      <EtiquetasTable />
    </div>
  )
}
