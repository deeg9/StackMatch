import { ActivityLog } from "@/components/ui/activity-log"
import { Progress } from "@/components/ui/progress"

const ActivityLogTab = () => {
  return (
    <div>
      <h2>Activity Log</h2>
      <ActivityLog />
      <Progress value={70} />
    </div>
  )
}

export default ActivityLogTab
