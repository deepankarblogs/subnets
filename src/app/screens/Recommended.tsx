import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Sparkles, RefreshCw } from 'lucide-react';
import { PostCard, PostCardSkeleton } from '../components/PostCard';
import { TagPill } from '../components/TagPill';
import { EmptyState } from '../components/EmptyState';
import { ErrorBanner } from '../components/ErrorBanner';
import { mockPosts } from '../data/mockData';
import { motion } from 'motion/react';

export function Recommended() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState(mockPosts);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Shuffle posts for demo
      setPosts([...posts].sort(() => Math.random() - 0.5));
      setIsLoading(false);
    }, 1000);
  };

  const recommendedShows = [
    { name: 'Stranger Things', count: 234 },
    { name: 'Breaking Bad', count: 189 },
    { name: 'The Last of Us', count: 167 },
    { name: 'Wednesday', count: 145 },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--bg-primary)]/95 backdrop-blur-lg border-b border-[var(--border-subtle)]">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={24} className="text-[var(--accent-red)]" />
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                  For You
                </h1>
              </div>
              <p className="text-sm text-[var(--text-tertiary)]">
                Personalized recommendations
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-red)] transition-colors disabled:opacity-50"
            >
              <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
            </button>
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

        {/* Recommended Shows */}
        <div className="mb-6">
          <h2 className="font-semibold text-[var(--text-primary)] mb-4">
            Trending Shows
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {recommendedShows.map((show, index) => (
              <motion.button
                key={show.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate('/search')}
                className="bg-[var(--bg-elevated)] rounded-2xl p-4 border border-[var(--border-subtle)] hover:border-[var(--accent-red)] transition-all text-left group"
              >
                <p className="font-medium text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-red)] transition-colors">
                  {show.name}
                </p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  {show.count} active theories
                </p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Recommended Posts */}
        <div>
          <h2 className="font-semibold text-[var(--text-primary)] mb-4">
            Based on Your Interests
          </h2>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PostCard
                    post={post}
                    onClick={() => navigate(`/thread/${post.id}`)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Personalization Notice */}
        <div className="mt-8 bg-[var(--bg-elevated)] rounded-2xl p-4 border border-[var(--border-subtle)]">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--accent-red-dim)] flex items-center justify-center flex-shrink-0">
              <Sparkles size={16} className="text-[var(--accent-red)]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
                Personalized Just for You
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                We recommend content based on your viewing history, interactions, and the shows you follow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
