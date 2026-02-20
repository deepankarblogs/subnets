import React from 'react';
import { Heart, MessageCircle, AtSign, Award, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import type { Notification } from '../data/mockData';

interface NotificationCardProps {
  notification: Notification;
  onClick?: () => void;
}

export function NotificationCard({ notification, onClick }: NotificationCardProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'upvote':
        return <Heart size={20} className="text-[var(--accent-red)]" fill="var(--accent-red)" />;
      case 'comment':
        return <MessageCircle size={20} className="text-[var(--tag-blue)]" />;
      case 'mention':
        return <AtSign size={20} className="text-[var(--tag-purple)]" />;
      case 'badge':
        return <Award size={20} className="text-[var(--tag-orange)]" />;
      case 'moderation':
        return <AlertCircle size={20} className="text-[var(--error)]" />;
    }
  };

  const getIconBg = () => {
    switch (notification.type) {
      case 'upvote':
        return 'bg-[var(--accent-red-dim)]';
      case 'comment':
        return 'bg-[var(--tag-blue-dim)]';
      case 'mention':
        return 'bg-[var(--tag-purple-dim)]';
      case 'badge':
        return 'bg-[var(--tag-orange-dim)]';
      case 'moderation':
        return 'bg-[rgba(239,68,68,0.1)]';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`
        bg-[var(--bg-elevated)] rounded-2xl p-4 border cursor-pointer
        ${notification.read ? 'border-[var(--border-subtle)]' : 'border-[var(--accent-red)] bg-[var(--accent-red-dim)]'}
        hover:border-[var(--border-medium)] transition-all
      `}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-full ${getIconBg()} flex items-center justify-center flex-shrink-0`}>
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            {notification.user && (
              <img
                src={notification.user.avatar}
                alt={notification.user.username}
                className="w-6 h-6 rounded-full flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <p className="text-sm text-[var(--text-primary)]">
                {notification.user && (
                  <span className="font-medium">{notification.user.username} </span>
                )}
                {notification.content}
              </p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">
                {notification.timestamp}
              </p>
            </div>
          </div>
        </div>

        {/* Unread indicator */}
        {!notification.read && (
          <div className="w-2 h-2 bg-[var(--accent-red)] rounded-full flex-shrink-0 mt-2" />
        )}
      </div>
    </motion.div>
  );
}
