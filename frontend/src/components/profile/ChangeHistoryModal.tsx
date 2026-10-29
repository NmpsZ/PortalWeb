import React from 'react';
import Modal from '../common/Modal';
import { formatDate } from '../../utils/helpers';
import { ProfileHistory } from '../../types';

export interface ChangeHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ProfileHistory[];
}

const formatFieldName = (field: string) => {
  const lower = field.toLowerCase();
  if (lower.includes('phone')) return 'Phone Number';
  if (lower.includes('email')) return 'Email Address';
  if (lower.includes('address')) return 'Address';
  if (lower.includes('photo')) return 'Profile Photo';
  if (lower.includes('skill')) return 'Skills & Proficiencies';
  return field;
};

const getFieldBadgeStyle = (field: string) => {
  const lower = field.toLowerCase();
  if (lower.includes('phone')) return 'bg-sky-50 text-sky-700 border-sky-200';
  if (lower.includes('email')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  if (lower.includes('address')) return 'bg-teal-50 text-teal-700 border-teal-200';
  if (lower.includes('photo')) return 'bg-amber-50 text-amber-800 border-amber-200';
  if (lower.includes('skill')) return 'bg-violet-50 text-violet-700 border-violet-200';
  return 'bg-slate-50 text-slate-700 border-slate-200';
};

const getFieldIcon = (field: string) => {
  const lower = field.toLowerCase();
  if (lower.includes('phone')) {
    return (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    );
  }
  if (lower.includes('email')) {
    return (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  }
  if (lower.includes('photo')) {
    return (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  }
  if (lower.includes('skill')) {
    return (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
      </svg>
    );
  }
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
};

// Render value content with special handling for photos and skill tags
const renderValueContent = (field: string, value: string | undefined, isOld: boolean) => {
  const safeVal = value || '';
  const lower = field.toLowerCase();

  // Photo rendering
  if (lower.includes('photo')) {
    if (!safeVal || safeVal.trim() === '') {
      return <span className="text-xs text-slate-400 italic">No photo</span>;
    }
    if (safeVal.startsWith('data:image') || safeVal.startsWith('http')) {
      return (
        <div className="flex items-center gap-2">
          <img
            src={safeVal}
            alt="Preview"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-2xs bg-white shrink-0"
          />
          <span className="text-xs font-medium text-slate-600">
            {isOld ? 'Previous Photo' : 'New Photo Uploaded'}
          </span>
        </div>
      );
    }
    return <span className="text-xs text-slate-600 font-medium truncate block">{safeVal}</span>;
  }

  // Skills rendering
  if (lower.includes('skill')) {
    if (!safeVal || safeVal.trim() === '') {
      return <span className="text-xs text-slate-400 italic">(No skills configured)</span>;
    }
    const skillsList = safeVal
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    return (
      <div className="flex flex-wrap gap-1.5 items-center">
        {skillsList.map((skill, idx) => (
          <span
            key={idx}
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
              isOld
                ? 'bg-rose-50/60 text-rose-700 border-rose-200 line-through'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {skill}
          </span>
        ))}
      </div>
    );
  }

  // Plain text fields (Phone, Email, Address)
  if (!safeVal || safeVal.trim() === '') {
    return <span className="text-xs text-slate-400 italic">(empty)</span>;
  }

  return (
    <span
      className={`text-xs block break-words font-medium ${
        isOld ? 'text-slate-500 line-through' : 'text-slate-900 font-semibold'
      }`}
    >
      {safeVal}
    </span>
  );
};

export const ChangeHistoryModal: React.FC<ChangeHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Profile Change History">
      <div className="flex flex-col">
        {/* Header Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3 px-0.5">
          <span>Audit records recorded in PostgreSQL (past 7 days)</span>
          <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
            {history.length} {history.length === 1 ? 'record' : 'records'}
          </span>
        </div>

        {/* Audit List Container */}
        <div className="max-h-[60vh] sm:max-h-[460px] overflow-y-auto pr-1">
          {history.length > 0 ? (
            <div className="flex flex-col gap-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/90 shadow-2xs transition-all hover:border-slate-300"
                >
                  {/* Card Header: Field tag on left, date on right */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold border shrink-0 ${getFieldBadgeStyle(
                        item.field_changed
                      )}`}
                    >
                      {getFieldIcon(item.field_changed)}
                      <span>{formatFieldName(item.field_changed)}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 text-slate-400 text-xs font-medium shrink-0">
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{formatDate(item.created_at)}</span>
                    </span>
                  </div>

                  {/* Diff Comparison Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white p-2.5 rounded-lg border border-slate-100">
                    {/* Previous Box */}
                    <div className="p-2.5 rounded-lg bg-rose-50/40 border border-rose-100/80">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                          Previous
                        </span>
                      </div>
                      <div className="min-h-[22px] flex items-center">
                        {renderValueContent(item.field_changed, item.old_value, true)}
                      </div>
                    </div>

                    {/* Updated Box */}
                    <div className="p-2.5 rounded-lg bg-emerald-50/40 border border-emerald-100/80">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                          Updated Value
                        </span>
                      </div>
                      <div className="min-h-[22px] flex items-center">
                        {renderValueContent(item.field_changed, item.new_value, false)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-400 py-12 px-4 text-sm flex flex-col items-center gap-2">
              <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium text-slate-600">No profile change history found</p>
              <p className="text-xs text-slate-400">Updates made within the past 7 days will be logged here.</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ChangeHistoryModal;
