"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UserProfile {
  id: string
  email: string
  user_type: "buyer" | "seller"
  full_name: string
  company_name?: string
  phone?: string
  avatar_url?: string
  bio?: string
  website_url?: string
  location?: string
  created_at: string
  updated_at: string
  additionalProfile?: any
}

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<UserProfile>>({})

  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/user/profile")
        if (!response.ok) {
          throw new Error("Failed to fetch profile")
        }

        const data = await response.json()
        setProfile(data.profile)
        setFormData(data.profile)
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching your profile")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile: {
            full_name: formData.full_name,
            company_name: formData.company_name,
            phone: formData.phone,
            bio: formData.bio,
            website_url: formData.website_url,
            location: formData.location,
          },
          additionalProfile: {
            // Add any type-specific fields here
          },
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update profile")
      }

      // Update the profile state with the new data
      setProfile((prev) => ({
        ...prev!,
        ...formData,
      }))

      setSuccess("Profile updated successfully")
      setIsEditing(false)
    } catch (err: any) {
      setError(err.message || "An error occurred while updating your profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!profile) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Profile not found. Please log in again.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Profile</CardTitle>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name} />
              <AvatarFallback>{profile.full_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{profile.full_name}</h2>
              <p className="text-gray-500">{profile.user_type === "buyer" ? "Buyer" : "Seller"}</p>
            </div>
          </div>

          <Tabs defaultValue="basic">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              {profile.user_type === "buyer" && <TabsTrigger value="buyer">Buyer Details</TabsTrigger>}
              {profile.user_type === "seller" && <TabsTrigger value="seller">Seller Details</TabsTrigger>}
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" value={profile.email} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      name="company_name"
                      value={formData.company_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" value={formData.phone || ""} onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website_url">Website</Label>
                    <Input
                      id="website_url"
                      name="website_url"
                      value={formData.website_url || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" value={formData.location || ""} onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" name="bio" value={formData.bio || ""} onChange={handleInputChange} rows={4} />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                    <p className="mt-1">{profile.full_name}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1">{profile.email}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Company Name</h3>
                    <p className="mt-1">{profile.company_name || "Not specified"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="mt-1">{profile.phone || "Not specified"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Website</h3>
                    <p className="mt-1">
                      {profile.website_url ? (
                        <a
                          href={profile.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {profile.website_url}
                        </a>
                      ) : (
                        "Not specified"
                      )}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p className="mt-1">{profile.location || "Not specified"}</p>
                  </div>

                  {profile.bio && (
                    <div className="col-span-2">
                      <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                      <p className="mt-1 whitespace-pre-line">{profile.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {profile.user_type === "buyer" && (
              <TabsContent value="buyer">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Buyer Profile</h3>
                  {/* Buyer-specific fields would go here */}
                  <p>Additional buyer profile information will be displayed here.</p>
                </div>
              </TabsContent>
            )}

            {profile.user_type === "seller" && (
              <TabsContent value="seller">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Seller Profile</h3>
                  {/* Seller-specific fields would go here */}
                  <p>Additional seller profile information will be displayed here.</p>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
