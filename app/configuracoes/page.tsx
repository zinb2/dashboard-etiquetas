import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EtniasTable } from "@/components/configuracoes/etnias-table"
import { TiposTable } from "@/components/configuracoes/tipos-table"

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Configurações</h1>

      <Tabs defaultValue="etnias">
        <TabsList className="mb-4">
          <TabsTrigger value="etnias">Etnias</TabsTrigger>
          <TabsTrigger value="tipos">Tipos</TabsTrigger>
        </TabsList>
        <TabsContent value="etnias">
          <EtniasTable />
        </TabsContent>
        <TabsContent value="tipos">
          <TiposTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
