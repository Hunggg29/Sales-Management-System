import type { ReactNode } from 'react';

interface AlertProps {
  variant?: 'info' | 'error' | 'success' | 'warning';
  title?: string;
  children: ReactNode;
}

const Alert = ({ variant = 'info', title, children }: AlertProps) => {
  const variantClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    error: 'bg-red-100 border-red-400 text-red-700',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  return (
    <div className={`${variantClasses[variant]} border px-4 py-3 rounded-lg text-sm`}>
      {title && <p className="font-semibold mb-1">{title}</p>}
      <div>{children}</div>
    </div>
  );
};

export default Alert;
