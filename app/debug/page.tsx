"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

import { clientEnv } from "@/lib/env"

export default function DebugPage() {
  const [dbInfo, setDbInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [createTablesResult, setCreateTablesResult] = useState<any>(null)
  const [creatingTables, setCreatingTables] = useState(false)

  const [envInfo, setEnvInfo] = useState<any>(null)
  const [loadingEnv, setLoadingEnv] = useState(false)

  async function checkEnvironment() {
    try {
      setLoadingEnv(true)
      const response = await fetch("/api/debug/env")
      const data = await response.json()
      setEnvInfo(data)
    } catch (err) {
      console.error("Error checking environment:", err)
    } finally {
      setLoadingEnv(false)
    }
  }

  useEffect(() => {
    async function checkDatabase() {
      try {
        setLoading(true)
        const response = await fetch("/api/debug/db")
        const data = await response.json()
        setDbInfo(data)
        setError(null)
      } catch (err) {
        setError("Erro ao verificar banco de dados")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    checkDatabase()
  }, [])

  useEffect(() => {
    checkEnvironment()
  }, [])

  async function handleCreateTables() {
    try {
      setCreatingTables(true)
      const response = await fetch("/api/debug/create-tables", {
        method: "POST",
      })
      const data = await response.json()
      setCreateTablesResult(data)

      // Recarregar informações do banco após criar tabelas
      const dbResponse = await fetch("/api/debug/db")
      const dbData = await dbResponse.json()
      setDbInfo(dbData)
    } catch (err) {
      setCreateTablesResult({ error: "Erro ao criar tabelas" })
      console.error(err)
    } finally {
      setCreatingTables(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Diagnóstico do Sistema</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Conexão com Banco de Dados</CardTitle>
          <CardDescription>Informações sobre a conexão com o banco de dados</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Carregando informações do banco de dados...</p>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">URL do Banco de Dados:</h3>
                <p className="text-sm text-muted-foreground">{dbInfo.databaseUrl}</p>
              </div>

              <div>
                <h3 className="font-medium">Banco de Dados Atual:</h3>
                <p className="text-sm">{dbInfo.connection?.current_database || "Não disponível"}</p>
              </div>

              <div>
                <h3 className="font-medium">Usuário Atual:</h3>
                <p className="text-sm">{dbInfo.connection?.current_user || "Não disponível"}</p>
              </div>

              <div>
                <h3 className="font-medium">Tabelas Disponíveis:</h3>
                {dbInfo.tables && dbInfo.tables.length > 0 ? (
                  <ul className="list-disc pl-5 text-sm">
                    {dbInfo.tables.map((table: string) => (
                      <li key={table}>{table}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma tabela encontrada</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.reload()}>Atualizar Informações</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Criar Tabelas</CardTitle>
          <CardDescription>Crie as tabelas necessárias para o funcionamento do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {createTablesResult && (
            <Alert variant={createTablesResult.error ? "destructive" : "default"} className="mb-4">
              {createTablesResult.error ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              <AlertDescription>{createTablesResult.error || createTablesResult.message}</AlertDescription>
            </Alert>
          )}
          <p className="text-sm text-muted-foreground mb-4">
            Esta ação criará todas as tabelas necessárias para o funcionamento do sistema, caso elas não existam. Nenhum
            dado será perdido se as tabelas já existirem.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateTables} disabled={creatingTables}>
            {creatingTables ? "Criando Tabelas..." : "Criar Tabelas"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Environment Variables</CardTitle>
          <CardDescription>Information about environment variables</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingEnv ? (
            <p>Checking environment variables...</p>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Client Environment:</h3>
                <p className="text-sm">APP_URL: {clientEnv.APP_URL}</p>
              </div>

              {envInfo && (
                <>
                  <div>
                    <h3 className="font-medium">Server Environment Variables:</h3>
                    <ul className="list-disc pl-5 text-sm">
                      {Object.entries(envInfo.serverEnvExists || {}).map(([key, exists]) => (
                        <li key={key}>
                          {key}: {exists ? "✅ Set" : "❌ Not set"}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium">Node Environment:</h3>
                    <p className="text-sm">{envInfo.nodeEnv || "Not available"}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={checkEnvironment}>Check Environment</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
