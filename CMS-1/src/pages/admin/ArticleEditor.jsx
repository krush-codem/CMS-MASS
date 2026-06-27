import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabaseClient';
import BlockEditor from '../../components/admin/BlockEditor';
import FAQForm from '../../components/admin/FAQForm';
import StatusSelectors from '../../components/admin/StatusSelectors';

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState([]);
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  
  const [blocks, setBlocks] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  
  const [isHeroSpotlight, setIsHeroSpotlight] = useState(false);
  const [isEditorialPick, setIsEditorialPick] = useState(false);
  const [status, setStatus] = useState('draft');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function init() {
      // Fetch categories
      const { data: catData } = await supabase.from('categories').select('id, name');
      if (catData) setCategoriesList(catData);

      if (id) {
        const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
        if (data) {
          setTitle(data.title || '');
          setSlug(data.slug || '');
          setExcerpt(data.excerpt || '');
          setTags(data.tags || []);
          setMainImageUrl(data.main_image_url || '');
          setMetaTitle(data.meta_title || '');
          setMetaDescription(data.meta_description || '');
          setBlocks(data.layout_blocks || []);
          setFaqs(data.faqs || []);
          setIsHeroSpotlight(data.is_hero_spotlight || false);
          setIsEditorialPick(data.is_editorial_pick || false);
          setStatus(data.status || 'draft');
        }
      }
    }
    init();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Auto-generate a URL-safe slug if the user left it blank
    const finalSlug = slug.trim() 
      ? slug.trim().toLowerCase().replace(/\s+/g, '-') 
      : title.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');

    if (!finalSlug) {
      alert("You must provide at least a Title to generate a URL.");
      setSaving(false);
      return;
    }

    const payload = {
      title,
      slug: finalSlug,
      excerpt,
      category_id: null, // Clear this out as we now use multi-select tags for taxonomy
      tags,
      main_image_url: mainImageUrl,
      meta_title: metaTitle,
      meta_description: metaDescription,
      layout_blocks: blocks,
      faqs,
      is_hero_spotlight: isHeroSpotlight,
      is_editorial_pick: isEditorialPick,
      status
    };

    try {
      if (id) {
        // Update existing article
        const { error } = await supabase.from('articles').update(payload).eq('id', id);
        if (error) throw error;
        alert('Article updated successfully!');
        navigate('/admin/dashboard');
      } else {
        // Insert new article
        const { error } = await supabase.from('articles').insert([payload]);
        if (error) throw error;
        alert('Article created successfully!');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error('Error saving article:', err);
      alert('Failed to save article: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-display font-black text-black-forest">
          {id ? 'Edit Article' : 'Composer Workspace'}
        </h1>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="w-full sm:w-auto bg-black-forest text-white px-8 py-3 rounded-xl font-bold hover:bg-black-forest/90 hover:shadow-md transition-all duration-300 disabled:opacity-50"
        >
          {saving ? 'Processing...' : 'Save Content Layout'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <div className="bg-surface border border-border-light shadow-sm p-8 rounded-3xl border border-border-light/50 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-black-forest/50 uppercase tracking-wider mb-2">Base Definitions</h3>
            <input 
              type="text" value={title} onChange={e => setTitle(e.target.value)} 
              placeholder="Article Title..." 
              className="w-full text-3xl font-display font-bold p-2 bg-transparent border-b-2 border-border-light focus:border-copperwood outline-none transition-colors placeholder-cozy-text/20"
            />
            <input 
              type="text" value={slug} onChange={e => setSlug(e.target.value)} 
              placeholder="url-slug-example" 
              className="w-full text-sm font-mono p-2 bg-surface-elevated/50 border border-border-light rounded-lg outline-none focus:ring-2 focus:ring-cozy-accent transition-all text-black-forest"
            />
            <textarea 
              value={excerpt} onChange={e => setExcerpt(e.target.value)} 
              placeholder="Enter a compelling excerpt..." 
              className="w-full p-4 bg-surface-elevated/50 border border-border-light rounded-xl outline-none focus:ring-2 focus:ring-cozy-accent transition-all leading-relaxed"
              rows="3"
            />
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex flex-wrap gap-2 items-center min-h-[48px] p-2 bg-surface-elevated/30 border border-border-light rounded-xl">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-2 px-3 py-1.5 bg-copperwood/20 text-black-forest font-bold text-xs uppercase tracking-wider rounded-lg border border-copperwood/30 shadow-sm">
                    {tag}
                    <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-red-500 font-black text-sm leading-none transition-colors">×</button>
                  </span>
                ))}
                
                <select
                  value=""
                  onChange={e => {
                    if (e.target.value && !tags.includes(e.target.value)) {
                      setTags([...tags, e.target.value]);
                    }
                  }}
                  className="p-2 bg-transparent outline-none text-sm font-medium text-black-forest cursor-pointer focus:text-black-forest"
                >
                  <option value="">+ Add Category...</option>
                  {categoriesList.filter(c => !tags.includes(c.name)).map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="pt-2">
              <input 
                type="text" value={mainImageUrl} onChange={e => setMainImageUrl(e.target.value)} 
                placeholder="Cover Image URL..." 
                className="w-full p-3 bg-surface-elevated/50 border border-border-light rounded-xl outline-none focus:ring-2 focus:ring-cozy-accent transition-all text-sm"
              />
            </div>
            {mainImageUrl && (
              <img src={mainImageUrl} alt="Cover Preview" className="w-full h-48 object-cover rounded-xl border border-border-light/50 shadow-sm" />
            )}
          </div>

          <BlockEditor blocks={blocks} onChange={setBlocks} />
          <FAQForm faqs={faqs} onChange={setFaqs} />
        </div>

        <div className="col-span-1 space-y-8">
          <StatusSelectors 
            isHero={isHeroSpotlight} setIsHero={setIsHeroSpotlight}
            isEditorial={isEditorialPick} setIsEditorial={setIsEditorialPick}
            status={status} setStatus={setStatus}
          />
          
          <div className="bg-surface border border-border-light shadow-sm p-6 rounded-3xl border border-border-light/50 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-black-forest/50 uppercase tracking-wider">SEO Graph</h3>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-black-forest pl-1">Meta Title</label>
              <input 
                type="text" value={metaTitle} onChange={e => setMetaTitle(e.target.value)}
                className="w-full p-3 bg-surface-elevated/50 border border-border-light rounded-xl outline-none focus:ring-2 focus:ring-cozy-accent transition-all text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-black-forest pl-1">Meta Description</label>
              <textarea 
                value={metaDescription} onChange={e => setMetaDescription(e.target.value)}
                className="w-full p-3 bg-surface-elevated/50 border border-border-light rounded-xl outline-none focus:ring-2 focus:ring-cozy-accent transition-all text-sm leading-relaxed"
                rows="4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
