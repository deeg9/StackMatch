"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Mail, Shield, CreditCard, Smartphone, AlertTriangle, CheckCircle } from "lucide-react"

export function AccountSettingsTab() {
  const [emailPreferences, setEmailPreferences] = useState({
    bidAlerts: true,
    messages: true,
    newsletters: false,
    projectUpdates: true,
    reviewNotifications: true,
    weeklyDigest: true,
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: "24",
  })

  return (
    <div className="space-y-6">
      {/* Email Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>Email Preferences</span>
          </CardTitle>
          <CardDescription>Choose what email notifications you'd like to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="bid-alerts">Bid Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when new projects match your expertise</p>
            </div>
            <Switch
              id="bid-alerts"
              checked={emailPreferences.bidAlerts}
              onCheckedChange={(checked) => setEmailPreferences((prev) => ({ ...prev, bidAlerts: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="messages">Direct Messages</Label>
              <p className="text-sm text-muted-foreground">Notifications for new messages from clients</p>
            </div>
            <Switch
              id="messages"
              checked={emailPreferences.messages}
              onCheckedChange={(checked) => setEmailPreferences((prev) => ({ ...prev, messages: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="project-updates">Project Updates</Label>
              <p className="text-sm text-muted-foreground">Updates on your active projects and milestones</p>
            </div>
            <Switch
              id="project-updates"
              checked={emailPreferences.projectUpdates}
              onCheckedChange={(checked) => setEmailPreferences((prev) => ({ ...prev, projectUpdates: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="review-notifications">Review Notifications</Label>
              <p className="text-sm text-muted-foreground">Get notified when clients leave reviews</p>
            </div>
            <Switch
              id="review-notifications"
              checked={emailPreferences.reviewNotifications}
              onCheckedChange={(checked) => setEmailPreferences((prev) => ({ ...prev, reviewNotifications: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weekly-digest">Weekly Digest</Label>
              <p className="text-sm text-muted-foreground">Weekly summary of your activity and opportunities</p>
            </div>
            <Switch
              id="weekly-digest"
              checked={emailPreferences.weeklyDigest}
              onCheckedChange={(checked) => setEmailPreferences((prev) => ({ ...prev, weeklyDigest: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="newsletters">Marketing Newsletters</Label>
              <p className="text-sm text-muted-foreground">Product updates and platform news</p>
            </div>
            <Switch
              id="newsletters"
              checked={emailPreferences.newsletters}
              onCheckedChange={(checked) => setEmailPreferences((prev) => ({ ...prev, newsletters: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Security & Authentication</span>
          </CardTitle>
          <CardDescription>Manage your account security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Password */}
          <div className="space-y-3">
            <Label>Password</Label>
            <div className="flex space-x-2">
              <Input type="password" placeholder="Current password" />
              <Button variant="outline">Change Password</Button>
            </div>
          </div>

          <Separator />

          {/* Two-Factor Authentication */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <div className="flex items-center space-x-2">
                {securitySettings.twoFactorEnabled ? (
                  <Badge className="bg-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Enabled
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Disabled
                  </Badge>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSecuritySettings((prev) => ({
                      ...prev,
                      twoFactorEnabled: !prev.twoFactorEnabled,
                    }))
                  }
                >
                  {securitySettings.twoFactorEnabled ? "Disable" : "Enable"}
                </Button>
              </div>
            </div>

            {securitySettings.twoFactorEnabled && (
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Smartphone className="w-4 h-4" />
                  <span className="text-sm font-medium">Authenticator App</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Two-factor authentication is enabled using your authenticator app.
                </p>
                <Button variant="link" className="p-0 h-auto text-xs">
                  View backup codes
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Login Alerts */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Login Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
            </div>
            <Switch
              checked={securitySettings.loginAlerts}
              onCheckedChange={(checked) => setSecuritySettings((prev) => ({ ...prev, loginAlerts: checked }))}
            />
          </div>

          {/* Session Timeout */}
          <div className="space-y-2">
            <Label>Session Timeout</Label>
            <div className="flex space-x-2">
              <Input
                value={securitySettings.sessionTimeout}
                onChange={(e) =>
                  setSecuritySettings((prev) => ({
                    ...prev,
                    sessionTimeout: e.target.value,
                  }))
                }
                className="w-20"
              />
              <span className="text-sm text-muted-foreground self-center">hours</span>
            </div>
            <p className="text-xs text-muted-foreground">Automatically log out after this period of inactivity</p>
          </div>
        </CardContent>
      </Card>

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Billing & Contact Information</span>
          </CardTitle>
          <CardDescription>Manage your billing details and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billing-email">Billing Email</Label>
              <Input id="billing-email" defaultValue="billing@techsolutions.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="+1 (555) 123-4567" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="billing-address">Billing Address</Label>
            <Input id="billing-address" defaultValue="123 Tech Street" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" defaultValue="San Francisco" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" defaultValue="CA" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input id="zip" defaultValue="94105" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tax-id">Tax ID / EIN</Label>
            <Input id="tax-id" placeholder="XX-XXXXXXX" />
          </div>

          <Button>Update Billing Information</Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg">
            <div>
              <h4 className="font-medium">Delete Account</h4>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data</p>
            </div>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
