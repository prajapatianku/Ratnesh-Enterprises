import React from 'react';
import { Brand } from '../../types';
import { BRAND_DIRECTORY, BrandLogo } from './BrandLogos';
import { Award, ArrowRight, CheckCircle2 } from 'lucide-react';

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
  const handleBrandClick = (brandId: Brand) => {
    onSelectBrandFilter(brandId);
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="brands" className="w-full py-10 sm:py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Simple & Clean Header (Ganesh Ceramic Style) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <span className="text-[11px] font-bold tracking-widest text-amber-700 uppercase block mb-1">
              Authorized Dealerships
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Our Brand Partners
            </h2>
          </div>

          <p className="text-xs text-slate-500 max-w-md sm:text-right">
            Official showroom partner for India's leading ceramic tiles, sanitaryware, and luxury bath fittings.
          </p>
        </div>

        {/* Single-Row Clean Brand Cards (Displayed Once, No Duplication) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {BRAND_DIRECTORY.map((brandMeta) => {
            const isSelected =
              activeBrandFilter.toLowerCase() === brandMeta.id.toLowerCase();

            return (
              <button
                key={brandMeta.id}
                type="button"
                onClick={() => handleBrandClick(brandMeta.id)}
                className={`group rounded-xl p-3 border transition-all duration-200 flex flex-col items-center justify-between gap-2.5 text-center cursor-pointer ${
                  isSelected
                    ? 'bg-amber-50/80 border-amber-600 ring-2 ring-amber-500/30 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
                title={`View ${brandMeta.displayName} collections`}
              >
                {/* Official Logo */}
                <div className="w-full h-14 sm:h-16 flex items-center justify-center p-1">
                  <BrandLogo
                    brand={brandMeta.id}
                    variant="full"
                    customLogoUrl={customBrandLogos[brandMeta.id]}
                    className="h-full w-full object-contain"
                  />
                </div>

                {/* Brand Name & Action */}
                <div className="w-full pt-2 border-t border-slate-100 flex items-center justify-between text-left">
                  <div className="truncate">
                    <span className="block font-bold text-xs text-slate-900 group-hover:text-amber-700 transition-colors truncate">
                      {brandMeta.displayName}
                    </span>
                    <span className="text-[10px] text-slate-500 capitalize block">
                      {brandMeta.category}
                    </span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Filter Clear Bar (Only shown when a brand filter is active) */}
        {activeBrandFilter !== 'all' && (
          <div className="mt-4 flex items-center justify-between bg-amber-50 border border-amber-200 px-4 py-2 rounded-lg text-xs">
            <span className="text-amber-900 font-medium">
              Showing products for: <strong className="font-bold">{activeBrandFilter}</strong>
            </span>
            <button
              onClick={() => onSelectBrandFilter('all')}
              className="text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer text-xs"
            >
              Show All Brands
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
