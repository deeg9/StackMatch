'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Building2, Mail, Lock, Eye, EyeOff, User, Briefcase, ShoppingCart, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    userType: 'buyer'
  })
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25
    if (password.match(/[0-9]/)) strength += 25
    if (password.match(/[^a-zA-Z0-9]/)) strength += 25
    setPasswordStrength(strength)
  }

  const handlePasswordChange = (value: string) => {
    setFormData({ ...formData, password: value })
    calculatePasswordStrength(value)
    if (formData.confirmPassword) {
      setPasswordMatch(value === formData.confirmPassword)
    }
  }

  const handleConfirmPasswordChange = (value: string) => {
    setFormData({ ...formData, confirmPassword: value })
    setPasswordMatch(formData.password === value)
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return 'bg-red-500'
    if (passwordStrength <= 50) return 'bg-orange-500'
    if (passwordStrength <= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 25) return 'Weak'
    if (passwordStrength <= 50) return 'Fair'
    if (passwordStrength <= 75) return 'Good'
    return 'Strong'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate password match
    if (!passwordMatch) {
      return
    }
    
    // Validate password strength
    if (passwordStrength < 50) {
      return
    }
    
    setIsLoading(true)
    
    try {
      // Simulate API call to create account
      // In production, this would be an actual API call to create the user
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Store user data in localStorage for the onboarding flow
      // In production, this would be handled by your auth system
      localStorage.setItem('onboardingData', JSON.stringify({
        userType: formData.userType,
        fullName: formData.fullName,
        email: formData.email,
        company: formData.company,
        isNewUser: true
      }))
      
      // Navigate to the onboarding page
      // The onboarding component will handle different user types internally
      router.push('/onboarding')
    } catch (error) {
      // Handle error - in production, show an error message to the user
      console.error('Signup error:', error)
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
              <span className="text-sm text-white/80">Already have an account?</span>
              <Link href="/login">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#1A2B4C]">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Left Side - Feature Showcase */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#4A73CC] to-[#1A2B4C] p-12 items-center justify-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#22C55E] rounded-full opacity-10 blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#F59E0B] rounded-full opacity-10 blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
          
          <div className="relative z-10 max-w-lg space-y-8 text-white">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold">Join the Procurement Revolution</h2>
              <p className="text-lg text-blue-200">
                Be part of the fastest-growing B2B software marketplace transforming how companies buy software.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-[#22C55E]">$384B</div>
                <div className="text-sm text-blue-200 mt-1">Market Opportunity</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-[#F59E0B]">200+</div>
                <div className="text-sm text-blue-200 mt-1">Active Companies</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-[#3B82F6]">50+</div>
                <div className="text-sm text-blue-200 mt-1">Expert Consultants</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-[#22C55E]">60%</div>
                <div className="text-sm text-blue-200 mt-1">Faster Procurement</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Why Join StackMatch?</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-[#22C55E]" />
                  <span className="text-blue-100">AI-powered vendor matching</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-[#22C55E]" />
                  <span className="text-blue-100">Expert consultant network</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-[#22C55E]" />
                  <span className="text-blue-100">Secure deal rooms</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-[#22C55E]" />
                  <span className="text-blue-100">Transparent pricing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold text-[#1A2B4C]">Create Your Account</h1>
              <p className="text-[#6B7280]">Start transforming your software procurement today</p>
            </div>

            <Card className="border-2 border-[#D1D5DB] hover:border-[#4A73CC] transition-all duration-300 shadow-lg">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* User Type Selection */}
                  <div className="space-y-3">
                    <Label className="text-[#374151] font-medium">I am a...</Label>
                    <RadioGroup 
                      value={formData.userType} 
                      onValueChange={(value) => setFormData({ ...formData, userType: value })}
                      className="grid grid-cols-3 gap-3"
                    >
                      <Label
                        htmlFor="buyer"
                        className={`cursor-pointer rounded-lg border-2 p-4 text-center transition-all hover:border-[#4A73CC] ${
                          formData.userType === 'buyer' ? 'border-[#4A73CC] bg-[#4A73CC]/5' : 'border-[#D1D5DB]'
                        }`}
                      >
                        <RadioGroupItem value="buyer" id="buyer" className="sr-only" />
                        <ShoppingCart className={`h-6 w-6 mx-auto mb-2 ${
                          formData.userType === 'buyer' ? 'text-[#4A73CC]' : 'text-[#6B7280]'
                        }`} />
                        <span className={`text-sm font-medium ${
                          formData.userType === 'buyer' ? 'text-[#4A73CC]' : 'text-[#374151]'
                        }`}>Buyer</span>
                      </Label>
                      <Label
                        htmlFor="seller"
                        className={`cursor-pointer rounded-lg border-2 p-4 text-center transition-all hover:border-[#22C55E] ${
                          formData.userType === 'seller' ? 'border-[#22C55E] bg-[#22C55E]/5' : 'border-[#D1D5DB]'
                        }`}
                      >
                        <RadioGroupItem value="seller" id="seller" className="sr-only" />
                        <Briefcase className={`h-6 w-6 mx-auto mb-2 ${
                          formData.userType === 'seller' ? 'text-[#22C55E]' : 'text-[#6B7280]'
                        }`} />
                        <span className={`text-sm font-medium ${
                          formData.userType === 'seller' ? 'text-[#22C55E]' : 'text-[#374151]'
                        }`}>Seller</span>
                      </Label>
                      <Label
                        htmlFor="consultant"
                        className={`cursor-pointer rounded-lg border-2 p-4 text-center transition-all hover:border-[#F59E0B] ${
                          formData.userType === 'consultant' ? 'border-[#F59E0B] bg-[#F59E0B]/5' : 'border-[#D1D5DB]'
                        }`}
                      >
                        <RadioGroupItem value="consultant" id="consultant" className="sr-only" />
                        <User className={`h-6 w-6 mx-auto mb-2 ${
                          formData.userType === 'consultant' ? 'text-[#F59E0B]' : 'text-[#6B7280]'
                        }`} />
                        <span className={`text-sm font-medium ${
                          formData.userType === 'consultant' ? 'text-[#F59E0B]' : 'text-[#374151]'
                        }`}>Consultant</span>
                      </Label>
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-[#374151] font-medium">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-[#6B7280]" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="pl-10 h-12 border-[#D1D5DB] focus:border-[#4A73CC] focus:ring-[#4A73CC] transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#374151] font-medium">
                        Work Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-[#6B7280]" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="pl-10 h-12 border-[#D1D5DB] focus:border-[#4A73CC] focus:ring-[#4A73CC] transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-[#374151] font-medium">
                        Company Name
                      </Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-5 w-5 text-[#6B7280]" />
                        <Input
                          id="company"
                          type="text"
                          placeholder="Acme Corporation"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="pl-10 h-12 border-[#D1D5DB] focus:border-[#4A73CC] focus:ring-[#4A73CC] transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-[#374151] font-medium">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-[#6B7280]" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) => handlePasswordChange(e.target.value)}
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
                      {formData.password && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[#6B7280]">Password strength:</span>
                            <span className={`font-medium ${
                              passwordStrength <= 50 ? 'text-red-600' : 'text-green-600'
                            }`}>{getPasswordStrengthText()}</span>
                          </div>
                          <Progress 
                            value={passwordStrength} 
                            className="h-2"
                            indicatorClassName={getPasswordStrengthColor()}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-[#374151] font-medium">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-[#6B7280]" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Re-enter your password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                          className={`pl-10 h-12 border transition-all ${
                            formData.confirmPassword && !passwordMatch 
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                              : 'border-[#D1D5DB] focus:border-[#4A73CC] focus:ring-[#4A73CC]'
                          }`}
                          required
                        />
                      </div>
                      {formData.confirmPassword && !passwordMatch && (
                        <div className="flex items-center space-x-2 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4" />
                          <span>Passwords do not match</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                    disabled={isLoading || !passwordMatch || passwordStrength < 50}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <p className="text-center text-sm text-[#6B7280]">
              By signing up, you agree to our{' '}
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
      </div>
    </div>
  )
}