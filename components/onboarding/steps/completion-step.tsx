'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sparkles, CheckCircle, ArrowRight, Star, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CompletionStep({ data, onUpdate, onNext, onPrev, userType }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleComplete = async () => {
    setIsSubmitting(true)
    
    // Simulate API call to save profile
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Redirect to appropriate dashboard
    const dashboardRoute = userType === 'buyer' ? '/dashboard/buyer' : '/dashboard/seller'
    router.push(dashboardRoute)
  }

  const profileCompletion = 85 // Calculate based on filled fields

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-full flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#1A2B4C] mb-2">You're Almost Ready!</h2>
          <p className="text-gray-600">
            Review your profile and start connecting with the StackMatch community
          </p>
        </div>
      </div>

      {/* Profile Preview */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Profile Summary */}
            <div className="flex-1 space-y-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={data.basicInfo?.avatar} alt="Profile" />
                  <AvatarFallback className="bg-[#1A2B4C] text-white text-xl">
                    {data.basicInfo?.fullName?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#1A2B4C]">
                    {data.basicInfo?.fullName || 'Your Name'}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {data.basicInfo?.headline || 'Your Professional Headline'}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{data.basicInfo?.location || 'Your Location'}</span>
                  </div>
                </div>
              </div>

              {/* Bio Preview */}
              {data.aboutBio?.bio && (
                <div>
                  <h4 className="font-semibold text-[#1A2B4C] mb-2">About</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {data.aboutBio.bio}
                  </p>
                </div>
              )}

              {/* Skills Preview */}
              {data.skills?.skillsList?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#1A2B4C] mb-2">Top Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.skillsList
                      .filter((skill: any) => skill.isPrimary)
                      .slice(0, 6)
                      .map((skill: any, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-[#4A73CC]/10 text-[#4A73CC]">
                          {skill.name}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}

              {/* Specializations Preview */}
              {data.aboutBio?.specializations?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#1A2B4C] mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.aboutBio.specializations.slice(0, 4).map((spec: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Completion Stats */}
            <div className="lg:w-80">
              <Card className="border border-[#22C55E]/20 bg-[#22C55E]/5">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-[#22C55E] mb-1">
                      {profileCompletion}%
                    </div>
                    <p className="text-sm text-gray-600">Profile Complete</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                      <span>Basic information added</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                      <span>Professional bio written</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                      <span>Skills and expertise listed</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                      <span>Profile photo uploaded</span>
                    </div>
                  </div>

                  <div className="mt-6 p-3 bg-white rounded-lg">
                    <p className="text-xs text-gray-600 text-center">
                      🎉 Your profile looks great! You can always add more details later.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="border-0 bg-gradient-to-r from-[#4A73CC]/10 to-[#22C55E]/10">
        <CardContent className="p-6">
          <h3 className="font-semibold text-[#1A2B4C] mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-[#F59E0B]" />
            What happens next?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <div className="w-8 h-8 bg-[#1A2B4C] rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <p className="font-medium">Explore Your Dashboard</p>
              <p className="text-gray-600 text-xs">
                {userType === 'buyer' 
                  ? 'Start browsing sellers and posting your first project'
                  : 'Discover new opportunities and build your reputation'
                }
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-[#4A73CC] rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <p className="font-medium">Complete Your Profile</p>
              <p className="text-gray-600 text-xs">
                Add more details like work history, portfolio, and certifications
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-[#22C55E] rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <p className="font-medium">Start Connecting</p>
              <p className="text-gray-600 text-xs">
                {userType === 'buyer' 
                  ? 'Reach out to sellers and start your first project'
                  : 'Apply to projects and build client relationships'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complete Button */}
      <div className="text-center">
        <Button
          onClick={handleComplete}
          disabled={isSubmitting}
          className="bg-[#22C55E] hover:bg-[#22C55E]/90 text-white px-8 py-3 text-lg"
        >
          {isSubmitting ? (
            'Setting up your profile...'
          ) : (
            <>
              Complete Setup & Go to Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
        <p className="text-sm text-gray-500 mt-3">
          You can always update your profile later from your dashboard
        </p>
      </div>
    </div>
  )
}