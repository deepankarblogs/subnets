import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Send, Ban } from 'lucide-react';
import { PostCard } from '../components/PostCard';
import { CommentCard } from '../components/CommentCard';
import { EmptyState } from '../components/EmptyState';
import { ErrorBanner } from '../components/ErrorBanner';
import { Breadcrumb } from '../components/Breadcrumb';
import { useAuth } from '../contexts/AuthContext';
import { getPost, getComments, createComment } from '../utils/api';
import { toast } from '../components/ui/sonner';

export function Thread() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    loadPostAndComments();
  }, [id]);

  async function loadPostAndComments() {
    try {
      setLoading(true);
      const [postData, commentsData] = await Promise.all([
        getPost(id!, accessToken),
        getComments(id!, accessToken),
      ]);
      
      setPost(postData);
      setComments(commentsData.comments);
    } catch (error: any) {
      console.error('Error loading thread:', error);
      setError(error.message || 'Failed to load thread');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] pb-20">
        <div className="max-w-lg mx-auto px-4 py-6">
          <p className="text-[var(--text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!post || error) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] pb-20">
        <div className="max-w-lg mx-auto px-4 py-6">
          <ErrorBanner
            type="error"
            message={error || "Post not found or has been deleted"}
            onRetry={() => navigate('/')}
          />
          <EmptyState
            type="posts"
            title="Post Not Found"
            description="This post may have been deleted or doesn't exist"
            actionLabel="Back to Feed"
            onAction={() => navigate('/')}
          />
        </div>
      </div>
    );
  }

  if (isBlocked) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] pb-20">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[var(--bg-primary)]/95 backdrop-blur-lg border-b border-[var(--border-subtle)]">
          <div className="max-w-lg mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="text-[var(--text-secondary)] hover:text-[var(--accent-red)] transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex-1">
                <h1 className="font-semibold text-[var(--text-primary)]">
                  Content Unavailable
                </h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-lg mx-auto px-4 py-16">
          <div className="bg-[var(--bg-elevated)] rounded-[var(--radius-card)] p-8 border border-[var(--border-subtle)] text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mx-auto mb-4">
              <Ban size={32} className="text-[var(--text-tertiary)]" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              User Blocked
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              You've blocked this user. You cannot view their content.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-[var(--accent-red)] text-white px-6 py-3 rounded-[var(--radius-button)] font-medium hover:bg-[var(--accent-red-hover)] transition-colors"
            >
              Back to Feed
            </button>
          </div>
        </div>
      </div>
    );
  }

  async function handleSubmitComment() {
    if (!commentText.trim()) return;

    if (!accessToken) {
      navigate('/auth');
      return;
    }

    try {
      const newComment = await createComment(
        id!,
        { content: commentText },
        accessToken
      );
      
      setComments([newComment, ...comments]);
      setCommentText('');
      toast.success('Comment posted! 💬');
    } catch (error: any) {
      console.error('Error posting comment:', error);
      setError('Failed to post comment');
      setTimeout(() => setError(null), 3000);
      toast.error('Failed to post comment');
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-20">
      {/* Header with Breadcrumb */}
      <header className="sticky top-0 z-30 bg-[var(--bg-primary)]/95 backdrop-blur-lg border-b border-[var(--border-subtle)]">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate('/')}
              className="text-[var(--text-secondary)] hover:text-[var(--accent-red)] transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="font-semibold text-[var(--text-primary)]">
                Discussion
              </h1>
              <p className="text-xs text-[var(--text-tertiary)]">{post.show}</p>
            </div>
          </div>
          <Breadcrumb
            items={[
              { label: 'Feed', path: '/' },
              { label: post.show, path: '/search' },
              { label: 'Thread' },
            ]}
          />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Error Banner */}
        {error && (
          <ErrorBanner
            type="error"
            message={error}
            onDismiss={() => setError(null)}
          />
        )}

        {/* Original Post */}
        <div className="mb-6">
          <PostCard post={post} />
        </div>

        {/* Comments Section */}
        <div className="mb-24">
          <h2 className="font-semibold text-[var(--text-primary)] mb-4">
            Comments ({comments.length})
          </h2>

          {comments.length === 0 ? (
            <EmptyState
              type="comments"
              onAction={() => {
                // Focus on comment input
                document.getElementById('comment-input')?.focus();
              }}
            />
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comment Input (Fixed Bottom) */}
      <div className="fixed bottom-16 left-0 right-0 bg-[var(--bg-elevated)] border-t border-[var(--border-medium)] p-4 z-20">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=You"
            alt="Your avatar"
            className="w-8 h-8 rounded-full flex-shrink-0"
          />
          <input
            id="comment-input"
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
            className="flex-1 bg-[var(--bg-secondary)] rounded-[var(--radius-button)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] border border-[var(--border-subtle)] focus:border-[var(--accent-red)] outline-none transition-colors"
          />
          <button
            onClick={handleSubmitComment}
            disabled={!commentText.trim()}
            className="p-2.5 bg-[var(--accent-red)] rounded-[var(--radius-button)] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--accent-red-hover)] transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}