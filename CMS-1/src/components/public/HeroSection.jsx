import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <div className="bg-surface rounded-[8px] py-[96px] text-center max-w-5xl mx-auto mb-[80px] border border-border-light shadow-sm">
      <h1 className="text-hero-display text-black-forest mb-[24px]">
        Productivity <br/> Redefined
      </h1>
      <p className="text-heading-sm text-black-forest max-w-2xl mx-auto mb-[48px] px-[24px] font-sans font-medium">
        Discover our high-signal, low-noise methodologies. Reclaim your attention, build atomic systems, and optimize your cognitive framework.
      </p>
      <div className="flex justify-center gap-[16px]">
        <Link to="/articles" className="btn-primary">
          Start Reading
        </Link>
        <Link to="/resources" className="btn-secondary">
          Explore Library
        </Link>
      </div>
    </div>
  );
}
