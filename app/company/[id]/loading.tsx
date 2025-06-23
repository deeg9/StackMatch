export default function CompanyLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header Skeleton */}
      <div className="relative h-80 bg-gradient-to-r from-stackmatch-navy to-stackmatch-blue animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="relative h-full flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <div className="flex items-end gap-6">
              <div className="w-32 h-32 bg-white/20 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-8 bg-white/20 rounded w-64 mb-2"></div>
                <div className="h-4 bg-white/20 rounded w-48 mb-4"></div>
                <div className="flex gap-4">
                  <div className="h-4 bg-white/20 rounded w-32"></div>
                  <div className="h-4 bg-white/20 rounded w-32"></div>
                  <div className="h-4 bg-white/20 rounded w-32"></div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-12 bg-white/20 rounded w-32"></div>
                <div className="h-12 bg-white/20 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tab Navigation Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 animate-pulse">
              <div className="border-b border-slate-200 bg-slate-50/50 p-4">
                <div className="grid grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 bg-slate-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="p-6 space-y-6">
                {/* Company Snapshot Skeleton */}
                <div className="space-y-4">
                  <div className="h-6 bg-slate-200 rounded w-48"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-3">
                        <div className="h-5 bg-slate-200 rounded w-24"></div>
                        <div className="space-y-2">
                          <div className="h-8 bg-slate-200 rounded"></div>
                          <div className="h-8 bg-slate-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics Cards Skeleton */}
                <div className="space-y-4">
                  <div className="h-6 bg-slate-200 rounded w-48"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-white border border-slate-200 rounded-lg p-6 animate-pulse">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
                            <div className="h-3 bg-slate-200 rounded w-16"></div>
                          </div>
                        </div>
                        <div className="h-8 bg-slate-200 rounded w-20 mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-28"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Featured Case Studies Skeleton */}
                <div className="space-y-4">
                  <div className="h-6 bg-slate-200 rounded w-48"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white border border-slate-200 rounded-lg p-6 animate-pulse">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="h-4 bg-slate-200 rounded w-20"></div>
                            <div className="h-5 bg-slate-200 rounded w-full"></div>
                            <div className="h-3 bg-slate-200 rounded w-32"></div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-3 bg-slate-200 rounded w-full"></div>
                            <div className="h-3 bg-slate-200 rounded w-full"></div>
                            <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="h-12 bg-slate-200 rounded"></div>
                            <div className="h-12 bg-slate-200 rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm animate-pulse">
                <div className="p-4">
                  <div className="h-4 bg-slate-200 rounded w-24 mb-3"></div>
                  <div className="space-y-3">
                    <div className="h-12 bg-slate-200 rounded"></div>
                    <div className="h-12 bg-slate-200 rounded"></div>
                    <div className="h-12 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}