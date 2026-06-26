import { useState } from 'react';
import { supabase } from '../config/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cozy-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Soft decorative background circles */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-cozy-soft/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-cozy-accent/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-cozy-card/90 backdrop-blur-xl rounded-3xl shadow-xl border border-cozy-soft/30 p-10 relative z-10 transition-all duration-500">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-black text-cozy-deep tracking-tight mb-2">Welcome Back.</h1>
          <p className="text-cozy-text/60">Sign in to manage your spaces.</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-cozy-deep uppercase tracking-wider pl-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-cozy-bg/50 border border-cozy-soft/50 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-cozy-accent focus:bg-white transition-all duration-300 placeholder-cozy-text/30"
              placeholder="you@domain.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-cozy-deep uppercase tracking-wider pl-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-cozy-bg/50 border border-cozy-soft/50 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-cozy-accent focus:bg-white transition-all duration-300 placeholder-cozy-text/30"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-cozy-deep text-white font-bold py-4 rounded-xl hover:bg-cozy-deep/90 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out disabled:opacity-50 mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-cozy-text/50">
            <a href="/" className="hover:text-cozy-deep transition-colors">← Return to Home</a>
          </p>
        </div>
      </div>
    </div>
  );
}
