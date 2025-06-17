"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Zap, Shield, Target, Star, Sparkles, Rocket, Globe, CheckCircle2, PlayCircle } from "lucide-react"
import { useClientAuth } from "@/hooks/useClientAuth"

export default function HomePage() {
  const { user, loading } = useClientAuth()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-400"></div>
          <div className="absolute inset-0 animate-pulse">
            <div className="rounded-full h-16 w-16 bg-gradient-to-r from-blue-400 to-purple-500 opacity-20"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-ping"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-5xl mx-auto">
            {/* Top Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-blue-400/30 mb-8 group hover:from-blue-500/30 hover:to-purple-600/30 transition-all duration-300">
              <Sparkles className="w-5 h-5 mr-2 text-blue-400 group-hover:text-blue-300" />
              <span className="text-blue-100 font-medium">Connecting Innovation Worldwide</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-50 to-blue-200 bg-clip-text text-transparent">
                Welcome to
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                StackMatch
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-blue-100/80 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              The premium platform where <span className="text-white font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">visionary buyers</span> meet 
              <span className="text-white font-semibold bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent"> exceptional sellers</span> to bring extraordinary projects to life.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
              {user ? (
                <>
                  <Link href="/browse-listings">
                    <Button size="lg" className="group relative w-full sm:w-auto px-10 py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                      <span className="relative z-10 flex items-center">
                        Browse Listings
                        <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                    </Button>
                  </Link>
                  <Link href="/create-listing">
                    <Button variant="outline" size="lg" className="group w-full sm:w-auto px-10 py-6 text-lg font-bold bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 rounded-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                      <span className="flex items-center">
                        Post a Project
                        <Target className="ml-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                      </span>
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/signup">
                    <Button size="lg" className="group relative w-full sm:w-auto px-10 py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                      <span className="relative z-10 flex items-center">
                        Get Started Free
                        <Rocket className="ml-3 h-6 w-6 group-hover:translate-y-[-2px] transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg" className="group w-full sm:w-auto px-10 py-6 text-lg font-bold bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 rounded-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                      <span className="flex items-center">
                        Watch Demo
                        <PlayCircle className="ml-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                      </span>
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { number: "50k+", label: "Active Projects", icon: Target },
                { number: "98%", label: "Success Rate", icon: CheckCircle2 },
                { number: "$100M+", label: "Projects Value", icon: Star }
              ].map((stat, index) => (
                <div key={index} className="group text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105">
                  <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-4 group-hover:text-blue-300 transition-colors" />
                  <div className="text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300">{stat.number}</div>
                  <div className="text-blue-200/80 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32 bg-gradient-to-b from-transparent to-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 px-6 py-2 text-sm bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-200 border-blue-400/30 rounded-full">
              Why Choose StackMatch
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Built for Excellence
            </h2>
            <p className="text-xl text-blue-100/70 max-w-3xl mx-auto font-light">
              Experience the perfect blend of innovation, security, and results that sets industry standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Bank-grade security with verified profiles and secure payment processing. Your projects are protected at every step.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Users,
                title: "Elite Network",
                description: "Connect with top-tier professionals and industry leaders. Quality is guaranteed through our rigorous vetting process.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Match with the perfect collaborators in minutes, not weeks. Our AI-powered matching system accelerates success.",
                gradient: "from-yellow-500 to-orange-500"
              },
              {
                icon: Globe,
                title: "Global Reach",
                description: "Access talent and opportunities from around the world. Break geographical barriers and think globally.",
                gradient: "from-green-500 to-teal-500"
              },
              {
                icon: Star,
                title: "Proven Results",
                description: "Track record of delivering exceptional outcomes. From startups to enterprise, we enable success at every scale.",
                gradient: "from-indigo-500 to-purple-500"
              },
              {
                icon: Rocket,
                title: "Innovation First",
                description: "Cutting-edge technology and modern development practices. Built for scale, performance, and the future.",
                gradient: "from-red-500 to-pink-500"
              }
            ].map((feature, index) => (
              <Card key={index} className="group relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="relative z-10 p-0">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-100 transition-colors">{feature.title}</h3>
                  <p className="text-blue-100/70 leading-relaxed font-light group-hover:text-blue-100/90 transition-colors">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 py-32 bg-gradient-to-b from-black/20 to-black/40">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Ready to Transform Your Ideas?
            </h2>
            <p className="text-xl text-blue-100/80 mb-12 max-w-2xl mx-auto font-light">
              Join thousands of successful projects and discover what makes StackMatch the preferred platform for innovators worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {user ? (
                <>
                  <Link href="/browse-listings">
                    <Button size="lg" className="group relative w-full sm:w-auto px-10 py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
                      <span className="relative z-10 flex items-center">
                        Explore Projects
                        <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </Link>
                  <Link href="/create-listing">
                    <Button variant="outline" size="lg" className="group w-full sm:w-auto px-10 py-6 text-lg font-bold bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 rounded-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-105">
                      Start Your Project
                      <Target className="ml-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/signup">
                    <Button size="lg" className="group relative w-full sm:w-auto px-10 py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
                      <span className="relative z-10 flex items-center">
                        Join StackMatch
                        <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg" className="group w-full sm:w-auto px-10 py-6 text-lg font-bold bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 rounded-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-105">
                      Sign In
                      <CheckCircle2 className="ml-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
