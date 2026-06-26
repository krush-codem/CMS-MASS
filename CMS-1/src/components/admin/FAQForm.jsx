import { useState } from 'react';

export default function FAQForm({ faqs = [], onChange }) {
  const [q, setQ] = useState('');
  const [a, setA] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const addFaq = () => {
    if (!q.trim() || !a.trim()) return;
    onChange([...faqs, { id: crypto.randomUUID(), q, a }]);
    setQ('');
    setA('');
  };

  const removeFaq = (id) => onChange(faqs.filter(f => f.id !== id));

  return (
    <div className="bg-surface border border-border-light shadow-sm p-8 rounded-3xl border border-border-light/50 shadow-sm mt-8">
      <h3 className="text-xl font-display font-bold text-black-forest mb-6">FAQ Matrix Builder</h3>
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-1 space-y-3">
          <input 
            type="text" 
            value={q} 
            onChange={(e) => setQ(e.target.value)} 
            placeholder="Question..." 
            className="w-full p-3 bg-surface-elevated/50 border border-border-light rounded-xl outline-none focus:ring-2 focus:ring-cozy-accent transition-all"
          />
          <textarea 
            value={a} 
            onChange={(e) => setA(e.target.value)} 
            placeholder="Answer..." 
            className="w-full p-3 bg-surface-elevated/50 border border-border-light rounded-xl outline-none focus:ring-2 focus:ring-cozy-accent transition-all"
            rows="3"
          />
          <button 
            type="button" 
            onClick={addFaq}
            className="w-full bg-copperwood text-white font-bold py-3 rounded-xl hover:bg-black-forest transition-all duration-300"
          >
            Add FAQ Pair
          </button>
        </div>
        
        <div className="flex-1 border-l-0 md:border-l border-border-light/50 md:pl-6">
          <h4 className="text-sm font-bold text-black-forest/50 uppercase tracking-wider mb-4">Live Preview Accordion</h4>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={faq.id} className="border border-border-light rounded-xl overflow-hidden group relative">
                <button 
                  type="button" 
                  onClick={() => removeFaq(faq.id)}
                  className="absolute top-3 right-3 text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity z-10"
                >
                  ✕
                </button>
                <button 
                  type="button"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full text-left p-4 bg-surface-elevated/30 hover:bg-surface-elevated/60 font-bold text-black-forest pr-10 transition-colors"
                >
                  {faq.q}
                </button>
                {openIndex === index && (
                  <div className="p-4 border-t border-border-light bg-white text-black-forest/80 text-sm leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
            {faqs.length === 0 && (
              <div className="text-center py-8 text-black-forest/40 text-sm border border-dashed border-border-light rounded-xl">
                Accordion preview will appear here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
