import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { PostCard, PostCardSkeleton } from '../components/PostCard';
import { ErrorBanner } from '../components/ErrorBanner';
import { EmptyState } from '../components/EmptyState';
import { SessionExpiredModal } from '../components/SessionExpiredModal';
import { WelcomeBanner } from '../components/WelcomeBanner';
import { useAuth } from '../contexts/AuthContext';
import { getPosts } from '../utils/api';
import { toast } from '../components/ui/sonner';

type ViewState = 'normal' | 'loading' | 'error' | 'empty' | 'offline' | 'paginationError' | 'sessionExpired';

export function Home() {
  const navigate = useNavigate();
  const { accessToken, isAuthenticated } = useAuth();
  const [viewState, setViewState] = useState<ViewState>('loading');
  const [posts, setPosts] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showPaginationError, setShowPaginationError] = useState(false);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [showWelcome, setShowWelcome] = useState(() => {
    const dismissed = localStorage.getItem('subnets_welcome_dismissed');
    return !dismissed;
  });

  const handleDismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('subnets_welcome_dismissed', 'true');
  };

  useEffect(() => {
    loadPosts();

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      setViewState('normal');
      loadPosts();
    };
    const handleOffline = () => {
      setIsOnline(false);
      setViewState('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Save scroll position before unmount
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  async function loadPosts() {
    try {
      setViewState('loading');
      const data = await getPosts({ limit: 20, offset: 0 }, accessToken);
      setPosts(data.posts);
      setHasMore(data.hasMore);
      setOffset(20);
      setViewState(data.posts.length === 0 ? 'empty' : 'normal');
      
      // Restore scroll position
      if (scrollPosition > 0) {
        setTimeout(() => window.scrollTo(0, scrollPosition), 100);
      }
    } catch (error: any) {
      console.error('Error loading posts:', error);
      setViewState('error');
      toast.error('Failed to load posts');
    }
  }

  const handleRefresh = () => {
    setOffset(0);
    loadPosts();
  };

  async function handleLoadMore() {
    if (!hasMore) return;

    try {
      const data = await getPosts({ limit: 20, offset }, accessToken);
      setPosts([...posts, ...data.posts]);
      setHasMore(data.hasMore);
      setOffset(offset + 20);
    } catch (error) {
      console.error('Error loading more posts:', error);
      setShowPaginationError(true);
      setTimeout(() => setShowPaginationError(false), 3000);
    }
  }

  const handleRetry = () => {
    loadPosts();
  };

  const handleLogin = () => {
    setShowSessionExpired(false);
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-20">
      {/* Session Expired Modal */}
      <SessionExpiredModal
        isOpen={showSessionExpired}
        onLogin={handleLogin}
      />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--bg-primary)]/95 backdrop-blur-lg border-b border-[var(--border-subtle)]">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--accent-red)] to-[var(--tag-orange)] bg-clip-text text-transparent">
                SubNets
              </h1>
              <p className="text-xs text-[var(--text-tertiary)]">
                Share theories & discuss shows
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-red)] transition-colors"
              >
                <RefreshCw size={20} />
              </button>
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${accessToken}`}
                    alt="Profile"
                    className="w-6 h-6 rounded-full"
                  />
                </button>
              ) : (
                <button
                  onClick={() => navigate('/auth')}
                  className="px-3 py-1.5 bg-[var(--accent-red)] text-white rounded-lg text-sm font-medium hover:bg-[var(--accent-red-hover)] transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Welcome Banner */}
        {showWelcome && (
          <WelcomeBanner onDismiss={handleDismissWelcome} />
        )}

        {/* Offline Banner */}
        {!isOnline && (
          <ErrorBanner
            type="offline"
            onRetry={handleRetry}
            onDismiss={() => setIsOnline(true)}
          />
        )}

        {/* Pagination Error */}
        {showPaginationError && (
          <ErrorBanner
            type="paginationFailed"
            onRetry={handleLoadMore}
            onDismiss={() => setShowPaginationError(false)}
          />
        )}

        {/* Trending Section */}
        {viewState === 'normal' && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-[var(--accent-red)]" />
              <h2 className="font-semibold text-[var(--text-primary)]">
                Trending Theories
              </h2>
            </div>
            {/* Quick Access Card */}
            <button
              onClick={() => navigate('/badges')}
              className="w-full bg-gradient-to-r from-[var(--tag-purple)] to-[var(--tag-orange)] rounded-2xl p-4 mb-4 text-left group hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold mb-1">🏆 Your Badges</p>
                  <p className="text-white/80 text-xs">Track your achievements</p>
                </div>
                <div className="text-white/60 group-hover:text-white transition-colors">
                  →
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Loading State */}
        {viewState === 'loading' && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {viewState === 'error' && (
          <div className="space-y-4">
            <ErrorBanner
              type="error"
              message="Failed to load posts"
              onRetry={handleRetry}
            />
            <EmptyState
              type="posts"
              title="Something went wrong"
              description="We couldn't load the posts. Please try again."
              actionLabel="Retry"
              onAction={handleRetry}
            />
          </div>
        )}

        {/* Empty State */}
        {viewState === 'empty' && (
          <EmptyState
            type="posts"
            onAction={() => navigate('/create')}
          />
        )}

        {/* Offline State with Cached Posts */}
        {viewState === 'offline' && (
          <div className="space-y-4">
            <div className="bg-[var(--bg-secondary)] rounded-2xl p-4 border border-[var(--border-subtle)] mb-4">
              <p className="text-sm text-[var(--text-secondary)]">
                📱 Showing cached content. Some features are limited while offline.
              </p>
            </div>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => navigate(`/thread/${post.id}`)}
              />
            ))}
          </div>
        )}

        {/* Normal State */}
        {viewState === 'normal' && (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => navigate(`/thread/${post.id}`)}
              />
            ))}

            {/* Load More */}
            <button
              onClick={handleLoadMore}
              className="w-full py-3 text-[var(--text-secondary)] hover:text-[var(--accent-red)] transition-colors text-sm font-medium"
            >
              Load more posts
            </button>
          </div>
        )}
      </div>
    </div>
  );
}