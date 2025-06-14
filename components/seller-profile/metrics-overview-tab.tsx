interface MetricsOverviewTabProps {
  isViewOnly?: boolean
}

export function MetricsOverviewTab({ isViewOnly }: MetricsOverviewTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Metrics Overview</h2>
      {isViewOnly ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded-lg shadow">
            <h3 className="font-medium mb-2">Project Success Rate</h3>
            <div className="text-3xl font-bold">98%</div>
            <p className="text-muted-foreground text-sm">Based on 45 completed projects</p>
          </div>

          <div className="bg-card p-4 rounded-lg shadow">
            <h3 className="font-medium mb-2">On-Time Delivery</h3>
            <div className="text-3xl font-bold">95%</div>
            <p className="text-muted-foreground text-sm">Projects delivered on schedule</p>
          </div>

          <div className="bg-card p-4 rounded-lg shadow">
            <h3 className="font-medium mb-2">Client Satisfaction</h3>
            <div className="text-3xl font-bold">4.9/5.0</div>
            <p className="text-muted-foreground text-sm">Average rating from clients</p>
          </div>

          <div className="bg-card p-4 rounded-lg shadow">
            <h3 className="font-medium mb-2">Response Time</h3>
            <div className="text-3xl font-bold">2.5 hrs</div>
            <p className="text-muted-foreground text-sm">Average time to respond</p>
          </div>

          <div className="bg-card p-4 rounded-lg shadow">
            <h3 className="font-medium mb-2">Projects Completed</h3>
            <div className="text-3xl font-bold">45</div>
            <p className="text-muted-foreground text-sm">Successfully delivered</p>
          </div>

          <div className="bg-card p-4 rounded-lg shadow">
            <h3 className="font-medium mb-2">Years of Experience</h3>
            <div className="text-3xl font-bold">8+</div>
            <p className="text-muted-foreground text-sm">In software development</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Performance Metrics</h3>
            <button className="text-sm text-primary">Configure</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-card p-4 rounded-lg shadow">
              <h3 className="font-medium mb-2">Project Success Rate</h3>
              <div className="text-3xl font-bold">98%</div>
              <p className="text-muted-foreground text-sm">Based on 45 completed projects</p>
              <button className="mt-2 text-xs text-primary">Edit</button>
            </div>

            {/* Additional editable metrics would go here */}
          </div>

          <div className="flex justify-end">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded">Update Metrics</button>
          </div>
        </div>
      )}
    </div>
  )
}
