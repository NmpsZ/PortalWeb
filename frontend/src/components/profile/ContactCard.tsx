import React from 'react';
import Button from '../common/Button';
import { UserProfile } from '../../types';

export interface ContactCardProps {
  profile: UserProfile;
  onEdit: () => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({ profile, onEdit }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 sm:p-6 transition-all hover:border-slate-300">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-900 truncate">Contact Information</h3>
            <p className="text-xs text-slate-500 truncate">Personal contact info</p>
          </div>
        </div>
        {/* Compact Edit Button on single line */}
        <Button
          variant="outline"
          onClick={onEdit}
          className="shrink-0 whitespace-nowrap text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1.5 hover:border-blue-500 hover:text-blue-600 transition-colors"
        >
          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span>Edit Contact</span>
        </Button>
      </div>

      {/* Full-width stacked rows so long data (e.g. emails and addresses) never breaks awkwardly */}
      <div className="flex flex-col gap-2.5 pt-0.5">
        {/* Mobile Phone Box - Full Width */}
        <div className="bg-gradient-to-r from-sky-50/50 via-slate-50/30 to-white p-3 sm:p-3.5 rounded-xl border border-sky-100/80 flex items-center gap-3 shadow-2xs">
          <div className="w-9 h-9 rounded-lg bg-sky-100/90 text-sky-600 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold text-sky-800 uppercase tracking-wider mb-0.5">
              Mobile Phone
            </span>
            <span className={`text-sm font-semibold block ${profile.phone_number ? 'text-slate-800' : 'text-slate-400 italic'}`}>
              {profile.phone_number ? profile.phone_number.replace(/\s+/g, '') : 'Not provided'}
            </span>
          </div>
        </div>

        {/* Email Address Box - Full Width */}
        <div className="bg-gradient-to-r from-indigo-50/50 via-slate-50/30 to-white p-3 sm:p-3.5 rounded-xl border border-indigo-100/80 flex items-center gap-3 shadow-2xs">
          <div className="w-9 h-9 rounded-lg bg-indigo-100/90 text-indigo-600 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold text-indigo-800 uppercase tracking-wider mb-0.5">
              Email Address
            </span>
            <span className={`text-sm font-semibold block ${profile.email ? 'text-slate-800' : 'text-slate-400 italic'}`}>
              {profile.email || 'Not provided'}
            </span>
          </div>
        </div>

        {/* Address Box - Full Width */}
        <div className="bg-gradient-to-r from-emerald-50/50 via-slate-50/30 to-white p-3 sm:p-3.5 rounded-xl border border-emerald-100/80 flex items-center gap-3 shadow-2xs">
          <div className="w-9 h-9 rounded-lg bg-emerald-100/90 text-emerald-600 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-0.5">
              Address
            </span>
            <span className={`text-sm font-semibold break-words block ${profile.address ? 'text-slate-800' : 'text-slate-400 italic'}`}>
              {profile.address || 'Not provided'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
