import React, { useState } from 'react';
import { QuoteItem, ShopSettings } from '../../types';
import { X, Trash2, MessageSquare, ShoppingBag, ArrowRight } from 'lucide-react';

interface QuoteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: QuoteItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onClearAll: () => void;
  shopSettings?: ShopSettings;
}

export const QuoteDrawer: React.FC<QuoteDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity,
  onClearAll,
  shopSettings,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerCity, setCustomerCity] = useState('');

  const handleSendToWhatsApp = () => {
    let breakdown = '';
    items.forEach((item, idx) => {
      if (item.product.category === 'tiles') {
        const sqft = ((item.boxesNeeded || 1) * (item.product.sqftPerBox || 15.5)).toFixed(1);
        breakdown += `${idx + 1}. *${item.product.name}* (${item.product.brand})\n   Size: ${item.product.size} | Finish: ${item.product.finish}\n   Requirement: ${item.boxesNeeded || 1} Boxes (~${sqft} sq.ft)\n\n`;
      } else {
        breakdown += `${idx + 1}. *${item.product.name}* (${item.product.brand})\n   Quantity: ${item.quantity} pcs\n\n`;
      }
    });

    const shopName = shopSettings?.shopName || 'Ratnesh Enterprises';
    const text = encodeURIComponent(
      `Hello ${shopName}! I would like to get price quotation for my selected designs:\n\n` +
      (customerName ? `Customer Name: ${customerName}\n` : '') +
      (customerCity ? `Site Location: ${customerCity}\n\n` : '\n') +
      `-- SELECTED DESIGNS & ITEMS --\n\n` +
      breakdown +
      `Please provide your best discounted showroom rates, delivery timeframe, and stock confirmation. Thank you!`
    );

    const num = shopSettings?.whatsappNumber ? `/${shopSettings.whatsappNumber}` : '/918709489716';
    window.open(`https://wa.me${num}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col h-full text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">Estimate & Quotation Bag</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {items.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium text-slate-600">Your quote bag is empty</p>
              <p className="text-xs text-slate-500 mt-1">
                Browse our tiles, Microvit basins and Juliet taps to build your custom quote.
              </p>
            </div>
          ) : (
            items.map((item) => {
              return (
                <div
                  key={item.product.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-700 block">
                        {item.product.brand}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        {item.product.size}
                      </span>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                    {item.product.category === 'tiles' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-[11px]">Boxes:</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="w-5 h-5 rounded bg-slate-200 hover:bg-slate-300 flex items-center justify-center font-bold text-slate-700 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-mono font-semibold px-1 text-slate-900">
                            {item.boxesNeeded || 1}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="w-5 h-5 rounded bg-slate-200 hover:bg-slate-300 flex items-center justify-center font-bold text-slate-700 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-[11px]">Qty:</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="w-5 h-5 rounded bg-slate-200 hover:bg-slate-300 flex items-center justify-center font-bold text-slate-700 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-mono font-semibold px-1 text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="w-5 h-5 rounded bg-slate-200 hover:bg-slate-300 flex items-center justify-center font-bold text-slate-700 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="font-bold text-emerald-700 text-xs">
                      Price on Request
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Customer Info */}
        {items.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <input
                type="text"
                placeholder="Your Name (Optional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
              />
              <input
                type="text"
                placeholder="Your City / Area"
                value={customerCity}
                onChange={(e) => setCustomerCity(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-600 font-medium">Selected Products:</span>
              <span className="text-sm font-black text-amber-700">
                {items.length} Item{items.length > 1 ? 's' : ''}
              </span>
            </div>

            <button
              onClick={handleSendToWhatsApp}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Get Wholesale Price on WhatsApp</span>
            </button>

            <button
              onClick={onClearAll}
              className="text-[11px] text-slate-500 hover:text-rose-600 text-center transition-colors cursor-pointer"
            >
              Clear Quote Bag
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
