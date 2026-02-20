import React from 'react';
import { useNavigate } from 'react-router';
import { AlertCircle } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-24 h-24 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={48} className="text-[var(--accent-red)]" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">
          404
        </h1>
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-[var(--text-secondary)] mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action */}
        <button
          onClick={() => navigate('/')}
          className="bg-[var(--accent-red)] text-white px-6 py-3 rounded-[var(--radius-button)] font-medium hover:bg-[var(--accent-red-hover)] transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
