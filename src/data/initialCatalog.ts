import { ProductItem } from '../types';

export const INITIAL_PRODUCTS: ProductItem[] = [
  // --- ORIENTBELL TILES ---
  {
    id: 'ob-statuario-carving',
    name: 'Orientbell Statuario Gold Carving Slab',
    modelCode: 'OB-PGVT-9401',
    brand: 'Orientbell',
    category: 'tiles',
    subCategory: 'Carving PGVT Vitrified Tile',
    size: '600x1200 mm (2x4 ft)',
    finish: 'Carving Vein',
    pricePerUnit: 64,
    unitLabel: 'sq.ft',
    sqftPerBox: 15.5,
    tilesPerBox: 2,
    thickness: '9 mm',
    colorTone: 'Alabaster White & Subtle Warm Grey',
    texturePattern: 'statuario',
    features: [
      'Authentic 3D Micro-Carving Vein that catches light',
      'Nano-Pore Stain Free Surface Technology',
      'Zero Water Absorption (<0.05%)',
      'High Breaking Strength > 1300 N'
    ],
    inStock: true,
    isFeatured: true,
    isNew: true,
    applications: ['Living Room Floor', 'Bathroom Wall & Floor', 'Bedroom Floor', 'Commercial & Hall'],
    specs: {
      waterAbsorption: '< 0.05%',
      surfaceTreatment: 'Nano Glazed Polished Carving',
      material: 'Glazed Vitrified (GVT/PGVT)',
      coveragePerBox: '15.5 sq.ft (2 Tiles)',
      warranty: '10 Year Structural Warranty'
    }
  },
  {
    id: 'ob-aqua-onyx',
    name: 'Orientbell Royal Aqua Onyx Grand PGVT',
    modelCode: 'OB-PGVT-8820',
    brand: 'Orientbell',
    category: 'tiles',
    subCategory: 'High Gloss PGVT Tile',
    size: '800x1600 mm (2.6x5.2 ft)',
    finish: 'High Gloss',
    pricePerUnit: 82,
    unitLabel: 'sq.ft',
    sqftPerBox: 27.55,
    tilesPerBox: 2,
    thickness: '9.5 mm',
    colorTone: 'Translucent Emerald Green & Golden Waves',
    texturePattern: 'emerald_onyx',
    features: [
      'Book-match flow design pattern',
      'Ultra high gloss glass surface finish',
      'Ideal for master feature walls & luxury living halls',
      'Scratch & chemical resistant'
    ],
    inStock: true,
    isFeatured: true,
    applications: ['Living Room Floor', 'Bathroom Wall & Floor', 'Commercial & Hall'],
    specs: {
      waterAbsorption: '< 0.03%',
      surfaceTreatment: 'Crystal Mirror Glaze',
      material: 'Vitrified Full Slab',
      coveragePerBox: '27.55 sq.ft (2 Tiles)',
      warranty: '10 Year Structural Warranty'
    }
  },
  {
    id: 'ob-moroccan-heritage',
    name: 'Orientbell Heritage Moroccan Blue Mosaic Tile',
    modelCode: 'OB-WL-4022',
    brand: 'Orientbell',
    category: 'tiles',
    subCategory: 'Digital Ceramic Wall Tile',
    size: '300x300 mm (1x1 ft)',
    finish: 'Matte / Satin',
    pricePerUnit: 52,
    unitLabel: 'sq.ft',
    sqftPerBox: 9.68,
    tilesPerBox: 10,
    thickness: '8 mm',
    colorTone: 'Cobalt Mediterranean Blue & Warm Chalk',
    texturePattern: 'moroccan_blue',
    features: [
      'Artisanal Andalusian geometric pattern',
      'Anti-stain matte glazed protection',
      'Perfect for kitchen backsplash & shower highlighter wall'
    ],
    inStock: true,
    applications: ['Kitchen Backsplash', 'Bathroom Wall & Floor'],
    specs: {
      waterAbsorption: '10-12%',
      surfaceTreatment: 'Digital Glazed Matte',
      material: 'Ceramic Body',
      coveragePerBox: '9.68 sq.ft (10 Tiles)',
      warranty: '5 Year Surface Finish'
    }
  },
  {
    id: 'ob-chevron-teak',
    name: 'Orientbell Valencia Chevron Wood Plank',
    modelCode: 'OB-WD-6110',
    brand: 'Orientbell',
    category: 'tiles',
    subCategory: 'Vitrified Wooden Plank',
    size: '200x1200 mm (8x48 inch)',
    finish: 'Wooden Plank',
    pricePerUnit: 68,
    unitLabel: 'sq.ft',
    sqftPerBox: 15.5,
    tilesPerBox: 6,
    thickness: '9 mm',
    colorTone: 'Honey Teak & Golden Walnut Grain',
    texturePattern: 'chevron_wood',
    features: [
      'Micro-relief natural wood grain texture',
      'Termite proof, 100% waterproof unlike real wood',
      'Underfloor heating compatible'
    ],
    inStock: true,
    applications: ['Bedroom Floor', 'Living Room Floor', 'Outdoor & Balcony'],
    specs: {
      waterAbsorption: '< 0.05%',
      surfaceTreatment: 'Silk Matte Wood Texture',
      material: 'Glazed Vitrified',
      coveragePerBox: '15.5 sq.ft (6 Tiles)',
      warranty: '10 Year Guarantee'
    }
  },

  // --- HELS CERAMICS ---
  {
    id: 'hels-calacatta-gold',
    name: 'Hels Calacatta Oro Extra Polished Grand Slab',
    modelCode: 'HL-PGVT-1090',
    brand: 'Hels',
    category: 'tiles',
    subCategory: 'Grand Vitrified Slab',
    size: '800x1600 mm (2.6x5.2 ft)',
    finish: 'High Gloss',
    pricePerUnit: 86,
    unitLabel: 'sq.ft',
    sqftPerBox: 27.55,
    tilesPerBox: 2,
    thickness: '9.5 mm',
    colorTone: 'Warm Italian White with Honey Veining',
    texturePattern: 'calacatta_gold',
    features: [
      'Continuous endless veining precision cut',
      'Imported Italian nano-coat glaze',
      'Stain resistant to turmeric, wine & coffee',
      'Reflects 95% ambient light for expansive room feel'
    ],
    inStock: true,
    isFeatured: true,
    isNew: true,
    applications: ['Living Room Floor', 'Bathroom Wall & Floor', 'Commercial & Hall'],
    specs: {
      waterAbsorption: '< 0.04%',
      surfaceTreatment: 'Double Charge Polished PGVT',
      material: 'Vitrified Porcelain',
      coveragePerBox: '27.55 sq.ft',
      warranty: '15 Year Guarantee'
    }
  },
  {
    id: 'hels-slate-concrete',
    name: 'Hels Urban Slate Concrete Matte',
    modelCode: 'HL-MT-5502',
    brand: 'Hels',
    category: 'tiles',
    subCategory: 'Industrial GVT Tile',
    size: '600x1200 mm (2x4 ft)',
    finish: 'Matte / Satin',
    pricePerUnit: 59,
    unitLabel: 'sq.ft',
    sqftPerBox: 15.5,
    tilesPerBox: 2,
    thickness: '9 mm',
    colorTone: 'Raw Industrial Charcoal Slate',
    texturePattern: 'rustic_concrete',
    features: [
      'Silky smooth soft-touch matte glaze',
      'Anti-fingerprint and non-reflective',
      'R9 Slip Rating for safe wet bathroom zones'
    ],
    inStock: true,
    applications: ['Bathroom Wall & Floor', 'Living Room Floor', 'Commercial & Hall'],
    specs: {
      waterAbsorption: '< 0.05%',
      surfaceTreatment: 'Satin Silk Matte',
      material: 'Glazed Vitrified Porcelain',
      coveragePerBox: '15.5 sq.ft',
      warranty: '10 Year Guarantee'
    }
  },
  {
    id: 'hels-venetian-terrazzo',
    name: 'Hels Venetian Multi-Chip Terrazzo Vitrified',
    modelCode: 'HL-TR-3030',
    brand: 'Hels',
    category: 'tiles',
    subCategory: 'Designer Vitrified Tile',
    size: '600x600 mm (2x2 ft)',
    finish: 'Matte / Satin',
    pricePerUnit: 56,
    unitLabel: 'sq.ft',
    sqftPerBox: 15.5,
    tilesPerBox: 4,
    thickness: '9 mm',
    colorTone: 'Warm Sand Canvas with Terracotta & Jade Flecks',
    texturePattern: 'terrazzo',
    features: [
      'Vintage Italian terrazzo revival aesthetic',
      'Uniform edge rectified cutting',
      'Resistant to heavy foot traffic'
    ],
    inStock: true,
    applications: ['Bathroom Wall & Floor', 'Kitchen Backsplash', 'Outdoor & Balcony'],
    specs: {
      waterAbsorption: '< 0.05%',
      surfaceTreatment: 'Textured Fine Grain Matte',
      material: 'Vitrified',
      coveragePerBox: '15.5 sq.ft (4 Tiles)',
      warranty: '10 Year Guarantee'
    }
  },

  // --- ADDON TILES ---
  {
    id: 'addon-armani-bronze',
    name: 'Addon Armani Bronze Mirror High Gloss',
    modelCode: 'AD-PGVT-7014',
    brand: 'Addon',
    category: 'tiles',
    subCategory: 'Luxury PGVT Tile',
    size: '600x1200 mm (2x4 ft)',
    finish: 'High Gloss',
    pricePerUnit: 72,
    unitLabel: 'sq.ft',
    sqftPerBox: 15.5,
    tilesPerBox: 2,
    thickness: '9 mm',
    colorTone: 'Deep Espresso Brown with Warm Golden Filaments',
    texturePattern: 'armani_brown',
    features: [
      'Rich aristocratic Spanish brown marble aesthetic',
      'Mirror reflection rating > 92 GU',
      'High density hydraulic press compaction'
    ],
    inStock: true,
    isFeatured: true,
    applications: ['Living Room Floor', 'Bathroom Wall & Floor', 'Bedroom Floor'],
    specs: {
      waterAbsorption: '< 0.05%',
      surfaceTreatment: 'Nano High Gloss Polish',
      material: 'Glazed Vitrified',
      coveragePerBox: '15.5 sq.ft',
      warranty: '10 Year Guarantee'
    }
  },
  {
    id: 'addon-botticino-cream',
    name: 'Addon Botticino Cream Satin Polish',
    modelCode: 'AD-ST-4081',
    brand: 'Addon',
    category: 'tiles',
    subCategory: 'Satin Vitrified Tile',
    size: '800x1600 mm (2.6x5.2 ft)',
    finish: 'Matte / Satin',
    pricePerUnit: 78,
    unitLabel: 'sq.ft',
    sqftPerBox: 27.55,
    tilesPerBox: 2,
    thickness: '9.5 mm',
    colorTone: 'Warm Beige Biscuit & Pearl Clouds',
    texturePattern: 'botticino_beige',
    features: [
      'Calm, soothing earthy tone beloved by architects',
      'Satin touch velvet texture',
      'Seamless joints with 1mm laser-cut bevel'
    ],
    inStock: true,
    applications: ['Living Room Floor', 'Bedroom Floor', 'Commercial & Hall'],
    specs: {
      waterAbsorption: '< 0.04%',
      surfaceTreatment: 'Honed Satin Sheen',
      material: 'Vitrified Slab',
      coveragePerBox: '27.55 sq.ft',
      warranty: '12 Year Guarantee'
    }
  },

  // --- EXOTILES ---
  {
    id: 'exotiles-nero-marquina',
    name: 'Exotiles Nero Marquina Midnight Black Slab',
    modelCode: 'EX-NM-9005',
    brand: 'Exotiles',
    category: 'tiles',
    subCategory: 'Premium High-Gloss PGVT',
    size: '600x1200 mm (2x4 ft)',
    finish: 'High Gloss',
    pricePerUnit: 76,
    unitLabel: 'sq.ft',
    sqftPerBox: 15.5,
    tilesPerBox: 2,
    thickness: '9 mm',
    colorTone: 'Deep Raven Black with Sharp White Quartz Fractures',
    texturePattern: 'nero_marquina',
    features: [
      'Dramatic contrast for accent walls & executive powder rooms',
      'Diamond-level scratch hardness Mohs 6',
      'Full body color pigmentation under glazed protective film'
    ],
    inStock: true,
    isFeatured: true,
    applications: ['Bathroom Wall & Floor', 'Living Room Floor', 'Commercial & Hall'],
    specs: {
      waterAbsorption: '< 0.03%',
      surfaceTreatment: 'Liquid Glass High Gloss',
      material: 'GVT Porcelain',
      coveragePerBox: '15.5 sq.ft',
      warranty: '10 Year Guarantee'
    }
  },
  {
    id: 'exotiles-outdoor-sandstone',
    name: 'Exotiles Heavy-Duty Anti-Skid Paver 16mm',
    modelCode: 'EX-PV-2200',
    brand: 'Exotiles',
    category: 'tiles',
    subCategory: 'Heavy Duty Outdoor Vitrified',
    size: '600x600 mm (2x2 ft)',
    finish: 'Rustic Anti-Skid',
    pricePerUnit: 69,
    unitLabel: 'sq.ft',
    sqftPerBox: 11.62,
    tilesPerBox: 3,
    thickness: '16 mm Full Body',
    colorTone: 'Chiseled Desert Stone Grey',
    texturePattern: 'rustic_concrete',
    features: [
      '16mm extra thickness for car driveway & parking',
      'R11 certified anti-skid wet grip surface',
      'Can withstand heavy SUV vehicle weights up to 3 tonnes'
    ],
    inStock: true,
    applications: ['Outdoor & Balcony', 'Commercial & Hall'],
    specs: {
      waterAbsorption: '< 0.02%',
      surfaceTreatment: 'Rough Textured Chiseled Grip',
      material: 'Full Body Vitrified',
      coveragePerBox: '11.62 sq.ft',
      warranty: '15 Year Industrial Warranty'
    }
  },

  // --- MICROVIT SANITARYWARE (TABLE TOP BASINS & COMMODES) ---
  {
    id: 'microvit-celestial-black',
    name: 'Microvit Celestial Oval Table Top Basin',
    modelCode: 'MV-TT-8101-BLK',
    brand: 'Microvit',
    category: 'sanitary',
    subCategory: 'Table Top Wash Basin',
    size: '560 x 380 x 140 mm',
    finish: 'Matte Black & Brushed Gold Rim',
    pricePerUnit: 5450,
    unitLabel: 'piece',
    thickness: 'Fine Ceramic 12 mm Rim',
    colorTone: 'Matte Charcoal Black with Regal Gold Trim',
    texturePattern: 'nero_marquina',
    features: [
      'Anti-splash deep curved ergonomic basin',
      'High-temperature 1280°C fired vitreous china',
      'Stain-resistant antibacterial nano glaze',
      'Universal 32mm drain waste coupling compatibility'
    ],
    inStock: true,
    isFeatured: true,
    isNew: true,
    specs: {
      material: 'A-Grade Vitreous China Ceramic',
      surfaceTreatment: 'Double Nano Glaze Matte & Metallic PVD Gold',
      warranty: '10 Years Ceramic Glaze Guarantee'
    }
  },
  {
    id: 'microvit-fluted-white',
    name: 'Microvit Fluted Alabaster Countertop Basin',
    modelCode: 'MV-TT-8120-WHT',
    brand: 'Microvit',
    category: 'sanitary',
    subCategory: 'Table Top Wash Basin',
    size: '410 x 410 x 135 mm',
    finish: 'Satin Alabaster White',
    pricePerUnit: 4200,
    unitLabel: 'piece',
    thickness: 'Fluted Ceramic Shell',
    colorTone: 'Pure Alabaster White',
    texturePattern: 'statuario',
    features: [
      'Architectural vertical flute ribbing exterior',
      'Smooth easy-wipe gloss interior',
      'Compact footprint perfect for designer vanities',
      'Overflow prevention design'
    ],
    inStock: true,
    isFeatured: true,
    specs: {
      material: 'Vitreous China Fine Ceramic',
      surfaceTreatment: 'Silky Satin Exterior / Gloss Glaze Basin',
      warranty: '10 Years Warranty'
    }
  },
  {
    id: 'microvit-calacatta-marble-sink',
    name: 'Microvit Calacatta Marble Luxury Table Top Sink',
    modelCode: 'MV-TT-8199-GLD',
    brand: 'Microvit',
    category: 'sanitary',
    subCategory: 'Table Top Wash Basin',
    size: '600 x 400 x 120 mm',
    finish: 'Calacatta Glaze Gloss',
    pricePerUnit: 6850,
    unitLabel: 'piece',
    colorTone: 'Italian Marble Veins on Snow White Base',
    texturePattern: 'calacatta_gold',
    features: [
      'Matching companion to Calacatta wall and floor tiles',
      'Zero porosity ceramic formula',
      'Includes matching ceramic pop-up waste coupling'
    ],
    inStock: true,
    specs: {
      material: 'Vitreous Ceramic with High-Definition Mineral Glaze',
      warranty: '10 Years Ceramic Warranty'
    }
  },
  {
    id: 'microvit-tornado-commode',
    name: 'Microvit Rimless Tornado Syphonic One-Piece Water Closet',
    modelCode: 'MV-EWC-5020',
    brand: 'Microvit',
    category: 'sanitary',
    subCategory: 'One Piece Commode (EWC)',
    size: '650 x 360 x 740 mm (S-Trap 300mm)',
    finish: 'Ultra Gloss Nano Glaze White',
    pricePerUnit: 9800,
    unitLabel: 'piece',
    colorTone: 'Ultra Pristine White',
    texturePattern: 'statuario',
    features: [
      '360° Tornado rimless whirlpool flush technology',
      'Dual flush eco system (3L liquid / 4.5L solid)',
      'Heavy-duty UF soft-close slim quick-release seat cover',
      'Glazed trapway prevents odor and clogging'
    ],
    inStock: true,
    isFeatured: true,
    specs: {
      material: 'Vitreous China Single Cast',
      surfaceTreatment: 'Nano Self-Cleaning Antibacterial Glaze',
      warranty: '10 Year Ceramic & 3 Year Flush Valve Warranty'
    }
  },
  {
    id: 'microvit-wallhung-smart',
    name: 'Microvit Pureline Rimless Wall Hung Toilet',
    modelCode: 'MV-WH-3011',
    brand: 'Microvit',
    category: 'sanitary',
    subCategory: 'Wall Hung Commode',
    size: '520 x 360 x 350 mm',
    finish: 'Pure White Nano Glaze',
    pricePerUnit: 7900,
    unitLabel: 'piece',
    colorTone: 'Snow White',
    texturePattern: 'statuario',
    features: [
      'Floating wall mounted clean aesthetic for easy floor moping',
      'UF Hydraulic soft-close slim cover',
      'Load tested up to 400 kg',
      'Blind installation with concealed fixings'
    ],
    inStock: true,
    specs: {
      material: 'High-Density Vitreous China',
      warranty: '10 Years Warranty'
    }
  },

  // --- JULIET TAPS & BATH FITTINGS ---
  {
    id: 'juliet-tall-mixer-rosegold',
    name: 'Juliet Royal Tall Body Single Lever Basin Mixer',
    modelCode: 'JL-BM-910-RG',
    brand: 'Juliet',
    category: 'fittings',
    subCategory: 'Tall Basin Mixer Faucet',
    size: 'Height: 310 mm | Spout Reach: 180 mm',
    finish: 'Brushed Rose Gold PVD',
    pricePerUnit: 4850,
    unitLabel: 'piece',
    colorTone: 'Luxurious Warm Rose Gold',
    texturePattern: 'calacatta_gold',
    features: [
      'Ideal height specifically engineered for Table Top Basins',
      'Solid virgin forged brass ingot body (Grade A)',
      'German Neoperl honeycomb aerator with splash-free foam flow',
      'Sedal European ceramic disc cartridge tested to 500,000 cycles'
    ],
    inStock: true,
    isFeatured: true,
    isNew: true,
    specs: {
      material: 'Lead-Free Heavy Brass & PVD Coating',
      warranty: '7 Years Comprehensive Leakproof Warranty'
    }
  },
  {
    id: 'juliet-diverter-matteblack',
    name: 'Juliet Concealed 3-Way Thermostatic Diverter & Rain Shower Set',
    modelCode: 'JL-SH-770-BLK',
    brand: 'Juliet',
    category: 'fittings',
    subCategory: 'Concealed Shower Diverter',
    size: 'Faceplate: 180x130 mm | Shower Arm: 400 mm',
    finish: 'Electroplated Matte Black',
    pricePerUnit: 8900,
    unitLabel: 'piece',
    colorTone: 'Architectural Matte Black',
    texturePattern: 'nero_marquina',
    features: [
      'Smooth 3-way diverter switch: Rain Shower / Hand Shower / Spout',
      'Anti-scald safety lock at 38°C for child and elder safety',
      'Corrosion resistant electroplated black skin',
      'High water flow rate even under low overhead tank pressure'
    ],
    inStock: true,
    isFeatured: true,
    specs: {
      material: 'Heavy Forged Brass & Stainless Steel 304',
      warranty: '7 Years Warranty'
    }
  },
  {
    id: 'juliet-waterfall-faucet',
    name: 'Juliet Cascade Waterfall Spout Basin Faucet',
    modelCode: 'JL-WF-402-GLD',
    brand: 'Juliet',
    category: 'fittings',
    subCategory: 'Waterfall Basin Faucet',
    size: 'Height: 220 mm | Spout Width: 60 mm',
    finish: 'Brushed Champagne Gold',
    pricePerUnit: 5200,
    unitLabel: 'piece',
    colorTone: 'Champagne Warm Gold',
    texturePattern: 'calacatta_gold',
    features: [
      'Open ribbon tranquil waterfall stream',
      'Smooth single-lever cold & hot temperature blending',
      'Heavy brass weighted base prevents loosening'
    ],
    inStock: true,
    specs: {
      material: 'Solid Brass with Titanium PVD Gold',
      warranty: '7 Years Warranty'
    }
  },

  // --- POLO TAPS & FITTINGS ---
  {
    id: 'polo-quadra-basin-tap',
    name: 'Polo Quadra Sleek Chrome Single Lever Basin Tap',
    modelCode: 'PL-QD-201-CHR',
    brand: 'Polo',
    category: 'fittings',
    subCategory: 'Basin Mixer Faucet',
    size: 'Height: 185 mm',
    finish: 'Mirror Chrome Triple Plated',
    pricePerUnit: 2450,
    unitLabel: 'piece',
    colorTone: 'Mirror Bright Chrome',
    texturePattern: 'statuario',
    features: [
      'Geometric cubic European architectural design',
      'Triple-layer nickel-chromium plating resists water spotting',
      'Eco-Smart water saving aerator saves up to 30% water',
      'Smooth feather-touch brass spindle lever'
    ],
    inStock: true,
    specs: {
      material: 'Forged Solid Brass Body',
      warranty: '5 Years Leakproof Warranty'
    }
  },
  {
    id: 'polo-rain-shower-overhead',
    name: 'Polo SS-304 Ultra-Slim 12" Over-Head Rain Shower',
    modelCode: 'PL-RS-1212',
    brand: 'Polo',
    category: 'fittings',
    subCategory: 'Rain Shower Head with Arm',
    size: '300 x 300 mm (12 x 12 inch) + 15" Arm',
    finish: 'Mirror Polished SS-304',
    pricePerUnit: 2850,
    unitLabel: 'piece',
    colorTone: 'Mirror Chrome Silver',
    texturePattern: 'statuario',
    features: [
      'Ultra-slim 1.5mm stainless steel precision welded body',
      'Self-cleaning medical grade silicone nozzles resist hard water scaling',
      'Ball joint allows 360° swivel tilt angle',
      'Air-injection technology gives dense, soothing tropical rain droplets'
    ],
    inStock: true,
    isFeatured: true,
    specs: {
      material: 'Food Grade Stainless Steel 304',
      warranty: '5 Years Warranty'
    }
  },
  {
    id: 'polo-health-faucet-brass',
    name: 'Polo Heavy Solid Brass Health Faucet Jet Spray Set',
    modelCode: 'PL-HF-550',
    brand: 'Polo',
    category: 'fittings',
    subCategory: 'Health Faucet Jet Spray',
    size: 'Spray Gun + 1.2m SS Flexible Tube + Wall Hook',
    finish: 'Chrome Plated Brass',
    pricePerUnit: 1150,
    unitLabel: 'piece',
    colorTone: 'Gloss Chrome Silver',
    texturePattern: 'statuario',
    features: [
      'Solid brass spray head (not cheap ABS plastic)',
      'High-pressure burst-proof braided 1.2m hose',
      'Precision push trigger with stay-on locking position',
      'Heavy chrome finish that does not peel'
    ],
    inStock: true,
    specs: {
      material: 'Solid Brass Gun & SS 304 Hose',
      warranty: '3 Years Warranty'
    }
  }
];
