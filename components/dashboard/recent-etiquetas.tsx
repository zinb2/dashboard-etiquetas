import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

interface Etiqueta {
  id: number
  codigo: string
  etnia: string
  tipo: string
  recipiente: string
  gramatura: string
  total_etiquetas: number
  usuario: string
  data_hora: string
  reposicao: boolean
}

interface RecentEtiquetasProps {
  etiquetas: Etiqueta[]
}

export function RecentEtiquetas({ etiquetas }: RecentEtiquetasProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Etiquetas Recentes</CardTitle>
        <CardDescription>Últimas etiquetas cadastradas no sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {etiquetas.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">Nenhuma etiqueta cadastrada</p>
          ) : (
            etiquetas.map((etiqueta) => (
              <div key={etiqueta.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-1">
                  <p className="font-medium leading-none">{etiqueta.codigo}</p>
                  <p className="text-sm text-muted-foreground">
                    {etiqueta.etnia} - {etiqueta.tipo}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right text-sm">
                    <p>{formatDate(etiqueta.data_hora)}</p>
                    <p className="text-xs text-muted-foreground">{etiqueta.usuario}</p>
                  </div>
                  {etiqueta.reposicao ? (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Repor
                    </Badge>
                  ) : (
                    <Badge variant="outline">OK</Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
