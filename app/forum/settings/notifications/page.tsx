"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ForumLayout } from "@/components/forum/forum-layout" // Assuming this component exists and is correct
import { Bell, MessageSquare, Users, ThumbsUp, Award, Megaphone } from "lucide-react"
import type { RootState } from "@/store"

export default function NotificationSettingsPage() {
  const authState = useSelector((state: RootState) => state.auth)
  const user = authState?.user // Safely access user

  const [settings, setSettings] = useState({
    newThreads: true,
    newComments: true,
    mentions: true,
    upvotes: true,
    bestAnswers: true,
    announcements: true,
    emailNotifications: false,
    pushNotifications: true,
    digestEmails: true,
  })

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // Save notification settings
    console.log("Saving notification settings for user:", user?.id, settings) // Example: use user.id if available
    // In a real app, this would make an API call
  }

  // Optional: Add a loading or placeholder state if user data is critical for rendering
  // if (!user) {
  //   return <ForumLayout><div>Loading user settings...</div></ForumLayout>;
  // }

  return (
    <ForumLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold">Notification Settings</h1>
          <p className="text-muted-foreground">Manage how you receive forum notifications</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Forum Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <div>
                    <Label htmlFor="newThreads">New Threads</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when new threads are posted in your subscribed categories
                    </p>
                  </div>
                </div>
                <Switch
                  id="newThreads"
                  checked={settings.newThreads}
                  onCheckedChange={(checked) => handleSettingChange("newThreads", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-4 w-4 text-green-500" />
                  <div>
                    <Label htmlFor="newComments">New Comments</Label>
                    <p className="text-sm text-muted-foreground">Get notified when someone comments on your threads</p>
                  </div>
                </div>
                <Switch
                  id="newComments"
                  checked={settings.newComments}
                  onCheckedChange={(checked) => handleSettingChange("newComments", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="h-4 w-4 text-purple-500" />
                  <div>
                    <Label htmlFor="mentions">Mentions</Label>
                    <p className="text-sm text-muted-foreground">Get notified when someone mentions you in a post</p>
                  </div>
                </div>
                <Switch
                  id="mentions"
                  checked={settings.mentions}
                  onCheckedChange={(checked) => handleSettingChange("mentions", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ThumbsUp className="h-4 w-4 text-orange-500" />
                  <div>
                    <Label htmlFor="upvotes">Upvotes</Label>
                    <p className="text-sm text-muted-foreground">Get notified when your posts receive upvotes</p>
                  </div>
                </div>
                <Switch
                  id="upvotes"
                  checked={settings.upvotes}
                  onCheckedChange={(checked) => handleSettingChange("upvotes", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <div>
                    <Label htmlFor="bestAnswers">Best Answers</Label>
                    <p className="text-sm text-muted-foreground">Get notified when your answer is marked as best</p>
                  </div>
                </div>
                <Switch
                  id="bestAnswers"
                  checked={settings.bestAnswers}
                  onCheckedChange={(checked) => handleSettingChange("bestAnswers", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Megaphone className="h-4 w-4 text-red-500" />
                  <div>
                    <Label htmlFor="announcements">Announcements</Label>
                    <p className="text-sm text-muted-foreground">Get notified about important forum announcements</p>
                  </div>
                </div>
                <Switch
                  id="announcements"
                  checked={settings.announcements}
                  onCheckedChange={(checked) => handleSettingChange("announcements", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications">Browser Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive real-time notifications in your browser</p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="digestEmails">Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">Receive a weekly summary of forum activity</p>
                </div>
                <Switch
                  id="digestEmails"
                  checked={settings.digestEmails}
                  onCheckedChange={(checked) => handleSettingChange("digestEmails", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Settings</Button>
          </div>
        </div>
      </div>
    </ForumLayout>
  )
}
