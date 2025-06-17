export default function StackTalkLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="text-center mb-8 animate-pulse">
          <div className="h-10 bg-slate-200 rounded-lg w-80 mx-auto mb-2"></div>
          <div className="h-6 bg-slate-200 rounded-lg w-96 mx-auto mb-4"></div>
          <div className="flex justify-center items-center gap-6">
            <div className="h-4 bg-slate-200 rounded w-32"></div>
            <div className="h-4 bg-slate-200 rounded w-32"></div>
          </div>
        </div>

        {/* Action Bar Skeleton */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="h-10 bg-slate-200 rounded w-24"></div>
            <div className="h-10 bg-slate-200 rounded flex-1"></div>
            <div className="h-10 bg-slate-200 rounded w-40"></div>
            <div className="h-10 bg-slate-200 rounded w-32"></div>
            <div className="flex gap-2">
              <div className="h-10 w-10 bg-slate-200 rounded"></div>
              <div className="h-10 w-10 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-20"></div>
                  <div className="h-8 bg-slate-200 rounded w-16"></div>
                  <div className="h-3 bg-slate-200 rounded w-24"></div>
                </div>
                <div className="h-8 w-8 bg-slate-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="flex gap-6">
          {/* Discussion List */}
          <div className="flex-1">
            {/* Category Tabs Skeleton */}
            <div className="bg-white rounded-lg p-1 mb-6 animate-pulse">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-8 bg-slate-200 rounded w-32"></div>
                ))}
              </div>
            </div>

            {/* Discussion Cards Skeleton */}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                      <div className="flex gap-4">
                        <div className="h-4 bg-slate-200 rounded w-24"></div>
                        <div className="h-4 bg-slate-200 rounded w-20"></div>
                        <div className="h-4 bg-slate-200 rounded w-16"></div>
                      </div>
                      <div className="h-4 bg-slate-200 rounded w-full"></div>
                      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                      <div className="flex gap-4">
                        <div className="h-6 bg-slate-200 rounded w-16"></div>
                        <div className="h-6 bg-slate-200 rounded w-20"></div>
                        <div className="h-6 bg-slate-200 rounded w-18"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="w-80 space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
                <div className="h-5 bg-slate-200 rounded w-32 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-8 bg-slate-200 rounded w-full"></div>
                  <div className="h-8 bg-slate-200 rounded w-full"></div>
                  <div className="h-8 bg-slate-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}