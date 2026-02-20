import React from 'react';
import { Home, Search, PlusCircle, Bell, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';

interface BottomNavProps {
  notificationCount?: number;
}

export function BottomNav({ notificationCount = 0 }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: PlusCircle, label: 'Create', path: '/create' },
    { icon: Bell, label: 'Alerts', path: '/notifications', badge: notificationCount },
    { icon: Sparkles, label: 'For You', path: '/recommended' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--bg-elevated)] border-t border-[var(--border-medium)] px-2 pb-safe z-40">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center justify-center flex-1 h-full"
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[var(--accent-red)] rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              {/* Icon with badge */}
              <div className="relative">
                <Icon
                  size={24}
                  className={`transition-colors ${
                    isActive
                      ? 'text-[var(--accent-red)]'
                      : 'text-[var(--text-secondary)]'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.badge && item.badge > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--accent-red)] rounded-full flex items-center justify-center"
                  >
                    <span className="text-[10px] font-semibold text-white">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] mt-1 transition-colors ${
                  isActive
                    ? 'text-[var(--accent-red)] font-medium'
                    : 'text-[var(--text-tertiary)]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}