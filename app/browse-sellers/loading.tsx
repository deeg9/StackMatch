export default function BrowseSellersLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="text-center mb-8 animate-pulse">
          <div className="h-12 bg-slate-200 rounded-lg w-80 mx-auto mb-4"></div>
          <div className="h-6 bg-slate-200 rounded-lg w-96 mx-auto mb-2"></div>
          <div className="h-5 bg-slate-200 rounded-lg w-48 mx-auto"></div>
        </div>

        {/* Filters Skeleton */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 animate-pulse">
          <div className="flex flex-wrap gap-4">
            <div className="h-12 bg-slate-200 rounded-lg flex-1 min-w-96"></div>
            <div className="h-12 bg-slate-200 rounded-lg w-40"></div>
            <div className="h-12 bg-slate-200 rounded-lg w-40"></div>
            <div className="h-12 bg-slate-200 rounded-lg w-40"></div>
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-5 bg-slate-200 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-24 mb-1"></div>
                  <div className="h-4 bg-slate-200 rounded w-20"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-slate-200 rounded w-16"></div>
                  <div className="h-6 bg-slate-200 rounded w-20"></div>
                  <div className="h-6 bg-slate-200 rounded w-18"></div>
                </div>
                <div className="h-10 bg-slate-200 rounded w-full mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}