import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/ui/sonner';
import { motion } from 'motion/react';

export function Auth() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        toast.success('Welcome back! 🎬');
      } else {
        if (!username.trim()) {
          toast.error('Username is required');
          setLoading(false);
          return;
        }
        await signUp(email, password, username);
        toast.success('Account created! Welcome to SubNets 🎉');
      }
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0C] to-[#121214] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-white">Sub</span>
            <span className="text-[#FF2B2B]">Nets</span>
          </h1>
          <p className="text-gray-400">Fan theories, memes, and reactions</p>
        </div>

        {/* Auth Form */}
        <div className="bg-[#1A1A1C] rounded-2xl p-6 border border-[#2A2A2C]">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-[#0B0B0C] rounded-xl p-1">
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                mode === 'signin'
                  ? 'bg-[#FF2B2B] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                mode === 'signup'
                  ? 'bg-[#FF2B2B] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#0B0B0C] border border-[#2A2A2C] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2B2B] transition-colors"
                  placeholder="theorymaster"
                  required={mode === 'signup'}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0B0B0C] border border-[#2A2A2C] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2B2B] transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0B0B0C] border border-[#2A2A2C] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2B2B] transition-colors"
                placeholder="••••••••"
                required
                minLength={6}
              />
              {mode === 'signup' && (
                <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF2B2B] text-white font-semibold py-3 rounded-lg hover:bg-[#E62525] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                <>{mode === 'signin' ? 'Sign In' : 'Create Account'}</>
              )}
            </button>
          </form>

          {mode === 'signin' && (
            <p className="text-center text-sm text-gray-400 mt-4">
              Demo account: <span className="text-gray-300">demo@subnets.com</span> / password
            </p>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
