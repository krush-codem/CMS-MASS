import { Link } from 'react-router-dom';

export default function ArticleCard({ article }) {
  const authorName = article.lead_author || 'Editorial Team';
  const imageUrl = article.main_image_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80';
  const dateString = article.created_at ? new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown Date';
  
  let categoryName = 'Uncategorized';
  if (Array.isArray(article.categories) && article.categories.length > 0) {
    categoryName = article.categories.map(c => c.name || c).join(', ');
  } else if (article.categories?.name) {
    categoryName = article.categories.name;
  } else if (Array.isArray(article.tags) && article.tags.length > 0) {
    categoryName = article.tags.join(', ');
  }

  return (
    <Link to={`/article/${article.slug || article.id}`} className="card-elevated group flex flex-col h-full overflow-hidden bg-surface border border-border-light rounded-[12px] hover:shadow-lg transition-all duration-300">
      <div className="w-full aspect-[16/9] md:aspect-[4/3] overflow-hidden relative shrink-0">
        <img 
          src={imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
        />
        {article.badge && (
           <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-copperwood text-white text-[9px] sm:text-[10px] font-bold uppercase px-2 py-1 sm:px-3 sm:py-1 rounded-full tracking-wider shadow-md">
             {article.badge}
           </div>
        )}
      </div>
      
      <div className="p-[16px] sm:p-[20px] lg:p-[24px] flex-1 flex flex-col">
        <div className="mb-[8px] sm:mb-[12px]">
          <span className="text-[10px] sm:text-[11px] font-bold text-sunlit-clay uppercase tracking-wider">
            {categoryName}
          </span>
        </div>
        
        <h3 className="text-[18px] sm:text-[20px] font-display font-bold text-black-forest mb-[8px] sm:mb-[12px] group-hover:text-copperwood transition-colors leading-tight line-clamp-2">
          {article.title}
        </h3>
        
        {article.excerpt && (
          <p className="text-body-sm text-black-forest/80 line-clamp-2 mb-[16px] sm:mb-[24px] flex-1 leading-relaxed">
            {article.excerpt}
          </p>
        )}
        
        <div className="flex items-center justify-between text-[11px] sm:text-[12px] font-bold text-black-forest/60 pt-[12px] sm:pt-[16px] border-t border-border-light/50 mt-auto gap-[8px]">
          <div className="flex items-center gap-[6px] sm:gap-[8px] min-w-0 flex-1">
            <div className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] rounded-full bg-surface-elevated border border-border-dark flex items-center justify-center text-[9px] sm:text-[10px] text-copperwood shrink-0">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <span className="truncate text-black-forest/80">{authorName}</span>
          </div>
          <span className="shrink-0 text-right">{dateString}</span>
        </div>
      </div>
    </Link>
  );
}
