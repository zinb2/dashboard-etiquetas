import { Header } from "@/components/header"
import { EtiquetasForm } from "@/components/etiquetas-form"

export default function CadastrarPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <EtiquetasForm />
      </main>
    </div>
  )
}
