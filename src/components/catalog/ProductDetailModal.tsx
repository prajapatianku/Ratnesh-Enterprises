import React, { useState } from 'react';
import { ProductItem, ShopSettings } from '../../types';
import { getTileTextureSvg } from '../../utils/textureGenerators';
import { BrandLogo } from '../brands/BrandLogos';
import {
  X,
  Maximize2,
  Calculator,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  CheckCircle2,
  PackageCheck,
  Edit3,
  Trash2,
} from 'lucide-react';

interface ProductDetailModalProps {
  isOpen?: boolean;
  product: ProductItem | null;
  onClose: () => void;
  onOpenCalculator: (product: ProductItem) => void;
  onAddToQuote?: (product: ProductItem) => void;
  shopSettings?: ShopSettings;
  isAdminAuthenticated?: boolean;
  onEditProduct?: (product: ProductItem) => void;
  onDeleteProduct?: (id: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen = true,
  product,
  onClose,
  onOpenCalculator,
  onAddToQuote,
  shopSettings,
  isAdminAuthenticated = false,
  onEditProduct,
  onDeleteProduct,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen || !product) return null;

  const isSanitaryOrFittings =
    ['Juliet', 'Microvit', 'Polo'].includes(product.brand) ||
    product.category !== 'tiles';

  // Gather all photos for this product
  const productImages: string[] = [];
  if (product.images && product.images.length > 0) {
    product.images.forEach((img) => {
      if (img && img.trim().length > 0) productImages.push(img);
    });
  } else if (product.customImageUrl && product.customImageUrl.trim().length > 0) {
    productImages.push(product.customImageUrl);
  } else {
    productImages.push(
      getTileTextureSvg(product.texturePattern, undefined, product.finish)
    );
  }

  const currentImageSrc = productImages[activeImageIndex] || productImages[0];

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const handleWhatsAppInquiry = () => {
    const shopName = shopSettings?.shopName || 'Ratnesh Enterprises';
    const specDetails = isSanitaryOrFittings
      ? `Brand: ${product.brand}\nType: ${product.subCategory || 'Bath Fixture / Sanitaryware'}\n\n`
      : `Brand: ${product.brand}\nCode: ${product.modelCode}\nSize: ${product.size}\nFinish: ${product.finish}\n\n`;

    const text = encodeURIComponent(
      `Hello ${shopName}! I would like to get the quotation for:\n\n` +
      `Product: ${product.name}\n` +
      specDetails +
      `Please provide your best showroom price quotation and stock availability.`
    );
    const num = shopSettings?.whatsappNumber ? `/${shopSettings.whatsappNumber}` : '/918709489716';
    window.open(`https://wa.me${num}?text=${text}`, '_blank');
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 md:p-6 overflow-y-auto"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col md:flex-row max-h-[94vh]"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 z-30 p-2 rounded-full bg-white/90 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer shadow-xs hover:scale-105"
            title="Close product detail"
          >
            <X className="w-5 h-5" />
          </button>

          {/* LEFT COLUMN: Multi-Photo Interactive Gallery Showcase */}
          <div className="w-full md:w-1/2 bg-slate-50 relative flex flex-col p-4 sm:p-6 border-b md:border-b-0 md:border-r border-slate-200 justify-between">
            {/* Top Toolbar: Photo Counter & Mode Switcher */}
            <div className="flex items-center justify-between mb-3 z-10">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-md">
                  {productImages.length > 1
                    ? `Photo ${activeImageIndex + 1} of ${productImages.length}`
                    : 'Showroom Sample'}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {product.finish}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setFitMode(fitMode === 'contain' ? 'cover' : 'contain')}
                  className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 text-[11px] text-slate-700 border border-slate-300 transition-colors cursor-pointer shadow-2xs"
                  title="Toggle Full View / Fill View"
                >
                  {fitMode === 'contain' ? 'Fill Frame' : 'Fit Entire Slab'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsZoomModalOpen(true)}
                  className="p-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors cursor-pointer shadow-2xs"
                  title="Zoom & inspect texture"
                >
                  <ZoomIn className="w-4 h-4 text-amber-600" />
                </button>
              </div>
            </div>

            {/* Main Image Display Box */}
            <div
              onClick={() => setIsZoomModalOpen(true)}
              className="relative w-full aspect-[4/3] sm:aspect-[1/1] md:aspect-[4/4] rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center cursor-zoom-in group shadow-inner"
            >
              <img
                src={currentImageSrc}
                alt={`${product.name} - view ${activeImageIndex + 1}`}
                className={`w-full h-full transition-transform duration-300 group-hover:scale-[1.02] ${
                  fitMode === 'contain' ? 'object-contain p-2' : 'object-cover'
                }`}
              />

              {/* Gloss Sheen Effect Overlay */}
              {product.finish.toLowerCase().includes('gloss') && (
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/20 pointer-events-none" />
              )}

              {/* Prev / Next Arrows if multi-image */}
              {productImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-amber-600 hover:text-white text-slate-800 border border-slate-300 shadow-md transition-all cursor-pointer"
                    title="Previous Photo"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-amber-600 hover:text-white text-slate-800 border border-slate-300 shadow-md transition-all cursor-pointer"
                    title="Next Photo"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Bottom hint badge */}
              <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-xs border border-slate-200 px-2.5 py-1 rounded text-[10px] text-slate-700 flex items-center gap-1.5 pointer-events-none shadow-xs">
                <Maximize2 className="w-3 h-3 text-amber-600" />
                <span>Click to Expand & Zoom</span>
              </div>
            </div>

            {/* Thumbnail Strip (Allows selecting between 1, 2, or 3 uploaded photos) */}
            {productImages.length > 1 ? (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <div className="text-[11px] text-slate-600 mb-2 font-medium flex items-center justify-between">
                  <span>Available Product Photos ({productImages.length}):</span>
                  <span className="text-[10px] text-amber-700 font-semibold">Click to preview</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {productImages.map((src, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all cursor-pointer bg-white ${
                        activeImageIndex === idx
                          ? 'border-amber-600 shadow-sm scale-[1.02]'
                          : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={src}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                        #{idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-3 text-center">
                <span className="text-[11px] text-slate-500">
                  High-definition showroom finish sample
                </span>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Product Specs & Actions */}
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto bg-white text-slate-800">
            <div>
              {/* Brand Logo & Model Code */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <BrandLogo brand={product.brand} variant="badge" />
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
                    {isSanitaryOrFittings ? 'Type' : 'Model Code'}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-700">
                    {isSanitaryOrFittings ? (product.subCategory || 'Bath Fixture') : product.modelCode}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* In-Stock & Authenticity Badge */}
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Showroom Stock Available
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                  <PackageCheck className="w-3.5 h-3.5 text-amber-600" />
                  100% Genuine {product.brand}
                </span>
              </div>

              {/* Direct WhatsApp CTA Banner */}
              <div className="mt-4 p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between gap-3 shadow-2xs">
                <div>
                  <span className="text-xs text-amber-900 block font-bold">Showroom Best Wholesale Rate</span>
                  <span className="text-sm font-semibold text-slate-800">
                    Get Instant Price Quote on WhatsApp
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-105 shrink-0 cursor-pointer"
                  title="Get Price on WhatsApp"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Get Price</span>
                </button>
              </div>

              {/* Comprehensive Specifications Grid */}
              <div className="mt-5">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
                  Specifications & Details
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {!isSanitaryOrFittings ? (
                    <>
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">Size / Dimensions</span>
                        <span className="font-bold text-slate-900">{product.size}</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">Surface Finish</span>
                        <span className="font-bold text-slate-900">{product.finish}</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">Color / Shade Tone</span>
                        <span className="font-bold text-slate-900 truncate block">{product.colorTone || 'Polished Marble'}</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">Box Coverage</span>
                        <span className="font-bold text-slate-900">
                          {product.sqftPerBox ? `${product.sqftPerBox} sq.ft` : '15.5 sq.ft (2 pcs)'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">Product Category</span>
                        <span className="font-bold text-slate-900 capitalize">{product.subCategory || product.category}</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">Material Build</span>
                        <span className="font-bold text-slate-900">
                          {product.specs?.material || (product.category === 'sanitary' ? 'A-Grade Ceramic' : 'Solid Brass & Chrome')}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">Surface Coating</span>
                        <span className="font-bold text-slate-900">{product.finish}</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">Warranty Guarantee</span>
                        <span className="font-bold text-slate-900">10 Years Showroom Warranty</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Key Features List */}
              {product.features && product.features.length > 0 && (
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {product.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md font-medium"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Interactive CTAs */}
            <div className="mt-6 flex flex-col gap-2.5 pt-4 border-t border-slate-200">
              {product.category === 'tiles' && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCalculator(product);
                  }}
                  className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-amber-300 cursor-pointer"
                >
                  <Calculator className="w-4 h-4 text-amber-700" />
                  <span>Calculate Required Boxes for My Room</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Get Price & Stock on WhatsApp</span>
              </button>

              {isAdminAuthenticated && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onEditProduct?.(product)}
                    className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Details</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirmDelete) {
                        setConfirmDelete(false);
                        onDeleteProduct?.(product.id);
                      } else {
                        setConfirmDelete(true);
                        setTimeout(() => setConfirmDelete(false), 3500);
                      }
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors border ${
                      confirmDelete
                        ? 'bg-red-600 text-white border-red-700'
                        : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{confirmDelete ? 'Confirm Delete?' : 'Delete Product'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN ZOOM INSPECTOR MODAL */}
      {isZoomModalOpen && (
        <div
          onClick={() => setIsZoomModalOpen(false)}
          className="fixed inset-0 z-60 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <button
            type="button"
            onClick={() => setIsZoomModalOpen(false)}
            className="absolute top-4 right-4 z-70 p-2.5 rounded-full bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 transition-all cursor-pointer shadow-lg"
            title="Close Zoom View"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center justify-center"
          >
            <img
              src={currentImageSrc}
              alt={product.name}
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-slate-200 bg-white"
            />
            <div className="mt-3 flex items-center gap-3 bg-white/95 border border-slate-200 px-4 py-2 rounded-xl text-xs text-slate-800 shadow-md">
              <span className="font-bold text-slate-900">{product.name}</span>
              <span>·</span>
              <span>{product.size}</span>
              <span>·</span>
              <span className="text-amber-700 font-semibold">{product.finish}</span>
              {productImages.length > 1 && (
                <>
                  <span>·</span>
                  <div className="flex gap-1.5">
                    {productImages.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveImageIndex(i)}
                        className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center transition-colors cursor-pointer ${
                          activeImageIndex === i
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
