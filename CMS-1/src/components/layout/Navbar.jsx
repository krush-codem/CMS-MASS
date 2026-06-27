import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { supabase } from '../../config/supabaseClient';

export default function Navbar() {
  const { user, isAdmin } = useAdminAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="sticky top-0 z-50 bg-base border-b border-border-dark shadow-sm">
      <div className="max-w-7xl mx-auto px-[24px] md:px-[32px]">
        <div className="flex justify-between items-center h-[72px]">
          
          <Link to="/" className="text-[20px] font-display font-bold text-black-forest tracking-tight flex items-center gap-[12px]">
            <div className="w-[36px] h-[36px] rounded-[6px] bg-copperwood flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            PRODUCTIVE FOR TOMORROW
          </Link>

          <div className="hidden md:flex gap-[32px] items-center flex-1 ml-[64px]">
            <Link to="/articles" className="text-[15px] font-semibold text-olive-leaf hover:text-black-forest transition-colors">Articles</Link>
            <Link to="/categories" className="text-[15px] font-semibold text-olive-leaf hover:text-black-forest transition-colors">Categories</Link>
            <Link to="/resources" className="text-[15px] font-semibold text-olive-leaf hover:text-black-forest transition-colors">Resources</Link>
          </div>

          <div className="hidden md:flex gap-[16px] items-center">
            {isAdmin && <Link to="/admin/dashboard" className="text-[15px] font-semibold text-olive-leaf hover:text-black-forest transition-colors mr-4">Admin Portal</Link>}
            
            {user ? (
              <button onClick={handleLogout} className="btn-secondary">
                Log Out
              </button>
            ) : (
              <Link to="/login" className="btn-primary">
                Log in
              </Link>
            )}
          </div>

          <div className="flex md:hidden items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-black-forest">
              {isMobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border-dark bg-base px-[24px] py-[16px] space-y-[16px]">
          <Link to="/articles" onClick={() => setIsMobileMenuOpen(false)} className="block text-[16px] font-semibold text-olive-leaf hover:text-black-forest transition-colors">Articles</Link>
          <Link to="/categories" onClick={() => setIsMobileMenuOpen(false)} className="block text-[16px] font-semibold text-olive-leaf hover:text-black-forest transition-colors">Categories</Link>
          <Link to="/resources" onClick={() => setIsMobileMenuOpen(false)} className="block text-[16px] font-semibold text-olive-leaf hover:text-black-forest transition-colors">Resources</Link>
          
          <div className="pt-[16px] border-t border-border-light flex flex-col gap-[12px]">
            {isAdmin && <Link to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block text-[16px] font-semibold text-olive-leaf hover:text-black-forest transition-colors">Admin Portal</Link>}
            {user ? (
              <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="btn-secondary w-full text-center">
                Log Out
              </button>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary w-full text-center block">
                Log in
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
