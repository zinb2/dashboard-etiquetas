import { UserProfile } from "@/components/auth/user-profile"

export default function PerfilPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Meu Perfil</h1>
      <UserProfile />
    </div>
  )
}
