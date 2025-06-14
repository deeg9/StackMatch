"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { setUser } from "@/store/slices/authSlice"
import { createClient } from "@/utils/supabase/client"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  const dispatch = useDispatch()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("LoginForm: Form submitted, starting login process...")

    setLoading(true)
    setError("")

    try {
      console.log("LoginForm: About to make fetch request to /api/auth/login")

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      console.log("LoginForm: Fetch request completed successfully")
      console.log("LoginForm: Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Login failed")
      }

      console.log("LoginForm: Response OK, about to parse JSON...")
      const data = await response.json()
      console.log("LoginForm: JSON parsed successfully")
      console.log("LoginForm: Response data:", data.message)

      if (data.success && data.session) {
        console.log("LoginForm: Login successful, setting up client-side session...")

        // Get Supabase client
        const supabase = createClient()
        console.log("LoginForm: Got Supabase client")

        // Set the session using the tokens from the server response
        console.log("LoginForm: Setting session with tokens...")
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        })

        if (sessionError) {
          console.error("LoginForm: Session error:", sessionError)
          throw new Error(`Session setup failed: ${sessionError.message}`)
        }

        console.log("LoginForm: Session set successfully")

        // Wait a moment for the session to be fully established
        await new Promise((resolve) => setTimeout(resolve, 200))

        // Verify session exists
        const {
          data: { session },
        } = await supabase.auth.getSession()
        console.log("LoginForm: Session verification:", !!session)

        if (session) {
          console.log("LoginForm: Setting user in Redux store...")
          dispatch(setUser(data.user))
          console.log("LoginForm: Redux store updated successfully")

          // Use Next.js router for navigation
          console.log("LoginForm: About to redirect to:", data.redirectTo)

          // Add a small delay to ensure everything is set up
          setTimeout(() => {
            router.push(data.redirectTo || "/buyer-dashboard")
            console.log("LoginForm: Router.push executed")
          }, 100)
        } else {
          throw new Error("Session verification failed after setup")
        }
      } else {
        throw new Error(data.message || "Login failed - no session data")
      }
    } catch (err: any) {
      console.error("LoginForm: Error during login:", err)
      setError(err.message || "An error occurred during login")
    } finally {
      console.log("LoginForm: Setting loading to false")
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
        <CardDescription className="text-center">Enter your email and password to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link href="/auth/forgot-password" className="text-primary hover:underline">
            Forgot your password?
          </Link>
        </div>

        <div className="mt-2 text-center text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
