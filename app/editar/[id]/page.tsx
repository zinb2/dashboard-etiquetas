import { notFound } from "next/navigation"
import { sql } from "@/lib/db"
import { EtiquetasForm } from "@/components/etiquetas/etiquetas-form"

interface EditarPageProps {
  params: {
    id: string
  }
}

// This is a server component, so it's safe to use sql here
export default async function EditarPage({ params }: EditarPageProps) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  // Buscar a etiqueta pelo ID
  const result = await sql`SELECT * FROM etiquetas WHERE id = ${id}`
  const etiqueta = result[0]

  if (!etiqueta) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Editar Etiqueta</h1>
      <EtiquetasForm etiqueta={etiqueta} />
    </div>
  )
}
