import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle, Users, Zap, Shield, TrendingUp, Building2, Clock, DollarSign } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Navigation */}
      <nav className="bg-[#1A2B4C] border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-white">
                StackMatch
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="#how-it-works" className="text-white hover:text-[#4A73CC] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  How It Works
                </Link>
                <Link href="#solutions" className="text-white hover:text-[#4A73CC] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Solutions
                </Link>
                <Link href="#pricing" className="text-white hover:text-[#4A73CC] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Pricing
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:text-[#4A73CC] hover:bg-transparent">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1A2B4C] to-[#4A73CC] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-[#22C55E] text-white hover:bg-[#16A34A] px-3 py-1">
                  Transforming $260B in Annual Procurement Failures
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Intelligent Software Procurement
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed">
                  End the chaos of software buying. StackMatch connects mid-market companies with expert consultants and verified vendors through structured workflows that guarantee success.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-8 py-4 text-lg">
                    Start Your Project
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#1A2B4C] px-8 py-4 text-lg">
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">66%</div>
                  <div className="text-sm text-blue-200">Projects Fail</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">121</div>
                  <div className="text-sm text-blue-200">Day Sales Cycles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">$260B</div>
                  <div className="text-sm text-blue-200">Annual Waste</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[#1A2B4C]">Deal Room: CRM Migration</h3>
                    <Badge className="bg-[#22C55E] text-white">Active</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#4A73CC] rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#374151]">3 Vendors Matched</div>
                        <div className="text-xs text-[#6B7280]">Salesforce, HubSpot, Pipedrive</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#22C55E] rounded-full flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#374151]">Expert Consultant Assigned</div>
                        <div className="text-xs text-[#6B7280]">Sarah Chen, CRM Specialist</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#F59E0B] rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#374151]">Timeline: 45 days</div>
                        <div className="text-xs text-[#6B7280]">60% faster than industry average</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-[#D1D5DB]">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">Projected Savings</span>
                      <span className="font-semibold text-[#22C55E]">$125,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-[#22C55E] rounded-full opacity-10"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-32 h-32 bg-[#F59E0B] rounded-full opacity-10"></div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-[#1A2B4C]">The B2B Software Buying Crisis</h2>
            <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
              Mid-market companies waste billions annually on failed software procurement. The process is broken, complex, and costly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-red-100 hover:border-red-200 transition-colors">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-red-600">66%</h3>
                <p className="text-[#374151] font-medium">Projects Fail to Meet Objectives</p>
                <p className="text-sm text-[#6B7280]">Only 31% of software projects complete on time and within budget</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-100 hover:border-orange-200 transition-colors">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-orange-600">121 Days</h3>
                <p className="text-[#374151] font-medium">Average Sales Cycle Length</p>
                <p className="text-sm text-[#6B7280]">Enterprise deals often extend 6-12 months with complexity</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-100 hover:border-red-200 transition-colors">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                  <DollarSign className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-red-600">$260B</h3>
                <p className="text-[#374151] font-medium">Annual Procurement Failures</p>
                <p className="text-sm text-[#6B7280]">Massive financial waste from poor software buying decisions</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-[#1A2B4C]">The StackMatch Solution</h2>
            <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
              A three-sided marketplace that connects buyers, sellers, and expert consultants through intelligent, structured workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="border-2 border-[#4A73CC] hover:shadow-lg transition-shadow">
              <CardContent className="p-8 space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#4A73CC] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A2B4C] mb-2">For Buyers</h3>
                  <p className="text-[#6B7280] mb-6">Mid-market companies seeking software solutions</p>
                </div>
                
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                    <span className="text-sm text-[#374151]">Guided listing workflow</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                    <span className="text-sm text-[#374151]">Expert consultant matching</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                    <span className="text-sm text-[#374151]">Secure deal rooms</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                    <span className="text-sm text-[#374151]">Pre-qualified vendors</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#22C55E] hover:shadow-lg transition-shadow">
              <CardContent className="p-8 space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#22C55E] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A2B4C] mb-2">For Consultants</h3>
                  <p className="text-[#6B7280] mb-6">Procurement experts and specialists</p>
                </div>
                
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                    <span className="text-sm text-[#374151]">AI-powered project matching</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                    <span className="text-sm text-[#374151]">Collaborative deal management</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                    <span className="text-sm text-[#374151]">Vetted marketplace access</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                    <span className="text-sm text-[#374151]">Premium project opportunities</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#F59E0B] hover:shadow-lg transition-shadow">
              <CardContent className="p-8 space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#F59E0B] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A2B4C] mb-2">For Sellers</h3>
                  <p className="text-[#6B7280] mb-6">Software vendors and solution providers</p>
                </div>
                
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                    <span className="text-sm text-[#374151]">High-quality, structured RFPs</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                    <span className="text-sm text-[#374151]">Pre-qualified buyers</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                    <span className="text-sm text-[#374151]">Faster sales cycles</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                    <span className="text-sm text-[#374151]">Transparent deal processes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-[#1A2B4C]">How StackMatch Works</h2>
            <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
              A simple, guided process that transforms chaotic software procurement into structured success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#4A73CC] rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold text-[#1A2B4C]">Define Your Needs</h3>
              <p className="text-sm text-[#6B7280]">
                Use our guided workflow to articulate business requirements and strategic goals clearly.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#22C55E] rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold text-[#1A2B4C]">Get Expert Help</h3>
              <p className="text-sm text-[#6B7280]">
                AI matches you with specialized consultants who manage the entire procurement process.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#F59E0B] rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold text-[#1A2B4C]">Review Proposals</h3>
              <p className="text-sm text-[#6B7280]">
                Receive high-quality proposals from pre-qualified vendors in secure deal rooms.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#16A34A] rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="text-lg font-semibold text-[#1A2B4C]">Close Successfully</h3>
              <p className="text-sm text-[#6B7280]">
                Negotiate and close deals with expert guidance and transparent collaboration tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#1A2B4C] to-[#4A73CC] text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Software Procurement?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join the companies already saving time, money, and reducing risk with StackMatch's intelligent procurement platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-8 py-4 text-lg">
                Start Your Project Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#1A2B4C] px-8 py-4 text-lg">
              Schedule a Demo
            </Button>
          </div>
          
          <p className="text-sm text-blue-200 mt-6">
            No credit card required • Free consultation • Expert guidance included
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A2B4C] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="text-2xl font-bold">StackMatch</div>
              <p className="text-blue-200 text-sm">
                Intelligent software procurement for mid-market companies.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Platform</h3>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><Link href="#" className="hover:text-white transition-colors">For Buyers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">For Sellers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">For Consultants</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Support</h3>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-blue-800 pt-8 mt-8 text-center text-sm text-blue-200">
            <p>&copy; 2024 StackMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}