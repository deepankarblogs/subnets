import React, { useState } from 'react';
import { Heart, MoreVertical } from 'lucide-react';
import { motion } from 'motion/react';
import type { Comment } from '../data/mockData';

interface CommentCardProps {
  comment: Comment;
  depth?: number;
}

export function CommentCard({ comment, depth = 0 }: CommentCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.reactions.upvotes);

  const handleUpvote = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div className={`${depth > 0 ? 'ml-12' : ''}`}>
      <div className="bg-[var(--bg-secondary)] rounded-2xl p-4 border border-[var(--border-subtle)]">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <img
              src={comment.author.avatar}
              alt={comment.author.username}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-[var(--text-primary)]">
                  {comment.author.username}
                </span>
                {comment.author.verified && (
                  <span className="text-[var(--accent-red)] text-xs">✓</span>
                )}
              </div>
              <p className="text-xs text-[var(--text-tertiary)]">
                {comment.timestamp}
              </p>
            </div>
          </div>
          <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>

        {/* Content */}
        <p className="text-sm text-[var(--text-primary)] leading-relaxed mb-3">
          {comment.content}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              isLiked
                ? 'text-[var(--accent-red)]'
                : 'text-[var(--text-secondary)]'
            } hover:text-[var(--accent-red)]`}
          >
            <motion.div
              animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart
                size={14}
                fill={isLiked ? 'var(--accent-red)' : 'none'}
                strokeWidth={2}
              />
            </motion.div>
            <span>{likeCount.toLocaleString()}</span>
          </button>
          <button className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            Reply
          </button>
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentCard key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
