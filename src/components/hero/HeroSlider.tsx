import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Calculator,
  Grid3X3,
  Sparkles
} from 'lucide-react';
import { ShopSettings, ProductCategory, HeroSlide } from '../../types';

interface HeroSliderProps {
  onOpenCalculator: () => void;
  shopSettings: ShopSettings;
  onSelectCategory?: (category: ProductCategory | 'all') => void;
  onSelectBrandFilter?: (brand: string) => void;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 'vitrified-slabs',
    badge: 'LUXURY SURFACES',
    title: 'Grand Vitrified Slabs & Designer Flooring',
    subtitle: 'High Gloss, Matte & Carving Vein finishes in 600x1200 mm & large formats.',
    description: '',
    ctaText: 'Explore Tiles',
    ctaTarget: '#catalog',
    secondaryCtaText: 'Tile Calculator',
    secondaryCtaTarget: 'calculator',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 'microvit-sanitary',
    badge: 'EXCLUSIVE SANITARYWARE',
    title: 'Designer Table-Top Basins & Ceramic Suites',
    subtitle: 'Vitreous china basins, rimless commodes, and luxury bathroom aesthetics.',
    description: '',
    ctaText: 'View Sanitaryware',
    ctaTarget: '#catalog',
    secondaryCtaText: 'WhatsApp Inquiry',
    secondaryCtaTarget: 'whatsapp',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 'juliet-polo-fittings',
    badge: 'PRECISION FITTINGS',
    title: 'Luxury CP Faucets, Diverters & Showers',
    subtitle: 'Engineered brass fittings with flawless chrome, matte black & PVD finishes.',
    description: '',
    ctaText: 'Browse Fittings',
    ctaTarget: '#catalog',
    secondaryCtaText: 'Calculate Boxes',
    secondaryCtaTarget: 'calculator',
    imageUrl: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 'showroom-experience',
    badge: 'VISIT OUR SHOWROOM',
    title: 'Experience 1,000+ Slabs & Live Mockups in Person',
    subtitle: 'Flagship boutique in Jainamore, Bokaro with authorized brand direct pricing.',
    description: '',
    ctaText: 'Watch Showroom Video',
    ctaTarget: '#video-tour',
    secondaryCtaText: 'Get Directions',
    secondaryCtaTarget: 'maps',
    imageUrl: '/assets/aistudio/20261010_152610_fbe3c357.jpg',
  },
];

export const HeroSlider: React.FC<HeroSliderProps> = ({
  onOpenCalculator,
  shopSettings,
  onSelectCategory,
}) => {
  const slides = shopSettings.heroSlides && shopSettings.heroSlides.length > 0
    ? shopSettings.heroSlides
    : DEFAULT_SLIDES;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto-advance sliding poster every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleActionClick = (target: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (target === 'calculator') {
      onOpenCalculator();
    } else if (target === 'whatsapp') {
      const text = encodeURIComponent(
        `Hello ${shopSettings.shopName}! I would like to inquire about tiles and sanitaryware pricing.`
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

  return (
    <section className="relative w-full bg-slate-900 text-white overflow-hidden">
      {/* Cinematic Sliding Poster Container (Ganesh Ceramic Style) */}
      <div
        className="relative w-full h-[400px] sm:h-[500px] lg:h-[580px] overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id || index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Poster Image */}
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover object-center"
                loading={index === 0 ? 'eager' : 'lazy'}
              />

              {/* Gradient Dark Scrim for High-Contrast Luxury Typography */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

              {/* Poster Typography & Actions */}
              <div className="absolute inset-0 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex flex-col justify-center">
                <div className="max-w-2xl">
                  {slide.badge && (
                    <span className="inline-block text-[11px] sm:text-xs font-bold tracking-widest text-amber-400 uppercase mb-3 px-3 py-1 bg-amber-500/20 border border-amber-400/30 rounded-full backdrop-blur-xs">
                      {slide.badge}
                    </span>
                  )}

                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                    {slide.title}
                  </h1>

                  <p className="mt-3 text-sm sm:text-base text-slate-200 font-medium leading-relaxed max-w-xl">
                    {slide.subtitle}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      onClick={(e) => handleActionClick(slide.ctaTarget, e)}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
                    >
                      <span>{slide.ctaText || 'Explore Catalog'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {slide.secondaryCtaText && (
                      <button
                        onClick={(e) => handleActionClick(slide.secondaryCtaTarget || '#catalog', e)}
                        className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs sm:text-sm border border-white/25 backdrop-blur-xs transition-all cursor-pointer"
                      >
                        {slide.secondaryCtaText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Previous & Next Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
          title="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
          title="Next slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Slide Indicators (Dots) */}
        <div className="absolute bottom-6 inset-x-0 z-20 flex items-center justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentSlide
                  ? 'w-8 bg-amber-400'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Quick Category Jump Strip (Minimal & Clean) */}
      <div className="w-full bg-slate-950 border-t border-slate-800 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <span className="text-xs text-slate-400 font-semibold shrink-0 uppercase tracking-wider">
            Quick Categories:
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (onSelectCategory) onSelectCategory('all');
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
            >
              All Products
            </button>
            <button
              onClick={() => {
                if (onSelectCategory) onSelectCategory('tiles');
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
            >
              Vitrified & Wall Tiles
            </button>
            <button
              onClick={() => {
                if (onSelectCategory) onSelectCategory('sanitary');
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
            >
              Sanitaryware & Basins
            </button>
            <button
              onClick={() => {
                if (onSelectCategory) onSelectCategory('fittings');
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
            >
              Bath Fittings & Showers
            </button>
            <button
              onClick={onOpenCalculator}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Tile Calculator</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
