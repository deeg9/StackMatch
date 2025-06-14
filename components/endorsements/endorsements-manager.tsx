import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VerificationSystemTest } from "./verification-system-test"

export function EndorsementsManager() {
  return (
    <Tabs defaultValue="system-test" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="system-test">System Test</TabsTrigger>
      </TabsList>
      <TabsContent value="system-test" className="space-y-4">
        <VerificationSystemTest />
      </TabsContent>
    </Tabs>
  )
}
