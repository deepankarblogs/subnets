import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Image, EyeOff, X } from 'lucide-react';
import { TagPill } from '../components/TagPill';
import { UploadProgress } from '../components/UploadProgress';
import { ErrorBanner } from '../components/ErrorBanner';
import { useAuth } from '../contexts/AuthContext';
import { createPost } from '../utils/api';
import { toast } from '../components/ui/sonner';

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

export function CreatePost() {
  const navigate = useNavigate();
  const { accessToken, isAuthenticated } = useAuth();
  const [content, setContent] = useState('');
  const [show, setShow] = useState('');
  const [hasSpoiler, setHasSpoiler] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Array<{ text: string; color: 'purple' | 'orange' | 'blue' }>>([]);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }

  const availableTags = [
    { text: 'Theory', color: 'purple' as const },
    { text: 'Spoiler', color: 'orange' as const },
    { text: 'Discussion', color: 'blue' as const },
    { text: 'Season Finale', color: 'orange' as const },
    { text: 'Rewatch', color: 'purple' as const },
    { text: 'Meme', color: 'blue' as const },
  ];

  const toggleTag = (tag: typeof availableTags[0]) => {
    if (selectedTags.find(t => t.text === tag.text)) {
      setSelectedTags(selectedTags.filter(t => t.text !== tag.text));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handlePost = async () => {
    if (!content.trim() || !show.trim()) {
      setError('Please fill in all required fields');
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (!accessToken) {
      navigate('/auth');
      return;
    }

    // Start upload
    setUploadState('uploading');
    setError(null);

    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      await createPost(
        {
          show,
          content,
          hasSpoiler,
          tags: selectedTags,
        },
        accessToken
      );

      setUploadProgress(100);
      clearInterval(interval);
      setUploadState('success');
      toast.success('Post created successfully! 🎬');
      
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error: any) {
      clearInterval(interval);
      setUploadState('error');
      setError(error.message || 'Failed to post. Please try again.');
      toast.error('Failed to create post');
      console.error('Error creating post:', error);
    }
  };

  const handleRetryUpload = () => {
    setUploadProgress(0);
    handlePost();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--bg-primary)]/95 backdrop-blur-lg border-b border-[var(--border-subtle)]">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="text-[var(--text-secondary)] hover:text-[var(--accent-red)] transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="font-semibold text-[var(--text-primary)]">
                Create Post
              </h1>
            </div>
            <button
              onClick={handlePost}
              disabled={uploadState === 'uploading' || !content.trim() || !show.trim()}
              className="px-4 py-2 bg-[var(--accent-red)] text-white rounded-[var(--radius-button)] font-medium hover:bg-[var(--accent-red-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {uploadState === 'uploading' ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Error Banner */}
        {error && (
          <ErrorBanner
            type={uploadState === 'error' ? 'uploadFailed' : 'error'}
            message={error}
            onDismiss={() => setError(null)}
            onRetry={uploadState === 'error' ? handleRetryUpload : undefined}
          />
        )}

        {/* Upload Progress */}
        {uploadState !== 'idle' && (
          <div className="mb-4">
            <UploadProgress
              status={uploadState}
              progress={uploadProgress}
              fileName="Your post"
              onRetry={handleRetryUpload}
            />
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* Show Name */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              TV Show / Series <span className="text-[var(--accent-red)]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Stranger Things"
              value={show}
              onChange={(e) => setShow(e.target.value)}
              className="w-full bg-[var(--bg-elevated)] rounded-[var(--radius-button)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] border border-[var(--border-subtle)] focus:border-[var(--accent-red)] outline-none transition-colors"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Your Theory / Discussion <span className="text-[var(--accent-red)]">*</span>
            </label>
            <textarea
              placeholder="Share your thoughts, theories, or reactions..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full bg-[var(--bg-elevated)] rounded-[var(--radius-button)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] border border-[var(--border-subtle)] focus:border-[var(--accent-red)] outline-none transition-colors resize-none"
            />
            <p className="text-xs text-[var(--text-tertiary)] mt-2">
              {content.length} / 500 characters
            </p>
          </div>

          {/* Spoiler Toggle */}
          <div className="bg-[var(--bg-elevated)] rounded-[var(--radius-card)] p-4 border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--accent-red-dim)] flex items-center justify-center">
                  <EyeOff size={20} className="text-[var(--accent-red)]" />
                </div>
                <div>
                  <p className="font-medium text-[var(--text-primary)] text-sm">
                    Contains Spoilers
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    Hide content behind spoiler warning
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasSpoiler}
                  onChange={(e) => setHasSpoiler(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[var(--bg-secondary)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--accent-red)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-red)]" />
              </label>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.find(t => t.text === tag.text);
                return (
                  <button
                    key={tag.text}
                    onClick={() => toggleTag(tag)}
                    className="transition-transform hover:scale-105"
                  >
                    <TagPill
                      text={tag.text}
                      color={tag.color}
                      variant={isSelected ? 'default' : 'outline'}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image Upload (Placeholder) */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
              Add Image (Optional)
            </label>
            <button className="w-full bg-[var(--bg-elevated)] rounded-[var(--radius-button)] px-4 py-8 border-2 border-dashed border-[var(--border-medium)] hover:border-[var(--accent-red)] transition-colors group">
              <div className="flex flex-col items-center gap-2">
                <Image size={32} className="text-[var(--text-tertiary)] group-hover:text-[var(--accent-red)] transition-colors" />
                <p className="text-sm text-[var(--text-secondary)]">
                  Click to upload image
                </p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  PNG, JPG up to 10MB
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}