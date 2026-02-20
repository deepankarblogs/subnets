import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => navigate('/')}
        className="text-[var(--text-tertiary)] hover:text-[var(--accent-red)] transition-colors flex-shrink-0"
      >
        <Home size={16} />
      </button>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={14} className="text-[var(--text-tertiary)] flex-shrink-0" />
          {item.path ? (
            <button
              onClick={() => navigate(item.path)}
              className="text-sm text-[var(--text-tertiary)] hover:text-[var(--accent-red)] transition-colors whitespace-nowrap"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-sm text-[var(--text-primary)] font-medium whitespace-nowrap">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
