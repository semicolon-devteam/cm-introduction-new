/**
 * Contact Loading State
 */

export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header Placeholder */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 border-b border-white/10">
        <div className="max-w-screen-xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="h-8 w-32 bg-white/10 rounded animate-pulse" />
            <div className="flex gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 w-12 bg-white/10 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="max-w-screen-xl mx-auto px-6">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <div className="h-8 w-32 bg-white/10 rounded animate-pulse mx-auto mb-2" />
            <div className="h-8 w-64 bg-white/10 rounded animate-pulse mx-auto mb-4" />
            <div className="h-4 w-80 bg-white/5 rounded animate-pulse mx-auto" />
          </div>

          {/* Form Skeleton */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Left Column */}
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <div className="h-4 w-16 bg-white/10 rounded animate-pulse mb-2" />
                    <div className="h-12 bg-white/5 border border-white/10 rounded-lg animate-pulse" />
                  </div>
                ))}
              </div>
              {/* Right Column */}
              <div>
                <div className="h-4 w-20 bg-white/10 rounded animate-pulse mb-2" />
                <div className="h-[280px] bg-white/5 border border-white/10 rounded-lg animate-pulse" />
              </div>
            </div>
            {/* Button */}
            <div className="mt-8 flex justify-end">
              <div className="h-12 w-32 bg-brand-primary/30 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
