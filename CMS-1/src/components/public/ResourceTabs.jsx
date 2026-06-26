import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';

export default function ResourceTabs() {
  const [activeTab, setActiveTab] = useState('book');
  const [resources, setResources] = useState([]);

  useEffect(() => {
    async function fetchResources() {
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('type', activeTab);
        if (data) setResources(data);
      } catch (err) {
        console.error('Error fetching resources:', err);
      }
    }
    fetchResources();
  }, [activeTab]);

  return (
    <div className="my-16">
      <h2 className="text-3xl font-black mb-8 tracking-tight">Resources</h2>
      <div className="flex gap-4 border-b border-gray-200 mb-8">
        {['book', 'worksheet', 'tool'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-2 font-medium capitalize transition-colors ${
              activeTab === tab 
                ? 'border-b-2 border-slate-900 text-slate-900' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}s
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <div key={resource.id} className="border border-gray-100 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg mb-2">{resource.title}</h3>
            {activeTab === 'book' && (
              <div className="flex items-center gap-1 mb-4">
                <span className="text-yellow-400 font-bold">★ {resource.rating?.toFixed(1) || '0.0'}</span>
              </div>
            )}
            {activeTab === 'worksheet' && (
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium mb-3">
                  {resource.badge_label || 'Worksheet'}
                </span>
                <ul className="text-sm text-slate-600 space-y-1 list-disc pl-4">
                  {(resource.features || []).map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            <a 
              href={resource.external_url || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 block w-full text-center bg-slate-900 text-white py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors"
            >
              {activeTab === 'book' ? 'Get on Amazon' : activeTab === 'worksheet' ? 'Download PDF' : 'View Tool'}
            </a>
          </div>
        ))}
        {resources.length === 0 && <p className="text-slate-500 col-span-full">No resources found in this category.</p>}
      </div>
    </div>
  );
}
