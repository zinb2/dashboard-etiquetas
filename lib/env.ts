// Server-side only environment variables
export const serverEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  // Add other server-only env vars here
}

// Client-side safe environment variables (must be prefixed with NEXT_PUBLIC_)
export const clientEnv = {
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  // Add any NEXT_PUBLIC_ prefixed env vars here
  // Example: APP_URL: process.env.NEXT_PUBLIC_APP_URL
}
