export default function LoadingEventPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm animate-pulse">
        <div className="aspect-video w-full bg-gray-200 dark:bg-gray-700" />
        
        <div className="p-6 space-y-6">
          <div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full mr-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-1/3" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 