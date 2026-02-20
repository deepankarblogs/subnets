import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search as SearchIcon, TrendingUp, X } from 'lucide-react';
import { PostCard, PostCardSkeleton } from '../components/PostCard';
import { TagPill } from '../components/TagPill';
import { EmptyState } from '../components/EmptyState';
import { ErrorBanner } from '../components/ErrorBanner';
import { useAuth } from '../contexts/AuthContext';
import { search as searchAPI } from '../utils/api';

export function Search() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState<string | null>(null);

  const trendingSearches = [
    { text: 'Stranger Things', color: 'purple' as const },
    { text: 'Breaking Bad', color: 'orange' as const },
    { text: 'The Last of Us', color: 'blue' as const },
    { text: 'Wednesday', color: 'purple' as const },
  ];

  async function handleSearch(query: string) {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    setError(null);

    try {
      const data = await searchAPI(query, 'posts', accessToken);
      setResults(data.posts);
    } catch (error: any) {
      console.error('Search error:', error);
      setError('Failed to search');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  const handleClearSearch = () => {
    setSearchQuery('');
    setHasSearched(false);
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--bg-primary)]/95 backdrop-blur-lg border-b border-[var(--border-subtle)]">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            Search
          </h1>

          {/* Search Input */}
          <div className="relative">
            <SearchIcon
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
            />
            <input
              type="text"
              placeholder="Search shows, theories, users..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-[var(--bg-elevated)] rounded-[var(--radius-button)] pl-12 pr-12 py-3.5 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] border border-[var(--border-subtle)] focus:border-[var(--accent-red)] outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X size={20} />
              </button>
            )}
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

        {/* Trending Searches */}
        {!hasSearched && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-[var(--accent-red)]" />
              <h2 className="font-semibold text-[var(--text-primary)]">
                Trending Searches
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search.text)}
                  className="transition-transform hover:scale-105"
                >
                  <TagPill text={search.text} color={search.color} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isSearching && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Search Results */}
        {!isSearching && hasSearched && (
          <>
            {results.length === 0 ? (
              <EmptyState
                type="search"
                onAction={handleClearSearch}
              />
            ) : (
              <div>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Found {results.length} result{results.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
                <div className="space-y-4">
                  {results.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onClick={() => navigate(`/thread/${post.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Recent Searches (Placeholder) */}
        {!hasSearched && (
          <div className="mt-8">
            <h2 className="font-semibold text-[var(--text-primary)] mb-4">
              Recent Searches
            </h2>
            <div className="space-y-3">
              {['Breaking Bad theories', 'Wednesday dance', 'Stranger Things S4'].map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="w-full text-left px-4 py-3 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <SearchIcon size={16} className="text-[var(--text-tertiary)]" />
                    <span className="text-sm text-[var(--text-primary)]">{search}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}