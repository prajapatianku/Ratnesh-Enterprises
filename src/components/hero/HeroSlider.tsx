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
  Video,
  Grid,
  CheckCircle2
} from 'lucide-react';
import { ShopSettings, ProductCategory, BannerSlide } from '../../types';

interface HeroSliderProps {
  onOpenCalculator: () => void;
  shopSettings: ShopSettings;
  onSelectCategory?: (category: ProductCategory | 'all') => void;
  onSelectBrandFilter?: (brand: string) => void;
}

export const DEFAULT_BANNER_SLIDES: BannerSlide[] = [
  {
    id: 'vitrified-slabs',
    badge: 'ORIENTBELL & ADDON',
    badgeBg: 'bg-amber-500 text-slate-950',
    title: 'Grand Vitrified Marble Slabs',
    subtitle: '600x1200 mm & large format PGVT tiles with high-gloss mirror polish for luxury floors & walls.',
    ctaText: 'Explore Tiles',
    ctaTarget: '#catalog',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    categoryFilter: 'tiles',
  },
  {
    id: 'designer-basins',
    badge: 'MICROVIT SANITARY',
    badgeBg: 'bg-emerald-500 text-slate-950',
    title: 'Artisan Designer Washbasins',
    subtitle: 'Matte fluted ceramics, gold-veined marble bowls & countertop vanity basins.',
    ctaText: 'View Washbasins',
    ctaTarget: '#catalog',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=85',
    categoryFilter: 'sanitary',
  },
  {
    id: 'luxury-taps',
    badge: 'JULIET & POLO FITTINGS',
    badgeBg: 'bg-blue-500 text-white',
    title: 'Precision Brass Taps & Diverters',
    subtitle: 'Heavy forged brass, mirror chrome & concealed diverter systems for modern bathrooms.',
    ctaText: 'Browse Bath Taps',
    ctaTarget: '#catalog',
    imageUrl: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1600&q=85',
    categoryFilter: 'fittings',
  },
  {
    id: 'rain-showers',
    badge: 'LUXURY SHOWER SUITES',
    badgeBg: 'bg-cyan-500 text-slate-950',
    title: 'Ceiling Rain Showers & Jet Panels',
    subtitle: 'Ultra-slim SS-304 rain heads with air-injection mist and waterfall flow.',
    ctaText: 'View Rain Showers',
    ctaTarget: '#catalog',
    imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1600&q=85',
    categoryFilter: 'fittings',
  },
  {
    id: 'real-showroom',
    badge: 'EXPERIENCE STUDIO',
    badgeBg: 'bg-purple-500 text-white',
    title: 'Visit 1,000+ Live Tile & Bath Displays',
    subtitle: 'Touch real textures and compare finishes at our flagship showroom in Bokaro.',
    ctaText: 'Watch Showroom Video',
    ctaTarget: '#video-tour',
    imageUrl: '/assets/aistudio/20261010_152610_fbe3c357.jpg',
  },
];

export const HeroSlider: React.FC<HeroSliderProps> = ({
  onOpenCalculator,
  shopSettings,
  onSelectCategory,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const bannerSlides: BannerSlide[] =
    shopSettings.heroBanners && shopSettings.heroBanners.length > 0
      ? shopSettings.heroBanners
      : DEFAULT_BANNER_SLIDES;

  // Auto-advance banner every 4 seconds (like Flipkart / Amazon)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, bannerSlides.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % bannerSlides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  const handleSlideCta = (slide: BannerSlide) => {
    if (slide.categoryFilter && onSelectCategory) {
      onSelectCategory(slide.categoryFilter);
    }
    const el = document.getElementById(slide.ctaTarget.replace('#', ''));
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = slide.ctaTarget;
    }
  };

  const handleCategoryClick = (cat: ProductCategory | 'all' | 'calculator' | 'video') => {
    if (cat === 'calculator') {
      onOpenCalculator();
      return;
    }
    if (cat === 'video') {
      const el = document.getElementById('video-tour');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (delta > 40) handleNext();
    else if (delta < -40) handlePrev();
    touchStartX.current = null;
  };

  const currentSlide = bannerSlides[currentIndex] || bannerSlides[0];

  return (
    <div className="w-full bg-slate-50 border-b border-slate-200">
      {/* =========================================================================
          FLIPKART STYLE CATEGORY QUICK NAVIGATION BAR
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-3 pb-2">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-2 sm:p-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between sm:justify-around min-w-[620px] sm:min-w-0 gap-2 sm:gap-4">
            {/* All Products */}
            <button
              onClick={() => handleCategoryClick('all')}
              className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-slate-50 transition-all group cursor-pointer text-center"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-amber-100 group-hover:scale-105 transition-all border border-slate-200 shadow-2xs">
                <Grid className="w-5 h-5 text-slate-700 group-hover:text-amber-800 transition-colors" />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-800 group-hover:text-amber-800 whitespace-nowrap">
                All Catalog
              </span>
            </button>

            {/* Vitrified & Floor Tiles */}
            <button
              onClick={() => handleCategoryClick('tiles')}
              className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-slate-50 transition-all group cursor-pointer text-center"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-50 flex items-center justify-center group-hover:bg-amber-200 group-hover:scale-105 transition-all border border-amber-200 shadow-2xs">
                <Layers className="w-5 h-5 text-amber-800" />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-800 group-hover:text-amber-800 whitespace-nowrap">
                Vitrified Tiles
              </span>
            </button>

            {/* Designer Washbasins & Sanitaryware */}
            <button
              onClick={() => handleCategoryClick('sanitary')}
              className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-slate-50 transition-all group cursor-pointer text-center"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-200 group-hover:scale-105 transition-all border border-emerald-200 shadow-2xs">
                <Bath className="w-5 h-5 text-emerald-800" />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-800 group-hover:text-emerald-800 whitespace-nowrap">
                Washbasins
              </span>
            </button>

            {/* Brass Taps & Fittings */}
            <button
              onClick={() => handleCategoryClick('fittings')}
              className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-slate-50 transition-all group cursor-pointer text-center"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-200 group-hover:scale-105 transition-all border border-blue-200 shadow-2xs">
                <Droplets className="w-5 h-5 text-blue-800" />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-800 group-hover:text-blue-800 whitespace-nowrap">
                Taps & Fittings
              </span>
            </button>

            {/* Showroom Video Tour */}
            <button
              onClick={() => handleCategoryClick('video')}
              className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-slate-50 transition-all group cursor-pointer text-center"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-200 group-hover:scale-105 transition-all border border-purple-200 shadow-2xs">
                <Video className="w-5 h-5 text-purple-800" />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-800 group-hover:text-purple-800 whitespace-nowrap">
                Showroom Video
              </span>
            </button>

            {/* Tile Calculator */}
            <button
              onClick={() => handleCategoryClick('calculator')}
              className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-slate-50 transition-all group cursor-pointer text-center"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-orange-200 group-hover:scale-105 transition-all border border-orange-200 shadow-2xs">
                <Calculator className="w-5 h-5 text-orange-800" />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-800 group-hover:text-orange-800 whitespace-nowrap">
                Tile Calculator
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          FLIPKART / AMAZON STYLE HERO SLIDING BANNER CAROUSEL
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 pb-4">
        <div
          className="relative w-full h-[190px] sm:h-[260px] md:h-[320px] lg:h-[350px] rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900 group select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Background Image with uniform cover */}
          <img
            src={currentSlide.imageUrl}
            alt={currentSlide.title}
            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out"
            key={currentSlide.id}
          />

          {/* Flipkart / Amazon Gradient Scrim Overlay for 100% Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent sm:via-slate-950/40" />

          {/* Banner Text Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-16 max-w-xl lg:max-w-2xl z-10">
            {/* Pill Badge */}
            <div className="mb-1.5 sm:mb-2.5">
              <span className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs ${currentSlide.badgeBg}`}>
                <Sparkles className="w-3 h-3" />
                <span>{currentSlide.badge}</span>
              </span>
            </div>

            {/* Main Title (Responsive & Never Truncated) */}
            <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
              {currentSlide.title}
            </h2>

            {/* Subtitle (1 clean sentence) */}
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-200 line-clamp-2 drop-shadow-xs max-w-md">
              {currentSlide.subtitle}
            </p>

            {/* Flipkart Style CTA Button */}
            <div className="mt-2.5 sm:mt-4">
              <button
                onClick={() => handleSlideCta(currentSlide)}
                className="inline-flex items-center gap-1.5 bg-white text-slate-900 hover:bg-amber-400 font-bold px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all hover:scale-105 cursor-pointer active:scale-95"
              >
                <span>{currentSlide.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Flipkart Floating Left Arrow (<) */}
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 hover:scale-110 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Flipkart Floating Right Arrow (>) */}
          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 hover:scale-110 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Flipkart Dot Pagination Indicators */}
          <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
            {bannerSlides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentIndex === idx
                    ? 'w-6 sm:w-8 h-1.5 sm:h-2 bg-amber-400 shadow-xs'
                    : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
