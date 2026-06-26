import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import { supabase } from '../config/supabaseClient';

export default function Resources() {
  const [activeTab, setActiveTab] = useState('book');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMockResources = (tab) => {
    if (tab === 'book') return [{ id: 1, title: 'Deep Work', author: 'Cal Newport', rating: 4.8, description: 'Rules for focused success in a distracted world.', external_url: '#' }];
    if (tab === 'worksheet') return [{ id: 2, title: 'Weekly Review Template', features: ['Sunday planning checklist', 'Habit tracker matrix', 'Reflection prompts'], badge_label: 'Free PDF Download', external_url: '#' }];
    return [{ id: 3, title: 'Cold Turkey Blocker', description: 'The toughest website blocker on the internet.', external_url: '#' }];
  };

  useEffect(() => {
    async function fetchResources() {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('resources').select('*').eq('type', activeTab);
        if (error) throw error;
        setResources(data && data.length > 0 ? data : getMockResources(activeTab));
      } catch (err) {
        setResources(getMockResources(activeTab));
      } finally {
        setLoading(false);
      }
    }
    fetchResources();
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-base font-sans selection:bg-copperwood selection:text-white">
      <Navbar />
      <main className="flex-1 max-w-[1280px] mx-auto w-full px-[32px] py-[80px]">
        <header className="mb-[48px]">
          <h1 className="text-display-lg text-black-forest mb-[16px]">
            Library
          </h1>
          <p className="text-heading-sm text-black-forest font-medium">
            Curated infrastructure tools, operational templates, and
            foundational texts.
          </p>
        </header>

        {/* Pill Tabs Nav */}
        <div className="flex gap-[12px] mb-[64px]">
          {["book", "worksheet", "tool"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`btn-pill-surface ${activeTab === tab ? "active" : ""}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}s
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-[64px]">
            <div className="animate-spin w-[40px] h-[40px] border-[4px] border-copperwood border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
            {resources.map((res) => (
              <div
                key={res.id}
                className="card-elevated flex flex-col h-[320px] group"
              >
                <div className="mb-[24px] flex-1">
                  {activeTab === "worksheet" && res.badge_label && (
                    <span className="badge-code mb-[16px] inline-block text-copperwood">
                      {res.badge_label}
                    </span>
                  )}
                  <h3 className="text-card-title text-black-forest mb-[8px] group-hover:text-copperwood transition-colors">
                    {res.title}
                  </h3>

                  {activeTab === "book" && (
                    <div className="flex flex-col gap-[4px] mb-[16px]">
                      <span className="text-body-sm-bold text-black-forest">
                        by {res.author || "Unknown"}
                      </span>
                      <div className="flex text-sunlit-clay text-[14px] mt-[4px]">
                        {"★".repeat(Math.round(res.rating || 5))}
                        {"☆".repeat(5 - Math.round(res.rating || 5))}
                      </div>
                    </div>
                  )}

                  {activeTab === "worksheet" && res.features && (
                    <ul className="space-y-[8px] mt-[16px]">
                      {res.features.map((f, i) => (
                        <li
                          key={i}
                          className="text-body-sm text-black-forest flex items-start gap-[8px]"
                        >
                          <span className="text-copperwood mt-[2px] font-bold">
                            •
                          </span>{" "}
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  {(activeTab === "book" || activeTab === "tool") && (
                    <p className="text-body-sm text-black-forest leading-relaxed line-clamp-4">
                      {res.description}
                    </p>
                  )}
                </div>

                <a
                  href={res.external_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full text-center"
                >
                  {activeTab === "book"
                    ? "View on Amazon"
                    : activeTab === "worksheet"
                      ? "Download PDF"
                      : "Visit Website"}
                </a>
              </div>
            ))}
          </div>
        )}
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
