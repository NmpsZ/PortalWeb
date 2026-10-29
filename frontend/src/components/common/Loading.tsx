import React from 'react';
import Spinner from './Spinner';

export interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  text = 'Loading...',
  fullScreen = false,
  className = '',
}) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs">
        <Spinner size="xl" color="blue" />
        {text && <p className="mt-3 text-sm font-semibold text-slate-700">{text}</p>}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <Spinner size="lg" color="blue" />
      {text && <p className="mt-3 text-sm font-semibold text-slate-700">{text}</p>}
    </div>
  );
};

export default Loading;

