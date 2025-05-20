import { NextResponse } from "next/server"
import { serverEnv, clientEnv } from "@/lib/env"

export async function GET() {
  try {
    // Only return safe information, never expose sensitive env vars
    return NextResponse.json({
      clientEnv: {
        APP_URL: clientEnv.APP_URL,
      },
      // Only return existence of server env vars, not their values
      serverEnvExists: {
        DATABASE_URL: !!serverEnv.DATABASE_URL,
        JWT_SECRET: !!serverEnv.JWT_SECRET,
      },
      nodeEnv: process.env.NODE_ENV,
    })
  } catch (error) {
    console.error("Error in debug env route:", error)
    return NextResponse.json(
      {
        error: "Error checking environment variables",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
