"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { calcularFolhas, verificarReposicao } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { getAbsoluteUrl } from "@/lib/url"

// Esquema de validação do formulário
const formSchema = z.object({
  codigo: z.string().min(1, { message: "O código é obrigatório" }),
  etnia: z.string().min(1, { message: "A etnia é obrigatória" }),
  tipo: z.string().min(1, { message: "O tipo é obrigatório" }),
  recipiente: z.string().min(1, { message: "O recipiente é obrigatório" }),
  gramatura: z.string().min(1, { message: "A gramatura é obrigatória" }),
  etiquetas: z.string().transform((val) => {
    // Converte a string de números separados por vírgula em um array de números
    return val
      .split(",")
      .map((num) => Number.parseInt(num.trim()))
      .filter((num) => !isNaN(num))
  }),
  usuario: z.string().min(1, { message: "O nome do responsável é obrigatório" }),
  obs: z.string().optional(),
})

interface Etnia {
  id: number
  nome: string
}

interface Tipo {
  id: number
  nome: string
}

export function EtiquetasForm({ etiqueta = null }: { etiqueta?: any }) {
  const router = useRouter()
  const [etnias, setEtnias] = useState<Etnia[]>([])
  const [tipos, setTipos] = useState<Tipo[]>([])
  const [gramaturas, setGramaturas] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // Inicializar o formulário
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: etiqueta
      ? {
          codigo: etiqueta.codigo,
          etnia: etiqueta.etnia,
          tipo: etiqueta.tipo,
          recipiente: etiqueta.recipiente,
          gramatura: etiqueta.gramatura,
          etiquetas: etiqueta.etiquetas.join(", "),
          usuario: etiqueta.usuario,
          obs: etiqueta.obs || "",
        }
      : {
          codigo: "",
          etnia: "",
          tipo: "",
          recipiente: "",
          gramatura: "",
          etiquetas: "",
          usuario: "",
          obs: "",
        },
  })

  // Carregar etnias ao montar o componente
  useEffect(() => {
    async function loadEtnias() {
      try {
        const response = await fetch(getAbsoluteUrl("/api/etnias"))
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

  // Carregar tipos quando a etnia mudar
  useEffect(() => {
    const etniaValue = form.watch("etnia")
    if (!etniaValue) return

    async function loadTipos() {
      try {
        const etniaObj = etnias.find((e) => e.nome === etniaValue)
        if (!etniaObj) return

        const response = await fetch(getAbsoluteUrl(`/api/tipos?etniaId=${etniaObj.id}`))
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
      }
    }

    loadTipos()
  }, [form.watch("etnia"), etnias])

  // Atualizar gramaturas quando o recipiente mudar
  useEffect(() => {
    const recipienteValue = form.watch("recipiente")
    if (recipienteValue === "Lata") {
      setGramaturas(["5g", "10g", "20g", "50g"])
    } else if (recipienteValue === "Pote") {
      setGramaturas(["7g", "14g", "28g"])
    } else if (recipienteValue === "Fundo de lata") {
      setGramaturas(["5g", "10g", "20g", "50g"])
    } else {
      setGramaturas([])
    }

    // Limpar o valor da gramatura se o recipiente mudar
    if (form.getValues("gramatura") && gramaturas.indexOf(form.getValues("gramatura")) === -1) {
      form.setValue("gramatura", "")
    }
  }, [form.watch("recipiente")])

  // Função para enviar o formulário
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    try {
      // Converter os valores para o formato esperado pela API
      const etiquetasArray = values.etiquetas as unknown as number[]
      const totalEtiquetas = etiquetasArray.reduce((sum, val) => sum + val, 0)
      const folhas = etiquetasArray.length
      const folhasCalculadas = calcularFolhas(etiquetasArray, values.recipiente, values.gramatura)
      const reposicao = verificarReposicao(totalEtiquetas, values.recipiente, values.gramatura)

      const payload = {
        ...values,
        etiquetas: etiquetasArray,
        total_etiquetas: totalEtiquetas,
        folhas: folhas,
        folhas_calculadas: folhasCalculadas,
        reposicao: reposicao,
      }

      // Determinar se é uma criação ou atualização
      const url = etiqueta ? getAbsoluteUrl(`/api/etiquetas/${etiqueta.id}`) : getAbsoluteUrl("/api/etiquetas")
      const method = etiqueta ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Falha ao salvar etiqueta")
      }

      // Registrar a atividade
      await fetch(getAbsoluteUrl("/api/atividades"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo: etiqueta ? "atualizacao" : "criacao",
          entidade: "etiqueta",
          descricao: etiqueta
            ? `Atualizou etiqueta ${values.codigo} (${values.etnia} - ${values.tipo})`
            : `Criou etiqueta ${values.codigo} (${values.etnia} - ${values.tipo})`,
        }),
      })

      toast({
        title: "Sucesso",
        description: etiqueta ? "Etiqueta atualizada com sucesso" : "Etiqueta cadastrada com sucesso",
      })

      // Redirecionar para a página de estoque
      router.push("/estoque")
      router.refresh()
    } catch (error) {
      console.error("Erro ao salvar etiqueta:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar a etiqueta",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{etiqueta ? "Editar Etiqueta" : "Cadastrar Nova Etiqueta"}</CardTitle>
        <CardDescription>
          Preencha os dados para {etiqueta ? "atualizar a" : "cadastrar uma nova"} etiqueta de rapé
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="codigo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código (SKU)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: RAP-HK-TRAD-L-5G" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="usuario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do responsável" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="etnia"
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
                          <SelectItem key={etnia.id} value={etnia.nome}>
                            {etnia.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!form.watch("etnia")}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tipos.map((tipo) => (
                          <SelectItem key={tipo.id} value={tipo.nome}>
                            {tipo.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recipiente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipiente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um recipiente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Lata">Lata</SelectItem>
                        <SelectItem value="Pote">Pote</SelectItem>
                        <SelectItem value="Fundo de lata">Fundo de lata</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gramatura"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gramatura</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!form.watch("recipiente")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma gramatura" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {gramaturas.map((gramatura) => (
                          <SelectItem key={gramatura} value={gramatura}>
                            {gramatura}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="etiquetas"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Quantidade de etiquetas por folha</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 25, 12, 30" {...field} />
                    </FormControl>
                    <FormDescription>Digite os valores separados por vírgula</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="obs"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Observações adicionais" className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => router.push("/estoque")}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : etiqueta ? "Atualizar" : "Cadastrar"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
