import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

// Rotas que não precisam de autenticação
const publicRoutes = ["/login", "/registro", "/api/auth/login", "/api/auth/register", "/debug", "/api/debug"]

// Função segura para verificar o token
function safeVerifyToken(token: string) {
  try {
    // Get JWT_SECRET from environment variable directly in middleware
    // This is safe because middleware runs on the server
    const JWT_SECRET = process.env.JWT_SECRET || "seu_jwt_secret_padrao"
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    console.error("Erro ao verificar token no middleware:", error)
    return null
  }
}

export function middleware(request: NextRequest) {
  // Verificar se a rota atual é pública
  const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // Se for uma rota pública, permitir acesso
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Verificar se o usuário está autenticado
  const token = request.cookies.get("auth_token")?.value

  // Se não houver token, redirecionar para login
  if (!token) {
    console.log("Middleware: Token não encontrado, redirecionando para login")
    // Use the request.nextUrl.origin to get the base URL
    const loginUrl = new URL("/login", request.nextUrl.origin)
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Verificar se o token é válido
  const isValidToken = safeVerifyToken(token)

  // Se o token não for válido, redirecionar para login
  if (!isValidToken) {
    console.log("Middleware: Token inválido, redirecionando para login")
    const loginUrl = new URL("/login", request.nextUrl.origin)
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Se o token for válido, permitir acesso
  return NextResponse.next()
}

// Configurar quais rotas o middleware deve ser executado
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
