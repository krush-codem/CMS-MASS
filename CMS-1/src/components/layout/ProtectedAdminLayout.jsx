import { useState } from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';

export default function ProtectedAdminLayout() {
  const { loading, isAdmin } = useAdminAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-base text-black-forest font-medium">Authenticating Session...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen selection:bg-copperwood selection:text-white">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-amber-900 p-4 text-white shadow-md z-20">
        <h2 className="text-xl font-display font-black text-copperwood tracking-wide">
          <Link to="/">CMS Portal</Link>
        </h2>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      <aside className={`${isSidebarOpen ? 'flex' : 'hidden'} md:flex w-full md:w-64 bg-amber-900 text-white p-6 md:border-r border-border-dark flex-col shadow-lg z-10 absolute md:static top-[60px] md:top-0 h-[calc(100vh-60px)] md:h-auto md:min-h-screen`}>
        <h2 className="hidden md:block text-2xl font-display font-black mb-10 text-copperwood hover:text-sunlit-clay transition-colors tracking-wide">
          <Link to="/">CMS Portal</Link>
        </h2>
        <nav className="space-y-3 flex-1">
          <Link
            to="/admin/dashboard"
            onClick={() => setIsSidebarOpen(false)}
            className="block px-4 py-3 rounded-[8px] bg-white/10 hover:bg-white/20 font-medium transition-all duration-300"
          >
            Workspace Hub
          </Link>
          <Link
            to="/admin/editor"
            onClick={() => setIsSidebarOpen(false)}
            className="block px-4 py-3 rounded-[8px] text-white/70 hover:text-white hover:bg-white/10 font-medium transition-all duration-300"
          >
            Article Composer
          </Link>
          <Link
            to="/admin/resources"
            onClick={() => setIsSidebarOpen(false)}
            className="block w-full text-left px-4 py-3 rounded-[8px] text-white/70 hover:text-white hover:bg-white/10 font-medium transition-all duration-300"
          >
            Resources
          </Link>
          <Link
            to="/admin/taxonomy"
            onClick={() => setIsSidebarOpen(false)}
            className="block w-full text-left px-4 py-3 rounded-[8px] text-white/70 hover:text-white hover:bg-white/10 font-medium transition-all duration-300"
          >
            Taxonomy
          </Link>
        </nav>
        <div className="pt-6 border-t border-white/20 mt-auto">
          <p className="text-xs text-white/50 uppercase tracking-wider font-bold px-4">
            Admin Session Active
          </p>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
