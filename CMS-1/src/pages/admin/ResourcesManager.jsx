import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';

export default function ResourcesManager() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingResource, setEditingResource] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState('book');
  const [externalUrl, setExternalUrl] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [badgeLabel, setBadgeLabel] = useState('');
  const [featuresText, setFeaturesText] = useState('');

  useEffect(() => {
    fetchResources();
  }, []);

  async function fetchResources() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setResources(data || []);
    } catch (err) {
      console.warn("Could not fetch resources. Check DB connection.", err);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setTitle(resource.title || '');
    setType(resource.type || 'book');
    setExternalUrl(resource.external_url || '');
    setDescription(resource.description || '');
    setAuthor(resource.author || '');
    setRating(resource.rating || 5);
    setBadgeLabel(resource.badge_label || '');
    setFeaturesText(resource.features ? resource.features.join('\n') : '');
  };

  const handleCancelEdit = () => {
    setEditingResource(null);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setType('book');
    setExternalUrl('');
    setDescription('');
    setAuthor('');
    setRating(5);
    setBadgeLabel('');
    setFeaturesText('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = {
      title,
      type,
      external_url: externalUrl,
      description: type !== 'worksheet' ? description : null,
      author: type === 'book' ? author : null,
      rating: type === 'book' ? parseFloat(rating) : null,
      badge_label: type === 'worksheet' ? badgeLabel : null,
      features: type === 'worksheet' ? featuresText.split('\n').filter(f => f.trim() !== '') : null
    };

    try {
      if (editingResource) {
        const { error } = await supabase.from('resources').update(payload).eq('id', editingResource.id);
        if (error) throw error;
        alert('Resource updated successfully!');
      } else {
        const { error } = await supabase.from('resources').insert([payload]);
        if (error) throw error;
        alert('Resource created successfully!');
      }
      fetchResources();
      handleCancelEdit();
    } catch (err) {
      console.error('Error saving resource:', err);
      alert('Failed to save resource: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you absolutely sure you want to delete "${title}"?`)) return;
    try {
      const { error } = await supabase.from('resources').delete().eq('id', id);
      if (error) throw error;
      setResources(resources.filter(r => r.id !== id));
    } catch (err) {
      alert("Error deleting resource: " + err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header>
        <h1 className="text-4xl font-display font-black text-black-forest mb-2">Resources Controller</h1>
        <p className="text-black-forest/60">Manage books, worksheets, and external tools.</p>
      </header>

      <div className="bg-surface border border-border-light shadow-sm p-8 rounded-3xl border border-border-light/50 shadow-sm">
        <h2 className="text-2xl font-display font-bold text-black-forest mb-6">
          {editingResource ? 'Edit Resource' : 'Add New Resource'}
        </h2>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-black-forest pl-1 mb-1">Title</label>
              <input 
                type="text" required value={title} onChange={e => setTitle(e.target.value)}
                className="w-full p-3 bg-surface-elevated/50 border border-border-light rounded-xl outline-none focus:ring-2 focus:ring-cozy-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-black-forest pl-1 mb-1">Type</label>
              <select 
                value={type} onChange={e => setType(e.target.value)}
                className="w-full p-3 bg-surface-elevated/50 border border-border-light rounded-xl outline-none focus:ring-2 focus:ring-cozy-accent"
              >
                <option value="book">Book</option>
                <option value="worksheet">Worksheet</option>
                <option value="tool">Tool</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-black-forest pl-1 mb-1">External URL</label>
            <input 
              type="url" value={externalUrl} onChange={e => setExternalUrl(e.target.value)}
              className="w-full p-3 bg-surface-elevated/50 border border-border-light rounded-xl outline-none focus:ring-2 focus:ring-cozy-accent"
            />
          </div>

          {type === 'book' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-black-forest pl-1 mb-1">Author</label>
                <input 
                  type="text" value={author} onChange={e => setAuthor(e.target.value)}
                  className="w-full p-3 bg-surface-elevated/50 border border-border-light rounded-xl outline-none focus:ring-2 focus:ring-cozy-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-black-forest pl-1 mb-1">Rating (1-5)</label>
                <input 
                  type="number" step="0.1" min="1" max="5" value={rating} onChange={e => setRating(e.target.value)}
                  className="w-full p-3 bg-surface-elevated/50 border border-border-light rounded-xl outline-none focus:ring-2 focus:ring-cozy-accent"
                />
              </div>
            </div>
          )}

          {(type === 'book' || type === 'tool') && (
            <div>
              <label className="block text-xs font-bold text-black-forest pl-1 mb-1">Description</label>
              <textarea 
                value={description} onChange={e => setDescription(e.target.value)} rows="3"
                className="w-full p-3 bg-surface-elevated/50 border border-border-light rounded-xl outline-none focus:ring-2 focus:ring-cozy-accent"
              />
            </div>
          )}

          {type === 'worksheet' && (
            <>
              <div>
                <label className="block text-xs font-bold text-black-forest pl-1 mb-1">Badge Label</label>
                <input 
                  type="text" value={badgeLabel} onChange={e => setBadgeLabel(e.target.value)} placeholder="e.g. Free PDF Download"
                  className="w-full p-3 bg-surface-elevated/50 border border-border-light rounded-xl outline-none focus:ring-2 focus:ring-cozy-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-black-forest pl-1 mb-1">Features (one per line)</label>
                <textarea 
                  value={featuresText} onChange={e => setFeaturesText(e.target.value)} rows="4"
                  className="w-full p-3 bg-surface-elevated/50 border border-border-light rounded-xl outline-none focus:ring-2 focus:ring-cozy-accent"
                  placeholder="Sunday planning checklist&#10;Habit tracker matrix"
                />
              </div>
            </>
          )}

          <div className="flex gap-4 pt-4">
            <button 
              type="submit" disabled={saving}
              className="bg-black-forest text-white px-8 py-3 rounded-xl font-bold hover:bg-black-forest/90 transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingResource ? 'Update Resource' : 'Add Resource'}
            </button>
            {editingResource && (
              <button 
                type="button" onClick={handleCancelEdit}
                className="bg-surface-elevated text-black-forest border border-border-light px-8 py-3 rounded-xl font-bold hover:bg-surface-elevated transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-border-light/50 overflow-hidden">
        <div className="p-6 border-b border-border-light/50 bg-surface-elevated/30">
          <h2 className="text-xl font-display font-bold text-black-forest">Resource Library</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-black-forest/50">Loading resources...</div>
        ) : resources.length === 0 ? (
          <div className="p-8 text-center text-black-forest/50">No resources found. Create one above!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-elevated/10 text-xs uppercase tracking-wider text-black-forest/50">
                  <th className="p-4 font-bold border-b border-border-light/50">Title</th>
                  <th className="p-4 font-bold border-b border-border-light/50">Type</th>
                  <th className="p-4 font-bold border-b border-border-light/50 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {resources.map(res => (
                  <tr key={res.id} className="hover:bg-surface-elevated/20 transition-colors group">
                    <td className="p-4 border-b border-border-light/20 font-medium text-black-forest">
                      {res.title}
                    </td>
                    <td className="p-4 border-b border-border-light/20 capitalize">
                      {res.type}
                    </td>
                    <td className="p-4 border-b border-border-light/20 text-right space-x-4">
                      <button onClick={() => handleEdit(res)} className="text-copperwood font-bold hover:text-black-forest transition-colors">Edit</button>
                      <button onClick={() => handleDelete(res.id, res.title)} className="text-red-400 font-bold hover:text-red-600 transition-colors">Delete</button>
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
