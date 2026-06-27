import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import ArticleCard from '../components/public/ArticleCard';

export default function CategoryArticles() {
  const { categoryName } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const { data: articlesData, error: artError } = await supabase
          .from('articles')
          .select('*, categories(name)')
          .eq('status', 'published')
          .order('created_at', { ascending: false });
        
        if (artError) throw artError;
        
        if (articlesData && articlesData.length > 0) {
          // Filter articles by the category name from params
          const filtered = articlesData.filter(
            a => a.categories?.name === categoryName || (a.tags && a.tags.includes(categoryName))
          );
          setArticles(filtered);
        } else {
          setArticles([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, [categoryName]);

  return (
    <div className="min-h-screen flex flex-col bg-base font-sans selection:bg-copperwood selection:text-white">
      <Navbar />
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-[32px] py-[80px]">
        
        <div className="mb-[32px]">
          <Link to="/categories" className="text-sm font-bold text-black-forest/50 hover:text-copperwood transition-colors uppercase tracking-wider">
            &larr; Back to Spaces
          </Link>
        </div>

        <header className="mb-[64px]">
          <h1 className="text-display-lg text-black-forest mb-[16px]">
            Frameworks in "{categoryName}"
          </h1>
          <p className="text-heading-sm text-black-forest font-medium">
            Explore methodologies assigned to the {categoryName} space.
          </p>
        </header>

        <section>
          {loading ? (
            <div className="flex justify-center py-[64px]">
              <div className="animate-spin w-[40px] h-[40px] border-[4px] border-copperwood border-t-transparent rounded-full"></div>
            </div>
          ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-[64px] bg-surface rounded-[8px] border border-border-light">
              <p className="text-heading-sm text-black-forest mb-[8px]">
                No frameworks found in this space.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="bg-amber-700 text-cornsilk py-[80px] px-[32px] border-t border-border-dark mt-auto">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[64px] items-start">
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
