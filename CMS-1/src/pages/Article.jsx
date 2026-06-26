import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import Navbar from '../components/layout/Navbar';

export default function Article() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            setArticle(null);
            return;
          }
          throw error;
        }
        setArticle(data);
      } catch (err) {
        setArticle({
          title: 'The Subtle Art of Deep Focus',
          excerpt: 'How to reclaim your attention in a world designed to distract you.',
          main_image_url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80',
          lead_author: 'Elena Rostov',
          read_duration: '5 min read',
          categories: { name: 'Focus' },
          tags: ['Productivity', 'Mindfulness'],
          layout_blocks: [
            { id: '1', type: 'text', value: 'Deep work is the ability to focus without distraction on a cognitively demanding task. It’s a skill that allows you to quickly master complicated information and produce better results in less time.' },
            { id: '2', type: 'heading', level: 'h2', value: 'Why Focus Matters' },
            { id: '3', type: 'text', value: 'In our current digital economy, the ability to focus is becoming increasingly rare at exactly the same time it is becoming increasingly valuable.' },
            { id: '4', type: 'separator' },
            { id: '5', type: 'author_spotlight', authorName: 'Elena Rostov', bio: 'Elena is a digital wellness researcher and author.' }
          ],
          faqs: [
            { id: 'f1', q: 'How long should a focus session be?', a: 'Typically 90 minutes is the maximum time your brain can sustain intense focus.' }
          ]
        });
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-base font-sans selection:bg-copperwood selection:text-white">
        <Navbar />
        <div className="flex-1 max-w-[720px] mx-auto w-full px-[32px] py-[80px] animate-pulse">
          <div className="h-[32px] bg-surface w-[120px] rounded-[4px] mb-[32px]"></div>
          <div className="h-[64px] bg-surface w-full rounded-[4px] mb-[24px]"></div>
          <div className="h-[400px] bg-surface w-full rounded-[8px] mb-[32px]"></div>
          <div className="space-y-[16px]">
            <div className="h-[16px] bg-surface w-full rounded-[4px]"></div>
            <div className="h-[16px] bg-surface w-5/6 rounded-[4px]"></div>
            <div className="h-[16px] bg-surface w-4/6 rounded-[4px]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) return <div className="text-center py-[96px] text-black-forest bg-base font-sans min-h-screen">Article not found.</div>;

  return (
    <div className="min-h-screen flex flex-col bg-base font-sans selection:bg-copperwood selection:text-white">
      <Navbar />
      <main className="flex-1 max-w-[720px] mx-auto w-full px-[24px] py-[80px]">
        
        {/* Header Section */}
        <header className="mb-[64px] text-center">
          {article.categories?.name && (
            <Link to={`/categories?tag=${article.categories.name}`} className="text-micro text-sunlit-clay uppercase tracking-[1.5px] mb-[24px] inline-block hover:text-copperwood transition-colors">
              {article.categories.name}
            </Link>
          )}
          <h1 className="text-display-lg text-black-forest mb-[24px] leading-tight">
            {article.title}
          </h1>
          <p className="text-heading-sm text-black-forest font-medium leading-relaxed mb-[40px] max-w-2xl mx-auto">
            {article.excerpt}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-[24px] text-body-sm text-black-forest">
            <span className="flex items-center gap-[12px]">
              <span className="w-[48px] h-[48px] rounded-full bg-surface border border-border-dark flex items-center justify-center text-black-forest font-bold text-[18px]">
                {(() => {
                  const authorBlock = article.layout_blocks?.find(b => b.type === 'author_spotlight');
                  const name = authorBlock?.authorName || 'Editorial Team';
                  return name.charAt(0).toUpperCase();
                })()}
              </span>
              <div className="text-left">
                <span className="block text-black-forest font-bold leading-tight">
                  {(() => {
                    const authorBlock = article.layout_blocks?.find(b => b.type === 'author_spotlight');
                    return authorBlock?.authorName || 'Editorial Team';
                  })()}
                </span>
                <span className="text-micro uppercase tracking-wider font-bold">Author</span>
              </div>
            </span>
            <span className="h-[32px] w-[1px] bg-border-light"></span>
            <div className="text-left">
              <span className="block text-black-forest font-bold leading-tight">{new Date(article.created_at || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span className="text-micro uppercase tracking-wider font-bold">{article.read_duration || '5 min read'}</span>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        {article.main_image_url && (
          <div className="mb-[64px] rounded-[8px] overflow-hidden shadow-md border border-border-light">
            <img src={article.main_image_url} alt={article.title} className="w-full h-auto object-cover max-h-[500px]" />
          </div>
        )}

        {/* Dynamic Layout Blocks */}
        <article className="max-w-[720px] mb-[64px]">
          {(article.layout_blocks || []).map((block, i) => {
            if (block.type === 'text') {
              return <p key={i} className="text-body-md text-black-forest leading-relaxed mb-[24px]">{block.value}</p>;
            }
            if (block.type === 'heading') {
              const Tag = block.level || 'h2';
              return <Tag key={i} className={`${Tag === 'h2' ? 'text-heading-md mt-[48px] mb-[24px]' : 'text-heading-sm mt-[32px] mb-[16px]'} text-black-forest`}>{block.value}</Tag>;
            }
            if (block.type === 'image') {
              return <img key={i} src={block.value} alt="Content block" className="rounded-[8px] shadow-sm border border-border-light w-full mb-[32px]" />;
            }
            if (block.type === 'separator') {
              return <hr key={i} className="border-t border-border-dark my-[48px] w-full" />;
            }
            if (block.type === 'author_spotlight') {
              return (
                <div key={i} className="bg-surface border border-border-light rounded-[8px] p-[32px] my-[48px] flex flex-col md:flex-row gap-[24px] items-center md:items-start text-center md:text-left shadow-sm">
                  <div className="w-[80px] h-[80px] shrink-0 rounded-full bg-base border border-border-dark flex items-center justify-center text-[32px] font-bold text-copperwood">
                    {block.authorName?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <h4 className="text-card-title text-black-forest mb-[8px]">{block.authorName}</h4>
                    <p className="text-body-md text-black-forest italic">"{block.bio}"</p>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </article>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-[8px] mb-[64px] pt-[32px] border-t border-border-dark">
            <span className="text-body-sm-bold text-black-forest mr-[8px] self-center">Filed under:</span>
            {article.tags.map(tag => (
              <Link to={`/categories?tag=${tag}`} key={tag} className="badge-code hover:bg-copperwood hover:text-white transition-colors cursor-pointer text-decoration-none">
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* FAQ Section */}
        {article.faqs && article.faqs.length > 0 && (
          <div className="mb-[64px]">
            <h3 className="text-heading-sm text-black-forest mb-[24px]">Q&A</h3>
            <div className="space-y-[16px]">
              {article.faqs.map((faq, i) => (
                <details key={i} className="group bg-surface border border-border-light rounded-[8px] open:shadow-sm transition-shadow">
                  <summary className="text-body-md-bold text-black-forest p-[24px] cursor-pointer select-none list-none flex justify-between items-center group-open:border-b border-border-light">
                    {faq.q}
                    <span className="text-black-forest group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-[24px] text-body-md text-black-forest leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className=" bg-amber-700 text-cornsilk py-[80px] px-[32px] border-t border-border-dark mt-auto text-center">
        <div className="max-w-[720px] mx-auto">
          <h2 className="text-heading-lg text-white mb-[16px] font-display">OUR MISSION</h2>
          <p className="text-body-md text-cornsilk/80 mb-[48px] max-w-2xl mx-auto">
            To provide high-signal frameworks that cut through the noise of the digital age, empowering individuals to reclaim their focus and build a more productive tomorrow.
          </p>
          
          <h2 className="text-heading-lg text-white mb-[16px] font-display">OUR VISION</h2>
          <p className="text-body-md text-cornsilk/80 mb-[64px] max-w-2xl mx-auto">
            A world where deep work is accessible to everyone, and technology serves as a tool for intention rather than a source of distraction.
          </p>
          
          <div className="bg-surface/10 p-[32px] rounded-[8px] border border-white/10 max-w-lg mx-auto">
            <h3 className="text-heading-sm text-white mb-[16px]">Leave a message</h3>
            <p className="text-body-sm text-cornsilk/60 mb-[24px]">Have a question or want to share your productivity journey? We'd love to hear from you.</p>
            <div className="flex flex-col gap-[16px]">
              <input type="email" placeholder="Your email address" className="input-field bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-sunlit-clay" />
              <textarea placeholder="Your message..." rows="3" className="input-field h-auto bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-sunlit-clay py-[12px]"></textarea>
              <button className="btn-primary w-full mt-[8px]">Send Message</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
