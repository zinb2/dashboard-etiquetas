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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  tipo: z.enum(["entrada", "saida"], {
    required_error: "Selecione o tipo de movimentação",
  }),
  etnia: z.string().min(1, { message: "A etnia é obrigatória" }),
  tipo_rape: z.string().min(1, { message: "O tipo é obrigatório" }),
  recipiente: z.string().min(1, { message: "O recipiente é obrigatório" }),
  gramatura: z.string().min(1, { message: "A gramatura é obrigatória" }),
  quantidade: z.string().transform((val) => Number.parseInt(val)),
  observacao: z.string().optional(),
})

interface Etnia {
  id: number
  nome: string
}

interface Tipo {
  id: number
  nome: string
}

interface Etiqueta {
  id: number
  codigo: string
  etnia: string
  tipo: string
  recipiente: string
  gramatura: string
  total_etiquetas: number
}

export function MovimentacaoForm() {
  const router = useRouter()
  const [etnias, setEtnias] = useState<Etnia[]>([])
  const [tipos, setTipos] = useState<Tipo[]>([])
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([])
  const [etiquetasFiltradas, setEtiquetasFiltradas] = useState<Etiqueta[]>([])
  const [etiquetaSelecionada, setEtiquetaSelecionada] = useState<Etiqueta | null>(null)
  const [gramaturas, setGramaturas] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: "entrada",
      etnia: "",
      tipo_rape: "",
      recipiente: "",
      gramatura: "",
      quantidade: "0",
      observacao: "",
    },
  })

  // Carregar etnias e etiquetas ao montar o componente
  useEffect(() => {
    async function loadData() {
      try {
        // Carregar etnias
        const etniasResponse = await fetch("/api/etnias")
        if (!etniasResponse.ok) throw new Error("Falha ao carregar etnias")
        const etniasData = await etniasResponse.json()
        setEtnias(etniasData)

        // Carregar etiquetas
        const etiquetasResponse = await fetch("/api/etiquetas")
        if (!etiquetasResponse.ok) throw new Error("Falha ao carregar etiquetas")
        const etiquetasData = await etiquetasResponse.json()
        setEtiquetas(etiquetasData)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados",
          variant: "destructive",
        })
      }
    }

    loadData()
  }, [])

  // Carregar tipos quando a etnia mudar
  useEffect(() => {
    const etniaValue = form.watch("etnia")
    if (!etniaValue) return

    async function loadTipos() {
      try {
        const etniaObj = etnias.find((e) => e.nome === etniaValue)
        if (!etniaObj) return

        const response = await fetch(`/api/tipos?etniaId=${etniaObj.id}`)
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

    // Filtrar etiquetas por etnia
    const filtradas = etiquetas.filter((e) => e.etnia === etniaValue)
    setEtiquetasFiltradas(filtradas)
    form.setValue("tipo_rape", "")
    form.setValue("recipiente", "")
    form.setValue("gramatura", "")
  }, [form.watch("etnia"), etnias, etiquetas])

  // Filtrar etiquetas quando o tipo mudar
  useEffect(() => {
    const tipoValue = form.watch("tipo_rape")
    if (!tipoValue) return

    const etniaValue = form.watch("etnia")
    const filtradas = etiquetas.filter((e) => e.etnia === etniaValue && e.tipo === tipoValue)
    setEtiquetasFiltradas(filtradas)

    // Extrair recipientes únicos
    const recipientes = Array.from(new Set(filtradas.map((e) => e.recipiente)))
    if (recipientes.length === 1) {
      form.setValue("recipiente", recipientes[0])
    } else {
      form.setValue("recipiente", "")
    }

    form.setValue("gramatura", "")
  }, [form.watch("tipo_rape"), form.watch("etnia"), etiquetas])

  // Atualizar gramaturas quando o recipiente mudar
  useEffect(() => {
    const recipienteValue = form.watch("recipiente")
    if (!recipienteValue) return

    const etniaValue = form.watch("etnia")
    const tipoValue = form.watch("tipo_rape")

    const filtradas = etiquetas.filter(
      (e) => e.etnia === etniaValue && e.tipo === tipoValue && e.recipiente === recipienteValue,
    )

    // Extrair gramaturas únicas
    const gramaturas = Array.from(new Set(filtradas.map((e) => e.gramatura)))
    setGramaturas(gramaturas)

    if (gramaturas.length === 1) {
      form.setValue("gramatura", gramaturas[0])
    } else {
      form.setValue("gramatura", "")
    }
  }, [form.watch("recipiente"), form.watch("etnia"), form.watch("tipo_rape"), etiquetas])

  // Encontrar etiqueta selecionada quando a gramatura mudar
  useEffect(() => {
    const gramaturaValue = form.watch("gramatura")
    if (!gramaturaValue) {
      setEtiquetaSelecionada(null)
      return
    }

    const etniaValue = form.watch("etnia")
    const tipoValue = form.watch("tipo_rape")
    const recipienteValue = form.watch("recipiente")

    const etiqueta = etiquetas.find(
      (e) =>
        e.etnia === etniaValue &&
        e.tipo === tipoValue &&
        e.recipiente === recipienteValue &&
        e.gramatura === gramaturaValue,
    )

    setEtiquetaSelecionada(etiqueta || null)
  }, [form.watch("gramatura"), form.watch("etnia"), form.watch("tipo_rape"), form.watch("recipiente"), etiquetas])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!etiquetaSelecionada) {
      toast({
        title: "Erro",
        description: "Nenhuma etiqueta encontrada com os critérios selecionados",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const payload = {
        etiqueta_id: etiquetaSelecionada.id,
        tipo: values.tipo,
        quantidade: values.quantidade,
        observacao: values.observacao,
      }

      const response = await fetch("/api/movimentacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Falha ao registrar movimentação")
      }

      toast({
        title: "Sucesso",
        description: `${values.tipo === "entrada" ? "Entrada" : "Saída"} registrada com sucesso`,
      })

      form.reset({
        tipo: "entrada",
        etnia: "",
        tipo_rape: "",
        recipiente: "",
        gramatura: "",
        quantidade: "0",
        observacao: "",
      })

      setEtiquetaSelecionada(null)
      router.refresh()
    } catch (error) {
      console.error("Erro ao registrar movimentação:", error)
      toast({
        title: "Erro",
        description: "Não foi possível registrar a movimentação",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Registrar Movimentação</CardTitle>
        <CardDescription>Registre entradas e saídas de etiquetas no estoque</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tipo de Movimentação</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="entrada" />
                        </FormControl>
                        <FormLabel className="font-normal">Entrada</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="saida" />
                        </FormControl>
                        <FormLabel className="font-normal">Saída</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                name="tipo_rape"
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!form.watch("tipo_rape")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um recipiente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from(new Set(etiquetasFiltradas.map((e) => e.recipiente))).map((recipiente) => (
                          <SelectItem key={recipiente} value={recipiente}>
                            {recipiente}
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
                name="quantidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="Quantidade de etiquetas"
                        {...field}
                        disabled={!etiquetaSelecionada}
                      />
                    </FormControl>
                    {etiquetaSelecionada && (
                      <FormDescription>Estoque atual: {etiquetaSelecionada.total_etiquetas} etiquetas</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="observacao"
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
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || !etiquetaSelecionada}>
                {loading ? "Salvando..." : "Registrar Movimentação"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
