import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-3.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
          <span>
            {label} {required && <span className="text-red-500 font-bold">*</span>}
          </span>
          {required && !error && (
            <span className="text-[10px] text-slate-400 font-normal normal-case">Required</span>
          )}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`w-full px-3.5 py-2.5 sm:py-2 text-sm rounded-lg border transition-colors outline-none focus:ring-2 ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-100 bg-red-50/20'
            : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100 bg-white'
        } ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'text-slate-900'}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-600 mt-1 font-medium">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
