export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#0d0e12]">
      <main className="max-w-screen-xl mx-auto px-6 py-8">
        {/* 헤더 스켈레톤 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-4 w-24 bg-[#25262b] animate-pulse rounded" />
            <div className="h-6 w-px bg-[#373A40]" />
            <div className="h-6 w-32 bg-[#25262b] animate-pulse rounded" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-32 bg-[#25262b] animate-pulse rounded" />
            <div className="h-9 w-28 bg-[#25262b] animate-pulse rounded" />
          </div>
        </div>

        {/* KPI 카드 스켈레톤 */}
        <section className="mb-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-4 w-16 bg-[#25262b] animate-pulse rounded" />
                  <div className="h-4 w-12 bg-[#25262b] animate-pulse rounded" />
                </div>
                <div className="h-9 w-24 bg-[#25262b] animate-pulse rounded mb-3" />
                <div className="h-1.5 w-full bg-[#25262b] animate-pulse rounded" />
              </div>
            ))}
          </div>
        </section>

        {/* 달력 & 차트 스켈레톤 */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          {/* 달력 */}
          <div className="xl:col-span-2">
            <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-[#373A40]">
                <div className="h-6 w-32 bg-[#25262b] animate-pulse rounded" />
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-[#25262b] animate-pulse rounded" />
                  <div className="w-8 h-8 bg-[#25262b] animate-pulse rounded" />
                </div>
              </div>
              <div className="grid grid-cols-7 border-b border-[#25262b]">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="py-2 flex justify-center">
                    <div className="h-4 w-4 bg-[#25262b] animate-pulse rounded" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {[...Array(35)].map((_, i) => (
                  <div key={i} className="min-h-[100px] p-2 border border-[#25262b] bg-[#1a1b23]">
                    <div className="h-4 w-4 bg-[#25262b] animate-pulse rounded mb-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 차트 */}
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
                <div className="h-5 w-28 bg-[#25262b] animate-pulse rounded mb-4" />
                <div className="h-[250px] flex items-center justify-center">
                  <div className="w-full h-full flex items-end justify-around px-4 pb-8">
                    {[...Array(5)].map((_, j) => (
                      <div
                        key={j}
                        className="w-12 bg-[#25262b] animate-pulse rounded-t"
                        style={{ height: `${30 + Math.random() * 50}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* GitHub 이슈 스켈레톤 */}
        <section>
          <div className="bg-[#1a1b23] rounded-lg border border-[#373A40]">
            <div className="flex items-center justify-between p-4 border-b border-[#373A40]">
              <div className="flex items-center gap-3">
                <div className="h-5 w-24 bg-[#25262b] animate-pulse rounded" />
                <div className="h-4 w-20 bg-[#25262b] animate-pulse rounded" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-24 bg-[#25262b] animate-pulse rounded" />
                <div className="w-8 h-8 bg-[#25262b] animate-pulse rounded" />
              </div>
            </div>
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-3 animate-pulse">
                  <div className="w-4 h-4 bg-[#25262b] rounded-full mt-0.5" />
                  <div className="flex-1">
                    <div className="h-4 w-3/4 bg-[#25262b] rounded mb-2" />
                    <div className="h-3 w-1/2 bg-[#25262b] rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
