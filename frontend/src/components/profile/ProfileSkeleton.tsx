import React from 'react';

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="h-7 sm:h-8 bg-slate-200 rounded-md w-44 sm:w-48 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded-md w-60 sm:w-72"></div>
        </div>
        <div className="h-9 bg-slate-200 rounded-lg w-full sm:w-52"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center">
          <div className="w-32 h-32 sm:w-36 sm:h-36 bg-slate-200 rounded-full mb-4"></div>
          <div className="h-5 bg-slate-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-24"></div>
        </div>
        <div className="md:col-span-2 flex flex-col gap-5 sm:gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 h-48"></div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 h-40"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
