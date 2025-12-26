/**
 * Part-timers Loading State
 */

export default function PartTimersLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse mx-auto mb-4" />
            <div className="h-6 w-96 bg-gray-100 rounded animate-pulse mx-auto" />
          </div>
        </div>
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-6" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
