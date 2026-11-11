import React, { useState } from 'react';
import {
  Layers,
  Bath,
  Droplets,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Compass,
  Ruler,
  Send
} from 'lucide-react';
import { ShopSettings } from '../../types';

interface LuxuryStudioVisualizerProps {
  shopSettings: ShopSettings;
}

type TabType = 'marble' | 'basins' | 'taps' | 'showers';

interface StudioItem {
  id: string;
  name: string;
  subtitle: string;
  material: string;
  specs: { label: string; value: string }[];
  description: string;
  imageUrl: string;
  finishes: string[];
  tag: string;
}

const STUDIO_COLLECTIONS: Record<TabType, StudioItem[]> = {
  marble: [
    {
      id: 'statuario-carving',
      name: 'Statuario Gold 3D Micro-Carving Slab',
      subtitle: '600x1200 mm (2x4 ft) · Orientbell Glazed Vitrified',
      material: 'Nano Glazed Vitrified (GVT/PGVT)',
      specs: [
        { label: 'Surface Sheen', value: 'Carving Vein Glow' },
        { label: 'Water Absorption', value: '< 0.05% (Zero Stain)' },
        { label: 'Thickness', value: '9 mm Heavy Commercial' },
        { label: 'Ideal For', value: 'Living Room & Master Suite' },
      ],
      description:
        'Features micro-textured golden and grey veins that catch natural sunlight. Engineered with stain-resistant porcelain glaze for lifelong scratch-free durability.',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      finishes: ['Carving Vein', 'High Gloss Mirror', 'Satin Matte'],
      tag: 'Most Popular for Living Rooms',
    },
    {
      id: 'nero-marquina',
      name: 'Nero Marquina Black Mirror Polish Slab',
      subtitle: '600x1200 mm · High Gloss PGVT Slabs',
      material: 'Full Body Glazed Vitrified',
      specs: [
        { label: 'Surface Sheen', value: 'High Gloss Mirror 98°' },
        { label: 'Water Absorption', value: '< 0.05%' },
        { label: 'Thickness', value: '9.2 mm' },
        { label: 'Ideal For', value: 'TV Feature Wall & Dining Hall' },
      ],
      description:
        'Deep jet-black background accentuated with crystalline white marble veining. High light reflection creates a grand luxury hotel aesthetic.',
      imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
      finishes: ['High Gloss Mirror', 'Book-Match Vein'],
      tag: 'Architectural Feature Walls',
    },
  ],

  basins: [
    {
      id: 'microvit-fluted',
      name: 'Microvit Artisan Fluted Table-Top Basin',
      subtitle: 'Matte Ceramic Designer Art Basin',
      material: 'Vitreous China with Anti-Microbial Glaze',
      specs: [
        { label: 'Form Factor', value: 'Oval Table Top Vessel' },
        { label: 'Surface Texture', value: 'Fluted Exterior, Gloss Interior' },
        { label: 'Drain Compatibility', value: 'Standard Pop-Up Coupling' },
        { label: 'Dimensions', value: '500 x 380 x 140 mm' },
      ],
      description:
        'Designed for luxury hotel powder rooms and contemporary vanities. The deep curved bowl prevents water splashing while the smooth glazed surface wipes clean in seconds.',
      imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
      finishes: ['Matte Alabaster', 'Gloss White', 'Matte Slate Grey'],
      tag: 'Luxury Boutique Series',
    },
    {
      id: 'marble-pattern-basin',
      name: 'Microvit Gold Vein Marble Ceramic Basin',
      subtitle: 'Rectangular Counter-Top Art Basin',
      material: 'Glazed Vitreous Ceramic',
      specs: [
        { label: 'Form Factor', value: 'Thin-Rim Counter Basin' },
        { label: 'Vein Style', value: 'Gold Calacatta Veins' },
        { label: 'Warranty', value: '10-Year Ceramic Warranty' },
        { label: 'Dimensions', value: '600 x 400 x 120 mm' },
      ],
      description:
        'Seamlessly matches 2x4 ft Statuario and Calacatta floor tiles to create a unified, coordinated bathroom suite with premium brass tall-body taps.',
      imageUrl: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1000&q=80',
      finishes: ['Calacatta Gold', 'Nero Black Gold'],
      tag: 'Coordinated Tile Match',
    },
  ],

  taps: [
    {
      id: 'juliet-diverter',
      name: 'Juliet Concealed High-Flow Bath Diverter',
      subtitle: 'Forged Brass 3-Inlet Wall Diverter',
      material: 'Solid Lead-Free Forged Brass Body',
      specs: [
        { label: 'Cartridge Type', value: 'German Ceramic Disc (500k Cycles)' },
        { label: 'Water Pressure', value: 'Tested to 16 Bar Pressure' },
        { label: 'Coating Tech', value: 'Multi-Layer PVD & Chrome' },
        { label: 'Warranty', value: '10-Year Leak-Free Warranty' },
      ],
      description:
        'Engineered with heavy forged brass construction. Effortless single-lever operation allows smooth switching between overhead rain shower, spout, and hand shower.',
      imageUrl: 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&w=1000&q=80',
      finishes: ['Mirror Chrome', 'Velvet Matte Black', 'PVD Rose Gold'],
      tag: 'Lifelong Leak-Free Performance',
    },
    {
      id: 'polo-tall-basin-tap',
      name: 'Polo Designer Tall-Body Table-Top Basin Mixer',
      subtitle: 'Single-Lever Counter Basin Faucet',
      material: 'Solid Heavy Brass Alloy with Aerator',
      specs: [
        { label: 'Spout Height', value: '300 mm (Fits Table-Top Basins)' },
        { label: 'Flow Tech', value: 'HoneyComb Aerator (Anti-Splash)' },
        { label: 'Inlet Hoses', value: 'Braided Stainless Steel Included' },
        { label: 'Finish', value: 'Diamond Hardened Chrome' },
      ],
      description:
        'Perfect height for table-top and vessel washbasins. The aerated water stream provides a soft, bubbly, splash-free flow with up to 30% water conservation.',
      imageUrl: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1000&q=80',
      finishes: ['Mirror Chrome', 'Matte Black', 'Brushed Gold'],
      tag: 'Fits Table-Top Basins',
    },
  ],

  showers: [
    {
      id: 'polo-rain-shower',
      name: 'Polo 12-Inch Ultra-Slim Ceiling Rain Shower',
      subtitle: 'Stainless Steel SS-304 Rain Head with Swivel Joint',
      material: 'Grade SS-304 Anti-Corrosion Steel',
      specs: [
        { label: 'Size', value: '300 x 300 mm (12x12 inch)' },
        { label: 'Nozzle Type', value: 'Self-Cleaning Silicon Rub-Clean' },
        { label: 'Flow Pattern', value: 'Cascading Soft Rain Flow' },
        { label: 'Arm Length', value: '15-Inch Heavy Brass Arm Included' },
      ],
      description:
        'Creates an immersive, drenching rainfall shower experience even under moderate municipal water pressure. Silicon nozzles prevent limescale and sediment blockage.',
      imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1000&q=80',
      finishes: ['Mirror Chrome', 'Matte Black', 'PVD Gold'],
      tag: 'Hotel Suite Rain Experience',
    },
  ],
};

export const LuxuryStudioVisualizer: React.FC<LuxuryStudioVisualizerProps> = ({ shopSettings }) => {
  const [activeTab, setActiveTab] = useState<TabType>('marble');
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [activeFinishIndex, setActiveFinishIndex] = useState(0);

  const currentItems = STUDIO_COLLECTIONS[activeTab];
  const currentItem = currentItems[activeItemIndex] || currentItems[0];

  const handleInquireWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello ${shopSettings.shopName}! I saw "${currentItem.name}" (${currentItem.finishes[activeFinishIndex] || 'Standard finish'}) in your online studio. Can you share availability and price for Bokaro delivery?`
    );
    const num = shopSettings.whatsappNumber ? `/${shopSettings.whatsappNumber}` : '';
    window.open(`https://wa.me${num}?text=${text}`, '_blank');
  };

  return (
    <section id="studio-visualizer" className="w-full py-12 sm:py-16 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              <span>Interactive Concept Studio</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Tiles, Marble Basins &amp; Bath Fittings Studio
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Inspect materials, surface finishes, dimensions, and water performance before choosing.
            </p>
          </div>

          {/* 4 Interactive Category Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                setActiveTab('marble');
                setActiveItemIndex(0);
                setActiveFinishIndex(0);
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                activeTab === 'marble'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>Vitrified Marble</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('basins');
                setActiveItemIndex(0);
                setActiveFinishIndex(0);
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                activeTab === 'basins'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bath className="w-3.5 h-3.5 text-emerald-600" />
              <span>Artisan Basins</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('taps');
                setActiveItemIndex(0);
                setActiveFinishIndex(0);
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                activeTab === 'taps'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Droplets className="w-3.5 h-3.5 text-blue-600" />
              <span>Brass Taps</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('showers');
                setActiveItemIndex(0);
                setActiveFinishIndex(0);
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                activeTab === 'showers'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>Rain Showers</span>
            </button>
          </div>
        </div>

        {/* Visualizer Display Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 shadow-sm">
          {/* Left Column: High-Res Visual Preview (7 cols) */}
          <div className="lg:col-span-7 relative bg-slate-900 min-h-[300px] sm:min-h-[420px] flex items-center justify-center overflow-hidden">
            <img
              src={currentItem.imageUrl}
              alt={currentItem.name}
              className="w-full h-full object-cover object-center transition-all duration-500 scale-102"
              key={currentItem.id}
            />

            {/* Top Tag Badge */}
            <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md text-amber-300 border border-amber-400/30 px-3 py-1 rounded-lg text-xs font-bold">
              {currentItem.tag}
            </div>

            {/* If collection has multiple items, small pill toggle */}
            {currentItems.length > 1 && (
              <div className="absolute bottom-4 inset-x-4 flex items-center justify-center gap-2">
                {currentItems.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveItemIndex(idx);
                      setActiveFinishIndex(0);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer backdrop-blur-md ${
                      idx === activeItemIndex
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-black/60 hover:bg-black/80 text-white border border-white/20'
                    }`}
                  >
                    {item.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Material Specs, Finish Selector & Inquiry (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white">
            <div>
              <span className="text-[11px] font-bold text-amber-700 tracking-wider uppercase block mb-1">
                {currentItem.material}
              </span>

              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {currentItem.name}
              </h3>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {currentItem.description}
              </p>

              {/* Finish Options Selector */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-900 block mb-2">
                  Available Surface Sheen &amp; Color Finishes:
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentItem.finishes.map((f, idx) => (
                    <button
                      key={f}
                      onClick={() => setActiveFinishIndex(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                        idx === activeFinishIndex
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specifications Matrix */}
              <div className="mt-5 grid grid-cols-2 gap-2.5 pt-4 border-t border-slate-100 text-xs">
                {currentItem.specs.map((s, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                      {s.label}
                    </span>
                    <strong className="text-slate-900 font-bold block mt-0.5 truncate">
                      {s.value}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Inquiry & Catalog Button */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <button
                onClick={handleInquireWhatsApp}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Inquire on WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all border border-slate-200 cursor-pointer"
              >
                View in Catalog →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
