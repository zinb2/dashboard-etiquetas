"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDate } from "@/lib/utils"

interface User {
  id: number
  nome: string
  usuario: string
  email: string
  role: string
}

interface Activity {
  id: number
  tipo: string
  entidade: string
  entidade_id: number | null
  descricao: string
  data_hora: string
}

export function UserProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const response = await fetch("/api/auth/me")
        if (!response.ok) {
          throw new Error("Falha ao carregar perfil")
        }
        const data = await response.json()
        setUser(data.user)
      } catch (error) {
        console.error("Erro ao carregar perfil:", error)
      }
    }

    async function loadUserActivities() {
      try {
        const response = await fetch("/api/atividades")
        if (!response.ok) {
          throw new Error("Falha ao carregar atividades")
        }
        const data = await response.json()
        setActivities(data)
      } catch (error) {
        console.error("Erro ao carregar atividades:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
    loadUserActivities()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <p>Carregando perfil...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center py-8">
        <p>Usuário não encontrado ou não autenticado</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-xl">{user.nome.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user.nome}</CardTitle>
              <CardDescription>@{user.usuario}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Função</p>
                <p className="capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Atividades recentes</CardTitle>
          <CardDescription>Histórico das suas ações no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="text-center text-muted-foreground">Nenhuma atividade registrada</p>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 rounded-lg border p-3">
                  <div className="flex-1">
                    <p className="font-medium">{activity.descricao}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.tipo} - {activity.entidade}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p>{formatDate(activity.data_hora)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
