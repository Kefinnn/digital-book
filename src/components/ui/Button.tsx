'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'icon' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base md:text-lg px-7 py-3 gap-3',
  };

  const variantStyles = {
    // White background button like Netflix's Play button
    primary: 'bg-white text-black hover:bg-neutral-200 active:bg-neutral-300 font-bold shadow-md hover:scale-105 active:scale-95',
    // Gray translucent button like Netflix's More Info button
    secondary: 'bg-neutral-600/70 text-white hover:bg-neutral-600/90 active:bg-neutral-700 backdrop-blur-sm shadow-md hover:scale-105 active:scale-95',
    // Outline button
    outline: 'border-2 border-neutral-400 text-white hover:border-white hover:bg-white/10 active:scale-95',
    // Circular icon button like Netflix's + and thumbs up buttons
    icon: 'rounded-full border-2 border-neutral-400 bg-black/40 text-white hover:border-white hover:bg-neutral-800 p-2.5 active:scale-90',
    // Netflix red button
    danger: 'bg-[#E50914] text-white hover:bg-[#b80710] font-bold shadow-md hover:scale-105 active:scale-95',
  };

  const appliedSize = variant === 'icon' ? '' : sizeStyles[size];

  return (
    <button
      className={`${baseStyles} ${appliedSize} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
