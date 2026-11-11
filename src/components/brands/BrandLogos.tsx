import React from 'react';
import { Brand } from '../../types';

interface BrandLogoProps {
  brand: Brand;
  className?: string;
  variant?: 'badge' | 'full' | 'compact' | 'monogram';
  customLogoUrl?: string;
}

export interface BrandMeta {
  id: Brand;
  displayName: string;
  category: 'tiles' | 'sanitary' | 'fittings';
  logoUrl: string;
  cardBg: string;
  isLightLogo?: boolean;
  specialty?: string;
  itemCountDesc?: string;
}

export const BRAND_DIRECTORY: BrandMeta[] = [
  {
    id: 'Orientbell',
    displayName: 'Orientbell Tiles',
    category: 'tiles',
    logoUrl: '/assets/aistudio/image_72ddbb6f.png',
    cardBg: 'bg-white',
    specialty: 'PGVT Vitrified & Ceramic Wall Slabs',
    itemCountDesc: "India's Leading Ceramic Brand",
  },
  {
    id: 'Hels',
    displayName: 'Hels Luxury Slabs',
    category: 'tiles',
    logoUrl: '/assets/aistudio/image_66165747.png',
    cardBg: 'bg-[#4a152e]',
    isLightLogo: true,
    specialty: 'Grand Porcelain & Carving Vein Tiles',
    itemCountDesc: 'Luxury Architectural Slabs',
  },
  {
    id: 'Addon',
    displayName: 'Addon Vitrified',
    category: 'tiles',
    logoUrl: '/assets/aistudio/image_2f659a6e.png',
    cardBg: 'bg-white',
    specialty: 'High Gloss PGVT & Digital Flooring',
    itemCountDesc: 'High-Durability Flooring',
  },
  {
    id: 'Exotiles',
    displayName: 'Exotiles Ceramic',
    category: 'tiles',
    logoUrl: '/assets/aistudio/image_8e5131d5.png',
    cardBg: 'bg-[#181a1b]',
    isLightLogo: true,
    specialty: 'Full Body Outdoor & Anti-Skid Tiles',
    itemCountDesc: 'Balcony, Parking & Elevation',
  },
  {
    id: 'Microvit',
    displayName: 'Microvit Sanitaryware',
    category: 'sanitary',
    logoUrl: '/assets/aistudio/image_cee607a1.png',
    cardBg: 'bg-white',
    specialty: 'Table-Top Basins & Ceramic Closets',
    itemCountDesc: 'Premium Vitreous China',
  },
  {
    id: 'Juliet',
    displayName: 'Juliet Bath Fittings',
    category: 'fittings',
    logoUrl: '/assets/aistudio/image_7a0351d0.png',
    cardBg: 'bg-white',
    specialty: 'Brass CP Diverters, Showers & Taps',
    itemCountDesc: 'Luxury Designer Fixtures',
  },
  {
    id: 'Polo',
    displayName: 'Polo Taps & Fittings',
    category: 'fittings',
    logoUrl: '',
    cardBg: 'bg-neutral-900',
    isLightLogo: true,
    specialty: 'Designer Taps, Concealed Valves & Spouts',
    itemCountDesc: 'Engineered Precision Fittings',
  },
];

export const BRAND_IMAGE_MAP: Record<string, string> = {
  orientbell: '/assets/aistudio/image_72ddbb6f.png',
  hels: '/assets/aistudio/image_66165747.png',
  addon: '/assets/aistudio/image_2f659a6e.png',
  exotiles: '/assets/aistudio/image_8e5131d5.png',
  microvit: '/assets/aistudio/image_cee607a1.png',
  juliet: '/assets/aistudio/image_7a0351d0.png',
  julient: '/assets/aistudio/image_7a0351d0.png',
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  brand,
  className = '',
  variant = 'badge',
  customLogoUrl,
}) => {
  const brandKey = brand.toLowerCase();
  const logoUrl = customLogoUrl || BRAND_IMAGE_MAP[brandKey] || '';
  const brandMeta = BRAND_DIRECTORY.find((b) => b.id.toLowerCase() === brandKey);
  const displayName = brandMeta ? brandMeta.displayName : brand;

  // 1. If an official logo image exists (Orientbell, Hels, Addon, Exotiles, Microvit, Juliet)
  if (logoUrl) {
    if (variant === 'compact') {
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white border border-slate-200 shadow-xs ${className}`}
          title={displayName}
        >
          <span className="w-5 h-5 rounded bg-slate-50 p-0.5 flex items-center justify-center shrink-0 overflow-hidden border border-slate-100">
            <img
              src={logoUrl}
              alt={displayName}
              className="max-h-full max-w-full object-contain"
            />
          </span>
          <span className="text-[11px] font-bold text-slate-800 tracking-tight truncate">
            {displayName}
          </span>
        </span>
      );
    }

    if (variant === 'badge') {
      return (
        <div
          className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white border border-slate-200 shadow-xs ${className}`}
          title={displayName}
        >
          <div className="w-6 h-6 rounded-md bg-slate-50 p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-xs border border-slate-100">
            <img
              src={logoUrl}
              alt={displayName}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <span className="text-xs font-bold text-slate-800">{displayName}</span>
        </div>
      );
    }

    // Default & Full Variant (Showcase Card)
    return (
      <div
        className={`w-full flex items-center justify-center p-3 rounded-xl bg-white border border-slate-200 shadow-xs ${className}`}
        title={displayName}
      >
        <img
          src={logoUrl}
          alt={displayName}
          className="max-h-12 w-auto max-w-[85%] object-contain"
        />
      </div>
    );
  }

  // 2. POLO (or any custom brand without an uploaded file yet)
  if (brandKey.includes('polo')) {
    if (variant === 'compact') {
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-50 border border-red-200 text-[11px] font-bold text-red-700 shadow-xs ${className}`}
          title="Polo Taps & Fittings"
        >
          <span className="w-2 h-2 rounded-full bg-red-600"></span>
          <span>POLO</span>
        </span>
      );
    }

    return (
      <div
        className={`w-full flex items-center justify-center p-3 rounded-xl bg-white border border-red-200 shadow-xs ${className}`}
        title="Polo Taps & Fittings"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600 text-white font-black flex items-center justify-center shadow-xs">
            P
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="text-sm font-black tracking-wider text-slate-900">POLO</span>
            <span className="text-[9px] font-bold text-red-600 tracking-widest mt-0.5 uppercase">
              Fittings
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 3. Fallback for any other custom brand
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-xs ${className}`}
    >
      <span>{brand}</span>
    </span>
  );
};
