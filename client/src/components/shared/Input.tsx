import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
}

const Input = ({ label, icon, error, className = '', ...props }: InputProps) => {
  return (
    <div>
      {label && (
        <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2">
          {label} {props.required && <span className="text-red-600">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={`w-full ${icon ? 'pl-10 sm:pl-12' : 'pl-3 sm:pl-4'} pr-3 sm:pr-4 py-2.5 sm:py-3.5 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm sm:text-base text-gray-700 placeholder:text-gray-400 ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs sm:text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
