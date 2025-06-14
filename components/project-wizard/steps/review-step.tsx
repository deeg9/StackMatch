"use client"

import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store"
import { updateData } from "@/store/slices/projectWizardSlice"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ReviewStep() {
  const dispatch = useDispatch()
  const { data } = useSelector((state: RootState) => state.projectWizard)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Review & Submit</h3>
        <p className="text-muted-foreground mb-6">Review your project details before submitting.</p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{data.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Category</Label>
              <p className="text-sm text-muted-foreground">{data.category}</p>
            </div>

            <div>
              <Label className="text-sm font-medium">Description</Label>
              <p className="text-sm text-muted-foreground">{data.description}</p>
            </div>

            <div>
              <Label className="text-sm font-medium">Requirements</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.requirements.map((req, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {req}
                  </Badge>
                ))}
              </div>
            </div>

            {data.skills.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Skills</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Budget</Label>
                <p className="text-sm text-muted-foreground">
                  ${data.budget?.toLocaleString()} ({data.budgetType})
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Timeline</Label>
                <p className="text-sm text-muted-foreground">{data.timeline}</p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Location</Label>
              <p className="text-sm text-muted-foreground">
                {data.location} {data.isRemote && "(Remote OK)"}
              </p>
            </div>

            {data.deadline && (
              <div>
                <Label className="text-sm font-medium">Deadline</Label>
                <p className="text-sm text-muted-foreground">{new Date(data.deadline).toLocaleDateString()}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div>
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Any additional information for potential providers..."
            value={data.additionalNotes}
            onChange={(e) => dispatch(updateData({ additionalNotes: e.target.value }))}
            rows={4}
          />
        </div>
      </div>
    </div>
  )
}
