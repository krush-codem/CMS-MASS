import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/public/HeroSection';
import { supabase } from '../config/supabaseClient';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/public/ArticleCard';

export default function Home() {
  const [editorialPicks, setEditorialPicks] = useState([]);
  const [recentStream, setRecentStream] = useState([]);

  useEffect(() => {
    async function fetchFeeds() {
      try {
        const { data: picks } = await supabase.from('articles').select('*, categories(name)').eq('is_editorial_pick', true).limit(4);
        setEditorialPicks(picks && picks.length > 0 ? picks : mockPicks);

        const { data: recent } = await supabase.from('articles').select('id, title, slug, excerpt, created_at, categories(name)').eq('status', 'published').order('created_at', { ascending: false }).limit(4);
        setRecentStream(recent && recent.length > 0 ? recent : mockRecent);
      } catch (err) {
        setEditorialPicks(mockPicks);
        setRecentStream(mockRecent);
      }
    }

    const mockPicks = [
      { id: 1, title: 'Deep Work Protocol', slug: 'deep-work', excerpt: 'The 4-hour daily framework for extreme cognitive output.', badge: 'ESSENTIAL', categories: { name: 'Focus' } },
      { id: 2, title: 'Atomic Habit Systems', slug: 'atomic-habits', excerpt: 'Building 1% compounding routines.', badge: 'FRAMEWORK', categories: { name: 'Systems' } },
      { id: 3, title: 'Digital Minimalism', slug: 'digital-minimalism', excerpt: 'Clearing the noise from your devices.', badge: 'GUIDE', categories: { name: 'Lifestyle' } },
      { id: 4, title: 'The Review Method', slug: 'm27', excerpt: 'Weekly reflections for long-term alignment.', badge: 'PRACTICE', categories: { name: 'Mindfulness' } }
    ];
    
    const mockRecent = [
      { id: 4, title: 'Morning Routines', slug: 'morning-routines', excerpt: 'How the most productive people start their day.', categories: { name: 'Lifestyle' } },
      { id: 5, title: 'The Pomodoro Myth', slug: 'pomodoro', excerpt: 'Why 25 minutes might not be enough for deep focus.', categories: { name: 'Focus' } },
      { id: 6, title: 'Journaling for Clarity', slug: 'journal-clarity', excerpt: 'Using text to untangle complex problems.', categories: { name: 'Mindfulness' } },
      { id: 7, title: 'Collaborative Flow', slug: 'collab', excerpt: 'Maintaining deep work in a team environment.', categories: { name: 'Systems' } },
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
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        {/* Recent Articles */}
        <section className="mb-[96px]">
          <h2 className="text-heading-md text-black-forest mb-[32px]">Recently Added</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
            {recentStream.map(article => (
              <ArticleCard key={article.id} article={article} />
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
