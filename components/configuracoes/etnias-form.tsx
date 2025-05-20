"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  nome: z.string().min(1, { message: "O nome da etnia é obrigatório" }),
})

interface EtniasFormProps {
  etnia?: { id: number; nome: string }
  onSuccess: () => void
}

export function EtniasForm({ etnia, onSuccess }: EtniasFormProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: etnia?.nome || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    try {
      const url = etnia ? `/api/etnias/${etnia.id}` : "/api/etnias"
      const method = etnia ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Falha ao salvar etnia")
      }

      toast({
        title: "Sucesso",
        description: etnia ? "Etnia atualizada com sucesso" : "Etnia cadastrada com sucesso",
      })

      form.reset()
      onSuccess()
    } catch (error) {
      console.error("Erro ao salvar etnia:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar a etnia",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{etnia ? "Editar Etnia" : "Nova Etnia"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Etnia</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Huni Kuin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : etnia ? "Atualizar" : "Cadastrar"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
