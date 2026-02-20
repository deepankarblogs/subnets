import React from 'react';
import { LogIn, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SessionExpiredModalProps {
  isOpen: boolean;
  onLogin: () => void;
}

export function SessionExpiredModal({ isOpen, onLogin }: SessionExpiredModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-[var(--bg-elevated)] rounded-[var(--radius-card)] p-6 max-w-sm w-full border border-[var(--border-medium)] shadow-[var(--shadow-elevated)]"
          >
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-[var(--accent-red-dim)] flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-[var(--accent-red)]" />
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                Session Expired
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Your session has expired for security reasons. Please log in again to continue.
              </p>
            </div>

            {/* Action */}
            <button
              onClick={onLogin}
              className="w-full bg-[var(--accent-red)] text-white py-3 rounded-[var(--radius-button)] font-medium hover:bg-[var(--accent-red-hover)] transition-colors flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              Log In Again
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
