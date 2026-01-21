/**
 * Contact Loading State
 */

export default function ContactLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse mx-auto mb-4" />
              <div className="h-6 w-96 bg-gray-100 rounded animate-pulse mx-auto" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i}>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                  </div>
                ))}
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
