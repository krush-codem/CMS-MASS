import { Navigate, Outlet, Link } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';

export default function ProtectedAdminLayout() {
  const { loading, isAdmin } = useAdminAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-base text-black-forest font-medium">Authenticating Session...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen  selection:bg-copperwood selection:text-white">
      <aside className="w-64 bg-amber-900 text-white p-6 border-r border-border-dark flex flex-col shadow-lg z-10">
        <h2 className="text-2xl font-display font-black mb-10 text-copperwood hover:text-sunlit-clay transition-colors tracking-wide">
          <Link to="/">CMS Portal</Link>
        </h2>
        <nav className="space-y-3 flex-1">
          <Link
            to="/admin/dashboard"
            className="block px-4 py-3 rounded-[8px] bg-white/10 hover:bg-white/20 font-medium transition-all duration-300"
          >
            Workspace Hub
          </Link>
          <Link
            to="/admin/editor"
            className="block px-4 py-3 rounded-[8px] text-white/70 hover:text-white hover:bg-white/10 font-medium transition-all duration-300"
          >
            Article Composer
          </Link>
          <Link
            to="/admin/resources"
            className="block w-full text-left px-4 py-3 rounded-[8px] text-white/70 hover:text-white hover:bg-white/10 font-medium transition-all duration-300"
          >
            Resources
          </Link>
          <Link
            to="/admin/taxonomy"
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
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
