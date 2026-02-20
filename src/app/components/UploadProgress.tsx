import React from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface UploadProgressProps {
  status: 'uploading' | 'success' | 'error';
  progress: number;
  fileName?: string;
  onRetry?: () => void;
}

export function UploadProgress({
  status,
  progress,
  fileName,
  onRetry,
}: UploadProgressProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--bg-elevated)] rounded-2xl p-4 border border-[var(--border-medium)] shadow-lg"
    >
      <div className="flex items-center gap-3">
        {/* Status Icon */}
        <div className="flex-shrink-0">
          {status === 'uploading' && (
            <Loader2 size={20} className="text-[var(--accent-red)] animate-spin" />
          )}
          {status === 'success' && (
            <CheckCircle size={20} className="text-[var(--success)]" />
          )}
          {status === 'error' && (
            <XCircle size={20} className="text-[var(--error)]" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">
              {fileName || 'Uploading...'}
            </p>
            <span className="text-xs text-[var(--text-tertiary)] ml-2">
              {status === 'uploading' && `${progress}%`}
              {status === 'success' && 'Complete'}
              {status === 'error' && 'Failed'}
            </span>
          </div>

          {/* Progress Bar */}
          {status === 'uploading' && (
            <div className="h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-[var(--accent-red)] to-[var(--tag-orange)]"
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          {status === 'error' && onRetry && (
            <button
              onClick={onRetry}
              className="text-xs text-[var(--accent-red)] hover:underline mt-1"
            >
              Retry upload
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
