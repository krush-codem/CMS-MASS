export default function StatusSelectors({ isHero, setIsHero, isEditorial, setIsEditorial, status, setStatus }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
      <h3 className="text-lg font-bold">Feature & Status Control</h3>
      
      <div className="space-y-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={isHero} 
            onChange={(e) => setIsHero(e.target.checked)}
            className="w-5 h-5 text-slate-900 border-gray-300 rounded focus:ring-slate-900"
          />
          <div>
            <span className="block font-medium text-slate-900">Hero Spotlight</span>
            <span className="block text-xs text-slate-500">Add this article to the Hero Carousel.</span>
          </div>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={isEditorial} 
            onChange={(e) => setIsEditorial(e.target.checked)}
            className="w-5 h-5 text-slate-900 border-gray-300 rounded focus:ring-slate-900"
          />
          <div>
            <span className="block font-medium text-slate-900">Editorial Pick</span>
            <span className="block text-xs text-slate-500">Show in the editorial picks grid.</span>
          </div>
        </label>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <label className="block text-sm font-medium text-slate-900 mb-2">Workflow Status</label>
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-slate-900"
        >
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
        </select>
      </div>
    </div>
  );
}
