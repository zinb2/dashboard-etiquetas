"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2 } from "lucide-react"
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
import { TiposForm } from "./tipos-form"

interface Tipo {
  id: number
  nome: string
  etnia_id: number
  etnia_nome?: string
}

export function TiposTable() {
  const [tipos, setTipos] = useState<Tipo[]>([])
  const [loading, setLoading] = useState(true)
  const [tipoParaEditar, setTipoParaEditar] = useState<Tipo | null>(null)
  const [tipoParaExcluir, setTipoParaExcluir] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)

  // Carregar tipos
  const loadTipos = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/tipos")
      if (!response.ok) throw new Error("Falha ao carregar tipos")
      const data = await response.json()
      setTipos(data)
    } catch (error) {
      console.error("Erro ao carregar tipos:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os tipos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTipos()
  }, [])

  // Função para excluir tipo
  async function excluirTipo(id: number) {
    try {
      const response = await fetch(`/api/tipos/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Falha ao excluir tipo")

      toast({
        title: "Sucesso",
        description: "Tipo excluído com sucesso",
      })

      loadTipos()
    } catch (error) {
      console.error("Erro ao excluir tipo:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o tipo",
        variant: "destructive",
      })
    }
  }

  function handleEditClick(tipo: Tipo) {
    setTipoParaEditar(tipo)
    setShowForm(true)
  }

  function handleSuccess() {
    loadTipos()
    setTipoParaEditar(null)
    setShowForm(false)
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tipos</CardTitle>
        <Button
          onClick={() => {
            setTipoParaEditar(null)
            setShowForm(true)
          }}
        >
          Novo Tipo
        </Button>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="mb-6">
            <TiposForm tipo={tipoParaEditar || undefined} onSuccess={handleSuccess} />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-4">
            <p>Carregando tipos...</p>
          </div>
        ) : tipos.length === 0 ? (
          <div className="flex justify-center py-4">
            <p className="text-muted-foreground">Nenhum tipo cadastrado</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Etnia</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tipos.map((tipo) => (
                  <TableRow key={tipo.id}>
                    <TableCell>{tipo.id}</TableCell>
                    <TableCell>{tipo.nome}</TableCell>
                    <TableCell>{tipo.etnia_nome}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditClick(tipo)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive"
                              onClick={() => setTipoParaExcluir(tipo.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este tipo? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground"
                                onClick={() => tipoParaExcluir && excluirTipo(tipoParaExcluir)}
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
