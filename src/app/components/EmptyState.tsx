import React from 'react';
import { Search, MessageCircle, Bell, Award, Tv, WifiOff } from 'lucide-react';

interface EmptyStateProps {
  type: 'posts' | 'comments' | 'notifications' | 'badges' | 'search' | 'offline';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  type,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const config = {
    posts: {
      icon: Tv,
      defaultTitle: 'No Posts Yet',
      defaultDescription: 'Be the first to share your theory!',
      defaultAction: 'Create Post',
    },
    comments: {
      icon: MessageCircle,
      defaultTitle: 'No Comments Yet',
      defaultDescription: 'Start the conversation!',
      defaultAction: 'Add Comment',
    },
    notifications: {
      icon: Bell,
      defaultTitle: 'All Caught Up!',
      defaultDescription: 'You have no new notifications',
      defaultAction: null,
    },
    badges: {
      icon: Award,
      defaultTitle: 'No Badges Unlocked',
      defaultDescription: 'Start participating to unlock badges',
      defaultAction: 'Explore',
    },
    search: {
      icon: Search,
      defaultTitle: 'No Results Found',
      defaultDescription: 'Try different keywords or check your spelling',
      defaultAction: 'Clear Search',
    },
    offline: {
      icon: WifiOff,
      defaultTitle: 'You\'re Offline',
      defaultDescription: 'Connect to the internet to see content',
      defaultAction: 'Retry',
    },
  };

  const { icon: Icon, defaultTitle, defaultDescription, defaultAction } = config[type];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mb-6">
        <Icon size={40} className="text-[var(--text-tertiary)]" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
        {title || defaultTitle}
      </h3>

      {/* Description */}
      <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-sm">
        {description || defaultDescription}
      </p>

      {/* Action Button */}
      {(actionLabel || defaultAction) && onAction && (
        <button
          onClick={onAction}
          className="bg-[var(--accent-red)] text-white px-6 py-3 rounded-[var(--radius-button)] font-medium hover:bg-[var(--accent-red-hover)] transition-colors"
        >
          {actionLabel || defaultAction}
        </button>
      )}
    </div>
  );
}
