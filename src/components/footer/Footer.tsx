import React from 'react';
import { Sparkles, Phone, Mail, MapPin } from 'lucide-react';
import { ShopSettings } from '../../types';
import { BrandLogo } from '../brands/BrandLogos';

interface FooterProps {
  onOpenCalculator: () => void;
  shopSettings?: ShopSettings;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCalculator, shopSettings }) => {
  const brandName = shopSettings?.shopName || 'Ratnesh Enterprises';

  return (
    <footer className="w-full bg-slate-100 text-slate-600 border-t border-slate-200 py-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-base">
              <img
                src="/assets/aistudio/image_7777a093.png"
                alt="Ratnesh Enterprises Logo"
                className="h-9 w-9 object-contain rounded-lg bg-white p-0.5 border border-slate-200 shadow-xs"
              />
              <span>{brandName}</span>
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Authorized Experience Studio for Orientbell, Hels, Addon, Exotiles, Microvit Sanitary, and Juliet & Polo fittings.
            </p>
            <div className="text-[11px] text-amber-700 font-semibold">
              100% Genuine First Choice Guarantee
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2">
            <span className="text-slate-900 font-bold uppercase tracking-wider text-[11px]">
              Explore
            </span>
            <a href="#catalog" className="text-slate-600 hover:text-slate-900 transition-colors">
              Floor & Wall Tiles
            </a>
            <a href="#catalog" className="text-slate-600 hover:text-slate-900 transition-colors">
              Microvit Table Top Basins
            </a>
            <a href="#catalog" className="text-slate-600 hover:text-slate-900 transition-colors">
              Juliet & Polo Fittings
            </a>
            <a href="#video-tour" className="text-amber-700 hover:text-amber-800 font-semibold transition-colors">
              Showroom Video Tour
            </a>
            <button
              onClick={onOpenCalculator}
              className="text-left text-slate-600 hover:text-slate-900 transition-colors font-medium cursor-pointer"
            >
              Tile & Box Calculator
            </button>
          </div>

          {/* Brand Portfolio */}
          <div className="flex flex-col gap-2.5">
            <span className="text-slate-900 font-bold uppercase tracking-wider text-[11px]">
              Authorized Brand Partners
            </span>
            <div className="flex flex-col gap-1.5">
              {(['Orientbell', 'Hels', 'Addon', 'Exotiles', 'Microvit', 'Juliet', 'Polo'] as const).map((b) => (
                <a
                  key={b}
                  href="#brands"
                  className="hover:scale-102 transition-transform origin-left"
                >
                  <BrandLogo brand={b} variant="compact" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-2.5">
            <span className="text-slate-900 font-bold uppercase tracking-wider text-[11px]">
              Showroom Support
            </span>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <div className="flex flex-col">
                <a
                  href={`tel:${(shopSettings?.phoneNumber || '+91 87094 89716').replace(/\s+/g, '')}`}
                  className="text-slate-700 hover:text-amber-700 font-medium transition-colors"
                >
                  {shopSettings?.phoneNumber || '+91 87094 89716'}
                </a>
                {shopSettings?.secondaryPhone && (
                  <a
                    href={`tel:${shopSettings.secondaryPhone.replace(/\s+/g, '')}`}
                    className="text-slate-500 hover:text-slate-800 transition-colors text-[10px]"
                  >
                    {shopSettings.secondaryPhone} (Sales)
                  </a>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <a
                href={`mailto:${shopSettings?.email || 'jhratneshenterprises@gmail.com'}`}
                className="text-slate-700 hover:text-amber-700 transition-colors truncate max-w-[200px]"
              >
                {shopSettings?.email || 'jhratneshenterprises@gmail.com'}
              </a>
            </div>
            <a
              href={
                shopSettings?.googleMapsUrl ||
                "https://www.google.com/maps/place/Ratnesh+Enterprises/@23.6586294,85.9750885,9249m/data=!3m1!1e3!4m10!1m2!2m1!1sPrajapati+Dharamshala,+Jaridih+Rd,+Teacher's+Colony,+Jena,+Bokaro+Steel+City,+Bandhdih,+Jharkhand+829301!3m6!1s0x39f43d359de74e53:0x77e1c7d97f0076f9!8m2!3d23.6586294!4d86.0162872!15sCmhQcmFqYXBhdGkgRGhhcmFtc2hhbGEsIEphcmlkaWggUmQsIFRlYWNoZXIncyBDb2xvbnksIEplbmEsIEJva2FybyBTdGVlbCBDaXR5LCBCYW5kaGRpaCwgSmhhcmtoYW5kIDgyOTMwMZIBCnRpbGVfc3RvcmXgAQA!16s%2Fg%2F11p1r52pj5?entry=ttu&g_ep=EgoyMDI2MTEwMi4wIKXMDSoASAFQAw%3D%3D"
              }
              target="_blank"
              rel="noreferrer"
              className="group flex items-start gap-2.5 p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-amber-400 transition-all text-slate-700 shadow-xs"
              title="Click to open showroom location in Google Maps directly"
            >
              <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col text-[11px]">
                <span className="text-amber-700 font-bold flex items-center gap-1">
                  <span>Showroom (Open in Google Maps)</span>
                  <span>↗</span>
                </span>
                <span className="leading-tight text-slate-800 font-medium mt-0.5">
                  {shopSettings?.address ||
                    "Prajapati Dharamshala, Jaridih Rd, Teacher's Colony, Jena, Bokaro Steel City, Bandhdih, Jharkhand 829301"}
                </span>
              </div>
            </a>
          </div>
        </div>

        {/* Quiet Copyright Row */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} {brandName}. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Wholesale & Retail</span>
            <span>·</span>
            <span>Architectural Supply</span>
            <span>·</span>
            <span>Direct Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
