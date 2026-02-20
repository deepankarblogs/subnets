import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SpoilerModalProps {
  content: string;
  show: string;
  onClose: () => void;
}

export function SpoilerModal({ content, show, onClose }: SpoilerModalProps) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-[var(--bg-elevated)] rounded-[var(--radius-card)] p-6 max-w-md w-full border border-[var(--accent-red)] shadow-[var(--shadow-elevated)]"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-red-dim)] flex items-center justify-center">
                <AlertTriangle size={20} className="text-[var(--accent-red)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">
                  Spoiler Alert
                </h3>
                <p className="text-sm text-[var(--text-tertiary)]">{show}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Warning */}
          <div className="bg-[var(--accent-red-dim)] border-l-4 border-[var(--accent-red)] p-4 rounded-lg mb-4">
            <p className="text-sm text-[var(--text-secondary)]">
              This content contains spoilers for {show}. Read at your own risk!
            </p>
          </div>

          {/* Content */}
          <div className="bg-[var(--bg-secondary)] rounded-xl p-4 mb-6">
            <p className="text-[var(--text-primary)] leading-relaxed">
              {content}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-[var(--accent-red)] text-white py-3 rounded-[var(--radius-button)] font-medium hover:bg-[var(--accent-red-hover)] transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
