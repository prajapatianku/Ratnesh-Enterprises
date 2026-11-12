export type ProductCategory = 'tiles' | 'sanitary' | 'fittings';

export type Brand =
  | 'Orientbell'
  | 'Hels'
  | 'Addon'
  | 'Exotiles'
  | 'Microvit'
  | 'Juliet'
  | 'Polo'
  | string;

export type TileApplication =
  | 'Living Room Floor'
  | 'Bathroom Wall & Floor'
  | 'Kitchen Backsplash'
  | 'Bedroom Floor'
  | 'Outdoor & Balcony'
  | 'Commercial & Hall';

export type TileFinish =
  | 'High Gloss'
  | 'Carving Vein'
  | 'Polished PGVT'
  | 'Matte / Satin'
  | 'Rustic Anti-Skid'
  | 'Wooden Plank';

export type TexturePattern =
  | 'statuario'
  | 'calacatta_gold'
  | 'nero_marquina'
  | 'botticino_beige'
  | 'emerald_onyx'
  | 'rustic_concrete'
  | 'terrazzo'
  | 'chevron_wood'
  | 'moroccan_blue'
  | 'armani_brown'
  | 'custom';

export interface ProductItem {
  id: string;
  name: string;
  modelCode: string;
  brand: Brand;
  category: ProductCategory;
  subCategory: string; // e.g. "PGVT Vitrified Tile", "Table Top Basin", "Concealed Diverter"
  size: string; // e.g. "600x1200 mm (2x4 ft)"
  finish: string;
  pricePerUnit: number; // in INR
  mrp?: number; // Optional original MRP to display discount badge
  unitLabel: string; // "sq.ft" or "piece"
  sqftPerBox?: number;
  tilesPerBox?: number;
  thickness?: string;
  colorTone: string;
  texturePattern: TexturePattern;
  customImageUrl?: string;
  images?: string[]; // Up to 3 uploaded photos (1: Main, 2: Close-up texture, 3: Room/Angle)
  features: string[];
  inStock: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  applications?: TileApplication[];
  specs?: {
    waterAbsorption?: string;
    surfaceTreatment?: string;
    material?: string;
    coveragePerBox?: string;
    warranty?: string;
  };
}

export interface QuoteItem {
  product: ProductItem;
  quantity: number; // sq.ft or pieces
  boxesNeeded?: number;
  areaSqFt?: number;
  selectedSurface?: 'floor' | 'wall' | 'counter';
}

export interface BannerSlide {
  id: string;
  badge: string;
  badgeBg?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaTarget: string;
  imageUrl: string;
  categoryFilter?: ProductCategory | 'all';
}

export interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaTarget: string; // e.g. "#catalog", "#video-tour", "#showroom-story"
  secondaryCtaText?: string;
  secondaryCtaTarget?: string;
  imageUrl?: string;
  brandTags?: string[];
  gradientTheme?: 'gold' | 'emerald' | 'amber' | 'slate';
}

export interface VideoShowcaseSettings {
  videoUrl?: string; // YouTube embed, direct MP4 URL, or uploaded blob
  videoTitle?: string;
  videoSubtitle?: string;
  videoDescription?: string;
  thumbnailUrl?: string;
  autoplayMuted?: boolean;
}

export interface ShopSettings {
  shopName: string;
  tagline: string;
  logoUrl?: string;
  adminPin?: string;
  founderName: string;
  managerName: string;
  whatsappNumber: string;
  phoneNumber: string;
  secondaryPhone?: string;
  email?: string;
  address: string;
  googleMapsUrl?: string;
  announcementText: string;
  discountOfferText: string;
  heroSlides?: HeroSlide[];
  heroBanners?: BannerSlide[];
  showroomVideo?: VideoShowcaseSettings;
  catalogInitialized?: boolean;
}
