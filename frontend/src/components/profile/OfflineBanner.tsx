import React from 'react';

export interface OfflineBannerProps {
  onRetry: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ onRetry }) => {
  return (
    <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
      <div className="flex items-start sm:items-center gap-2.5">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-1 sm:mt-0"></span>
        <div>
          <strong className="font-semibold text-amber-950">Demo Preview Mode:</strong>
          <span className="ml-1 text-amber-800">
            Go Backend on port 3000 is offline. Showing mock data so you can test and view UI components.
          </span>
        </div>
      </div>
      <button
        onClick={onRetry}
        className="self-stretch sm:self-auto px-3.5 py-2 sm:py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shadow-xs cursor-pointer text-center"
      >
        Retry Connection
      </button>
    </div>
  );
};

export default OfflineBanner;
