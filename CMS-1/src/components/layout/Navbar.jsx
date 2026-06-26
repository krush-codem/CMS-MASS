import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { supabase } from '../../config/supabaseClient';

export default function Navbar() {
  const { user, isAdmin } = useAdminAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="sticky top-0 z-50 bg-base border-b border-border-dark shadow-sm">
      <div className="max-w-7xl mx-auto px-[32px]">
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

          <div className="flex gap-[16px] items-center">
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
        </div>
      </div>
    </nav>
  );
}
