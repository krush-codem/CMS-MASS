import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabaseClient';

export default function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('articles').select('id, title, status, created_at').order('created_at', { ascending: false });
      if (error) throw error;
      setArticles(data || []);
    } catch (err) {
      console.warn("Could not fetch articles. Check DB connection.");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you absolutely sure you want to delete "${title}"? This cannot be undone.`)) return;
    
    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
      setArticles(articles.filter(a => a.id !== id));
    } catch (err) {
      alert("Error deleting article: " + err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-display font-black text-black-forest mb-2">Master Workspace Hub</h1>
        <p className="text-black-forest/60">Manage your productivity platform seamlessly.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        
        <div className="bg-surface border border-border-light shadow-sm p-8 rounded-3xl shadow-sm border border-border-light/50 hover:shadow-md hover:border-copperwood transition-all duration-300 group flex flex-col">
          <h2 className="text-2xl font-display font-bold text-black-forest mb-3 group-hover:text-copperwood transition-colors">Content Manager</h2>
          <p className="text-black-forest/70 mb-8 text-sm leading-relaxed flex-1">Create new long-form dynamic content, assign hero spotlights, and build FAQ matrices.</p>
          <Link to="/admin/editor" className="inline-block text-center bg-black-forest text-white font-bold px-6 py-3 rounded-xl hover:bg-copperwood transition-all duration-300">
            Open Composer
          </Link>
        </div>

        <div className="bg-surface border border-border-light shadow-sm p-8 rounded-3xl shadow-sm border border-border-light/50 hover:shadow-md transition-all duration-300 flex flex-col">
          <h2 className="text-2xl font-display font-bold text-black-forest mb-3">Resources Controller</h2>
          <p className="text-black-forest/70 mb-8 text-sm leading-relaxed flex-1">Upload PDF worksheets, curate external tools, and catalog foundational books.</p>
          <Link to="/admin/resources" className="inline-block w-full text-center bg-surface-elevated text-black-forest border border-border-light font-bold px-6 py-3 rounded-xl hover:bg-surface-elevated transition-all duration-300">
            Manage Library
          </Link>
        </div>

        <div className="bg-surface border border-border-light shadow-sm p-8 rounded-3xl shadow-sm border border-border-light/50 hover:shadow-md transition-all duration-300 flex flex-col">
          <h2 className="text-2xl font-display font-bold text-black-forest mb-3">Taxonomy Matrices</h2>
          <p className="text-black-forest/70 mb-8 text-sm leading-relaxed flex-1">Maintain the 30 fixed productivity roots and control navigational tags across the system.</p>
          <Link to="/admin/taxonomy" className="inline-block w-full text-center bg-surface-elevated text-black-forest border border-border-light font-bold px-6 py-3 rounded-xl hover:bg-surface-elevated transition-all duration-300">
            Edit Categories
          </Link>
        </div>

      </div>

      {/* Articles Management Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-border-light/50 overflow-hidden">
        <div className="p-6 border-b border-border-light/50 bg-surface-elevated/30 flex justify-between items-center">
          <h2 className="text-xl font-display font-bold text-black-forest">Content Repository</h2>
          <Link to="/admin/editor" className="bg-black-forest text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-copperwood transition-colors">
            + New Article
          </Link>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-black-forest/50">Loading articles...</div>
        ) : articles.length === 0 ? (
          <div className="p-8 text-center text-black-forest/50">No articles found. Create one above!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-elevated/10 text-xs uppercase tracking-wider text-black-forest/50">
                  <th className="p-4 font-bold border-b border-border-light/50">Title</th>
                  <th className="p-4 font-bold border-b border-border-light/50">Status</th>
                  <th className="p-4 font-bold border-b border-border-light/50">Date</th>
                  <th className="p-4 font-bold border-b border-border-light/50 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {articles.map(article => (
                  <tr key={article.id} className="hover:bg-surface-elevated/20 transition-colors group">
                    <td className="p-4 border-b border-border-light/20 font-medium text-black-forest">
                      <Link to={`/article/${article.slug || article.id}`} target="_blank" className="hover:text-copperwood transition-colors">
                        {article.title}
                      </Link>
                    </td>
                    <td className="p-4 border-b border-border-light/20">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${article.status === 'published' ? 'bg-copperwood/20 text-black-forest' : 'bg-gray-100 text-gray-500'}`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="p-4 border-b border-border-light/20 text-black-forest/60">
                      {new Date(article.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 border-b border-border-light/20 text-right space-x-4">
                      <Link to={`/admin/editor/${article.id}`} className="text-copperwood font-bold hover:text-black-forest transition-colors">Edit</Link>
                      <button onClick={() => handleDelete(article.id, article.title)} className="text-red-400 font-bold hover:text-red-600 transition-colors">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
