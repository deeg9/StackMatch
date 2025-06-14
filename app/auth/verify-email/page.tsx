"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [isLoading, setIsLoading] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError("Verification token is missing")
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (response.ok) {
          setIsVerified(true)
        } else {
          setError(data.error || "Failed to verify email")
        }
      } catch (error) {
        console.error("Email verification error:", error)
        setError("An unexpected error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    verifyEmail()
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Email Verification</CardTitle>
            <CardDescription className="text-center">Verifying your email address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Verifying your email address...</p>
              </div>
            ) : isVerified ? (
              <div className="flex flex-col items-center justify-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-xl font-medium text-center mb-2">Email Verified Successfully!</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Your email has been verified. You can now access all features of StackMatch.
                </p>
                <Button className="w-full" asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <XCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-xl font-medium text-center mb-2">Verification Failed</h3>
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
                <div className="space-y-2 w-full">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/login">Back to Login</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/auth/resend-verification">Resend Verification Email</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
