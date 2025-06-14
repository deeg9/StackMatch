"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Download, FileText, MessageSquare, Users, Calendar, FileArchive } from "lucide-react"
import { format } from "date-fns"

interface ExportOption {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  checked: boolean
}

interface ExportDealRoomDataProps {
  dealRoomId: string
  dealRoomName: string
  closedAt: string
  onExport: (options: string[]) => void
  onCancel: () => void
}

export function ExportDealRoomData({
  dealRoomId,
  dealRoomName,
  closedAt,
  onExport,
  onCancel,
}: ExportDealRoomDataProps) {
  const [options, setOptions] = useState<ExportOption[]>([
    {
      id: "messages",
      label: "Messages",
      description: "All messages exchanged in the deal room",
      icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
      checked: true,
    },
    {
      id: "files",
      label: "Files",
      description: "All files uploaded to the deal room",
      icon: <FileText className="h-4 w-4 text-green-500" />,
      checked: true,
    },
    {
      id: "participants",
      label: "Participants",
      description: "List of all participants and their roles",
      icon: <Users className="h-4 w-4 text-purple-500" />,
      checked: true,
    },
    {
      id: "timeline",
      label: "Timeline",
      description: "Timeline of key events in the deal room",
      icon: <Calendar className="h-4 w-4 text-amber-500" />,
      checked: true,
    },
    {
      id: "contracts",
      label: "Contracts",
      description: "All contracts and agreements",
      icon: <FileArchive className="h-4 w-4 text-red-500" />,
      checked: true,
    },
  ])

  const [loading, setLoading] = useState(false)

  // Toggle option checked state
  const toggleOption = (id: string) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) => (option.id === id ? { ...option, checked: !option.checked } : option)),
    )
  }

  // Select all options
  const selectAll = () => {
    setOptions((prevOptions) => prevOptions.map((option) => ({ ...option, checked: true })))
  }

  // Deselect all options
  const deselectAll = () => {
    setOptions((prevOptions) => prevOptions.map((option) => ({ ...option, checked: false })))
  }

  // Handle export button click
  const handleExport = () => {
    setLoading(true)

    // Get selected option IDs
    const selectedOptions = options.filter((option) => option.checked).map((option) => option.id)

    // Call the onExport callback with selected options
    onExport(selectedOptions)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          <span>Export Deal Room Data</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">{dealRoomName}</h3>
            <p className="text-sm text-gray-500">Closed on {format(new Date(closedAt), "MMMM d, yyyy")}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Select data to export</h4>
              <div className="space-x-2">
                <Button variant="ghost" size="sm" onClick={selectAll} className="text-xs h-7">
                  Select All
                </Button>
                <Button variant="ghost" size="sm" onClick={deselectAll} className="text-xs h-7">
                  Deselect All
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {options.map((option) => (
                <div key={option.id} className="flex items-start space-x-3">
                  <Checkbox id={option.id} checked={option.checked} onCheckedChange={() => toggleOption(option.id)} />
                  <div>
                    <label htmlFor={option.id} className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                      {option.icon}
                      {option.label}
                    </label>
                    <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={loading || !options.some((option) => option.checked)}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
