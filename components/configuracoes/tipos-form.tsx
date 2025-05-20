"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  nome: z.string().min(1, { message: "O nome do tipo é obrigatório" }),
  etniaId: z.string().min(1, { message: "A etnia é obrigatória" }),
})

interface TiposFormProps {
  tipo?: { id: number; nome: string; etnia_id: number }
  onSuccess: () => void
}

interface Etnia {
  id: number
  nome: string
}

export function TiposForm({ tipo, onSuccess }: TiposFormProps) {
  const [loading, setLoading] = useState(false)
  const [etnias, setEtnias] = useState<Etnia[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: tipo?.nome || "",
      etniaId: tipo?.etnia_id.toString() || "",
    },
  })

  useEffect(() => {
    async function loadEtnias() {
      try {
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
      }
    }

    loadEtnias()
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    try {
      const url = tipo ? `/api/tipos/${tipo.id}` : "/api/tipos"
      const method = tipo ? "PUT" : "POST"

      const payload = {
        nome: values.nome,
        etniaId: Number.parseInt(values.etniaId),
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Falha ao salvar tipo")
      }

      toast({
        title: "Sucesso",
        description: tipo ? "Tipo atualizado com sucesso" : "Tipo cadastrado com sucesso",
      })

      form.reset()
      onSuccess()
    } catch (error) {
      console.error("Erro ao salvar tipo:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar o tipo",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tipo ? "Editar Tipo" : "Novo Tipo"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Tipo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Rapé Tradicional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="etniaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Etnia</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma etnia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {etnias.map((etnia) => (
                        <SelectItem key={etnia.id} value={etnia.id.toString()}>
                          {etnia.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : tipo ? "Atualizar" : "Cadastrar"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
