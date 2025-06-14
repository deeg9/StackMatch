import { Loader2 } from "lucide-react"

export default function SimpleFileInvestigationLoading() {
  return (
    <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h2 className="text-2xl font-semibold">Loading Investigation Tool...</h2>
      <p className="text-muted-foreground mt-2">Please wait while we prepare the investigation interface</p>
    </div>
  )
}
