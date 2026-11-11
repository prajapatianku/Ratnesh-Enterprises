import React, { useState } from 'react';
import { Calculator, X, MessageSquare, Plus, Check } from 'lucide-react';
import { ProductItem } from '../../types';

interface TileCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct?: ProductItem | null;
  onAddToQuote?: (product: ProductItem, sqft: number, boxes: number) => void;
}

export const TileCalculatorModal: React.FC<TileCalculatorModalProps> = ({
  isOpen,
  onClose,
  selectedProduct,
  onAddToQuote,
}) => {
  if (!isOpen) return null;

  const [unit, setUnit] = useState<'feet' | 'meter'>('feet');
  const [length, setLength] = useState<number>(14);
  const [width, setWidth] = useState<number>(12);
  const [wastagePercent, setWastagePercent] = useState<number>(10);
  const [tileSize, setTileSize] = useState<string>(
    selectedProduct?.size || '600x1200 mm (2x4 ft)'
  );

  // Sqft per box calculation based on tile size
  const getBoxCoverage = (size: string): number => {
    if (size.includes('800x1600')) return 27.55;
    if (size.includes('600x1200')) return 15.5;
    if (size.includes('600x600')) return 15.5;
    if (size.includes('300x600')) return 8.7;
    if (size.includes('200x1200')) return 15.5;
    return 15.5;
  };

  const boxCoverage = getBoxCoverage(tileSize);

  // Net Area
  const netAreaSqFt = unit === 'feet' ? length * width : length * width * 10.7639;
  const grossAreaSqFt = netAreaSqFt * (1 + wastagePercent / 100);
  const boxesNeeded = Math.ceil(grossAreaSqFt / boxCoverage);
  const actualCoveredSqFt = boxesNeeded * boxCoverage;

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Hello Ratnesh Enterprises! I calculated my tile requirement:\n\n` +
      `Product: ${selectedProduct?.name || 'Vitrified Tiles'}\n` +
      `Tile Size: ${tileSize}\n` +
      `Room Dimensions: ${length} x ${width} ${unit}\n` +
      `Total Area Needed: ${grossAreaSqFt.toFixed(1)} sq.ft (incl. ${wastagePercent}% wastage)\n` +
      `Boxes Needed: ${boxesNeeded} boxes (~${actualCoveredSqFt.toFixed(1)} sq.ft)\n\n` +
      `Please provide the best price quote, delivery details, and stock availability for my project.`
    );
    window.open(`https://wa.me/918709489716?text=${text}`, '_blank');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Tile Area & Box Estimator
              </h2>
              <p className="text-xs text-slate-500">
                Accurate box count with cutting allowance
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close calculator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 flex flex-col gap-4 text-xs">
          {/* Unit Toggle */}
          <div className="flex items-center justify-between bg-slate-100 p-1 rounded-lg border border-slate-200">
            <span className="text-slate-600 pl-3 font-medium">Measurement Unit:</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setUnit('feet')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                  unit === 'feet'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Feet (ft)
              </button>
              <button
                type="button"
                onClick={() => setUnit('meter')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                  unit === 'meter'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Meters (m)
              </button>
            </div>
          </div>

          {/* Room Dimensions Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 mb-1 font-medium">
                Room Length ({unit})
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={length}
                onChange={(e) => setLength(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-1 font-medium">
                Room Width ({unit})
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={width}
                onChange={(e) => setWidth(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Tile Size Selection */}
          <div>
            <label className="block text-slate-700 mb-1 font-medium">
              Tile Dimensions & Format
            </label>
            <select
              value={tileSize}
              onChange={(e) => setTileSize(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
            >
              <option value="600x1200 mm (2x4 ft)">600x1200 mm (2x4 ft) · 15.5 sq.ft / Box (2 tiles)</option>
              <option value="800x1600 mm (2.6x5.2 ft)">800x1600 mm (Grand Slab) · 27.55 sq.ft / Box (2 tiles)</option>
              <option value="600x600 mm (2x2 ft)">600x600 mm (2x2 ft) · 15.5 sq.ft / Box (4 tiles)</option>
              <option value="300x600 mm (1x2 ft)">300x600 mm (1x2 ft) Wall · 8.7 sq.ft / Box</option>
              <option value="200x1200 mm (Wood Plank)">200x1200 mm Wooden Plank · 15.5 sq.ft / Box</option>
            </select>
          </div>

          {/* Wastage / Cutting Allowance */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-700 font-medium">
                Cutting & Corner Wastage Allowance
              </label>
              <span className="text-amber-700 font-bold">{wastagePercent}% Extra</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 5, label: '5% (Simple)' },
                { val: 10, label: '10% (Recommended)' },
                { val: 15, label: '15% (Diagonal)' },
              ].map((w) => (
                <button
                  key={w.val}
                  type="button"
                  onClick={() => setWastagePercent(w.val)}
                  className={`py-1.5 px-2 rounded-lg border font-medium text-center transition-all ${
                    wastagePercent === w.val
                      ? 'bg-amber-50 border-amber-500 text-amber-800 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* CALCULATION SUMMARY CARD */}
          <div className="bg-gradient-to-br from-amber-50/60 to-slate-50 border border-amber-200/80 rounded-xl p-4 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200">
              <div>
                <span className="text-[11px] text-slate-500 block">Room Net Area</span>
                <span className="text-base font-bold text-slate-900 tabular-nums">
                  {netAreaSqFt.toFixed(1)} sq.ft
                </span>
                <span className="text-[10px] text-slate-500 block">
                  ({(netAreaSqFt / 10.7639).toFixed(1)} sq.m)
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">With {wastagePercent}% Wastage</span>
                <span className="text-base font-bold text-amber-700 tabular-nums">
                  {grossAreaSqFt.toFixed(1)} sq.ft
                </span>
                <span className="text-[10px] text-slate-500 block">Required material</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-[11px] text-slate-600 block font-medium">Boxes Needed</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-amber-600 tabular-nums">
                    {boxesNeeded}
                  </span>
                  <span className="text-sm text-slate-800 font-bold">Boxes</span>
                </div>
                <span className="text-[11px] text-slate-500">
                  Total {actualCoveredSqFt.toFixed(1)} sq.ft coverage
                </span>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-emerald-700 block font-bold uppercase tracking-wider">
                  Showroom Pricing
                </span>
                <div className="text-sm font-bold text-slate-900">
                  Price on Request
                </div>
                <span className="text-[10px] text-slate-500 block">
                  Direct wholesale quotation
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={handleWhatsAppShare}
            className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02] cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>Get Price for {boxesNeeded} Boxes on WhatsApp</span>
          </button>

          {selectedProduct && onAddToQuote && (
            <button
              onClick={() => {
                onAddToQuote(selectedProduct, actualCoveredSqFt, boxesNeeded);
                onClose();
              }}
              className="py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Estimate</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
