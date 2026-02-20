import React from 'react';
import { AlertCircle, WifiOff, RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ErrorBannerProps {
  type: 'error' | 'offline' | 'sessionExpired' | 'uploadFailed' | 'paginationFailed';
  message?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  visible?: boolean;
}

export function ErrorBanner({
  type,
  message,
  onRetry,
  onDismiss,
  visible = true,
}: ErrorBannerProps) {
  const config = {
    error: {
      icon: AlertCircle,
      title: 'Error',
      description: message || 'Something went wrong. Please try again.',
      bgColor: 'bg-[var(--error)]',
    },
    offline: {
      icon: WifiOff,
      title: 'No Internet Connection',
      description: 'You are currently offline. Some features may be limited.',
      bgColor: 'bg-[var(--warning)]',
    },
    sessionExpired: {
      icon: AlertCircle,
      title: 'Session Expired',
      description: 'Your session has expired. Please log in again.',
      bgColor: 'bg-[var(--error)]',
    },
    uploadFailed: {
      icon: AlertCircle,
      title: 'Upload Failed',
      description: message || 'Failed to upload your post. Please try again.',
      bgColor: 'bg-[var(--error)]',
    },
    paginationFailed: {
      icon: AlertCircle,
      title: 'Failed to Load More',
      description: 'Could not load additional content. Please try again.',
      bgColor: 'bg-[var(--error)]',
    },
  };

  const { icon: Icon, title, description, bgColor } = config[type];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`${bgColor} text-white p-4 rounded-2xl mb-4 shadow-lg`}
        >
          <div className="flex items-start gap-3">
            <Icon size={20} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-1">{title}</h4>
              <p className="text-xs opacity-90">{description}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Retry"
                >
                  <RefreshCw size={16} />
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Dismiss"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
