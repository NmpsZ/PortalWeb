import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-40 shadow-xs">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
            Portal<span className="text-blue-600">Web</span>
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
