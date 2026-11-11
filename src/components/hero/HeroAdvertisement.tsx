import React from 'react';
import { ArrowRight, ShieldCheck, Truck, Ruler, PhoneCall, Award, CheckCircle2 } from 'lucide-react';
import { ProductItem, ShopSettings } from '../../types';
import { getTileTextureSvg } from '../../utils/textureGenerators';
import { BrandLogo } from '../brands/BrandLogos';

interface HeroAdvertisementProps {
  onOpenCalculator: () => void;
  featuredTile: ProductItem;
  shopSettings: ShopSettings;
}

export const HeroAdvertisement: React.FC<HeroAdvertisementProps> = ({
  onOpenCalculator,
  featuredTile,
  shopSettings,
}) => {
  const handleCallOrWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello ${shopSettings.shopName}! I am planning my home renovation and would like to visit the showroom or get a quotation for tiles and sanitaryware.`
    );
    const num = shopSettings.whatsappNumber ? `/${shopSettings.whatsappNumber}` : '';
    window.open(`https://wa.me${num}?text=${text}`, '_blank');
  };

  const handleScrollToCatalog = () => {
    const el = document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-white via-slate-50 to-amber-50/30 text-slate-900 border-b border-slate-200">
      {/* Subtle warm luxury light accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-slate-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* TOP ANNOUNCEMENT BANNER */}
      <div className="w-full bg-amber-600 text-white py-2 px-4 text-center text-xs font-bold tracking-wide shadow-xs flex items-center justify-center gap-2">
        <span>
          {shopSettings.announcementText ||
            'SHOWROOM SPECIAL OFFER: Premium Vitrified Tiles, Microvit Sanitaryware & Bath Fittings in Bokaro! Visit our Jena showroom or order online.'}
        </span>
        <button
          onClick={handleCallOrWhatsApp}
          className="underline ml-2 hover:text-amber-100 transition-colors text-[11px] uppercase tracking-wider cursor-pointer font-extrabold"
        >
          Get Best Price →
        </button>
      </div>

      {/* MAIN HERO CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Showroom Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300/80 text-amber-900 text-xs font-bold mb-4">
              <Award className="w-3.5 h-3.5 text-amber-700" />
              <span>Direct Authorized Showroom · Jena, Bokaro</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.18] text-slate-900">
              Exquisite Vitrified Tiles, Sanitaryware & Luxury Bath Studio.
            </h1>

            {/* Sub-headline */}
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Official authorized dealer for <strong className="text-slate-900">Orientbell</strong>,{' '}
              <strong className="text-slate-900">Hels</strong>, <strong className="text-slate-900">Addon</strong>,{' '}
              <strong className="text-slate-900">Exotiles</strong>, <strong className="text-slate-900">Microvit Sanitaryware</strong> (Designer Table Top Basins), and{' '}
              <strong className="text-slate-900">Juliet & Polo</strong> precision bath fittings.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={handleScrollToCatalog}
                className="px-6 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-all shadow-md shadow-amber-600/20 hover:scale-[1.02] cursor-pointer"
              >
                <span>Browse Full Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenCalculator}
                className="px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors shadow-2xs cursor-pointer"
              >
                <Ruler className="w-4 h-4 text-amber-600" />
                <span>Tile & Box Calculator</span>
              </button>

              <button
                onClick={handleCallOrWhatsApp}
                className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Get Quotation</span>
              </button>
            </div>

            {/* Authorized Brands Ribbon with Official Logos */}
            <div className="mt-8 pt-5 border-t border-slate-200 w-full">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>Authorized Brand Dealerships (Bokaro):</span>
                </span>
                <a
                  href="#brands"
                  className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 transition-colors"
                >
                  View All Partners ↓
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {(['Orientbell', 'Hels', 'Addon', 'Exotiles', 'Microvit', 'Juliet', 'Polo'] as const).map((b) => (
                  <a
                    key={b}
                    href="#brands"
                    className="hover:scale-105 transition-transform"
                    title={`View ${b} Authorized Collection`}
                  >
                    <BrandLogo brand={b} variant="compact" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLS: Clean Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl bg-white border border-slate-200 p-5 shadow-lg overflow-hidden group">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-amber-700 font-bold block">
                    Showroom Highlight
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Italian Calacatta Gold Marble Slab
                  </h3>
                </div>
                <div className="px-2.5 py-1 bg-amber-100 border border-amber-300 rounded text-[11px] font-bold text-amber-900">
                  600x1200 mm
                </div>
              </div>

              {/* Tile Preview Box */}
              <div
                onClick={handleScrollToCatalog}
                className="relative w-full aspect-[4/3] rounded-xl overflow-hidden cursor-pointer shadow-inner border border-slate-200"
              >
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url("${getTileTextureSvg('calacatta_gold')}")`,
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-t from-black/50 via-transparent to-black/20 flex flex-col justify-between p-4">
                    <div className="self-start bg-white/95 backdrop-blur-md px-2.5 py-1 rounded text-[11px] text-slate-900 font-bold shadow-xs">
                      High Gloss PGVT Vitrified
                    </div>

                    <div className="bg-white/95 backdrop-blur-md border border-slate-200 p-2.5 rounded-lg flex items-center justify-between shadow-md">
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Hels & Orientbell Vitrified Collection
                        </div>
                        <div className="text-[11px] text-slate-600">
                          Zero water absorption (under 0.05%) · Mirror Polish
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-amber-600 flex items-center justify-center text-white">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Showroom Perks Strip */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">100% Genuine Brands</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-medium">Direct Showroom Supply</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
