'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, Building2, Mail, Lock, Eye, EyeOff, Sparkles, Clock } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirect based on user type
        if (data.user_type === 'buyer') {
          window.location.href = '/dashboard/buyer'
        } else if (data.user_type === 'seller') {
          window.location.href = '/dashboard/seller'
        } else {
          window.location.href = '/dashboard'
        }
      } else {
        alert(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-[#F9FAFB]">
      {/* Navigation */}
      <nav className="bg-[#1A2B4C] border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold text-white hover:text-[#4A73CC] transition-colors">
                StackMatch
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white/80">Don't have an account?</span>
              <Link href="/signup">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#1A2B4C]">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold text-[#1A2B4C]">Welcome Back</h1>
              <p className="text-[#6B7280]">Sign in to access your intelligent procurement dashboard</p>
            </div>

            <Card className="border-2 border-[#D1D5DB] hover:border-[#4A73CC] transition-all duration-300 shadow-lg">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#374151] font-medium">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-[#6B7280]" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-12 border-[#D1D5DB] focus:border-[#4A73CC] focus:ring-[#4A73CC] transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="password" className="text-[#374151] font-medium">
                          Password
                        </Label>
                        <Link href="/forgot-password" className="text-sm text-[#4A73CC] hover:text-[#1A2B4C] transition-colors">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-[#6B7280]" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 h-12 border-[#D1D5DB] focus:border-[#4A73CC] focus:ring-[#4A73CC] transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-[#6B7280] hover:text-[#374151] transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      className="border-[#D1D5DB] data-[state=checked]:bg-[#4A73CC] data-[state=checked]:border-[#4A73CC]"
                    />
                    <Label 
                      htmlFor="remember" 
                      className="text-sm text-[#6B7280] cursor-pointer hover:text-[#374151] transition-colors"
                    >
                      Remember me for 30 days
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#D1D5DB]" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-[#6B7280]">Or continue with</span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="h-12 border-[#D1D5DB] hover:border-[#4A73CC] hover:bg-[#F9FAFB] transition-all"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="ml-2">Google</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-12 border-[#D1D5DB] hover:border-[#4A73CC] hover:bg-[#F9FAFB] transition-all"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"/>
                      </svg>
                      <span className="ml-2">Microsoft</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className="text-center text-sm text-[#6B7280]">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-[#4A73CC] hover:text-[#1A2B4C] transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-[#4A73CC] hover:text-[#1A2B4C] transition-colors">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Feature Showcase */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#1A2B4C] to-[#4A73CC] p-12 items-center justify-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#22C55E] rounded-full opacity-10 blur-3xl animate-float"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F59E0B] rounded-full opacity-10 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          
          <div className="relative z-10 max-w-lg space-y-8 text-white">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[#22C55E]">
                <Sparkles className="h-6 w-6" />
                <span className="text-lg font-semibold">Welcome to the Future</span>
              </div>
              <h2 className="text-4xl font-bold">Transform Your Procurement Process</h2>
              <p className="text-lg text-blue-200">
                Join thousands of companies saving time and money with intelligent software procurement.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#22C55E] rounded-full flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">200+ Companies Trust Us</h3>
                  <p className="text-blue-200">From startups to Fortune 500, we power procurement excellence</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">60% Faster Procurement</h3>
                  <p className="text-blue-200">Reduce your software buying cycle from months to weeks</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">AI-Powered Matching</h3>
                  <p className="text-blue-200">Get matched with perfect vendors and expert consultants</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/20">
              <blockquote className="text-lg italic">
                "StackMatch reduced our ERP selection process from 6 months to just 6 weeks. The expert consultants made all the difference."
              </blockquote>
              <div className="mt-4">
                <div className="font-semibold">Sarah Chen</div>
                <div className="text-blue-200">CTO, TechCorp Industries</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}