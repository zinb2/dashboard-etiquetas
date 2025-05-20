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
import { EtniasForm } from "./etnias-form"

interface Etnia {
  id: number
  nome: string
}

export function EtniasTable() {
  const [etnias, setEtnias] = useState<Etnia[]>([])
  const [loading, setLoading] = useState(true)
  const [etniaParaEditar, setEtniaParaEditar] = useState<Etnia | null>(null)
  const [etniaParaExcluir, setEtniaParaExcluir] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)

  // Carregar etnias
  const loadEtnias = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/etnias")
      if (!response.ok) throw new Error("Falha ao carregar etnias")
      const data = await response.json()
      setEtnias(data)
    } catch (error) {
      console.error("Erro ao carregar etnias:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as etnias",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEtnias()
  }, [])

  // Função para excluir etnia
  async function excluirEtnia(id: number) {
    try {
      const response = await fetch(`/api/etnias/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Falha ao excluir etnia")

      toast({
        title: "Sucesso",
        description: "Etnia excluída com sucesso",
      })

      loadEtnias()
    } catch (error) {
      console.error("Erro ao excluir etnia:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a etnia",
        variant: "destructive",
      })
    }
  }

  function handleEditClick(etnia: Etnia) {
    setEtniaParaEditar(etnia)
    setShowForm(true)
  }

  function handleSuccess() {
    loadEtnias()
    setEtniaParaEditar(null)
    setShowForm(false)
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Etnias</CardTitle>
        <Button
          onClick={() => {
            setEtniaParaEditar(null)
            setShowForm(true)
          }}
        >
          Nova Etnia
        </Button>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="mb-6">
            <EtniasForm etnia={etniaParaEditar || undefined} onSuccess={handleSuccess} />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-4">
            <p>Carregando etnias...</p>
          </div>
        ) : etnias.length === 0 ? (
          <div className="flex justify-center py-4">
            <p className="text-muted-foreground">Nenhuma etnia cadastrada</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {etnias.map((etnia) => (
                  <TableRow key={etnia.id}>
                    <TableCell>{etnia.id}</TableCell>
                    <TableCell>{etnia.nome}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditClick(etnia)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive"
                              onClick={() => setEtniaParaExcluir(etnia.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir esta etnia? Esta ação não pode ser desfeita e também
                                excluirá todos os tipos associados a ela.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground"
                                onClick={() => etniaParaExcluir && excluirEtnia(etniaParaExcluir)}
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
