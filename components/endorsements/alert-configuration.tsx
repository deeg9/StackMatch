"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AlertCircle, Save } from "lucide-react"

interface AlertSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  threshold: number
  recipients: string[]
}

export function AlertConfiguration() {
  const [settings, setSettings] = useState<AlertSettings>({
    emailNotifications: true,
    smsNotifications: false,
    threshold: 80,
    recipients: [],
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value })
  }

  const handleSave = () => {
    // Save alert settings
    console.log("Saving alert settings:", settings)
    // In a real app, this would make an API call
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          Alert Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive email alerts for system health issues</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive SMS alerts for critical outages</p>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
            />
          </div>

          <div>
            <Label htmlFor="threshold">Health Score Threshold</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="threshold"
                type="number"
                min="0"
                max="100"
                value={settings.threshold}
                onChange={(e) => handleSettingChange("threshold", Number(e.target.value))}
                className="w-24"
              />
              <span>%</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Send alerts when the overall system health score drops below this threshold
            </p>
          </div>

          <div>
            <Label htmlFor="recipients">Notification Recipients</Label>
            <Input
              id="recipients"
              type="email"
              placeholder="Enter email addresses, separated by commas"
              value={settings.recipients.join(",")}
              onChange={(e) =>
                handleSettingChange(
                  "recipients",
                  e.target.value.split(",").map((s) => s.trim()),
                )
              }
            />
            <p className="text-sm text-muted-foreground">Enter email addresses or phone numbers to receive alerts</p>
          </div>
        </div>

        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Alert Settings
        </Button>
      </CardContent>
    </Card>
  )
}
