import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Ruler,
  PhoneCall,
  Sparkles,
  Award,
  Video,
  Layers,
  Bath,
  Droplets,
  Home,
  CheckCircle2,
  MapPin,
  Flame,
  Grid3X3
} from 'lucide-react';
import { ProductItem, ShopSettings, ProductCategory, HeroSlide } from '../../types';
import { BrandLogo } from '../brands/BrandLogos';

interface HeroSliderProps {
  onOpenCalculator: () => void;
  shopSettings: ShopSettings;
  onSelectCategory?: (category: ProductCategory | 'all') => void;
  onSelectBrandFilter?: (brand: string) => void;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 'vitrified-slabs',
    badge: 'NEW LUXURY ARRIVALS · 2026 COLLECTION',
    title: 'Grand Vitrified Slabs & Italian Marble Finishes',
    subtitle: '600x1200 mm (2x4 ft) & Large Format Porcelain Tiles',
    description:
      'Engineered with mirror-like High Gloss and Carving Vein technology. Stain-proof, anti-skid and zero water absorption for living rooms, master bedrooms & commercial halls.',
    ctaText: 'Explore Vitrified Tiles',
    ctaTarget: '#catalog',
    secondaryCtaText: 'Tile Box Calculator',
    secondaryCtaTarget: 'calculator',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    brandTags: ['Orientbell', 'Hels', 'Addon', 'Exotiles'],
    gradientTheme: 'amber',
  },
  {
    id: 'microvit-sanitary',
    badge: 'EXCLUSIVE SANITARY BOUTIQUE',
    title: 'Microvit Designer Table Top Basins & Closets',
    subtitle: 'Matte Finish, Marble Pattern & Gold Rim Ceramic Art',
    description:
      'Transform ordinary bathrooms into 5-star hotel suites with Microvit luxury ceramic basins, rimless soft-close commodes, and premium designer vanities.',
    ctaText: 'Browse Sanitaryware',
    ctaTarget: '#catalog',
    secondaryCtaText: 'Get WhatsApp Quotation',
    secondaryCtaTarget: 'whatsapp',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80',
    brandTags: ['Microvit', 'Addon'],
    gradientTheme: 'emerald',
  },
  {
    id: 'juliet-polo-fittings',
    badge: 'PRECISION GERMAN-STYLE ENGINEERING',
    title: 'Juliet & Polo Luxury Faucets & Rain Showers',
    subtitle: 'Solid Brass Concealed Diverters, Spouts & Shower Panels',
    description:
      'Heavy forged brass construction with diamond-chrome, matte black, and PVD gold coatings. High water flow performance tested for lifelong leak-free operation.',
    ctaText: 'View Bath Fittings',
    ctaTarget: '#catalog',
    secondaryCtaText: 'Contractor Wholesale Rates',
    secondaryCtaTarget: 'whatsapp',
    imageUrl: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1600&q=80',
    brandTags: ['Juliet', 'Polo'],
    gradientTheme: 'slate',
  },
  {
    id: 'showroom-experience',
    badge: 'FLAGSHIP STOREFRONT · JAINAMORE, BOKARO',
    title: 'Touch Real Slab Textures Under True Lighting',
    subtitle: 'Over 1000+ Slabs, Tiles & Sanitary Mockups in Stock',
    description:
      'Visit our spacious physical showroom near Prajapati Dharamshala, Teacher Colony, Jainamore. Direct authorized brand pricing with safe hydraulic site delivery across Jharkhand.',
    ctaText: 'Watch Showroom Video Tour',
    ctaTarget: '#video-tour',
    secondaryCtaText: 'Get Google Maps Directions',
    secondaryCtaTarget: 'maps',
    imageUrl: '/assets/aistudio/20261010_152610_fbe3c357.jpg',
    brandTags: ['Orientbell', 'Hels', 'Addon', 'Microvit', 'Juliet', 'Polo'],
    gradientTheme: 'gold',
  },
];

export const HeroSlider: React.FC<HeroSliderProps> = ({
  onOpenCalculator,
  shopSettings,
  onSelectCategory,
  onSelectBrandFilter,
}) => {
  const slides = shopSettings.heroSlides && shopSettings.heroSlides.length > 0
    ? shopSettings.heroSlides
    : DEFAULT_SLIDES;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto-slide every 5.5 seconds (Flipkart/Amazon style)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
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
        `Hello ${shopSettings.shopName}! I am interested in getting a quotation and design options for tiles and sanitaryware.`
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

  const handleCategoryQuickFilter = (cat: ProductCategory | 'all', subQuery?: string) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    const el = document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative w-full bg-white text-slate-900 border-b border-slate-200 overflow-hidden">
      {/* TOP ANNOUNCEMENT BANNER */}
      <div className="w-full bg-slate-900 text-white py-2 px-4 text-center text-xs font-medium tracking-wide flex items-center justify-center gap-2 border-b border-slate-800">
        <span className="flex items-center gap-1.5 font-bold text-amber-400">
          <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
          <span>FESTIVE & SHOWROOM OFFER:</span>
        </span>
        <span className="truncate max-w-xl text-slate-200">
          {shopSettings.announcementText ||
            'Direct Factory Batches for Orientbell, Hels, Addon, Microvit & Polo with Safe Site Delivery in Bokaro.'}
        </span>
        <button
          onClick={() => handleActionClick('whatsapp')}
          className="text-amber-400 hover:text-amber-300 font-bold underline ml-1 cursor-pointer shrink-0 text-[11px] uppercase tracking-wider"
        >
          Get Price List →
        </button>
      </div>

      {/* FLIPKART / AMAZON STYLE SLIDING HERO BANNER */}
      <div
        className="relative w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-3 sm:py-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-950 aspect-[16/10] sm:aspect-[21/9] lg:aspect-[24/9] min-h-[420px] sm:min-h-[460px]">
          {/* Slides Container */}
          {slides.map((s, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={s.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Background Image with Fallback and Scrim */}
                <img
                  src={s.imageUrl}
                  alt={s.title}
                  className="w-full h-full object-cover object-center scale-105 transition-transform duration-7000 ease-out"
                  referrerPolicy="no-referrer"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />

                {/* Dark Luxury Gradient Scrim for 100% Text Contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                {/* Slide Text Content */}
                <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-16 max-w-3xl">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-amber-300 bg-amber-500/20 border border-amber-400/40 px-3 py-1 rounded-full mb-3 w-fit backdrop-blur-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{s.badge}</span>
                  </div>

                  {/* Headline */}
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] drop-shadow-sm text-balance">
                    {s.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="mt-2 text-sm sm:text-lg font-bold text-amber-200 drop-shadow-xs">
                    {s.subtitle}
                  </p>

                  {/* Description */}
                  <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl line-clamp-2 sm:line-clamp-3">
                    {s.description}
                  </p>

                  {/* Brand Badges on Slide */}
                  {s.brandTags && s.brandTags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-4">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Authorized:
                      </span>
                      {s.brandTags.map((b) => (
                        <span
                          key={b}
                          className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white/15 text-white backdrop-blur-xs border border-white/20"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-3 mt-6">
                    <button
                      onClick={(e) => handleActionClick(s.ctaTarget, e)}
                      className="px-5 sm:px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-amber-500/25 hover:scale-[1.02] cursor-pointer"
                    >
                      <span>{s.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {s.secondaryCtaText && s.secondaryCtaTarget && (
                      <button
                        onClick={(e) => handleActionClick(s.secondaryCtaTarget!, e)}
                        className="px-4 sm:px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-colors border border-white/30 backdrop-blur-xs cursor-pointer"
                      >
                        {s.secondaryCtaTarget === 'calculator' && <Ruler className="w-4 h-4 text-amber-300" />}
                        {s.secondaryCtaTarget === 'whatsapp' && <PhoneCall className="w-4 h-4 text-emerald-400" />}
                        {s.secondaryCtaTarget === 'maps' && <MapPin className="w-4 h-4 text-amber-300" />}
                        {s.secondaryCtaTarget === '#video-tour' && <Video className="w-4 h-4 text-amber-300" />}
                        <span>{s.secondaryCtaText}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Previous / Next Arrow Controls (Flipkart/Amazon style) */}
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-amber-500 text-white hover:text-slate-950 flex items-center justify-center backdrop-blur-sm transition-all duration-200 cursor-pointer shadow-lg hover:scale-105"
            title="Previous Banner"
            aria-label="Previous Banner"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-amber-500 text-white hover:text-slate-950 flex items-center justify-center backdrop-blur-sm transition-all duration-200 cursor-pointer shadow-lg hover:scale-105"
            title="Next Banner"
            aria-label="Next Banner"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>

          {/* Slide Indicator Dots (Amazon/Flipkart pill style) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentSlide === idx
                    ? 'w-7 h-2.5 bg-amber-400'
                    : 'w-2.5 h-2.5 bg-white/50 hover:bg-white'
                }`}
                title={`Go to slide ${idx + 1}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* FLIPKART & GANESH CERAMIC STYLE CATEGORY QUICK STRIP */}
      <div className="w-full bg-slate-50 border-t border-slate-200 py-4 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-2 mb-3 px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Grid3X3 className="w-3.5 h-3.5 text-amber-700" />
              <span>Shop By Category</span>
            </span>
            <a
              href="#catalog"
              className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline"
            >
              View All Products (17+) →
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
            {/* 1. Floor Tiles */}
            <button
              onClick={() => handleCategoryQuickFilter('tiles', 'floor')}
              className="group p-3 bg-white hover:bg-amber-50/60 rounded-xl border border-slate-200 hover:border-amber-400 transition-all text-left flex items-center gap-2.5 shadow-2xs hover:shadow-xs cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 group-hover:scale-105 transition-transform">
                <Home className="w-4 h-4 text-amber-700" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 block truncate group-hover:text-amber-900">
                  Floor Tiles
                </span>
                <span className="text-[10px] text-slate-500 block truncate">
                  Living & Bedroom
                </span>
              </div>
            </button>

            {/* 2. Wall Tiles */}
            <button
              onClick={() => handleCategoryQuickFilter('tiles', 'wall')}
              className="group p-3 bg-white hover:bg-amber-50/60 rounded-xl border border-slate-200 hover:border-amber-400 transition-all text-left flex items-center gap-2.5 shadow-2xs hover:shadow-xs cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 group-hover:scale-105 transition-transform">
                <Layers className="w-4 h-4 text-amber-700" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 block truncate group-hover:text-amber-900">
                  Wall Slabs
                </span>
                <span className="text-[10px] text-slate-500 block truncate">
                  Kitchen & Accent
                </span>
              </div>
            </button>

            {/* 3. Vitrified Porcelain 2x4 */}
            <button
              onClick={() => handleCategoryQuickFilter('tiles', 'vitrified')}
              className="group p-3 bg-white hover:bg-amber-50/60 rounded-xl border border-slate-200 hover:border-amber-400 transition-all text-left flex items-center gap-2.5 shadow-2xs hover:shadow-xs cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-amber-700" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 block truncate group-hover:text-amber-900">
                  Vitrified Slabs
                </span>
                <span className="text-[10px] text-slate-500 block truncate">
                  600x1200 mm PGVT
                </span>
              </div>
            </button>

            {/* 4. Table Top Basins */}
            <button
              onClick={() => handleCategoryQuickFilter('sanitary', 'basin')}
              className="group p-3 bg-white hover:bg-amber-50/60 rounded-xl border border-slate-200 hover:border-amber-400 transition-all text-left flex items-center gap-2.5 shadow-2xs hover:shadow-xs cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 group-hover:scale-105 transition-transform">
                <Droplets className="w-4 h-4 text-amber-700" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 block truncate group-hover:text-amber-900">
                  Art Basins
                </span>
                <span className="text-[10px] text-slate-500 block truncate">
                  Microvit Table Top
                </span>
              </div>
            </button>

            {/* 5. Sanitaryware */}
            <button
              onClick={() => handleCategoryQuickFilter('sanitary', 'closet')}
              className="group p-3 bg-white hover:bg-amber-50/60 rounded-xl border border-slate-200 hover:border-amber-400 transition-all text-left flex items-center gap-2.5 shadow-2xs hover:shadow-xs cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 group-hover:scale-105 transition-transform">
                <Bath className="w-4 h-4 text-amber-700" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 block truncate group-hover:text-amber-900">
                  Sanitaryware
                </span>
                <span className="text-[10px] text-slate-500 block truncate">
                  Commodes & Vanities
                </span>
              </div>
            </button>

            {/* 6. Bath Fittings */}
            <button
              onClick={() => handleCategoryQuickFilter('fittings', 'diverter')}
              className="group p-3 bg-white hover:bg-amber-50/60 rounded-xl border border-slate-200 hover:border-amber-400 transition-all text-left flex items-center gap-2.5 shadow-2xs hover:shadow-xs cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 group-hover:scale-105 transition-transform">
                <Award className="w-4 h-4 text-amber-700" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 block truncate group-hover:text-amber-900">
                  Bath Fittings
                </span>
                <span className="text-[10px] text-slate-500 block truncate">
                  Juliet & Polo Brass
                </span>
              </div>
            </button>

            {/* 7. Showroom Video Tour */}
            <a
              href="#video-tour"
              className="group p-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl border border-amber-500 transition-all text-left flex items-center gap-2.5 shadow-xs cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                <Video className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block truncate">
                  Video Tour
                </span>
                <span className="text-[10px] text-amber-100 block truncate">
                  Watch Showroom Walk
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* QUICK TRUST BAR */}
      <div className="border-t border-slate-200 bg-white py-3 px-4 sm:px-6 text-xs text-slate-700">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold text-slate-800">Direct Authorized Dealer</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold text-slate-800">100% Genuine First Quality</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold text-slate-800">Zero-Breakage Site Transit</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold text-slate-800">Wholesale Project Margins</span>
          </div>
        </div>
      </div>
    </section>
  );
};
