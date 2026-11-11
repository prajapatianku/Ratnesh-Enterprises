import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Calculator,
  Sparkles,
  Layers,
  Bath,
  Droplets,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { ShopSettings, ProductCategory } from '../../types';

interface HeroSliderProps {
  onOpenCalculator: () => void;
  shopSettings: ShopSettings;
  onSelectCategory?: (category: ProductCategory | 'all') => void;
  onSelectBrandFilter?: (brand: string) => void;
}

interface ShowcaseCard {
  id: string;
  badge: string;
  category: 'tiles' | 'sanitary' | 'fittings' | 'showroom';
  title: string;
  subtitle: string;
  highlights: string[];
  ctaText: string;
  ctaTarget: string;
  secondaryCtaText?: string;
  secondaryCtaTarget?: string;
  imageUrl: string;
  accentColor: string;
  materialTag: string;
}

const SHOWCASE_CARDS: ShowcaseCard[] = [
  {
    id: 'marble-slabs',
    badge: 'ITALIAN MARBLE & VITRIFIED',
    category: 'tiles',
    title: 'Grand Vitrified Slabs & Marble Finishes',
    subtitle: 'Statuario, Calacatta & Carving Veins in 600x1200 mm & large formats.',
    highlights: ['Nano-Glaze Mirror Polish', 'Zero Stain Absorption (<0.05%)', '10-Year Structural Warranty'],
    ctaText: 'Explore Vitrified Slabs',
    ctaTarget: '#catalog',
    secondaryCtaText: 'Tile Box Calculator',
    secondaryCtaTarget: 'calculator',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    accentColor: 'from-amber-600/90 to-amber-950/95',
    materialTag: 'Glazed Vitrified (PGVT / GVT)',
  },
  {
    id: 'designer-washbasins',
    badge: 'ARTISAN CERAMIC COLLECTION',
    category: 'sanitary',
    title: 'Microvit Designer Table-Top Washbasins',
    subtitle: 'Matte fluted ceramics, marble-veined bowls & gold-rim art basins.',
    highlights: ['Anti-Bacterial Glaze', 'Deep Anti-Splash Bowl Geometry', 'Soft-Close One-Piece Closets'],
    ctaText: 'View Washbasins',
    ctaTarget: '#catalog',
    secondaryCtaText: 'WhatsApp Price List',
    secondaryCtaTarget: 'whatsapp',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85',
    accentColor: 'from-emerald-700/90 to-slate-950/95',
    materialTag: 'High-Density Vitreous China',
  },
  {
    id: 'luxury-faucets-taps',
    badge: 'FORGED BRASS PRECISION',
    category: 'fittings',
    title: 'Juliet & Polo Luxury Taps & Diverters',
    subtitle: 'High-flow concealed diverters, tall body basin mixers & spouts.',
    highlights: ['Solid Heavy Brass Body', 'Triple-Layer Mirror Chrome', 'Smooth Ceramic Disc Cartridge'],
    ctaText: 'Browse Bath Taps',
    ctaTarget: '#catalog',
    secondaryCtaText: 'Wholesale Inquiry',
    secondaryCtaTarget: 'whatsapp',
    imageUrl: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=85',
    accentColor: 'from-blue-700/90 to-slate-950/95',
    materialTag: 'Lead-Free Brass Alloys',
  },
  {
    id: 'rain-showers',
    badge: 'LUXURY SHOWER SUITES',
    category: 'fittings',
    title: 'Ceiling Rain Showers & Body Jet Panels',
    subtitle: '12-inch ultra-slim stainless steel rain heads & thermostatic valves.',
    highlights: ['Self-Cleaning Silicon Nozzles', 'Air-Injection Mist & Rain Flow', 'Matte Black & PVD Gold Available'],
    ctaText: 'View Shower Panels',
    ctaTarget: '#catalog',
    secondaryCtaText: 'Tile Calculator',
    secondaryCtaTarget: 'calculator',
    imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=85',
    accentColor: 'from-cyan-700/90 to-slate-950/95',
    materialTag: 'SS-304 & Precision Brass',
  },
  {
    id: 'showroom-experience',
    badge: 'VISIT OUR EXPERIENCE STUDIO',
    category: 'showroom',
    title: 'Touch Real Textures in Jainamore, Bokaro',
    subtitle: 'Over 1,000+ live slab displays, basins and luxury bath setups in stock.',
    highlights: ['Authorized Brand Pricing', 'Compare Finishes Under True Light', 'Safe Site Hydraulic Delivery'],
    ctaText: 'Watch Showroom Video',
    ctaTarget: '#video-tour',
    secondaryCtaText: 'Get Map Directions',
    secondaryCtaTarget: 'maps',
    imageUrl: '/assets/aistudio/20261010_152610_fbe3c357.jpg',
    accentColor: 'from-slate-800/90 to-slate-950/95',
    materialTag: 'Flagship Showroom Bokaro',
  },
];

export const HeroSlider: React.FC<HeroSliderProps> = ({
  onOpenCalculator,
  shopSettings,
  onSelectCategory,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto-advance card slider every 4.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SHOWCASE_CARDS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % SHOWCASE_CARDS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + SHOWCASE_CARDS.length) % SHOWCASE_CARDS.length);
  };

  const handleActionClick = (target: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (target === 'calculator') {
      onOpenCalculator();
    } else if (target === 'whatsapp') {
      const text = encodeURIComponent(
        `Hello ${shopSettings.shopName}! I would like to inquire about tile prices, sanitary basins, and bath fittings.`
      );
      const num = shopSettings.whatsappNumber ? `/${shopSettings.whatsappNumber}` : '';
      window.open(`https://wa.me${num}?text=${text}`, '_blank');
    } else if (target === 'maps') {
      window.open(shopSettings.googleMapsUrl || 'https://maps.google.com', '_blank');
    } else if (target.startsWith('#')) {
      const el = document.getElementById(target.substring(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = target;
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) handleNext();
    else if (diff < -50) handlePrev();
    touchStartX.current = null;
  };

  const activeCard = SHOWCASE_CARDS[activeIndex];

  return (
    <section className="relative w-full bg-slate-950 text-white overflow-hidden py-10 sm:py-14 border-b border-slate-800">
      {/* Background Decorative Marble Texture Glow */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.25),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.2),transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Header: Luxury Headline & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/15 border border-amber-400/30 px-3 py-1 rounded-full mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>MARBLE, CERAMIC &amp; POLISHED BRASS STUDIO</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Grand Surfaces. Designer Basins. Precision Taps.
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl">
              Swipe or tap cards to preview luxury vitrified slabs, artisan washbasins, and high-pressure rain shower systems for modern architecture.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-slate-400 font-mono">
              <strong className="text-amber-400">0{activeIndex + 1}</strong> / 0{SHOWCASE_CARDS.length}
            </span>

            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl p-1">
              <button
                onClick={handlePrev}
                className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Previous card"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Next card"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CARD-BASED SLIDER / CAROUSEL
           ========================================================================= */}
        <div
          className="relative w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Active Hero Card Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl min-h-[440px] sm:min-h-[480px]">
            {/* Visual Image Side (7 cols on Desktop) */}
            <div className="lg:col-span-7 relative min-h-[260px] sm:min-h-[340px] lg:min-h-full overflow-hidden">
              <img
                src={activeCard.imageUrl}
                alt={activeCard.title}
                className="w-full h-full object-cover object-center transition-all duration-700 scale-102 hover:scale-105"
                key={activeCard.id}
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-900" />

              {/* Top-left Material Badge */}
              <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wide flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeCard.materialTag}</span>
              </div>
            </div>

            {/* Content & Action Side (5 cols on Desktop) */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-slate-900">
              <div>
                <span className="text-[11px] font-extrabold tracking-widest text-amber-400 uppercase block mb-2">
                  {activeCard.badge}
                </span>

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
                  {activeCard.title}
                </h2>

                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {activeCard.subtitle}
                </p>

                {/* Feature Highlights List */}
                <div className="mt-5 space-y-2 border-t border-slate-800 pt-4">
                  {activeCard.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
                <button
                  onClick={(e) => handleActionClick(activeCard.ctaTarget, e)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>{activeCard.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {activeCard.secondaryCtaText && (
                  <button
                    onClick={(e) => handleActionClick(activeCard.secondaryCtaTarget || '#catalog', e)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    {activeCard.secondaryCtaTarget === 'calculator' && <Calculator className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{activeCard.secondaryCtaText}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Card Thumbnails / Quick Jump Strip */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {SHOWCASE_CARDS.map((card, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={card.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-slate-800 border-amber-500 ring-2 ring-amber-500/30'
                      : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800'
                  }`}
                >
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-700"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block truncate">
                      {card.category}
                    </span>
                    <span className="text-xs font-bold text-white truncate block">
                      {card.title.split('&')[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Surface Jump Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-400 font-semibold mr-1">Direct Jump:</span>
            <button
              onClick={() => {
                if (onSelectCategory) onSelectCategory('tiles');
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors cursor-pointer"
            >
              Vitrified Marble Slabs (2x4 ft)
            </button>
            <button
              onClick={() => {
                if (onSelectCategory) onSelectCategory('sanitary');
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors cursor-pointer"
            >
              Artisan Table-Top Basins
            </button>
            <button
              onClick={() => {
                if (onSelectCategory) onSelectCategory('fittings');
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors cursor-pointer"
            >
              Concealed Diverters &amp; Taps
            </button>
          </div>

          <button
            onClick={onOpenCalculator}
            className="text-amber-400 hover:text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer underline"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Open Tile Box Calculator</span>
          </button>
        </div>
      </div>
    </section>
  );
};
