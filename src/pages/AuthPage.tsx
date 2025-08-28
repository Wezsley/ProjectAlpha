import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { LogIn, UserPlus, AtSign, Lock, Loader } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      }
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-midnight-950 flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8 bg-midnight-900/50 backdrop-blur-sm border border-neon-cyan/20 rounded-2xl shadow-2xl shadow-neon-cyan/10"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-100 tracking-wider">
            PROJECT <span className="text-neon-cyan">ALPHA</span>
          </h1>
          <p className="text-slate-400 mt-2">Wezs Company</p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="bg-midnight-800 p-1 rounded-lg flex space-x-1 border border-neon-cyan/20">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-6 py-2 rounded-md text-sm font-semibold transition-colors relative ${isLogin ? 'text-slate-100' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {isLogin && <motion.div layoutId="auth-bg" className="absolute inset-0 bg-neon-cyan/20 rounded-md" />}
              <span className="relative z-10">Login</span>
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-6 py-2 rounded-md text-sm font-semibold transition-colors relative ${!isLogin ? 'text-slate-100' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {!isLogin && <motion.div layoutId="auth-bg" className="absolute inset-0 bg-neon-cyan/20 rounded-md" />}
              <span className="relative z-10">Sign Up</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="relative">
            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 bg-midnight-800 border border-midnight-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan transition-all"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 bg-midnight-800 border border-midnight-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan transition-all"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-neon-orange text-sm text-center"
              >
                {error}
              </motion.p>
            )}
            {message && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-neon-green text-sm text-center"
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-4 bg-neon-cyan text-midnight-950 font-bold rounded-lg transition-all shadow-lg shadow-neon-cyan/20 hover:shadow-neon-cyan/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader className="animate-spin" />
            ) : isLogin ? (
              <>
                <LogIn className="mr-2" size={20} />
                Login
              </>
            ) : (
              <>
                <UserPlus className="mr-2" size={20} />
                Sign Up
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};
