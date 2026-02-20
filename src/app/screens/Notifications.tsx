import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { CheckCheck, Filter } from 'lucide-react';
import { NotificationCard } from '../components/NotificationCard';
import { EmptyState } from '../components/EmptyState';
import { ErrorBanner } from '../components/ErrorBanner';
import { mockNotifications } from '../data/mockData';
import { motion } from 'motion/react';

type FilterType = 'all' | 'unread' | 'mentions';

export function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<FilterType>('all');
  const [error, setError] = useState<string | null>(null);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    // Mark as read
    setNotifications(notifications.map(n =>
      n.id === notification.id ? { ...n, read: true } : n
    ));

    // Navigate to post if applicable
    if (notification.postId) {
      navigate(`/thread/${notification.postId}`);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'mentions') return n.type === 'mention';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--bg-primary)]/95 backdrop-blur-lg border-b border-[var(--border-subtle)]">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <p className="text-sm text-[var(--text-tertiary)]">
                  {unreadCount} unread
                </p>
              )}
            </div>
            <button
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--accent-red)] hover:bg-[var(--accent-red-dim)] rounded-[var(--radius-button)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCheck size={16} />
              Mark all read
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            {(['all', 'unread', 'mentions'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`
                  px-4 py-2 rounded-[var(--radius-pill)] text-sm font-medium transition-colors
                  ${filter === f
                    ? 'bg-[var(--accent-red)] text-white'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }
                `}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        {error && (
          <ErrorBanner
            type="error"
            message={error}
            onDismiss={() => setError(null)}
          />
        )}

        {filteredNotifications.length === 0 ? (
          <EmptyState
            type="notifications"
            title={filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
            description={
              filter === 'unread'
                ? 'You have no unread notifications'
                : 'Start engaging with the community to get notifications'
            }
            actionLabel="Explore Posts"
            onAction={() => navigate('/')}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <NotificationCard
                  notification={notification}
                  onClick={() => handleNotificationClick(notification)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
