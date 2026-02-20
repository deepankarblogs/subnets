import { useNavigate } from 'react-router';
import { ArrowLeft, User, LogOut, Settings, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/ui/sonner';

export function Profile() {
  const navigate = useNavigate();
  const { user, signOut, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }

  async function handleSignOut() {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  }

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
            <h1 className="font-semibold text-[var(--text-primary)]">
              Profile
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* User Info Card */}
        <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 border border-[var(--border-subtle)] mb-6">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
              alt={user?.username}
              className="w-20 h-20 rounded-full border-2 border-[var(--accent-red)]"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  {user?.username}
                </h2>
                {user?.verified && (
                  <div className="w-5 h-5 rounded-full bg-[var(--accent-red)] flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-sm text-[var(--text-tertiary)]">
                {user?.email}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[var(--border-subtle)]">
            <div className="text-center">
              <p className="text-lg font-bold text-[var(--text-primary)]">0</p>
              <p className="text-xs text-[var(--text-tertiary)]">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[var(--text-primary)]">0</p>
              <p className="text-xs text-[var(--text-tertiary)]">Comments</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[var(--text-primary)]">0</p>
              <p className="text-xs text-[var(--text-tertiary)]">Upvotes</p>
            </div>
          </div>
        </div>

        {/* Settings Menu */}
        <div className="space-y-2">
          <button
            onClick={() => toast.info('Edit profile coming soon!')}
            className="w-full bg-[var(--bg-elevated)] rounded-2xl p-4 border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
                <User size={20} className="text-[var(--text-secondary)]" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-[var(--text-primary)]">Edit Profile</p>
                <p className="text-xs text-[var(--text-tertiary)]">Update your profile information</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => toast.info('Settings coming soon!')}
            className="w-full bg-[var(--bg-elevated)] rounded-2xl p-4 border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
                <Settings size={20} className="text-[var(--text-secondary)]" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-[var(--text-primary)]">Settings</p>
                <p className="text-xs text-[var(--text-tertiary)]">Preferences and notifications</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => toast.info('Privacy settings coming soon!')}
            className="w-full bg-[var(--bg-elevated)] rounded-2xl p-4 border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
                <Shield size={20} className="text-[var(--text-secondary)]" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-[var(--text-primary)]">Privacy & Security</p>
                <p className="text-xs text-[var(--text-tertiary)]">Manage your privacy settings</p>
              </div>
            </div>
          </button>

          <button
            onClick={handleSignOut}
            className="w-full bg-[var(--bg-elevated)] rounded-2xl p-4 border border-[var(--border-subtle)] hover:border-[var(--accent-red)] hover:bg-[var(--accent-red)]/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-red)]/10 flex items-center justify-center">
                <LogOut size={20} className="text-[var(--accent-red)]" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-[var(--accent-red)]">Sign Out</p>
                <p className="text-xs text-[var(--text-tertiary)]">Log out of your account</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
