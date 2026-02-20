import React, { useState } from 'react';
import { MoreVertical, Flag, EyeOff } from 'lucide-react';
import { TagPill } from './TagPill';
import { ReactionBar } from './ReactionBar';
import { SpoilerModal } from './SpoilerModal';
import type { Post } from '../data/mockData';

interface PostCardProps {
  post: Post;
  variant?: 'default' | 'loading' | 'error' | 'deleted';
  onClick?: () => void;
}

export function PostCard({ post, variant = 'default', onClick }: PostCardProps) {
  const [showSpoiler, setShowSpoiler] = useState(false);

  if (variant === 'loading') {
    return <PostCardSkeleton />;
  }

  if (variant === 'deleted' || post.isDeleted) {
    return (
      <div className="bg-[var(--bg-elevated)] rounded-[var(--radius-card)] p-5 border border-[var(--border-subtle)]">
        <div className="flex items-center gap-3 text-[var(--text-tertiary)]">
          <EyeOff size={20} />
          <p className="text-sm">This post has been removed by moderators</p>
        </div>
      </div>
    );
  }

  if (variant === 'error') {
    return (
      <div className="bg-[var(--bg-elevated)] rounded-[var(--radius-card)] p-5 border border-[var(--error)]">
        <div className="flex items-center gap-3 text-[var(--error)]">
          <Flag size={20} />
          <p className="text-sm">Failed to load post</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="bg-[var(--bg-elevated)] rounded-[var(--radius-card)] p-5 border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-all cursor-pointer shadow-[var(--shadow-card)]"
        onClick={onClick}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-[var(--text-primary)]">
                  {post.author.username}
                </span>
                {post.author.verified && (
                  <span className="text-[var(--accent-red)] text-xs">✓</span>
                )}
              </div>
              <p className="text-xs text-[var(--text-tertiary)]">
                {post.show} • {post.timestamp}
              </p>
            </div>
          </div>
          <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="mb-4">
          {post.hasSpoiler ? (
            <div
              className="bg-[var(--accent-red-dim)] border border-[var(--accent-red)] rounded-xl p-4 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setShowSpoiler(true);
              }}
            >
              <div className="flex items-center gap-2 text-[var(--accent-red)] mb-2">
                <EyeOff size={16} />
                <span className="text-sm font-medium">Spoiler Warning</span>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                Click to reveal spoiler content
              </p>
            </div>
          ) : (
            <p className="text-[var(--text-primary)] leading-relaxed">
              {post.content}
            </p>
          )}
        </div>

        {/* Image if exists */}
        {post.image && (
          <img
            src={post.image}
            alt="Post content"
            className="w-full rounded-xl mb-4 max-h-80 object-cover"
          />
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <TagPill key={index} text={tag.text} color={tag.color} />
          ))}
        </div>

        {/* Reactions */}
        <ReactionBar
          upvotes={post.reactions.upvotes}
          comments={post.reactions.comments}
          shares={post.reactions.shares}
        />
      </div>

      {/* Spoiler Modal */}
      {showSpoiler && (
        <SpoilerModal
          content={post.content}
          show={post.show}
          onClose={() => setShowSpoiler(false)}
        />
      )}
    </>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="bg-[var(--bg-elevated)] rounded-[var(--radius-card)] p-5 border border-[var(--border-subtle)] animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--bg-hover)]" />
          <div>
            <div className="h-4 w-24 bg-[var(--bg-hover)] rounded mb-2" />
            <div className="h-3 w-32 bg-[var(--bg-hover)] rounded" />
          </div>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-[var(--bg-hover)] rounded w-full" />
        <div className="h-4 bg-[var(--bg-hover)] rounded w-5/6" />
        <div className="h-4 bg-[var(--bg-hover)] rounded w-4/6" />
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-16 bg-[var(--bg-hover)] rounded-full" />
        <div className="h-6 w-20 bg-[var(--bg-hover)] rounded-full" />
      </div>
      <div className="flex gap-4">
        <div className="h-5 w-12 bg-[var(--bg-hover)] rounded" />
        <div className="h-5 w-12 bg-[var(--bg-hover)] rounded" />
        <div className="h-5 w-12 bg-[var(--bg-hover)] rounded" />
      </div>
    </div>
  );
}
