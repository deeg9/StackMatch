"use client"

import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store"
import { updateData } from "@/store/slices/projectWizardSlice"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Calendar, Clock, TrendingUp, Target } from "lucide-react"

const budgetRanges = [
  { min: 5000, max: 10000, label: "$5K - $10K" },
  { min: 10000, max: 25000, label: "$10K - $25K" },
  { min: 25000, max: 50000, label: "$25K - $50K" },
  { min: 50000, max: 100000, label: "$50K - $100K" },
  { min: 100000, max: 250000, label: "$100K - $250K" },
  { min: 250000, max: 500000, label: "$250K - $500K" },
  { min: 500000, max: 1000000, label: "$500K+" },
]

const timelineOptions = [
  "1-2 weeks",
  "3-4 weeks",
  "1-2 months",
  "3-4 months",
  "5-6 months",
  "6+ months",
  "Ongoing project",
]

export function BudgetTimelineStep() {
  const dispatch = useDispatch()
  const { data } = useSelector((state: RootState) => state.projectWizard)

  const handleInputChange = (field: string, value: string | number) => {
    dispatch(updateData({ [field]: value }))
  }

  const handleBudgetRangeSelect = (range: { min: number; max: number }) => {
    dispatch(
      updateData({
        budgetMin: range.min,
        budgetMax: range.max,
      }),
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="budget" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="flexibility">Flexibility</TabsTrigger>
        </TabsList>

        {/* Budget Tab */}
        <TabsContent value="budget" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Project Budget
            </h3>
            <p className="text-muted-foreground mb-6">
              Define your budget structure and range. This helps providers understand your investment level and propose
              appropriate solutions.
            </p>

            {/* Budget Type */}
            <div className="mb-6">
              <Label className="text-base font-medium">Budget Structure</Label>
              <p className="text-sm text-muted-foreground mb-3">How would you like to structure the payment?</p>
              <RadioGroup
                value={data.budgetType}
                onValueChange={(value: "FIXED" | "HOURLY" | "MILESTONE") => handleInputChange("budgetType", value)}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="FIXED" id="fixed" />
                  <div className="flex-1">
                    <Label htmlFor="fixed" className="font-medium">
                      Fixed Price
                    </Label>
                    <p className="text-sm text-muted-foreground">One total price for the entire project</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="HOURLY" id="hourly" />
                  <div className="flex-1">
                    <Label htmlFor="hourly" className="font-medium">
                      Hourly Rate
                    </Label>
                    <p className="text-sm text-muted-foreground">Pay based on time spent</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="MILESTONE" id="milestone" />
                  <div className="flex-1">
                    <Label htmlFor="milestone" className="font-medium">
                      Milestone-based
                    </Label>
                    <p className="text-sm text-muted-foreground">Pay upon completion of milestones</p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Budget Range Selection */}
            <div className="mb-6">
              <Label className="text-base font-medium">Budget Range</Label>
              <p className="text-sm text-muted-foreground mb-3">Select a range or enter custom amounts</p>

              {/* Quick Range Selection */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {budgetRanges.map((range) => (
                  <Badge
                    key={range.label}
                    variant={data.budgetMin === range.min && data.budgetMax === range.max ? "default" : "outline"}
                    className="cursor-pointer justify-center py-2 px-3"
                    onClick={() => handleBudgetRangeSelect(range)}
                  >
                    {range.label}
                  </Badge>
                ))}
              </div>

              {/* Custom Budget Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget-min">Minimum Budget</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="budget-min"
                      type="number"
                      className="pl-10"
                      value={data.budgetMin || ""}
                      onChange={(e) => handleInputChange("budgetMin", Number(e.target.value))}
                      placeholder="5000"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="budget-max">Maximum Budget</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="budget-max"
                      type="number"
                      className="pl-10"
                      value={data.budgetMax || ""}
                      onChange={(e) => handleInputChange("budgetMax", Number(e.target.value))}
                      placeholder="25000"
                    />
                  </div>
                </div>
              </div>

              {/* Budget Summary */}
              {data.budgetMin > 0 && data.budgetMax > 0 && (
                <Card className="mt-4 border-green-200 bg-green-50">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-green-800">Budget Range:</span>
                      <span className="text-lg font-bold text-green-800">
                        {formatCurrency(data.budgetMin)} - {formatCurrency(data.budgetMax)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Currency Selection */}
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={data.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Project Timeline
            </h3>
            <p className="text-muted-foreground mb-6">
              Define when you want to start and complete your project. Clear timelines help providers plan their
              resources.
            </p>

            <div className="space-y-6">
              {/* Timeline Duration */}
              <div>
                <Label className="text-base font-medium">Expected Duration</Label>
                <p className="text-sm text-muted-foreground mb-3">How long do you expect this project to take?</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {timelineOptions.map((option) => (
                    <Badge
                      key={option}
                      variant={data.timeline === option ? "default" : "outline"}
                      className="cursor-pointer justify-center py-2 px-3"
                      onClick={() => handleInputChange("timeline", option)}
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Start Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="start-date">Preferred Start Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="start-date"
                      type="date"
                      className="pl-10"
                      value={data.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">When would you like to begin?</p>
                </div>

                <div>
                  <Label htmlFor="deadline">Project Deadline</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="deadline"
                      type="date"
                      className="pl-10"
                      value={data.deadline}
                      onChange={(e) => handleInputChange("deadline", e.target.value)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">When do you need it completed?</p>
                </div>
              </div>

              {/* Timeline Summary */}
              {data.startDate && data.deadline && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-blue-800">Project Duration:</span>
                      <span className="text-lg font-bold text-blue-800">
                        {Math.ceil(
                          (new Date(data.deadline).getTime() - new Date(data.startDate).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}{" "}
                        days
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Flexibility Tab */}
        <TabsContent value="flexibility" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Flexibility & Preferences
            </h3>
            <p className="text-muted-foreground mb-6">
              Indicate how flexible you are with budget, timeline, and scope changes.
            </p>

            <div className="space-y-6">
              {/* Flexibility Level */}
              <div>
                <Label className="text-base font-medium">Timeline Flexibility</Label>
                <p className="text-sm text-muted-foreground mb-3">How flexible are you with the project timeline?</p>
                <RadioGroup
                  value={data.flexibility}
                  onValueChange={(value: "STRICT" | "FLEXIBLE" | "NEGOTIABLE") =>
                    handleInputChange("flexibility", value)
                  }
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="STRICT" id="strict" />
                    <div className="flex-1">
                      <Label htmlFor="strict" className="font-medium">
                        Strict Timeline
                      </Label>
                      <p className="text-sm text-muted-foreground">Deadline is firm and non-negotiable</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="FLEXIBLE" id="flexible" />
                    <div className="flex-1">
                      <Label htmlFor="flexible" className="font-medium">
                        Flexible
                      </Label>
                      <p className="text-sm text-muted-foreground">Some flexibility with timeline</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="NEGOTIABLE" id="negotiable" />
                    <div className="flex-1">
                      <Label htmlFor="negotiable" className="font-medium">
                        Negotiable
                      </Label>
                      <p className="text-sm text-muted-foreground">Open to timeline discussions</p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Additional Notes */}
              <div>
                <Label htmlFor="budget-notes">Additional Budget & Timeline Notes</Label>
                <Textarea
                  id="budget-notes"
                  placeholder="Any additional information about budget constraints, payment terms, timeline considerations, or special requirements..."
                  rows={4}
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Include any special considerations, payment preferences, or timeline constraints.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Budget & Timeline Tips */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center text-amber-800">
            <TrendingUp className="h-4 w-4 mr-2" />
            Budget & Timeline Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Be realistic with your budget - quality work requires fair compensation</li>
            <li>• Allow buffer time for revisions and unexpected challenges</li>
            <li>• Consider breaking large projects into phases</li>
            <li>• Milestone-based payments often work well for larger projects</li>
            <li>• Communicate any hard deadlines or budget constraints upfront</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
