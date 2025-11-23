import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  children: ReactNode;
}

const Button = ({ 
  variant = 'primary', 
  isLoading = false, 
  loadingText = 'Đang xử lý...', 
  fullWidth = false,
  children, 
  className = '', 
  disabled,
  ...props 
}: ButtonProps) => {
  const baseClasses = 'font-bold py-3 sm:py-4 rounded-lg shadow-md transition-all text-sm sm:text-base disabled:bg-gray-400 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-red-600 text-white hover:bg-red-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent text-gray-600 hover:text-gray-800 shadow-none',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {isLoading ? loadingText : children}
    </motion.button>
  );
};

export default Button;
