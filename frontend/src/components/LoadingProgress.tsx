export interface LoadingProgressProps {
  percent: number;
  message?: string;
}

export function LoadingProgress({ percent, message = 'Loading Bible Data...' }: LoadingProgressProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {message}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {percent < 100 ? 'Downloading and processing...' : 'Complete!'}
          </p>
        </div>
        
        <div className="relative w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percent}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {percent}%
          </p>
          {percent < 100 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Please wait, this may take a moment...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

