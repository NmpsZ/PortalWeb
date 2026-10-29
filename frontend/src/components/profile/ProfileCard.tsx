import React from 'react';
import Spinner from '../common/Spinner';
import { UserProfile } from '../../types';

export interface ProfileCardProps {
  profile: UserProfile;
  uploading: boolean;
  onUploadPhoto: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onViewHistory?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  uploading,
  onUploadPhoto,
  onViewHistory,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden mb-5 transition-all hover:border-slate-300">
      {/* Sleek Subdued Dark Executive Cover Banner */}
      <div className="h-20 sm:h-24 w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden border-b border-slate-800/60">
        {/* Soft subtle ambient glow */}
        <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-indigo-500/10 blur-md pointer-events-none"></div>
        <div className="absolute left-1/3 -top-8 w-28 h-28 rounded-full bg-blue-500/10 blur-md pointer-events-none"></div>
      </div>

      {/* Main Profile Info Row (Perfect Symmetrical Alignment) */}
      <div className="px-5 sm:px-6 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left: Avatar + Name (Vertically Centered on Exact Same Centerline) */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 text-center sm:text-left">
            {/* Avatar Photo with Touch/Hover Camera Trigger */}
            <div className="relative group w-18 h-18 sm:w-20 sm:h-20 shrink-0">
              {profile.photo_url ? (
                <img
                  src={profile.photo_url}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full ring-2 ring-slate-200 shadow-xs bg-white"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center text-xl sm:text-2xl font-extrabold ring-2 ring-slate-200 shadow-xs">
                  {profile.full_name?.[0] || 'U'}{profile.last_name?.[0] || 'P'}
                </div>
              )}

              {/* Uploading Spinner Overlay */}
              {uploading && (
                <div className="absolute inset-0 rounded-full bg-slate-900/60 backdrop-blur-[2px] text-white flex flex-col items-center justify-center z-20 transition-opacity">
                  <Spinner size="md" color="white" className="mb-1" />
                  <span className="text-[10px] font-semibold tracking-wide">Uploading...</span>
                </div>
              )}

              {/* Desktop Hover Overlay */}
              {!uploading && (
                <label className="hidden sm:flex absolute inset-0 rounded-full bg-slate-900/50 text-white flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10">
                  <svg className="w-4 h-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-[10px] font-semibold">Change</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onUploadPhoto}
                    className="hidden"
                  />
                </label>
              )}

              {/* Mobile Camera Badge */}
              {!uploading && (
                <label className="sm:hidden absolute bottom-0 right-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md border-2 border-white cursor-pointer active:scale-95 transition-transform hover:bg-blue-700 z-10">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onUploadPhoto}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Name & Read-Only Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {profile.full_name} {profile.last_name}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200 self-center sm:self-auto shrink-0">
                <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Full Name (Read-only)</span>
              </span>
            </div>
          </div>

          {/* Right: Action Buttons (Equal Height h-9) */}
          <div className="flex items-center justify-center gap-2.5 w-full sm:w-auto shrink-0">
            <label className="cursor-pointer flex-1 sm:flex-initial">
              <input
                type="file"
                accept="image/*"
                onChange={onUploadPhoto}
                disabled={uploading}
                className="hidden"
              />
              <div className="h-9 px-3.5 rounded-lg border border-slate-300 hover:border-blue-400 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-[0.98]">
                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{uploading ? 'Uploading...' : 'Change Photo'}</span>
              </div>
            </label>

            {onViewHistory && (
              <button
                type="button"
                onClick={onViewHistory}
                className="h-9 px-3.5 rounded-lg border border-slate-300 hover:border-blue-400 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-[0.98] flex-1 sm:flex-initial cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>7-Day History</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
