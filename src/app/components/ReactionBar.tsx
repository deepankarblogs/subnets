import React, { useState } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ReactionBarProps {
  upvotes: number;
  comments: number;
  shares: number;
  isUpvoted?: boolean;
  onUpvote?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  variant?: 'default' | 'compact';
}

export function ReactionBar({
  upvotes,
  comments,
  shares,
  isUpvoted = false,
  onUpvote,
  onComment,
  onShare,
  variant = 'default',
}: ReactionBarProps) {
  const [isLiked, setIsLiked] = useState(isUpvoted);
  const [likeCount, setLikeCount] = useState(upvotes);

  const handleUpvote = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    onUpvote?.();
  };

  const buttonClass = variant === 'compact'
    ? 'flex items-center gap-1 text-xs'
    : 'flex items-center gap-2';

  const iconSize = variant === 'compact' ? 16 : 20;

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleUpvote}
        className={`${buttonClass} transition-colors ${
          isLiked ? 'text-[var(--accent-red)]' : 'text-[var(--text-secondary)]'
        } hover:text-[var(--accent-red)]`}
      >
        <motion.div
          animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart
            size={iconSize}
            fill={isLiked ? 'var(--accent-red)' : 'none'}
            strokeWidth={2}
          />
        </motion.div>
        <span className={variant === 'compact' ? 'text-xs' : 'text-sm'}>
          {likeCount.toLocaleString()}
        </span>
      </button>

      <button
        onClick={onComment}
        className={`${buttonClass} text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors`}
      >
        <MessageCircle size={iconSize} strokeWidth={2} />
        <span className={variant === 'compact' ? 'text-xs' : 'text-sm'}>
          {comments.toLocaleString()}
        </span>
      </button>

      <button
        onClick={onShare}
        className={`${buttonClass} text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors`}
      >
        <Share2 size={iconSize} strokeWidth={2} />
        <span className={variant === 'compact' ? 'text-xs' : 'text-sm'}>
          {shares.toLocaleString()}
        </span>
      </button>
    </div>
  );
}
