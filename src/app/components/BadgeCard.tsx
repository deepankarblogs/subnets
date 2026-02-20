import React from 'react';
import { Lock } from 'lucide-react';
import { motion } from 'motion/react';
import type { Badge } from '../data/mockData';

interface BadgeCardProps {
  badge: Badge;
}

export function BadgeCard({ badge }: BadgeCardProps) {
  const isUnlocked = !!badge.unlockedAt;

  const rarityStyles = {
    common: 'border-[var(--text-tertiary)]',
    rare: 'border-[var(--tag-blue)]',
    epic: 'border-[var(--tag-purple)]',
    legendary: 'border-[var(--tag-orange)]',
  };

  const rarityGlow = {
    common: 'shadow-none',
    rare: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    epic: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
    legendary: 'shadow-[0_0_30px_rgba(251,146,60,0.4)]',
  };

  return (
    <motion.div
      whileHover={isUnlocked ? { y: -4 } : {}}
      className={`
        bg-[var(--bg-elevated)] rounded-[var(--radius-card)] p-5 border-2
        ${rarityStyles[badge.rarity]}
        ${isUnlocked ? rarityGlow[badge.rarity] : 'opacity-60'}
        transition-all relative overflow-hidden
      `}
    >
      {/* Shimmer effect for legendary */}
      {badge.rarity === 'legendary' && isUnlocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
      )}

      {/* Badge Icon */}
      <div className="text-center mb-4">
        <div className={`text-5xl mb-2 ${!isUnlocked && 'filter grayscale'}`}>
          {isUnlocked ? badge.icon : <Lock className="mx-auto text-[var(--text-tertiary)]" size={48} />}
        </div>
      </div>

      {/* Badge Info */}
      <div className="text-center">
        <h3 className="font-semibold text-[var(--text-primary)] mb-1">
          {badge.name}
        </h3>
        <p className="text-xs text-[var(--text-secondary)] mb-3">
          {badge.description}
        </p>

        {/* Rarity Tag */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span
            className={`
              text-xs font-medium px-3 py-1 rounded-full
              ${badge.rarity === 'common' && 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'}
              ${badge.rarity === 'rare' && 'bg-[var(--tag-blue-dim)] text-[var(--tag-blue)]'}
              ${badge.rarity === 'epic' && 'bg-[var(--tag-purple-dim)] text-[var(--tag-purple)]'}
              ${badge.rarity === 'legendary' && 'bg-[var(--tag-orange-dim)] text-[var(--tag-orange)]'}
            `}
          >
            {badge.rarity.toUpperCase()}
          </span>
        </div>

        {/* Progress Bar */}
        {badge.progress && (
          <div className="mb-2">
            <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] mb-1">
              <span>Progress</span>
              <span>
                {badge.progress.current}/{badge.progress.total}
              </span>
            </div>
            <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(badge.progress.current / badge.progress.total) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[var(--accent-red)] to-[var(--tag-orange)]"
              />
            </div>
          </div>
        )}

        {/* Unlock Date */}
        {isUnlocked && (
          <p className="text-xs text-[var(--text-tertiary)]">
            Unlocked {badge.unlockedAt}
          </p>
        )}
      </div>
    </motion.div>
  );
}
