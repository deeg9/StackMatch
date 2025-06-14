"use client"

import { LoginForm } from "@/components/auth/login-form"
import { Providers } from "@/components/providers"

export default function ClientLoginPage() {
  return (
    <Providers>
      <LoginForm />
    </Providers>
  )
}
