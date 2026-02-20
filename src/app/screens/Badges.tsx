import React, { useState } from 'react';
import { Trophy, Lock } from 'lucide-react';
import { BadgeCard } from '../components/BadgeCard';
import { EmptyState } from '../components/EmptyState';
import { mockBadges } from '../data/mockData';
import { motion } from 'motion/react';

type FilterType = 'all' | 'unlocked' | 'locked';

export function Badges() {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredBadges = mockBadges.filter(badge => {
    if (filter === 'unlocked') return !!badge.unlockedAt;
    if (filter === 'locked') return !badge.unlockedAt;
    return true;
  });

  const unlockedCount = mockBadges.filter(b => b.unlockedAt).length;
  const totalBadges = mockBadges.length;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--bg-primary)]/95 backdrop-blur-lg border-b border-[var(--border-subtle)]">
        <div className="max-w-lg mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-red)] to-[var(--tag-orange)] mb-4">
              <Trophy size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
              Your Badges
            </h1>
            <p className="text-[var(--text-secondary)]">
              {unlockedCount} of {totalBadges} unlocked
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(unlockedCount / totalBadges) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[var(--accent-red)] via-[var(--tag-purple)] to-[var(--tag-orange)]"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            {(['all', 'unlocked', 'locked'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`
                  flex-1 px-4 py-2 rounded-[var(--radius-pill)] text-sm font-medium transition-colors
                  ${filter === f
                    ? 'bg-[var(--accent-red)] text-white'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }
                `}
              >
                {f === 'all' && `All (${totalBadges})`}
                {f === 'unlocked' && `Unlocked (${unlockedCount})`}
                {f === 'locked' && `Locked (${totalBadges - unlockedCount})`}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        {filteredBadges.length === 0 ? (
          <EmptyState
            type="badges"
            title={filter === 'unlocked' ? 'No badges unlocked yet' : 'No badges to show'}
            description="Keep participating to unlock amazing badges!"
          />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <BadgeCard badge={badge} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
