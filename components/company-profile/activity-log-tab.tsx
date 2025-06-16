// import { ActivityLog } from "@/components/ui/activity-log" // Component doesn't exist
import { Progress } from "@/components/ui/progress"

const ActivityLogTab = () => {
  return (
    <div>
      <h2>Activity Log</h2>
      {/* <ActivityLog /> */}
      <p className="text-sm text-muted-foreground">Activity log temporarily disabled</p>
      <Progress value={70} />
    </div>
  )
}

export default ActivityLogTab
