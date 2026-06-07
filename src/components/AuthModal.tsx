import React, { useState } from 'react';
import { Mail, Lock, X, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User, token: string) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGuestBypass = () => {
    setError('');
    const demoUser: User = {
      id: 'guest-sandbox',
      email: 'guest@nexidea.co',
      createdAt: new Date().toISOString()
    };
    onAuthSuccess(demoUser, 'guest-token');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase connection details are missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your applet Environment Secrets.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;

        if (data.user) {
          const authenticatedUser: User = {
            id: data.user.id,
            email: data.user.email || '',
            createdAt: data.user.created_at || new Date().toISOString()
          };
          onAuthSuccess(authenticatedUser, data.session?.access_token || data.user.id);
          onClose();
        }
      } else {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        if (data.user) {
          const authenticatedUser: User = {
            id: data.user.id,
            email: data.user.email || '',
            createdAt: data.user.created_at || new Date().toISOString()
          };
          
          if (!data.session) {
            // Under some Supabase flow, email confirmation check might prevent immediate session
            setError('Account created successfully! Please check your email inbox to confirm your account subscription.');
            setLoading(false);
            return;
          }

          onAuthSuccess(authenticatedUser, data.session.access_token || data.user.id);
          onClose();
        }
      }
    } catch (err: any) {
      console.error("Supabase auth error:", err);
      setError(err.message || 'Authentication failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop background blur */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Auth Card Frame with slide/fade entrance */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm overflow-hidden rounded-xl border border-neutral-900 bg-[#0a0a0a] p-6 sm:p-8 shadow-2xl z-10"
      >
        {/* Glow corner effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,rgba(255,107,0,0.1),transparent_70%)] pointer-events-none"></div>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-500 hover:text-white hover:bg-neutral-900 p-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <X size={15} />
        </button>

        {/* Modal headers styling */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[#666] font-bold mb-1.5">
            <ShieldCheck size={11} className="text-brand-orange" />
            <span>Encrypted Secure Protocol</span>
          </div>
          <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white">
            {isLogin ? 'Enter Workspace' : 'Register Founder Token'}
          </h2>
          <p className="mt-1 text-xs text-neutral-400 font-sans leading-relaxed">
            {isLogin 
              ? 'Provide credentials to verify your secured cloud records.' 
              : 'Sign up to persistently save, query, and share your assessments.'
            }
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-950/20 border border-red-900/30 p-3 text-xs text-red-400 font-sans leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5 font-bold">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-neutral-600">
                <Mail size={14} />
              </span>
              <input
                type="email"
                required
                placeholder="founder@nexidea.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-[#0d0d0d] py-2.5 pl-9 pr-4 text-xs text-white placeholder-neutral-700 transition-all focus:border-brand-orange/50 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5 font-bold">
              Secure Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-neutral-600">
                <Lock size={14} />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-[#0d0d0d] py-2.5 pl-9 pr-4 text-xs text-white placeholder-neutral-700 transition-all focus:border-brand-orange/50 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-orange hover:bg-brand-orange/95 py-3 text-xs sm:text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="animate-spin text-white" size={14} />
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight size={13} />
              </>
            )}
          </button>

          <div className="flex items-center my-3.5 text-neutral-600 uppercase font-mono text-[9px] tracking-widest select-none">
            <div className="flex-1 h-[1px] bg-neutral-900"></div>
            <span className="px-2">or sandbox test drive</span>
            <div className="flex-1 h-[1px] bg-neutral-900"></div>
          </div>

          <button
            type="button"
            onClick={handleGuestBypass}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-neutral-800 bg-[#0c0c0c] hover:bg-[#121212] py-2.5 text-xs text-neutral-300 font-semibold transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>Instant Demo Guest Access</span>
            <ArrowRight size={12} className="text-brand-orange" />
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-neutral-500 font-sans pt-4 border-t border-neutral-900">
          <span>{isLogin ? "No persistent ID?" : "Recognized credentials?"}</span>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="ml-1 font-semibold text-brand-orange hover:underline focus:outline-none cursor-pointer"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
