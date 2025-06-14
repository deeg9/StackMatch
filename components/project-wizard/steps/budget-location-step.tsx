"use client"

import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store"
import { updateData } from "@/store/slices/projectWizardSlice"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

export function BudgetLocationStep() {
  const dispatch = useDispatch()
  const { data } = useSelector((state: RootState) => state.projectWizard)

  const handleInputChange = (field: string, value: any) => {
    dispatch(updateData({ [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Budget & Location</h3>
        <p className="text-muted-foreground mb-6">Set your budget and location preferences for this project.</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label>Budget Type *</Label>
          <RadioGroup
            value={data.budgetType || ""}
            onValueChange={(value) => handleInputChange("budgetType", value)}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fixed" id="fixed" />
              <Label htmlFor="fixed">Fixed Price</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hourly" id="hourly" />
              <Label htmlFor="hourly">Hourly Rate</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="budget">Budget Amount * ({data.budgetType === "hourly" ? "per hour" : "total"})</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="budget"
              type="number"
              placeholder="0"
              value={data.budget || ""}
              onChange={(e) => handleInputChange("budget", Number.parseInt(e.target.value) || null)}
              className="pl-8"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            placeholder="e.g., New York, NY or Worldwide"
            value={data.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="remote"
            checked={data.isRemote}
            onCheckedChange={(checked) => handleInputChange("isRemote", checked)}
          />
          <Label htmlFor="remote">Remote work is acceptable</Label>
        </div>

        <div>
          <Label htmlFor="deadline">Project Deadline (Optional)</Label>
          <Input
            id="deadline"
            type="date"
            value={data.deadline}
            onChange={(e) => handleInputChange("deadline", e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
