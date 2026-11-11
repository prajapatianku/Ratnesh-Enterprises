import React from 'react';
import { Calculator, Phone, Lock, Unlock, MapPin } from 'lucide-react';
import { QuoteItem, ShopSettings, ProductCategory } from '../../types';

interface NavbarProps {
  quoteItems?: QuoteItem[];
  onOpenQuote?: () => void;
  onOpenCalculator: () => void;
  onOpenAdminPortal: () => void;
  shopSettings: ShopSettings;
  isAdminAuthenticated?: boolean;
  onLockAdmin?: () => void;
  onSelectCategory?: (category: ProductCategory | 'all') => void;
  activeCategory?: ProductCategory | 'all';
}

const DEFAULT_MAPS_URL =
  "https://www.google.com/maps/place/Ratnesh+Enterprises/@23.6586294,85.9750885,9249m/data=!3m1!1e3!4m10!1m2!2m1!1sPrajapati+Dharamshala,+Jaridih+Rd,+Teacher's+Colony,+Jena,+Bokaro+Steel+City,+Bandhdih,+Jharkhand+829301!3m6!1s0x39f43d359de74e53:0x77e1c7d97f0076f9!8m2!3d23.6586294!4d86.0162872!15sCmhQcmFqYXBhdGkgRGhhcmFtc2hhbGEsIEphcmlkaWggUmQsIFRlYWNoZXIncyBDb2xvbnksIEplbmEsIEJva2FybyBTdGVlbCBDaXR5LCBCYW5kaGRpaCwgSmhhcmtoYW5kIDgyOTMwMZIBCnRpbGVfc3RvcmXgAQA!16s%2Fg%2F11p1r52pj5?entry=ttu&g_ep=EgoyMDI2MTEwMi4wIKXMDSoASAFQAw%3D%3D";

export const Navbar: React.FC<NavbarProps> = ({
  quoteItems = [],
  onOpenQuote,
  onOpenCalculator,
  onOpenAdminPortal,
  shopSettings,
  isAdminAuthenticated = false,
  onLockAdmin,
  onSelectCategory,
  activeCategory = 'all',
}) => {
  const directMapsUrl = shopSettings.googleMapsUrl || DEFAULT_MAPS_URL;

  const handleNavClick = (
    e: React.MouseEvent,
    targetId: string,
    category?: ProductCategory | 'all'
  ) => {
    e.preventDefault();
    if (category && onSelectCategory) {
      onSelectCategory(category);
    }
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = targetId;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-colors">
      {/* Top Address & Google Maps Navigation Ribbon */}
      <div className="bg-slate-100 border-b border-slate-200 py-1.5 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-[11px] sm:text-xs">
          <a
            href={directMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-slate-700 hover:text-amber-700 transition-colors group truncate"
            title="Click to open showroom in Google Maps directly"
          >
            <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full shrink-0">
              <MapPin className="w-3 h-3 text-amber-700" />
              <span>Showroom:</span>
            </span>
            <span className="underline underline-offset-2 decoration-amber-600/50 group-hover:decoration-amber-700 font-medium truncate text-slate-800">
              {shopSettings.address ||
                "Prajapati Dharamshala, Jaridih Rd, Teacher's Colony, Jena, Bokaro Steel City, Bandhdih, Jharkhand 829301"}
            </span>
            <span className="text-[10px] font-extrabold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors hidden sm:inline-flex items-center gap-0.5">
              <span>Google Maps ↗</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-3 text-slate-600 shrink-0 text-[11px]">
            <span>Mon–Sat: 9:30 AM – 8:30 PM</span>
            <span>·</span>
            <a href="tel:+918709489716" className="text-amber-700 hover:text-amber-800 hover:underline font-mono font-bold">
              +91 87094 89716
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Brand Wordmark & Logo */}
        <a
          href="/"
          className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2.5 group"
        >
          <img
            src="/assets/aistudio/image_7777a093.png"
            alt="Ratnesh Enterprises"
            className="h-10 w-10 object-contain rounded-lg bg-white p-0.5 border border-slate-300 shadow-xs group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 leading-none">
              {shopSettings.shopName || 'Ratnesh Enterprises'}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 mt-0.5">
              Tiles & Sanitaryware
            </span>
          </div>
        </a>

        {/* Navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a
            href="#brands"
            onClick={(e) => handleNavClick(e, 'brands')}
            className="hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 font-semibold text-slate-800 cursor-pointer"
          >
            Brand Partners
          </a>
          <a
            href="#catalog"
            onClick={(e) => handleNavClick(e, 'catalog', 'tiles')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeCategory === 'tiles' ? 'text-amber-700 font-bold' : 'hover:text-amber-700'
            }`}
          >
            Tiles Catalog
          </a>
          <a
            href="#catalog"
            onClick={(e) => handleNavClick(e, 'catalog', 'sanitary')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeCategory === 'sanitary' ? 'text-amber-700 font-bold' : 'hover:text-amber-700'
            }`}
          >
            Sanitaryware
          </a>
          <a
            href="#catalog"
            onClick={(e) => handleNavClick(e, 'catalog', 'fittings')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeCategory === 'fittings' ? 'text-amber-700 font-bold' : 'hover:text-amber-700'
            }`}
          >
            Bath Fittings
          </a>
          <a
            href="#about-us"
            onClick={(e) => handleNavClick(e, 'about-us')}
            className="hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Who We Are
          </a>
          <a
            href="#video-tour"
            onClick={(e) => handleNavClick(e, 'video-tour')}
            className="hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer font-medium text-amber-800"
          >
            Video Tour
          </a>
          <a
            href="#showroom-story"
            onClick={(e) => handleNavClick(e, 'showroom-story')}
            className="hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Showroom
          </a>
        </nav>

        {/* Actions (Phone Call + Calculator + Admin) */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`tel:${shopSettings.phoneNumber.replace(/\s+/g, '')}`}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:text-amber-800 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors whitespace-nowrap shrink-0"
            title="Call Ratnesh Enterprises"
          >
            <Phone className="w-3.5 h-3.5 text-amber-700" />
            <span className="font-mono">{shopSettings.phoneNumber}</span>
          </a>
          
          <button
            onClick={onOpenCalculator}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:text-amber-800 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Tile Box Calculator"
          >
            <Calculator className="w-3.5 h-3.5 text-amber-700" />
            <span>Tile Calculator</span>
          </button>

          {/* Admin Owner Portal Button */}
          {isAdminAuthenticated ? (
            <div className="flex items-center gap-1 bg-amber-100 border border-amber-300 rounded-xl p-0.5">
              <button
                onClick={onOpenAdminPortal}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-amber-900 hover:text-amber-950 transition-colors cursor-pointer"
                title="Open Owner Admin Portal"
              >
                <Unlock className="w-3.5 h-3.5 text-amber-700" />
                <span>Admin</span>
              </button>
              {onLockAdmin && (
                <button
                  onClick={onLockAdmin}
                  className="p-1 text-slate-500 hover:text-red-600 rounded transition-colors cursor-pointer"
                  title="Lock / Log Out of Admin"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAdminPortal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-all shadow-2xs shrink-0 cursor-pointer"
              title="Store Owner Login (Password Protected)"
            >
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>Owner Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
