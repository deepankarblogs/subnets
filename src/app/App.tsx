/**
 * SubNets - Mobile Social App for TV Show Fan Theories
 * 
 * SCREENS IMPLEMENTED:
 * - Home Feed (/) - Trending theories with all states
 * - Thread Discussion (/thread/:id) - Post details with comments
 * - Create Post (/create) - Form with upload progress
 * - Notifications (/notifications) - Activity feed with filters
 * - Badges (/badges) - Achievement system with progress
 * - Search (/search) - Search shows and theories
 * - Recommended (/recommended) - Personalized "For You" feed
 * - 404 Not Found - Error page
 * 
 * STATES HANDLED (PER SCREEN):
 * ✅ Normal - Default content view
 * ✅ Loading - Skeleton loaders
 * ✅ Empty - No content states
 * ✅ Error - Error banners with retry
 * ✅ Offline - Cached content fallback
 * ✅ Pagination Failed - Load more errors
 * ✅ Session Expired - Auth modal
 * ✅ Deleted Posts - Moderation removal
 * ✅ Upload Failed - Retry upload
 * ✅ Blocked Users - Access denied
 * ✅ API/Network Errors - Recovery UX
 * 
 * COMPONENT LIBRARY:
 * - PostCard (+ skeleton, deleted, error variants)
 * - CommentCard (with nested replies)
 * - ReactionBar (with like animation)
 * - NotificationCard (with pulse effect)
 * - BadgeCard (with rarity and shimmer)
 * - BottomNav (with active state animation)
 * - TagPill (purple/orange/blue colors)
 * - SpoilerModal (with warning)
 * - ErrorBanner (5 types with retry/dismiss)
 * - EmptyState (6 types with actions)
 * - UploadProgress (uploading/success/error)
 * - Breadcrumb (navigation trail)
 * - SessionExpiredModal (auth prompt)
 * 
 * INTERACTIONS:
 * - Like animation (scale bounce)
 * - Upload progress (gradient bar)
 * - Toast notifications (success/error)
 * - Notification pulse (unread indicator)
 * - Tab switching (layout animation)
 * - Spoiler reveal (modal animation)
 * - Scroll position restore
 * - Offline detection
 */

import { RouterProvider } from 'react-router';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';
import { router } from './routes';

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-medium)',
          },
        }}
      />
    </AuthProvider>
  );
}