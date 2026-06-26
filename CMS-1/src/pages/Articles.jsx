import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import { supabase } from "../config/supabaseClient";
import { Link } from "react-router-dom";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const mockArticles = [
    {
      id: 1,
      title: "The Subtle Art of Deep Focus",
      slug: "subtle-art",
      excerpt: "Reclaim your attention in a distracted world.",
      categories: { name: "Focus" },
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Building Atomic Habits",
      slug: "atomic-habits",
      excerpt: "Small changes lead to big results.",
      categories: { name: "Systems" },
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      title: "Journaling for Clarity",
      slug: "journaling",
      excerpt: "Write it down to understand it.",
      categories: { name: "Mindfulness" },
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      title: "Digital Minimalism",
      slug: "digital-minimalism",
      excerpt: "Declutter your digital life.",
      categories: { name: "Lifestyle" },
      created_at: new Date().toISOString(),
    },
  ];

  const mockCategories = ["Focus", "Systems", "Mindfulness", "Lifestyle"];

  useEffect(() => {
    async function fetchArticlesAndCategories() {
      setLoading(true);
      try {
        const { data: articlesData, error } = await supabase
          .from("articles")
          .select("*, categories(name)")
          .eq("status", "published")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (articlesData && articlesData.length > 0) {
          setArticles(articlesData);

          const uniqueCats = new Set();
          articlesData.forEach((art) => {
            if (art.categories && art.categories.name) {
              uniqueCats.add(art.categories.name);
            }
          });
          setCategories(Array.from(uniqueCats));
        } else {
          setArticles(mockArticles);
          setCategories(mockCategories);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setArticles(mockArticles);
        setCategories(mockCategories);
      } finally {
        setLoading(false);
      }
    }
    fetchArticlesAndCategories();
  }, []);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "" || article.categories?.name === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-base font-sans selection:bg-copperwood selection:text-white">
      <Navbar />
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-[32px] py-[80px]">
        <header className="mb-[64px] text-center max-w-3xl mx-auto">
          <h1 className="text-display-lg text-black-forest mb-[24px]">
            All Articles
          </h1>
          <p className="text-heading-sm text-black-forest font-medium">
            Explore our complete archive of methodologies, reflections, and deep
            dives into intentional living.
          </p>
        </header>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-[24px] mb-[64px] bg-surface rounded-[8px] p-[24px] border border-border-light shadow-sm">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field w-full"
            />
          </div>
          <div className="w-full md:w-[250px]">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field w-full appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="flex justify-center py-[64px]">
            <div className="animate-spin w-[40px] h-[40px] border-[4px] border-copperwood border-t-transparent rounded-full"></div>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[32px]">
            {filteredArticles.map((article) => (
              <Link
                to={`/article/${article.slug}`}
                key={article.id}
                className="card-elevated group flex flex-col h-full"
              >
                {article.main_image_url && (
                  <div className="h-[200px] -mx-[32px] -mt-[32px] mb-[24px] overflow-hidden rounded-t-[8px]">
                    <img
                      src={article.main_image_url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="flex-1 flex flex-col">
                  {article.categories?.name && (
                    <span className="text-micro text-sunlit-clay uppercase tracking-[1px] mb-[12px] block">
                      {article.categories.name}
                    </span>
                  )}
                  <h3 className="text-card-title text-black-forest mb-[12px] group-hover:text-copperwood transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-body-sm text-black-forest line-clamp-3 mb-[24px] flex-1">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-caption-bold text-black-forest pt-[16px] border-t border-border-light mt-auto">
                    <span>
                      {new Date(article.created_at).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" },
                      )}
                    </span>
                    <span>Read Article &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-[64px] bg-surface rounded-[8px] border border-border-light">
            <p className="text-heading-sm text-black-forest mb-[8px]">
              No articles found.
            </p>
            <p className="text-body-sm text-black-forest">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
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
