import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'match' | 'age' | 'format' | 'genre' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'genre',
  className = '',
}) => {
  const variantStyles = {
    // Netflix green match score
    match: 'text-[#46d369] font-bold text-sm tracking-wide',
    // Bordered rating (e.g. 13+, 17+)
    age: 'border border-neutral-500 text-neutral-300 text-xs px-1.5 py-0.5 rounded uppercase font-medium',
    // Book format tag (e.g., E-BOOK, AUDIO, FULL HD)
    format: 'border border-neutral-600 bg-neutral-800/80 text-neutral-300 text-[10px] tracking-wider px-1.5 py-0.5 rounded font-mono',
    // General genre pill
    genre: 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 text-xs px-2.5 py-1 rounded-full transition-colors',
    // Outline badge
    outline: 'border border-neutral-600 text-neutral-400 text-xs px-2 py-0.5 rounded',
  };

  return (
    <span className={`inline-flex items-center ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
