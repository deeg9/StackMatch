import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Star, Sparkles, CheckCircle2, Shield, Users, Zap, Globe, Rocket, ArrowRight, PlayCircle } from "lucide-react"
// Force static generation - no dynamic server-side features
export const dynamic = 'force-static'

export default function HomePage() {
  // Show unauthenticated version by default for static generation
  // This ensures the beautiful design always renders
  const user = null

  return (
    <>
      {/* Override any parent background with maximum specificity */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 -z-10" />
      
      <div className="relative z-10 min-h-screen w-full overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-ping"></div>
        </div>

        {/* Hero Section - Full Height */}
        <section className="relative z-20 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            {/* Top Badge */}
            <div className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-blue-400/30 mb-12 group hover:from-blue-500/30 hover:to-purple-600/30 transition-all duration-300">
              <Sparkles className="w-6 h-6 mr-3 text-blue-400 group-hover:text-blue-300" />
              <span className="text-blue-100 font-semibold text-lg">Connecting Innovation Worldwide</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight">
              <span className="block bg-gradient-to-r from-white via-blue-50 to-blue-200 bg-clip-text text-transparent">
                Welcome to
              </span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-pulse mt-4">
                StackMatch
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-2xl md:text-3xl text-blue-100/90 mb-16 max-w-5xl mx-auto leading-relaxed font-light">
              The premium platform where <span className="text-white font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">visionary buyers</span> meet <span className="text-white font-bold bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">exceptional sellers</span> to bring extraordinary projects to life.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center mb-24">
              <Link href="/signup">
                <Button size="lg" className="group relative w-full sm:w-auto px-12 py-8 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0 rounded-3xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-110 hover:-translate-y-2">
                  <span className="relative z-10 flex items-center">
                    Get Started Free
                    <Rocket className="ml-4 h-7 w-7 group-hover:translate-y-[-4px] transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="group w-full sm:w-auto px-12 py-8 text-xl font-bold bg-white/10 hover:bg-white/20 text-white border-3 border-white/40 hover:border-white/60 rounded-3xl backdrop-blur-sm transition-all duration-300 transform hover:scale-110 hover:-translate-y-2">
                  <span className="flex items-center">
                    Watch Demo
                    <PlayCircle className="ml-4 h-7 w-7 group-hover:scale-125 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
              {[
                { number: "50k+", label: "Active Projects", icon: Target },
                { number: "98%", label: "Success Rate", icon: CheckCircle2 },
                { number: "$100M+", label: "Projects Value", icon: Star }
              ].map((stat, index) => (
                <div key={index} className="group text-center p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-110">
                  <stat.icon className="w-12 h-12 text-blue-400 mx-auto mb-6 group-hover:text-blue-300 transition-colors" />
                  <div className="text-5xl font-black text-white mb-3 group-hover:scale-110 transition-transform duration-300">{stat.number}</div>
                  <div className="text-blue-200/80 font-semibold text-lg">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative z-20 py-40 bg-gradient-to-b from-transparent to-black/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-24">
              <div className="inline-block mb-8 px-8 py-3 text-lg bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-200 border border-blue-400/30 rounded-full backdrop-blur-sm">
                Why Choose StackMatch
              </div>
              <h2 className="text-6xl md:text-7xl font-black mb-8 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Built for Excellence
              </h2>
              <p className="text-2xl text-blue-100/70 max-w-4xl mx-auto font-light">
                Experience the perfect blend of innovation, security, and results that sets industry standards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
                <Card key={index} className="group relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-4 p-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardContent className="relative z-10 p-0">
                    <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-6 group-hover:text-blue-100 transition-colors">{feature.title}</h3>
                    <p className="text-blue-100/70 leading-relaxed font-light text-lg group-hover:text-blue-100/90 transition-colors">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative z-20 py-40 bg-gradient-to-b from-black/30 to-black/50">
          <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-16 border border-white/20">
              <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Ready to Transform Your Ideas?
              </h2>
              <p className="text-2xl text-blue-100/80 mb-16 max-w-3xl mx-auto font-light">
                Join thousands of successful projects and discover what makes StackMatch the preferred platform for innovators worldwide.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="group relative w-full sm:w-auto px-12 py-8 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0 rounded-3xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-110">
                    <span className="relative z-10 flex items-center">
                      Join StackMatch
                      <ArrowRight className="ml-4 h-7 w-7 group-hover:translate-x-2 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="group w-full sm:w-auto px-12 py-8 text-xl font-bold bg-white/10 hover:bg-white/20 text-white border-3 border-white/40 hover:border-white/60 rounded-3xl backdrop-blur-sm transition-all duration-300 transform hover:scale-110">
                    Sign In
                    <CheckCircle2 className="ml-4 h-7 w-7 group-hover:scale-125 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
