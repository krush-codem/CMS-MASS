import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';

export default function Taxonomy() {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.warn("Could not fetch categories. Check DB connection.");
    } finally {
      setLoading(false);
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    try {
      const { data, error } = await supabase.from('categories').insert([{ name: newCat.trim() }]).select();
      if (error) throw error;
      setCategories([...categories, ...(data || [])]);
      setNewCat('');
    } catch (err) {
      alert("Error adding category: " + err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the category "${name}"?`)) return;
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      alert("Error deleting category: " + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-display font-black text-black-forest mb-2">Taxonomy Matrices</h1>
        <p className="text-black-forest/60">Manage your platform's core categories and navigation filters.</p>
      </header>

      <div className="bg-surface border border-border-light shadow-sm p-8 rounded-3xl shadow-sm border border-border-light/50 mb-10">
        <h3 className="text-xl font-bold text-black-forest mb-4">Add New Category</h3>
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" value={newCat} onChange={e => setNewCat(e.target.value)} 
            placeholder="e.g. Productivity, Focus, Mindset..." 
            className="flex-1 p-3 bg-surface-elevated/50 border border-border-light rounded-xl outline-none focus:ring-2 focus:ring-cozy-accent"
          />
          <button type="submit" className="bg-black-forest text-white px-8 py-3 rounded-xl font-bold hover:bg-copperwood transition-colors">
            Add Category
          </button>
        </form>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-border-light/50 overflow-hidden">
        <div className="p-6 border-b border-border-light/50 bg-surface-elevated/30">
          <h2 className="text-xl font-display font-bold text-black-forest">Active Taxonomy Roots</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-black-forest/50">Loading taxonomy...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-elevated/10 text-xs uppercase tracking-wider text-black-forest/50">
                <th className="p-4 font-bold border-b border-border-light/50">Category Name</th>
                <th className="p-4 font-bold border-b border-border-light/50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-surface-elevated/20 transition-colors">
                  <td className="p-4 border-b border-border-light/20 font-bold text-black-forest">{cat.name}</td>
                  <td className="p-4 border-b border-border-light/20 text-right">
                    <button onClick={() => handleDelete(cat.id, cat.name)} className="text-red-400 font-bold hover:text-red-600 transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="2" className="p-8 text-center text-black-forest/50 font-medium">No categories created yet. Create your first taxonomy root above!</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
