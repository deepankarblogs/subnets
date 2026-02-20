import React from 'react';

interface TagPillProps {
  text: string;
  color: 'purple' | 'orange' | 'blue';
  variant?: 'default' | 'outline';
}

export function TagPill({ text, color, variant = 'default' }: TagPillProps) {
  const colorStyles = {
    purple: variant === 'default' 
      ? 'bg-[var(--tag-purple-dim)] text-[var(--tag-purple)]' 
      : 'border-[var(--tag-purple)] text-[var(--tag-purple)]',
    orange: variant === 'default'
      ? 'bg-[var(--tag-orange-dim)] text-[var(--tag-orange)]'
      : 'border-[var(--tag-orange)] text-[var(--tag-orange)]',
    blue: variant === 'default'
      ? 'bg-[var(--tag-blue-dim)] text-[var(--tag-blue)]'
      : 'border-[var(--tag-blue)] text-[var(--tag-blue)]',
  };

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-[var(--radius-pill)] text-xs font-medium
        ${variant === 'outline' ? 'border' : ''}
        ${colorStyles[color]}
      `}
    >
      {text}
    </span>
  );
}
