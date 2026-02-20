import { useState } from 'react';
import { X, Database } from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from './ui/sonner';

export function WelcomeBanner({ onDismiss }: { onDismiss: () => void }) {
  const [isSeeding, setIsSeeding] = useState(false);

  async function handleSeed() {
    setIsSeeding(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-85349416/seed`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      
      if (data.success) {
        toast.success('Demo data loaded! You can now sign in with: demo@subnets.com / password');
        onDismiss();
        // Refresh the page to load the new data
        setTimeout(() => window.location.reload(), 2000);
      } else {
        toast.error(data.error || 'Failed to load demo data');
      }
    } catch (error) {
      console.error('Error seeding database:', error);
      toast.error('Failed to load demo data');
    } finally {
      setIsSeeding(false);
    }
  }

  return (
    <div className="bg-gradient-to-r from-[var(--tag-purple)] to-[var(--tag-orange)] rounded-2xl p-6 mb-6 border-2 border-[var(--accent-red)]/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20" />
      </div>

      {/* Content */}
      <div className="relative">
        <button
          onClick={onDismiss}
          className="absolute top-0 right-0 text-white/60 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Database size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">
              Welcome to SubNets! 🎬
            </h3>
            <p className="text-white/90 text-sm mb-4">
              To get started, load some demo posts and create your account. This will create sample TV show theories and a demo user account you can use.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleSeed}
                disabled={isSeeding}
                className="px-4 py-2 bg-white text-[var(--tag-purple)] font-semibold rounded-lg hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
              >
                {isSeeding ? 'Loading...' : 'Load Demo Data'}
              </button>
              <button
                onClick={onDismiss}
                className="px-4 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all text-sm"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
