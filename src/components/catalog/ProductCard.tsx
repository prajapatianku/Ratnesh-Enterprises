import React from 'react';
import { ProductItem } from '../../types';
import { getTileTextureSvg } from '../../utils/textureGenerators';
import { BrandLogo } from '../brands/BrandLogos';
import { Eye, MessageSquare, Edit3, Trash2 } from 'lucide-react';

interface ProductCardProps {
  product: ProductItem;
  onOpenDetails: (product: ProductItem) => void;
  onAddToQuote?: (product: ProductItem) => void;
  isAdminMode?: boolean;
  onEditProduct?: (product: ProductItem) => void;
  onDeleteProduct?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onAddToQuote,
  isAdminMode = false,
  onEditProduct,
  onDeleteProduct,
}) => {
  const primaryImage = product.images?.[0] || product.customImageUrl;
  const textureSrc = getTileTextureSvg(
    product.texturePattern,
    primaryImage,
    product.finish
  );

  const isSanitaryOrFittings =
    ['Juliet', 'Microvit', 'Polo'].includes(product.brand) ||
    product.category !== 'tiles';

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const details = isSanitaryOrFittings
      ? `\nBrand: ${product.brand}\nType: ${product.subCategory || 'Bath Fixture / Sanitaryware'}`
      : `\nBrand: ${product.brand}\nModel Code: ${product.modelCode}\nSize: ${product.size}\nFinish: ${product.finish}`;
    const text = encodeURIComponent(
      `Hello Ratnesh Enterprises! Please provide the quotation for:\n\n*${product.name}*${details}`
    );
    window.open(`https://wa.me/918709489716?text=${text}`, '_blank');
  };

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
    >
      {/* Product Image / Surface Texture Preview */}
      <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden border-b border-slate-200">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage: `url("${textureSrc}")`,
          }}
        />

        {/* Gloss sheen overlay */}
        {product.finish.toLowerCase().includes('gloss') && (
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/30 pointer-events-none" />
        )}

        {/* Brand Official Logo Tag */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <BrandLogo brand={product.brand} variant="compact" />
        </div>

        {/* Multi-photo indicator badge if product has multiple photos */}
        {product.images && product.images.length > 1 && (
          <div className="absolute bottom-2.5 left-2.5 z-10 px-2 py-0.5 rounded bg-white/90 backdrop-blur-xs text-[10px] font-bold text-slate-700 border border-slate-200 shadow-2xs">
            {product.images.length} Photos
          </div>
        )}

        {/* Out of Stock Banner */}
        {!product.inStock && (
          <div className="absolute top-2.5 right-2.5 bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
            Out of Stock
          </div>
        )}

        {/* Admin Quick Action Pills (when in Admin Mode) */}
        {isAdminMode && (
          <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditProduct?.(product);
              }}
              className="p-1.5 bg-white/95 hover:bg-slate-100 text-amber-700 border border-slate-300 rounded shadow-xs"
              title="Edit Tile"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete ${product.name}?`)) {
                  onDeleteProduct?.(product.id);
                }
              }}
              className="p-1.5 bg-white/95 hover:bg-red-50 text-red-600 border border-slate-300 rounded shadow-xs"
              title="Delete Tile"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Quick action overlay on hover */}
        <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(product);
            }}
            className="px-3.5 py-1.5 bg-white text-slate-900 hover:bg-amber-50 font-bold rounded-lg text-xs shadow-md transition-colors flex items-center gap-1.5"
            title="Inspect Details"
          >
            <Eye className="w-3.5 h-3.5 text-amber-600" />
            <span>View Details</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs shadow-md transition-colors"
            title="WhatsApp inquiry"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
          </button>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata */}
          {!isSanitaryOrFittings ? (
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>{product.size}</span>
              <span aria-hidden="true">·</span>
              <span>{product.finish}</span>
            </div>
          ) : (
            <div className="text-xs text-slate-500 mb-1 font-medium">
              {product.subCategory || (product.category === 'sanitary' ? 'Table Top Basin' : 'Bath Fitting')}
            </div>
          )}

          {/* Product Name */}
          <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
            {product.name}
          </h3>

          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
            {!isSanitaryOrFittings ? (product.colorTone || 'Polished Glaze') : (product.features?.[0] || 'Authorized Showroom Stock')}
          </p>
        </div>

        {/* Actions Row: Get Price on WhatsApp */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center">
          <button
            onClick={handleWhatsApp}
            className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all hover:scale-[1.01] cursor-pointer"
            title="Get Price"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>Get Price on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
