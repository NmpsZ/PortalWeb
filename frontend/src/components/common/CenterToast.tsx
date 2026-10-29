import React from 'react';

export interface CenterToastProps {
  isOpen: boolean;
  message: string;
  type?: 'success' | 'error';
  onClose?: () => void;
}

export const CenterToast: React.FC<CenterToastProps> = ({
  isOpen,
  message,
  type = 'success',
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-[2px] transition-all animate-fadeIn"
      role="alert"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 flex flex-col items-center text-center max-w-sm w-full mx-auto transform transition-all animate-scaleUp"
      >
        {type === 'success' ? (
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 ring-8 ring-emerald-50/60">
            <svg
              className="w-8 h-8 stroke-current stroke-[2.5]"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        ) : (
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4 ring-8 ring-red-50/60">
            <svg
              className="w-8 h-8 stroke-current stroke-[2.5]"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        )}

        <h3 className="text-lg font-bold text-slate-900 mb-1">
          {type === 'success' ? 'Update Successful' : 'Action Failed'}
        </h3>

        <p className="text-sm text-slate-600 font-medium">
          {message}
        </p>
      </div>
    </div>
  );
};

export default CenterToast;

