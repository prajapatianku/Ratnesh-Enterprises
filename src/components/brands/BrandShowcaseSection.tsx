import React, { useState, useEffect, useRef } from 'react';
import { Brand } from '../../types';
import { BRAND_DIRECTORY, BrandLogo } from './BrandLogos';
import {
  Award,
  ArrowRight,
  Play,
  Pause,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  X,
  Layers,
} from 'lucide-react';

interface BrandShowcaseSectionProps {
  onSelectBrandFilter: (brand: Brand) => void;
  activeBrandFilter?: string;
  customBrandLogos?: Record<string, string>;
}

export const BrandShowcaseSection: React.FC<BrandShowcaseSectionProps> = ({
  onSelectBrandFilter,
  activeBrandFilter = 'all',
  customBrandLogos = {},
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Direction: 'ltr' (Left to Right, as requested) or 'rtl' (Right to Left)
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'tiles' | 'sanitary' | 'fittings'>('all');

  // Scroll Parallax State
  const [scrollParallax, setScrollParallax] = useState<number>(0);
  const [watermarkParallax, setWatermarkParallax] = useState<number>(0);

  // Scroll listener to calculate dynamic scroll-linked animation
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // When section is near or in viewport
            if (rect.top < windowHeight && rect.bottom > 0) {
              const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
              // Shift from -60px to +60px depending on scroll progress
              const shift = (scrollProgress - 0.5) * 120;
              setScrollParallax(shift);
              // Watermark counter-shift for rich depth
              setWatermarkParallax(-shift * 0.8);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial measure

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Filtered list of brands based on category chips
  const filteredBrands = BRAND_DIRECTORY.filter((brand) => {
    if (selectedCategory === 'all') return true;
    return brand.category === selectedCategory;
  });

  // Triplicate the brands array for flawless, gapless infinite marquee
  const marqueeItems = [...filteredBrands, ...filteredBrands, ...filteredBrands];

  const handleBrandClick = (brandId: Brand) => {
    onSelectBrandFilter(brandId);
    // Smoothly scroll down to the product catalog
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleManualNudge = (delta: 'left' | 'right') => {
    if (trackRef.current) {
      // Temporarily pause animation and scroll container
      trackRef.current.scrollBy({
        left: delta === 'left' ? -320 : 320,
        behavior: 'smooth',
      });
    }
  };

  const activeMeta = BRAND_DIRECTORY.find(
    (b) => b.id.toLowerCase() === activeBrandFilter.toLowerCase()
  );

  return (
    <section
      ref={sectionRef}
      id="brands"
      className="relative w-full py-14 sm:py-20 bg-gradient-to-b from-white via-slate-50/70 to-white border-y border-slate-200/80 overflow-hidden"
    >
      {/* =========================================================================
          BACKGROUND WATERMARK: Architectural "Tiles & Sanitaryware" Typographic Art
          (Inspired by luxury ceramic showcase websites like Ganesh Ceramic)
         ========================================================================= */}
      <div
        className="relative md:absolute md:inset-x-0 md:top-6 lg:top-10 z-[1] flex items-center justify-center pointer-events-none select-none overflow-hidden px-2 sm:px-4 pt-8 sm:pt-10 md:pt-0"
        style={{
          opacity: 1,
          transform: `translate3d(${watermarkParallax}px, 0, 0)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        <h2
          className="font-bold text-center whitespace-nowrap leading-none transition-all duration-700 select-none max-w-full tracking-tight sm:tracking-normal"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(20px, 6.8vw, 160px)',
            letterSpacing: '0px',
            backgroundColor: 'transparent',
            backgroundImage:
              'linear-gradient(rgb(216, 216, 216) 0%, rgba(219, 217, 217, 0.38) 75.48%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
          }}
        >
          Tiles &amp; Sanitaryware
        </h2>
      </div>

      {/* =========================================================================
          FOREGROUND CONTENT & HEADER
         ========================================================================= */}
      <div className="relative z-[10] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Section Titles */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2.5 shadow-2xs">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Official Authorized Showroom Dealerships</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              Our Premium Brand Partners
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Authentic vitrified floor & wall slabs, microvit sanitaryware, and designer CP fittings.
              Gliding live showroom flow from left to right.
            </p>
          </div>

          {/* Interactive Flow Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Live Flow Indicator & Direction Toggle */}
            <button
              type="button"
              onClick={() => setDirection(direction === 'ltr' ? 'rtl' : 'ltr')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer group"
              title="Click to toggle flow direction"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-amber-600 group-hover:rotate-180 transition-transform duration-300" />
              <span>
                Flow:{' '}
                <strong className="text-amber-800 font-bold">
                  {direction === 'ltr' ? 'Left to Right ➔' : 'Right to Left ➔'}
                </strong>
              </span>
            </button>

            {/* Play / Pause Flow */}
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              title={isPaused ? 'Resume live flow' : 'Pause live flow'}
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-slate-600" />
                  <span>Pause</span>
                </>
              )}
            </button>

            {/* Left / Right Manual Nudge */}
            <div className="hidden sm:inline-flex items-center border border-slate-200 rounded-xl bg-white shadow-2xs overflow-hidden">
              <button
                type="button"
                onClick={() => handleManualNudge('left')}
                className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                title="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-slate-200" />
              <button
                type="button"
                onClick={() => handleManualNudge('right')}
                className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                title="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Pill (if any brand is selected) */}
        {activeMeta && (
          <div className="mt-4 inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-medium shadow-2xs animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>
              Currently viewing authorized collection for:{' '}
              <strong className="font-bold text-amber-950">{activeMeta.displayName}</strong>
            </span>
            <button
              type="button"
              onClick={() => onSelectBrandFilter('all')}
              className="inline-flex items-center gap-1 ml-1 px-2 py-0.5 rounded-md bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold text-[11px] transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Show All Brands</span>
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          THE FLOWING BRAND CAROUSEL / CONTINUOUS MARQUEE TRACK
         ========================================================================= */}
      <div className="relative z-[10] w-full overflow-hidden py-3">
        {/* Left & Right Smooth Gradient Masks (Infinite Fade Edges) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-20" />

        {/* Outer scroll parallax container */}
        <div
          ref={trackRef}
          className="w-full flex items-center overflow-x-auto no-scrollbar scroll-smooth"
          style={{
            transform: `translate3d(${scrollParallax * 0.4}px, 0, 0)`,
            transition: 'transform 0.15s ease-out',
          }}
        >
          {/* Inner Continuous Moving Track */}
          <div
            className={`flex items-center gap-5 sm:gap-6 py-2 px-6 shrink-0 pause-flow ${
              direction === 'ltr' ? 'animate-flow-ltr' : 'animate-flow-rtl'
            }`}
            style={{
              animationPlayState: isPaused ? 'paused' : 'running',
              animationDuration: '30s',
            }}
          >
            {marqueeItems.map((brandMeta, idx) => {
              const isSelected =
                activeBrandFilter.toLowerCase() === brandMeta.id.toLowerCase();

              return (
                <button
                  key={`${brandMeta.id}-${idx}`}
                  type="button"
                  onClick={() => handleBrandClick(brandMeta.id)}
                  className={`group relative shrink-0 w-[260px] sm:w-[300px] rounded-2xl p-4 sm:p-5 border text-left transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50/90 border-amber-500 ring-3 ring-amber-500/25 shadow-md -translate-y-1'
                      : 'bg-white hover:bg-slate-50/90 border-slate-200/90 hover:border-amber-300 hover:shadow-lg hover:-translate-y-1'
                  }`}
                >
                  {/* Category Pill + Active Indicator */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 group-hover:bg-amber-100 group-hover:text-amber-900 transition-colors">
                      <Layers className="w-3 h-3 text-amber-600" />
                      {brandMeta.category}
                    </span>

                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3" />
                        Active Filter
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-600 group-hover:text-amber-700 font-semibold flex items-center gap-0.5 transition-colors">
                        View Products
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    )}
                  </div>

                  {/* Logo Display Box */}
                  <div className="w-full h-20 sm:h-22 rounded-xl bg-slate-50/80 border border-slate-100 p-2.5 flex items-center justify-center overflow-hidden mb-3.5 group-hover:bg-white group-hover:shadow-2xs transition-all">
                    <BrandLogo
                      brand={brandMeta.id}
                      variant="full"
                      customLogoUrl={customBrandLogos[brandMeta.id]}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  {/* Brand Meta Text */}
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-amber-800 transition-colors truncate">
                      {brandMeta.displayName}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {brandMeta.specialty || 'Authorized Showroom Collection'}
                    </p>
                  </div>

                  {/* Footer Tag */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600">
                    <span className="font-medium text-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                      Authorized Dealer
                    </span>
                    <span className="font-semibold text-slate-600 group-hover:text-amber-800">
                      Showroom Bokaro
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          CATEGORY FILTER CHIPS & HELPFUL HINT
         ========================================================================= */}
      <div className="relative z-[10] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 pt-4">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto py-1">
            <span className="text-xs text-slate-600 font-semibold shrink-0 mr-1">
              Browse by:
            </span>
            {(
              [
                { id: 'all', label: 'All Brands (7)' },
                { id: 'tiles', label: 'Tiles (4)' },
                { id: 'sanitary', label: 'Sanitaryware (1)' },
                { id: 'fittings', label: 'Bath Fittings (2)' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* User Hint */}
          <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Hover or tap any card to pause flow • Click to filter showroom catalog</span>
          </div>
        </div>
      </div>
    </section>
  );
};
