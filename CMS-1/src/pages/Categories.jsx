import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTag = searchParams.get('tag');
  
  const mockArticles = [
    { id: 1, title: 'The Subtle Art of Deep Focus', slug: 'subtle-art', excerpt: 'Reclaim your attention in a distracted world.', categories: { name: 'Focus' } },
    { id: 2, title: 'Building Atomic Habits', slug: 'atomic-habits', excerpt: 'Small changes lead to big results.', categories: { name: 'Systems' } },
    { id: 3, title: 'Journaling for Clarity', slug: 'journaling', excerpt: 'Write it down to understand it.', categories: { name: 'Mindfulness' } }
  ];

  const mockCategories = [
    { id: 1, name: 'Focus', articles: [{ count: 1 }] },
    { id: 2, name: 'Systems', articles: [{ count: 1 }] },
    { id: 3, name: 'Mindfulness', articles: [{ count: 1 }] },
    { id: 4, name: 'Lifestyle', articles: [{ count: 1 }] }
  ];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data: catsData, error: catsError } = await supabase
          .from('categories')
          .select('*, articles(count)')
          .order('name');
        
        if (catsError) throw catsError;
        
        if (catsData && catsData.length > 0) {
          setCategories(catsData);
        } else {
          setCategories(mockCategories);
        }

        const { data: articlesData, error: artError } = await supabase
          .from('articles')
          .select('*, categories(name)')
          .eq('status', 'published')
          .order('created_at', { ascending: false });
        
        if (artError) throw artError;
        
        if (articlesData && articlesData.length > 0) {
          setArticles(articlesData);
        } else {
          setArticles(mockArticles);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setCategories(mockCategories);
        setArticles(mockArticles);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredArticles = selectedTag 
    ? articles.filter(a => a.categories?.name === selectedTag || (a.tags && a.tags.includes(selectedTag)))
    : articles;

  return (
    <div className="min-h-screen flex flex-col bg-base font-sans selection:bg-copperwood selection:text-white">
      <Navbar />
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-[32px] py-[80px]">
        <header className="mb-[64px]">
          <h1 className="text-display-lg text-black-forest mb-[16px]">
            Browse Spaces
          </h1>
          <p className="text-heading-sm text-black-forest font-medium">
            Explore specific methodologies and frameworks for deeper focus.
          </p>
        </header>

        {/* Categories Grid (Genres) */}
        <section className="mb-[80px]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[24px]">
            {categories.map((cat, i) => {
              const bgColors = [
                "bg-sunlit-clay",
                "bg-copperwood",
                "bg-olive-leaf",
                "bg-black-forest",
              ];
              const bgColor = bgColors[i % bgColors.length];

              return (
                <div
                  key={cat.id}
                  onClick={() => setSearchParams({ tag: cat.name })}
                  className={`${selectedTag === cat.name ? "ring-4 ring-copperwood/50 scale-105" : "hover:scale-105"} cursor-pointer transition-all duration-300 rounded-[8px] p-[24px] h-[160px] flex flex-col justify-end relative overflow-hidden shadow-sm`}
                >
                  <div
                    className={`absolute inset-0 ${bgColor} opacity-90`}
                  ></div>
                  <div className="relative z-10">
                    <h3 className="text-heading-sm text-white font-display tracking-wide mb-[4px]">
                      {cat.name}
                    </h3>
                    <p className="text-caption text-white/80">
                      {cat.articles?.[0]?.count || 0} frameworks
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {selectedTag && (
            <div className="mt-[24px]">
              <button
                onClick={() => setSearchParams({})}
                className="btn-secondary text-[12px]"
              >
                Clear Filter &times;
              </button>
            </div>
          )}
        </section>

        {/* Filtered Results */}
        <section>
          <h2 className="text-heading-md text-black-forest mb-[32px]">
            {selectedTag ? `Frameworks in "${selectedTag}"` : "All Frameworks"}
          </h2>

          {loading ? (
            <div className="flex justify-center py-[64px]">
              <div className="animate-spin w-[40px] h-[40px] border-[4px] border-copperwood border-t-transparent rounded-full"></div>
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              {filteredArticles.map((article) => (
                <Link
                  to={`/article/${article.slug}`}
                  key={article.id}
                  className="card-base group flex items-start gap-[24px] h-auto p-[24px]"
                >
                  {article.main_image_url ? (
                    <div className="w-[120px] h-[120px] rounded-[6px] overflow-hidden shrink-0">
                      <img
                        src={article.main_image_url}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="w-[120px] h-[120px] rounded-[6px] bg-surface-elevated border border-border-dark flex items-center justify-center shrink-0">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--color-olive-leaf)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {article.categories?.name && (
                      <span className="text-micro text-sunlit-clay uppercase tracking-[1px] mb-[8px] block">
                        {article.categories.name}
                      </span>
                    )}
                    <h3 className="text-body-md-bold text-black-forest mb-[8px] group-hover:text-copperwood transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-body-sm text-olive-leaf line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-[64px] bg-surface rounded-[8px] border border-border-light">
              <p className="text-heading-sm text-black-forest mb-[8px]">
                No frameworks found in this space.
              </p>
              <button
                onClick={() => setSearchParams({})}
                className="btn-secondary mt-[16px]"
              >
                View all frameworks
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="bg-amber-700 text-cornsilk py-[80px] px-[32px] border-t border-border-dark mt-auto">
        {/* Increased max-width to give the 2 columns room to breathe side-by-side */}
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[64px] items-start">
          {/* LEFT SIDE: Mission & Vision */}
          <div className="text-left">
            <h2 className="text-heading-lg text-white mb-[16px] font-display">
              OUR MISSION
            </h2>
            <p className="text-body-md text-cornsilk/80 mb-[48px]">
              To provide high-signal frameworks that cut through the noise of
              the digital age, empowering individuals to reclaim their focus and
              build a more productive tomorrow.
            </p>

            <h2 className="text-heading-lg text-white mb-[16px] font-display">
              OUR VISION
            </h2>
            <p className="text-body-md text-cornsilk/80">
              A world where deep work is accessible to everyone, and technology
              serves as a tool for intention rather than a source of
              distraction.
            </p>
          </div>

          {/* RIGHT SIDE: Leave a Message Card */}
          <div className="bg-surface/10 p-[32px] rounded-[8px] border border-white/10 w-full max-w-lg md:ml-auto text-center md:text-left">
            <h3 className="text-heading-sm text-white mb-[16px]">
              Leave a message
            </h3>
            <p className="text-body-sm text-cornsilk/60 mb-[24px]">
              Have a question or want to share your productivity journey? We'd
              love to hear from you.
            </p>
            <div className="flex flex-col gap-[16px]">
              <input
                type="email"
                placeholder="Your email address"
                className="input-field bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-sunlit-clay"
              />
              <textarea
                placeholder="Your message..."
                rows="3"
                className="input-field h-auto bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-sunlit-clay py-[12px]"
              ></textarea>
              <button className="btn-primary w-full mt-[8px]">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
