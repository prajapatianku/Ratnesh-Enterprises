import React, { useState, useMemo } from 'react';
import { ProductItem, ProductCategory, Brand } from '../../types';
import { ProductCard } from './ProductCard';
import { Search, Filter, PlusCircle, ShieldCheck, Lock } from 'lucide-react';
import { BrandLogo } from '../brands/BrandLogos';

interface ProductGridProps {
  products: ProductItem[];
  onOpenDetails: (product: ProductItem) => void;
  onAddToQuote: (product: ProductItem) => void;
  onOpenAdminPortal: () => void;
  onOpenAddProduct?: () => void;
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
  onEditProduct: (product: ProductItem) => void;
  onDeleteProduct: (id: string) => void;
  isAdminAuthenticated?: boolean;
  selectedBrand?: string;
  onSelectBrand?: (brand: string) => void;
  selectedCategory?: ProductCategory | 'all';
  onSelectCategory?: (category: ProductCategory | 'all') => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onOpenDetails,
  onAddToQuote,
  onOpenAdminPortal,
  onOpenAddProduct,
  isAdminMode,
  onToggleAdminMode,
  onEditProduct,
  onDeleteProduct,
  isAdminAuthenticated = false,
  selectedBrand: controlledBrand,
  onSelectBrand: setControlledBrand,
  selectedCategory: controlledCategory,
  onSelectCategory: setControlledCategory,
}) => {
  const [internalCategory, setInternalCategory] = useState<ProductCategory | 'all'>('all');
  const selectedCategory = controlledCategory !== undefined ? controlledCategory : internalCategory;
  const setSelectedCategory = setControlledCategory || setInternalCategory;

  const [internalBrand, setInternalBrand] = useState<string>('all');
  const selectedBrand = controlledBrand !== undefined ? controlledBrand : internalBrand;
  const setSelectedBrand = setControlledBrand || setInternalBrand;

  const [selectedFinish, setSelectedFinish] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const BRANDS: Brand[] = [
    'Orientbell',
    'Hels',
    'Addon',
    'Exotiles',
    'Microvit',
    'Juliet',
    'Polo',
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

      // Brand filter
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;

      // Finish filter
      if (selectedFinish !== 'all' && !p.finish.toLowerCase().includes(selectedFinish.toLowerCase())) {
        return false;
      }

      // Search query
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesBrand = p.brand.toLowerCase().includes(query);
        const matchesCode = p.modelCode.toLowerCase().includes(query);
        const matchesSize = p.size.toLowerCase().includes(query);
        const matchesColor = p.colorTone.toLowerCase().includes(query);
        const matchesSubcat = p.subCategory.toLowerCase().includes(query);
        return matchesName || matchesBrand || matchesCode || matchesSize || matchesColor || matchesSubcat;
      }

      return true;
    });
  }, [products, selectedCategory, selectedBrand, selectedFinish, searchQuery]);

  return (
    <section id="catalog" className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
            <span>Official Authorized Collections</span>
            <span aria-hidden="true">·</span>
            <span>Orientbell · Hels · Addon · Exotiles · Microvit · Juliet · Polo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tiles, Sanitaryware & Luxury Bath Boutique
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Explore our curated showroom catalog of premium vitrified floor slabs, wall tiles, designer table top basins, and bath fittings with instant WhatsApp price quotation.
          </p>
        </div>

        {/* Owner Quick Actions (Only visible when logged in) */}
        {isAdminAuthenticated && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onOpenAddProduct && (
              <button
                type="button"
                onClick={onOpenAddProduct}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Tile / Product</span>
              </button>
            )}
            <button
              type="button"
              onClick={onToggleAdminMode}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border cursor-pointer ${
                isAdminMode
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
              title="Show/Hide Edit & Delete buttons on cards"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Card Edit/Delete: {isAdminMode ? 'ON' : 'OFF'}</span>
            </button>
            <button
              type="button"
              onClick={onOpenAdminPortal}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              Control Hub
            </button>
          </div>
        )}
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs mb-8 flex flex-col gap-4">
        {/* Row 1: Category Segmented Tabs & Search */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full lg:w-auto overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: 'All Collections' },
              { id: 'tiles', label: 'Tiles (Vitrified & Slabs)' },
              { id: 'sanitary', label: 'Sanitaryware (Microvit Basins)' },
              { id: 'fittings', label: 'Bath Fittings (Juliet & Polo)' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-amber-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search design, code, size, finish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Row 2: Brand Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-500 font-semibold shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-amber-600" />
            Brand:
          </span>
          <button
            onClick={() => setSelectedBrand('all')}
            className={`px-3 py-1.5 rounded-xl border transition-colors shrink-0 text-xs font-bold cursor-pointer ${
              selectedBrand === 'all'
                ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                : 'border-slate-300 text-slate-700 hover:bg-slate-100 bg-white'
            }`}
          >
            All Brands
          </button>
          {BRANDS.map((b) => {
            const isSelected = selectedBrand.toLowerCase() === b.toLowerCase();
            return (
              <button
                key={b}
                onClick={() => setSelectedBrand(isSelected ? 'all' : b)}
                className={`transition-all shrink-0 rounded-xl cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-amber-600 scale-105 shadow-xs'
                    : 'opacity-85 hover:opacity-100 hover:scale-102'
                }`}
                title={`Filter by ${b}`}
              >
                <BrandLogo brand={b} variant="compact" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Status Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
        <span>
          Showing <strong className="text-slate-900">{filteredProducts.length}</strong> items in showroom
        </span>
        {isAdminMode && (
          <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">
            ⚡ Admin mode active: Click on card edit/delete buttons to update items directly
          </span>
        )}
      </div>

      {/* PRODUCT CARDS GRID */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onOpenDetails={onOpenDetails}
              onAddToQuote={onAddToQuote}
              isAdminMode={isAdminMode}
              onEditProduct={onEditProduct}
              onDeleteProduct={onDeleteProduct}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
          <p className="text-slate-500 text-sm">
            No designs found matching your current filter.
          </p>
          <button
            onClick={() => {
              setSelectedBrand('all');
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="mt-3 px-4 py-2 bg-amber-600 text-white font-bold rounded-xl text-xs hover:bg-amber-700 transition-colors cursor-pointer"
          >
            Show All Products
          </button>
        </div>
      )}
    </section>
  );
};
