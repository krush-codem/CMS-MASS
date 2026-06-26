import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/public/HeroSection';
import { supabase } from '../config/supabaseClient';
import { Link } from 'react-router-dom';

export default function Home() {
  const [editorialPicks, setEditorialPicks] = useState([]);
  const [recentStream, setRecentStream] = useState([]);

  useEffect(() => {
    async function fetchFeeds() {
      try {
        const { data: picks } = await supabase.from('articles').select('*').eq('is_editorial_pick', true).limit(4);
        setEditorialPicks(picks && picks.length > 0 ? picks : mockPicks);

        const { data: recent } = await supabase.from('articles').select('id, title, slug, excerpt, created_at').eq('status', 'published').order('created_at', { ascending: false }).limit(4);
        setRecentStream(recent && recent.length > 0 ? recent : mockRecent);
      } catch (err) {
        setEditorialPicks(mockPicks);
        setRecentStream(mockRecent);
      }
    }

    const mockPicks = [
      { id: 1, title: 'Deep Work Protocol', slug: 'deep-work', excerpt: 'The 4-hour daily framework for extreme cognitive output.', badge: 'ESSENTIAL' },
      { id: 2, title: 'Atomic Habit Systems', slug: 'atomic-habits', excerpt: 'Building 1% compounding routines.', badge: 'FRAMEWORK' },
      { id: 3, title: 'Digital Minimalism', slug: 'digital-minimalism', excerpt: 'Clearing the noise from your devices.', badge: 'GUIDE' },
      { id: 4, title: 'The Review Method', slug: 'm27', excerpt: 'Weekly reflections for long-term alignment.', badge: 'PRACTICE' }
    ];
    
    const mockRecent = [
      { id: 4, title: 'Morning Routines', slug: 'morning-routines', excerpt: 'How the most productive people start their day.' },
      { id: 5, title: 'The Pomodoro Myth', slug: 'pomodoro', excerpt: 'Why 25 minutes might not be enough for deep focus.' },
      { id: 6, title: 'Journaling for Clarity', slug: 'journal-clarity', excerpt: 'Using text to untangle complex problems.' },
      { id: 7, title: 'Collaborative Flow', slug: 'collab', excerpt: 'Maintaining deep work in a team environment.' },
    ];
    
    fetchFeeds();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-base font-sans selection:bg-copperwood selection:text-white">
      <Navbar />
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-[32px] pt-[48px]">
        
        <HeroSection />
        
        {/* Editorial Picks */}
        <section className="mb-[96px]">
          <h2 className="text-heading-md text-black-forest mb-[32px]">Top Frameworks</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
            {editorialPicks.map((article) => (
              <Link 
                to={`/article/${article.slug}`} 
                key={article.id} 
                className="card-elevated group cursor-pointer flex flex-col h-[320px] justify-between relative overflow-hidden"
              >
                <div>
                  {article.badge && <span className="badge-code mb-[16px] inline-block text-copperwood">{article.badge}</span>}
                  <h3 className="text-card-title mb-[12px] text-black-forest group-hover:text-copperwood transition-colors">{article.title}</h3>
                  <p className="text-body-sm text-black-forest line-clamp-4">{article.excerpt}</p>
                </div>
                
                <div className="mt-auto flex justify-end">
                  <div className="btn-circle-play opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Articles */}
        <section className="mb-[96px]">
          <h2 className="text-heading-md text-black-forest mb-[32px]">Recently Added</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
            {recentStream.map(article => (
              <Link 
                to={`/article/${article.slug}`} 
                key={article.id} 
                className="card-base group flex items-center gap-[24px] h-[120px]"
              >
                <div className="h-[72px] w-[72px] bg-surface-elevated rounded-[6px] shrink-0 flex items-center justify-center text-[28px] text-black-forest group-hover:bg-sunlit-clay group-hover:text-white transition-colors border border-border-dark">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-body-md-bold text-black-forest mb-[6px] truncate group-hover:text-copperwood transition-colors">{article.title}</h3>
                  <p className="text-body-sm text-black-forest truncate">{article.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      
      <footer className="bg-amber-700 text-cornsilk py-[80px] px-[32px] border-t border-border-dark">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-[64px]">
          
          <div className="lg:col-span-2">
            <h2 className="text-[20px] font-display font-bold text-white mb-[16px] tracking-tight">PRODUCTIVE FOR TOMORROW</h2>
            <p className="text-body-sm mb-[32px] max-w-sm text-cornsilk/80">
              Focus is the new currency. Protect your attention and build a better tomorrow through intentional action today.
            </p>
          </div>

          <div>
            <h3 className="text-[14px] font-bold text-white mb-[24px] uppercase tracking-[1px]">Company</h3>
            <div className="flex flex-col gap-[16px]">
              <Link to="/articles" className="text-body-sm hover:text-sunlit-clay transition-colors">About</Link>
              <Link to="/articles" className="text-body-sm hover:text-sunlit-clay transition-colors">Jobs</Link>
              <Link to="/articles" className="text-body-sm hover:text-sunlit-clay transition-colors">For the Record</Link>
            </div>
          </div>

          <div>
            <h3 className="text-[14px] font-bold text-white mb-[24px] uppercase tracking-[1px]">Communities</h3>
            <div className="flex flex-col gap-[16px]">
              <Link to="/resources" className="text-body-sm hover:text-sunlit-clay transition-colors">For Developers</Link>
              <Link to="/resources" className="text-body-sm hover:text-sunlit-clay transition-colors">Creators</Link>
              <Link to="/resources" className="text-body-sm hover:text-sunlit-clay transition-colors">Vendors</Link>
            </div>
          </div>

          <div>
            <h3 className="text-[14px] font-bold text-white mb-[24px] uppercase tracking-[1px]">Useful Links</h3>
            <div className="flex flex-col gap-[16px]">
              <Link to="/categories" className="text-body-sm hover:text-sunlit-clay transition-colors">Support</Link>
              <Link to="/articles" className="text-body-sm hover:text-sunlit-clay transition-colors">Web Player</Link>
            </div>
          </div>

        </div>
        
        <div className="max-w-[1280px] mx-auto mt-[80px] pt-[32px] border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[12px] text-cornsilk/60">
          <div className="flex gap-[24px] mb-[16px] md:mb-0">
            <Link to="/" className="hover:text-white transition-colors">Legal</Link>
            <Link to="/" className="hover:text-white transition-colors">Privacy Center</Link>
            <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-white transition-colors">Cookies</Link>
            <Link to="/" className="hover:text-white transition-colors">About Ads</Link>
          </div>
          <p>© {new Date().getFullYear()} Productive for Tomorrow AB</p>
        </div>
      </footer>
    </div>
  );
}
