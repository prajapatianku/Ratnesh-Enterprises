import React, { useState } from 'react';
import {
  ProductItem,
  Brand,
  ProductCategory,
  TexturePattern,
  ShopSettings,
  BannerSlide
} from '../../types';
import {
  ShieldAlert,
  PlusCircle,
  Package,
  Settings,
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  Edit3,
  Check,
  Search,
  RotateCcw,
  Sparkles,
  PhoneCall,
  MapPin,
  Tag,
  Cloud,
  RefreshCw,
  Video,
  Play,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { getTileTextureSvg } from '../../utils/textureGenerators';
import { compressImageFile, compressBannerDataUrl } from '../../utils/imageCompressor';
import { saveLocalVideoBlob } from '../../utils/videoStorage';
import { DEFAULT_BANNER_SLIDES } from '../hero/HeroSlider';

type AdminTab = 'inventory' | 'add' | 'banners' | 'video' | 'settings';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  onAddProduct: (product: ProductItem) => Promise<void> | void;
  onUpdateProduct: (product: ProductItem) => Promise<void> | void;
  onDeleteProduct: (id: string) => Promise<void> | void;
  shopSettings: ShopSettings;
  onUpdateSettings: (settings: ShopSettings) => Promise<void> | void;
  initialEditProduct?: ProductItem | null;
  onClearInitialEdit?: () => void;
  initialTab?: AdminTab;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  shopSettings,
  onUpdateSettings,
  initialEditProduct = null,
  onClearInitialEdit,
  initialTab = 'inventory',
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Hero Banners State
  const [bannerSlides, setBannerSlides] = useState<BannerSlide[]>(() => {
    return shopSettings.heroBanners && shopSettings.heroBanners.length > 0
      ? shopSettings.heroBanners
      : DEFAULT_BANNER_SLIDES;
  });
  const [bannersSaved, setBannersSaved] = useState(false);
  const [isSavingBanners, setIsSavingBanners] = useState(false);

  // Keep bannerSlides synchronized if remote cloud settings arrive
  React.useEffect(() => {
    if (shopSettings.heroBanners && shopSettings.heroBanners.length > 0) {
      setBannerSlides(shopSettings.heroBanners);
    }
  }, [shopSettings.heroBanners]);

  // Add Product Form State
  const [brand, setBrand] = useState<Brand>('Orientbell');
  const [customBrandName, setCustomBrandName] = useState('');
  const [name, setName] = useState('');
  const [modelCode, setModelCode] = useState('');
  const [category, setCategory] = useState<ProductCategory>('tiles');
  const [subCategory, setSubCategory] = useState('Carving PGVT Vitrified Slab');
  const [size, setSize] = useState('600x1200 mm (2x4 ft)');
  const [finish, setFinish] = useState('High Gloss');
  const [sqftPerBox, setSqftPerBox] = useState<number>(15.5);
  const [tilesPerBox, setTilesPerBox] = useState<number>(2);
  const [thickness, setThickness] = useState('9 mm');
  const [colorTone, setColorTone] = useState('Statuario White & Grey Veins');
  const [texturePattern, setTexturePattern] = useState<TexturePattern>('statuario');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>(['', '', '']);
  const [compressingSlot, setCompressingSlot] = useState<number | null>(null);
  const [feature1, setFeature1] = useState('Zero Water Absorption (<0.05%)');
  const [feature2, setFeature2] = useState('Nano Glaze Stain Resistance');
  const [inStock, setInStock] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Helper to check if current selection is Juliet, Microvit, or Polo (or sanitary/fittings)
  const isSanitaryOrFittings =
    ['Juliet', 'Microvit', 'Polo'].includes(brand) ||
    category === 'sanitary' ||
    category === 'fittings';

  // Automatic category switcher on brand selection
  const handleBrandChange = (newBrand: Brand) => {
    setBrand(newBrand);
    if (newBrand === 'Microvit') {
      setCategory('sanitary');
      setSubCategory('Table Top Basin');
      setFeature1('High-Grade Ceramic Glaze');
      setFeature2('Stain & Scratch Resistant');
    } else if (newBrand === 'Juliet' || newBrand === 'Polo') {
      setCategory('fittings');
      setSubCategory(newBrand === 'Juliet' ? 'CP Bath Fitting & Mixer' : 'Brass Faucets & Shower');
      setFeature1('Solid Brass Body with Chrome Finish');
      setFeature2('Smooth Foam Flow Aerator');
    } else if (['Orientbell', 'Hels', 'Addon', 'Exotiles'].includes(newBrand)) {
      setCategory('tiles');
      setSubCategory('Carving PGVT Vitrified Slab');
      setFeature1('Zero Water Absorption (<0.05%)');
      setFeature2('Nano Glaze Stain Resistance');
    }
  };

  // Search in inventory tab
  const [inventorySearch, setInventorySearch] = useState('');

  // Editing state
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(initialEditProduct);

  React.useEffect(() => {
    if (initialEditProduct) {
      setEditingProduct(initialEditProduct);
    }
  }, [initialEditProduct]);

  // Settings State
  const [settingsForm, setSettingsForm] = useState<ShopSettings>(shopSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Handle Add Product Submit
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isAddingProduct) return;

    const finalBrand = brand === 'Other' && customBrandName.trim() ? customBrandName.trim() : brand;

    const safeBrand = finalBrand.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanId = `${safeBrand || 'custom'}-${category}-${Date.now()}`;

    const validImages = uploadedImages.filter((img) => img && img.trim().length > 0);
    const primaryImg = validImages[0] || customImageUrl.trim() || undefined;

    const newProduct: ProductItem = {
      id: cleanId,
      name: name.trim(),
      modelCode: isSanitaryOrFittings
        ? `${finalBrand.toUpperCase().replace(/\s+/g, '')}-${Date.now().toString().slice(-4)}`
        : (modelCode.trim() || `CD-${Math.floor(1000 + Math.random() * 9000)}`),
      brand: finalBrand,
      category,
      subCategory: subCategory.trim() || (category === 'sanitary' ? 'Table Top Basin' : category === 'fittings' ? 'Bath Fittings' : 'Premium Vitrified Slab'),
      size: isSanitaryOrFittings ? 'Standard Size' : size.trim(),
      finish: isSanitaryOrFittings ? (category === 'sanitary' ? 'Glazed Ceramic' : 'Polished Chrome') : finish,
      pricePerUnit: 0,
      mrp: undefined,
      unitLabel: category === 'tiles' ? 'sq.ft' : 'piece',
      sqftPerBox: category === 'tiles' ? Number(sqftPerBox) : undefined,
      tilesPerBox: category === 'tiles' ? Number(tilesPerBox) : undefined,
      thickness: isSanitaryOrFittings ? undefined : thickness.trim(),
      colorTone: isSanitaryOrFittings ? '' : colorTone.trim(),
      texturePattern: isSanitaryOrFittings ? 'statuario' : texturePattern,
      customImageUrl: primaryImg,
      images: validImages.length > 0 ? validImages : (primaryImg ? [primaryImg] : undefined),
      features: [feature1, feature2].filter((f) => f.trim().length > 0),
      inStock,
      isFeatured,
      isNew: true,
      applications:
        category === 'tiles'
          ? ['Living Room Floor', 'Bathroom Wall & Floor']
          : undefined,
      specs: {
        material: category === 'tiles' ? 'Glazed Vitrified (GVT/PGVT)' : category === 'sanitary' ? 'A-Grade Ceramic' : 'Solid Brass & Chrome',
        warranty: '10 Year Guarantee',
      },
    };

    setIsAddingProduct(true);
    try {
      await onAddProduct(newProduct);
      // Reset form
      setName('');
      setModelCode('');
      setCustomImageUrl('');
      setUploadedImages(['', '', '']);
      setActiveTab('inventory');
    } catch {
      // toast already shown by parent
    } finally {
      setIsAddingProduct(false);
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || isSavingEdit) return;
    setIsSavingEdit(true);
    try {
      const cleanedProduct: ProductItem = {
        ...editingProduct,
        name: editingProduct.name.trim(),
        brand: editingProduct.brand.trim(),
        features: (editingProduct.features || []).map((f) => f.trim()).filter(Boolean),
      };
      await onUpdateProduct(cleanedProduct);
      setEditingProduct(null);
      onClearInitialEdit?.();
    } catch {
      // toast already shown by parent
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Multi-slot image upload handler for Add Design form
  const handleSlotUpload = async (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompressingSlot(slotIndex);
      try {
        const compressed = await compressImageFile(file, 900, 0.7);
        setUploadedImages((prev) => {
          const updated = [...prev];
          updated[slotIndex] = compressed;
          return updated;
        });
      } catch (err) {
        console.error('Failed to compress image:', err);
        alert('Could not process this image. Please select another JPEG/PNG photo.');
      } finally {
        setCompressingSlot(null);
      }
    }
  };

  // Image Upload handler with automatic compression (<100KB for phone camera photos)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isForEdit = false, slotIndex = 0) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressingImage(true);
      try {
        const compressed = await compressImageFile(file, 900, 0.7);
        if (isForEdit && editingProduct) {
          const currImages = editingProduct.images && editingProduct.images.length > 0
            ? [...editingProduct.images]
            : [editingProduct.customImageUrl || ''];
          while (currImages.length <= slotIndex) currImages.push('');
          currImages[slotIndex] = compressed;
          const cleanImages = currImages.filter(Boolean);
          setEditingProduct({
            ...editingProduct,
            images: cleanImages,
            customImageUrl: cleanImages[0] || compressed,
          });
        } else {
          setCustomImageUrl(compressed);
        }
      } catch (err) {
        console.error('Failed to compress image:', err);
        alert('Could not process this image. Please select another JPEG/PNG photo.');
      } finally {
        setIsCompressingImage(false);
      }
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (settingsForm.showroomVideo?.videoUrl) {
      saveLocalVideoBlob('showroom_video', settingsForm.showroomVideo.videoUrl).catch(console.warn);
    }
    onUpdateSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const handleBannerImageFile = async (slideIndex: number, file: File) => {
    try {
      const compressed = await compressImageFile(file, 960, 0.68);
      setBannerSlides((prev) => {
        const copy = [...prev];
        copy[slideIndex] = {
          ...copy[slideIndex],
          imageUrl: compressed,
        };
        return copy;
      });
    } catch (err) {
      console.error('Failed to compress banner image:', err);
      alert('Could not process this image file. Please choose a JPG or PNG image.');
    }
  };

  const handleSaveBanners = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBanners(true);
    try {
      // Compress all custom base64 images so they are guaranteed to fit in Firestore
      const cleanBanners = await Promise.all(
        bannerSlides.map(async (slide) => {
          if (slide.imageUrl && slide.imageUrl.startsWith('data:image')) {
            const comp = await compressBannerDataUrl(slide.imageUrl);
            return { ...slide, imageUrl: comp };
          }
          return slide;
        })
      );
      setBannerSlides(cleanBanners);
      onUpdateSettings({
        ...shopSettings,
        heroBanners: cleanBanners,
      });
      setBannersSaved(true);
      setTimeout(() => setBannersSaved(false), 2500);
    } catch (err) {
      console.warn('Error saving banners:', err);
      onUpdateSettings({
        ...shopSettings,
        heroBanners: bannerSlides,
      });
      setBannersSaved(true);
      setTimeout(() => setBannersSaved(false), 2500);
    } finally {
      setIsSavingBanners(false);
    }
  };

  const handleResetBanners = () => {
    if (confirm('Reset hero banners to default showroom slides?')) {
      setBannerSlides(DEFAULT_BANNER_SLIDES);
      onUpdateSettings({
        ...shopSettings,
        heroBanners: DEFAULT_BANNER_SLIDES,
      });
      setBannersSaved(true);
      setTimeout(() => setBannersSaved(false), 2000);
    }
  };

  const filteredInventory = products.filter((p) => {
    if (!inventorySearch.trim()) return true;
    const q = inventorySearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.modelCode.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[94vh]"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 flex-wrap">
                <span>Showroom Control Hub</span>
                <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded shadow-xs inline-flex items-center gap-1">
                  <Cloud className="w-3 h-3" />
                  Firebase Connected
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                Add, edit, or delete products &amp; customize showroom settings — saved live to cloud
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            title="Close Admin Portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-slate-100 border-b border-slate-200 text-xs overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Manage Items ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('add')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'add'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Add New Design</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('banners')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'banners'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Hero Sliding Banners</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'video'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Showroom Video</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Store &amp; WhatsApp Setup</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 text-xs text-slate-800">
          {/* =========================================================================
              TAB 1: INVENTORY & MANAGE ALL PRODUCTS
             ========================================================================= */}
          {activeTab === 'inventory' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, brand, model code..."
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('add')}
                  className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 hover:bg-amber-500 transition-colors shrink-0 cursor-pointer shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add New Design</span>
                </button>
              </div>

              {filteredInventory.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
                  <Package className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600 font-semibold">No products found</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('add')}
                    className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg font-bold text-xs cursor-pointer"
                  >
                    + Add First Design
                  </button>
                </div>
              )}

              {/* Mobile Friendly Card List (< md) */}
              <div className="grid grid-cols-1 gap-3 md:hidden">
                {filteredInventory.map((item) => {
                  const primaryImg = item.images?.[0] || item.customImageUrl;
                  const img = getTileTextureSvg(item.texturePattern, primaryImg, item.finish);

                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex flex-col gap-2.5"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-14 h-14 rounded-lg border border-slate-200 bg-cover bg-center shrink-0"
                          style={{ backgroundImage: `url("${img}")` }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-slate-900 text-xs truncate">{item.name}</div>
                          <div className="text-[11px] text-amber-700 font-bold mt-0.5">
                            {item.brand} · <span className="font-mono text-slate-500 font-normal">{item.modelCode}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 capitalize mt-0.5 truncate">
                            {item.category} · {item.size} · {item.finish}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => onUpdateProduct({ ...item, inStock: !item.inStock })}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase cursor-pointer ${
                            item.inStock
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {item.inStock ? 'In Stock' : 'Out of Stock'}
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingProduct(item)}
                            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteProduct(item.id)}
                            className="px-3 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer border transition-colors bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table (md+) */}
              {filteredInventory.length > 0 && (
                <div className="hidden md:block border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                          <th className="py-2.5 px-3">Item / Image</th>
                          <th className="py-2.5 px-3">Brand &amp; Code</th>
                          <th className="py-2.5 px-3">Category &amp; Size</th>
                          <th className="py-2.5 px-3">Type / Sub-Category</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredInventory.map((item) => {
                          const primaryImg = item.images?.[0] || item.customImageUrl;
                          const img = getTileTextureSvg(item.texturePattern, primaryImg, item.finish);

                          return (
                            <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                              {/* Image & Title */}
                              <td className="py-2.5 px-3 flex items-center gap-2.5">
                                <div
                                  className="w-10 h-10 rounded border border-slate-200 bg-cover bg-center shrink-0 shadow-xs"
                                  style={{ backgroundImage: `url("${img}")` }}
                                />
                                <div className="max-w-[200px]">
                                  <div className="font-semibold text-slate-900 truncate">{item.name}</div>
                                  <div className="text-[10px] text-slate-500">{item.finish}</div>
                                </div>
                              </td>

                              {/* Brand & Code */}
                              <td className="py-2.5 px-3">
                                <div className="font-bold text-amber-700">{item.brand}</div>
                                <div className="text-[10px] text-slate-500 font-mono">{item.modelCode}</div>
                              </td>

                              {/* Category & Size */}
                              <td className="py-2.5 px-3">
                                <div className="capitalize text-slate-800 font-medium">{item.category}</div>
                                <div className="text-[10px] text-slate-500">{item.size}</div>
                              </td>

                              {/* Type / Sub-Category */}
                              <td className="py-2.5 px-3">
                                <span className="text-slate-700 font-medium capitalize">
                                  {item.subCategory || (item.category === 'tiles' ? 'Tile Slab' : item.category === 'sanitary' ? 'Sanitaryware' : 'Bath Fitting')}
                                </span>
                              </td>

                              {/* In Stock toggle */}
                              <td className="py-2.5 px-3">
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateProduct({ ...item, inStock: !item.inStock })
                                  }
                                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                                    item.inStock
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                                  }`}
                                >
                                  {item.inStock ? 'In Stock' : 'Out of Stock'}
                                </button>
                              </td>

                              {/* Actions */}
                              <td className="py-2.5 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setEditingProduct(item)}
                                    className="px-2.5 py-1 text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                                    title="Edit full specifications"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onDeleteProduct(item.id)}
                                    className="px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer border text-rose-600 bg-rose-50 hover:bg-rose-100 border-rose-200"
                                    title="Delete item"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 2: ADD NEW DESIGN (ONE-BY-ONE STEP BY STEP)
             ========================================================================= */}
          {activeTab === 'add' && (
            <form onSubmit={handleAddSubmit} className="flex flex-col gap-4 max-w-3xl mx-auto">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center gap-2.5 text-amber-900">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  <strong>Step-by-Step Design Creator:</strong> Enter your tile details, take or upload up to 3 photos, and it will be visible in the showroom catalog immediately.
                </span>
              </div>

              {/* 1. Brand & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Select Brand Company</label>
                  <select
                    value={brand}
                    onChange={(e) => handleBrandChange(e.target.value as Brand)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                  >
                    <option value="Orientbell">Orientbell Tiles</option>
                    <option value="Hels">Hels Ceramics</option>
                    <option value="Addon">Addon Tiles</option>
                    <option value="Exotiles">Exotiles</option>
                    <option value="Microvit">Microvit Sanitaryware</option>
                    <option value="Juliet">Juliet Bath Fittings</option>
                    <option value="Polo">Polo Taps & Fittings</option>
                    <option value="Other">Other / Custom Brand...</option>
                  </select>
                  {brand === 'Other' && (
                    <input
                      type="text"
                      placeholder="Type custom brand name"
                      value={customBrandName}
                      onChange={(e) => setCustomBrandName(e.target.value)}
                      className="mt-2 w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Product Category</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      const c = e.target.value as ProductCategory;
                      setCategory(c);
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                  >
                    <option value="tiles">Tiles (Vitrified / Ceramic / Parking / Slabs)</option>
                    <option value="sanitary">Sanitaryware (Table Top Basin / Commode / Vanity)</option>
                    <option value="fittings">Bath Fittings & Taps (Mixer, Shower, Faucets)</option>
                  </select>
                </div>
              </div>

              {/* 2. Title & (Model Code for Tiles only) */}
              <div className={isSanitaryOrFittings ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'grid grid-cols-3 gap-3'}>
                <div className={isSanitaryOrFittings ? '' : 'col-span-2'}>
                  <label className="block text-slate-700 mb-1 font-semibold">
                    {isSanitaryOrFittings ? 'Product Name / Model Title' : 'Design / Model Title'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      brand === 'Microvit'
                        ? 'e.g. Designer Onyx Table Top Basin'
                        : brand === 'Juliet' || brand === 'Polo'
                        ? 'e.g. Royal Diverter Mixer / Overhead Rain Shower'
                        : 'e.g. Statuario Royal Carving PGVT'
                    }
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                  />
                </div>

                {isSanitaryOrFittings ? (
                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Sub-Category / Type</label>
                    <input
                      type="text"
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      placeholder={
                        brand === 'Microvit'
                          ? 'e.g. Table Top Basin / Countertop'
                          : 'e.g. Basin Mixer / Health Faucet / Rain Shower'
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Model / Shade Code</label>
                    <input
                      type="text"
                      placeholder="e.g. OB-8890"
                      value={modelCode}
                      onChange={(e) => setModelCode(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                )}
              </div>

              {/* 3. Size & Surface Finish (Tiles only) */}
              {!isSanitaryOrFittings && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Tile Size / Dimensions</label>
                    <input
                      type="text"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      placeholder="e.g. 600x1200 mm (2x4 ft)"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Surface Finish</label>
                    <select
                      value={finish}
                      onChange={(e) => setFinish(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                    >
                      <option value="High Gloss">High Gloss / Mirror Polished</option>
                      <option value="Carving Vein">Carving Vein Glaze</option>
                      <option value="Matte / Satin">Silk Matte / Honed</option>
                      <option value="Rustic Anti-Skid">Rustic Anti-Skid / Paver</option>
                      <option value="Wooden Plank">Natural Wood Grain</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Color / Shade Tone (Tiles only) */}
              {!isSanitaryOrFittings && (
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Color / Shade Tone</label>
                  <input
                    type="text"
                    value={colorTone}
                    onChange={(e) => setColorTone(e.target.value)}
                    placeholder="e.g. Alabaster White & Golden Veins"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              )}

              {/* 4. Box Specs (for tiles) */}
              {category === 'tiles' && !isSanitaryOrFittings && (
                <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Sq.ft per Box</label>
                    <input
                      type="number"
                      step="0.05"
                      value={sqftPerBox}
                      onChange={(e) => setSqftPerBox(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Tiles per Box</label>
                    <input
                      type="number"
                      value={tilesPerBox}
                      onChange={(e) => setTilesPerBox(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Thickness</label>
                    <input
                      type="text"
                      value={thickness}
                      onChange={(e) => setThickness(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* 5. Photo & Texture Settings (Up to 3 Photos) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-600" />
                    Product Photos (Up to 3 Photos)
                  </span>
                  <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {uploadedImages.filter(Boolean).length} / 3 Uploaded
                  </span>
                </div>

                <p className="text-[11px] text-slate-500">
                  Upload up to 3 showroom photos (e.g. Photo 1: Main Slab, Photo 2: Texture/Vein close-up, Photo 3: Angle/Room). Automatically compressed and optimized for mobile & desktop.
                </p>

                {/* 3 Upload Slots */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { slot: 0, title: 'Photo 1: Main Face', desc: 'Primary Tile / Fitting' },
                    { slot: 1, title: 'Photo 2: Texture', desc: 'Vein & Surface Detail' },
                    { slot: 2, title: 'Photo 3: Angle / Room', desc: 'In-situ or Side View' },
                  ].map(({ slot, title, desc }) => {
                    const img = uploadedImages[slot];
                    const isBusy = compressingSlot === slot;

                    return (
                      <div
                        key={slot}
                        className="p-3 bg-white border border-slate-200 rounded-xl flex flex-col justify-between relative overflow-hidden shadow-xs"
                      >
                        <div>
                          <span className="font-semibold text-slate-900 block text-xs">{title}</span>
                          <span className="text-[10px] text-slate-500 block mb-2">{desc}</span>
                        </div>

                        {img ? (
                          <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                            <img src={img} alt={title} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                setUploadedImages((prev) => {
                                  const upd = [...prev];
                                  upd[slot] = '';
                                  return upd;
                                });
                              }}
                              className="absolute top-1.5 right-1.5 p-1 bg-rose-600/90 text-white rounded-md hover:bg-rose-500 transition-colors shadow cursor-pointer"
                              title="Remove this photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <div className="absolute bottom-1 left-1 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded text-[9px] text-emerald-700 font-bold flex items-center gap-1 shadow-xs border border-emerald-200">
                              ✓ Ready
                            </div>
                          </div>
                        ) : (
                          <label className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-lg aspect-[4/3] flex flex-col items-center justify-center p-2 text-center transition-colors bg-slate-50 hover:bg-amber-50/40">
                            <Upload className="w-4 h-4 text-amber-600 mb-1" />
                            <span className="text-[11px] text-slate-700 font-medium">
                              {isBusy ? 'Optimizing...' : 'Upload Photo'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleSlotUpload(e, slot)}
                              className="hidden"
                              disabled={isBusy}
                            />
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Option B: Or Paste Image URL */}
                <div className="p-3 border border-slate-200 rounded-xl bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                  <div className="w-full sm:w-auto">
                    <span className="text-slate-900 font-medium block text-xs">Or Paste Image URL</span>
                    <span className="text-[10px] text-slate-500">If you have a direct photo link</span>
                  </div>
                  <input
                    type="url"
                    placeholder="https://example.com/product-photo.jpg"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="w-full sm:w-72 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                {/* Option C: Or pick high-res procedural pattern (TILES ONLY - HIDDEN for Juliet, Microvit, Polo) */}
                {!isSanitaryOrFittings && (
                  <div>
                    <span className="text-slate-700 block mb-1.5 text-xs font-medium">
                      Digital Italian Marble Shader Pattern (if no camera photo available):
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                      {[
                        { id: 'statuario', name: 'Statuario White' },
                        { id: 'calacatta_gold', name: 'Calacatta Gold' },
                        { id: 'nero_marquina', name: 'Nero Black' },
                        { id: 'emerald_onyx', name: 'Emerald Onyx' },
                        { id: 'botticino_beige', name: 'Botticino Beige' },
                        { id: 'rustic_concrete', name: 'Slate Concrete' },
                        { id: 'terrazzo', name: 'Terrazzo' },
                        { id: 'chevron_wood', name: 'Chevron Wood' },
                        { id: 'moroccan_blue', name: 'Moroccan Blue' },
                        { id: 'armani_brown', name: 'Armani Brown' },
                      ].map((pat) => (
                        <button
                          key={pat.id}
                          type="button"
                          onClick={() => setTexturePattern(pat.id as TexturePattern)}
                          className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                            texturePattern === pat.id
                              ? 'bg-amber-100 border-amber-600 text-amber-900 font-bold shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {pat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Live Preview */}
                {(uploadedImages.some(Boolean) || customImageUrl || (!isSanitaryOrFittings && texturePattern)) && (
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                    <span className="text-slate-500 text-[11px] font-medium">Primary Preview:</span>
                    <div
                      className="w-12 h-12 rounded-lg border border-amber-500 bg-cover bg-center shadow-xs"
                      style={{
                        backgroundImage: `url("${uploadedImages.find(Boolean) || getTileTextureSvg(texturePattern, customImageUrl, finish)}")`,
                      }}
                    />
                    <span className="text-emerald-700 text-[11px] font-semibold">
                      ✓ Ready for Showroom Catalog
                    </span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isAddingProduct || compressingSlot !== null}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-600/20 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isAddingProduct ? 'Saving to Firebase...' : 'Save Design & Publish Live to Showroom'}</span>
              </button>
            </form>
          )}

          {/* =========================================================================
              TAB 3: STORE & WHATSAPP SETTINGS
             ========================================================================= */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="flex flex-col gap-4 max-w-2xl mx-auto">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  Showroom Contact & WhatsApp Quote Route
                </span>

                <div>
                  <label className="block text-slate-700 mb-1 font-medium">
                    Your WhatsApp Number (Country code + Number without +, e.g. 919876543210)
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.whatsappNumber}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })
                    }
                    placeholder="919876543210"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    When customers click "Get WhatsApp Quote", this is the number that receives the customer's inquiry directly!
                  </p>
                </div>

                {/* Current Logo Preview */}
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
                  <img
                    src={settingsForm.logoUrl || '/assets/aistudio/image_7777a093.png'}
                    alt="Store Logo"
                    className="h-12 w-12 object-contain rounded-lg bg-slate-50 p-1 border border-slate-200 shadow-xs"
                  />
                  <div>
                    <span className="text-slate-900 font-bold block text-xs">Official Showroom Logo</span>
                    <span className="text-[11px] text-emerald-700 font-medium">✓ Ratnesh Enterprises emblem active across navbar, hero, and footer</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-medium">Showroom / Business Name</label>
                  <input
                    type="text"
                    value={settingsForm.shopName}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, shopName: e.target.value })
                    }
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1 font-medium">Founder / Managing Director</label>
                    <input
                      type="text"
                      value={settingsForm.founderName || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, founderName: e.target.value })
                      }
                      placeholder="e.g. Mr. Ratnesh"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1 font-medium">Operations / Client Director</label>
                    <input
                      type="text"
                      value={settingsForm.managerName || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, managerName: e.target.value })
                      }
                      placeholder="e.g. Mr. Ankit"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1 font-medium">Secondary Sales Phone</label>
                    <input
                      type="text"
                      value={settingsForm.secondaryPhone || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, secondaryPhone: e.target.value })
                      }
                      placeholder="+91 89868 42544"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1 font-medium">Official Email</label>
                    <input
                      type="email"
                      value={settingsForm.email || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, email: e.target.value })
                      }
                      placeholder="jhratneshenterprises@gmail.com"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-medium">Store Address</label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, address: e.target.value })
                    }
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-medium">Google Maps Direct Place Link</label>
                  <input
                    type="text"
                    value={settingsForm.googleMapsUrl || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, googleMapsUrl: e.target.value })
                    }
                    placeholder="https://www.google.com/maps/place/Ratnesh+Enterprises/..."
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Direct redirection link for all showroom map buttons and address ribbons.
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-medium">Top Advertisement / Festive Offer Text</label>
                  <input
                    type="text"
                    value={settingsForm.announcementText}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, announcementText: e.target.value })
                    }
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Admin Security PIN */}
                <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">Owner Security PIN / Passcode</span>
                      <span className="text-[11px] text-slate-600">
                        This PIN protects the Admin Portal and stock editing from regular visitors. Default: 9931.
                      </span>
                    </div>
                  </div>
                  <input
                    type="text"
                    maxLength={8}
                    value={settingsForm.adminPin || '9931'}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, adminPin: e.target.value })
                    }
                    placeholder="9931"
                    className="w-48 bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-bold tracking-widest text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>{settingsSaved ? 'Settings Saved Successfully!' : 'Update Store Settings'}</span>
                </button>
              </div>
            </form>
          )}

          {/* =========================================================================
              TAB: HERO SLIDING BANNERS (CUSTOMIZE IMAGES & TEXT)
             ========================================================================= */}
          {activeTab === 'banners' && (
            <div className="max-w-4xl mx-auto flex flex-col gap-6">
              {/* Header Box */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                    <SlidersHorizontal className="w-4 h-4 text-amber-700" />
                    <span>Frontpage Hero Banners &amp; Sliding Cards</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 max-w-xl">
                    Edit the headline text, subtitle, badge, and photo for each slide of the homepage carousel. Changes update live immediately!
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleResetBanners}
                    className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    title="Reset to original default slides"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveBanners}
                    disabled={isSavingBanners}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isSavingBanners ? 'Saving to Cloud...' : bannersSaved ? 'Saved Successfully!' : 'Save All Banners'}</span>
                  </button>
                </div>
              </div>

              {/* Banners List */}
              <div className="space-y-4">
                {bannerSlides.map((slide, sIdx) => (
                  <div
                    key={slide.id || sIdx}
                    className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col gap-4"
                  >
                    {/* Slide Top Bar */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                          {sIdx + 1}
                        </span>
                        <span className="font-extrabold text-sm text-slate-900">
                          Slide #{sIdx + 1}: {slide.title || 'Untitled Banner'}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        {slide.badge || 'Banner'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      {/* Left: Image Preview & File Upload */}
                      <div className="lg:col-span-4 flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-700">Slide Photo Preview:</span>
                        <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
                          <img
                            src={slide.imageUrl}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <label className="px-3 py-1.5 bg-white text-slate-900 text-xs font-bold rounded-lg cursor-pointer shadow-md hover:bg-amber-50">
                              <span>Replace Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handleBannerImageFile(sIdx, f);
                                }}
                              />
                            </label>
                          </div>
                        </div>

                        {/* Image URL input alternative */}
                        <div>
                          <label className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                            Or paste Image URL:
                          </label>
                          <input
                            type="text"
                            value={slide.imageUrl}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBannerSlides((prev) => {
                                const copy = [...prev];
                                copy[sIdx] = { ...copy[sIdx], imageUrl: val };
                                return copy;
                              });
                            }}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-slate-800 focus:outline-none focus:border-amber-600 focus:bg-white"
                          />
                        </div>
                      </div>

                      {/* Right: Text Editing Fields */}
                      <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Title */}
                        <div className="sm:col-span-2">
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Main Heading / Title:
                          </label>
                          <input
                            type="text"
                            value={slide.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBannerSlides((prev) => {
                                const copy = [...prev];
                                copy[sIdx] = { ...copy[sIdx], title: val };
                                return copy;
                              });
                            }}
                            placeholder="e.g. Grand Vitrified Marble Slabs"
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                          />
                        </div>

                        {/* Subtitle */}
                        <div className="sm:col-span-2">
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Short Description / Subtitle:
                          </label>
                          <textarea
                            rows={2}
                            value={slide.subtitle}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBannerSlides((prev) => {
                                const copy = [...prev];
                                copy[sIdx] = { ...copy[sIdx], subtitle: val };
                                return copy;
                              });
                            }}
                            placeholder="1-2 sentences describing the collection or finish..."
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white resize-none"
                          />
                        </div>

                        {/* Badge Tag */}
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Top Badge Tag:
                          </label>
                          <input
                            type="text"
                            value={slide.badge}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBannerSlides((prev) => {
                                const copy = [...prev];
                                copy[sIdx] = { ...copy[sIdx], badge: val };
                                return copy;
                              });
                            }}
                            placeholder="e.g. ORIENTBELL & ADDON"
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                          />
                        </div>

                        {/* Button Text */}
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Button Text:
                          </label>
                          <input
                            type="text"
                            value={slide.ctaText}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBannerSlides((prev) => {
                                const copy = [...prev];
                                copy[sIdx] = { ...copy[sIdx], ctaText: val };
                                return copy;
                              });
                            }}
                            placeholder="e.g. Explore Tiles"
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Sticky Save Button */}
              <div className="sticky bottom-0 bg-white/95 backdrop-blur-md p-4 border border-slate-200 rounded-2xl shadow-lg flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Click Save to immediately update the sliding cards on the front page.
                </span>
                <button
                  type="button"
                  onClick={handleSaveBanners}
                  disabled={isSavingBanners}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md hover:scale-105"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSavingBanners ? 'Saving to Cloud...' : bannersSaved ? 'Saved Successfully!' : 'Save All Banners'}</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: SHOWROOM VIDEO SETTINGS & UPLOAD
             ========================================================================= */}
          {activeTab === 'video' && (
            <div className="max-w-2xl mx-auto flex flex-col gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col gap-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
                      <Video className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Showroom Video Walkthrough Settings</h3>
                      <p className="text-[11px] text-slate-500">
                        Upload your showroom video from phone/laptop or paste any YouTube video link.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Option 1: Upload Video File */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="font-bold text-slate-900 block text-xs mb-1">
                    Option A: Upload Video File (from Phone or Computer)
                  </span>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Select an MP4, WebM, or MOV video clip of your showroom displays or walk-through.
                  </p>
                  <label className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-300 rounded-xl font-bold cursor-pointer transition-colors text-xs">
                    <Upload className="w-4 h-4 text-amber-700" />
                    <span>Choose Video File from Device</span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/ogg,video/quicktime"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 150 * 1024 * 1024) {
                            alert('Video file is larger than 150MB. For larger videos, please upload to YouTube and paste the link below for fastest loading.');
                            return;
                          }
                          // Store safely in IndexedDB (handles large files without localStorage limits)
                          saveLocalVideoBlob('showroom_video', file);
                          const blobUrl = URL.createObjectURL(file);
                          setSettingsForm((prev) => ({
                            ...prev,
                            showroomVideo: {
                              ...prev.showroomVideo,
                              videoUrl: blobUrl,
                            },
                          }));
                        }
                      }}
                    />
                  </label>
                  {(settingsForm.showroomVideo?.videoUrl?.startsWith('blob:') || settingsForm.showroomVideo?.videoUrl?.startsWith('data:video')) && (
                    <span className="block text-[11px] text-emerald-700 font-semibold mt-2">
                      ✓ Custom video file attached from device! Preview below and click Save.
                    </span>
                  )}
                </div>

                {/* Option 2: Enter YouTube or Video Link */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="font-bold text-slate-900 block text-xs mb-1">
                    Option B: Paste YouTube or Video Link
                  </span>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Paste any YouTube URL (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...) or direct MP4 URL:
                  </p>
                  <input
                    type="url"
                    value={settingsForm.showroomVideo?.videoUrl || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSettingsForm((prev) => ({
                        ...prev,
                        showroomVideo: {
                          ...prev.showroomVideo,
                          videoUrl: val,
                        },
                      }));
                    }}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-mono focus:outline-none focus:border-amber-600 focus:bg-white"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Leave blank to use the high-definition default ceramic showroom tour video.
                  </p>
                </div>

                {/* Video Title & Subtitle */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
                  <div>
                    <label className="block text-slate-700 font-medium text-xs mb-1">Video Section Title</label>
                    <input
                      type="text"
                      value={settingsForm.showroomVideo?.videoTitle || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSettingsForm((prev) => ({
                          ...prev,
                          showroomVideo: {
                            ...prev.showroomVideo,
                            videoTitle: val,
                          },
                        }));
                      }}
                      placeholder="e.g. Experience Ratnesh Enterprises in Motion"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-amber-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium text-xs mb-1">Video Subtitle</label>
                    <input
                      type="text"
                      value={settingsForm.showroomVideo?.videoSubtitle || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSettingsForm((prev) => ({
                          ...prev,
                          showroomVideo: {
                            ...prev.showroomVideo,
                            videoSubtitle: val,
                          },
                        }));
                      }}
                      placeholder="e.g. Take a Virtual Tour of Our Flagship Showroom in Jainamore, Bokaro"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-amber-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium text-xs mb-1">Showroom Video Notes / Description</label>
                    <textarea
                      rows={2}
                      value={settingsForm.showroomVideo?.videoDescription || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSettingsForm((prev) => ({
                          ...prev,
                          showroomVideo: {
                            ...prev.showroomVideo,
                            videoDescription: val,
                          },
                        }));
                      }}
                      placeholder="Describe what customers will see: vitrified slabs, table top basins, bath fittings..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-amber-600 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Live Preview Container */}
                <div className="p-4 bg-slate-900 text-white rounded-xl shadow-xs">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-2">
                    Live Video Preview
                  </span>
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-black border border-slate-700 relative">
                    {(() => {
                      const vUrl = settingsForm.showroomVideo?.videoUrl;
                      if (!vUrl || vUrl.includes('youtube') || vUrl.includes('youtu.be')) {
                        const match = vUrl ? vUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/) : null;
                        const yId = match ? match[1] : 'kYjygXAHyBU';
                        return (
                          <iframe
                            src={`https://www.youtube.com/embed/${yId}?controls=1`}
                            className="w-full h-full border-0"
                            title="Video Preview"
                            allowFullScreen
                          />
                        );
                      }
                      return (
                        <video
                          src={vUrl}
                          controls
                          className="w-full h-full object-cover"
                        />
                      );
                    })()}
                  </div>
                </div>

                {/* Save and Reset Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const { saveLocalVideoBlob } = await import('../../utils/videoStorage');
                        await saveLocalVideoBlob('showroom_video', '');
                      } catch {}
                      setSettingsForm((prev) => {
                        const copy = { ...prev };
                        delete copy.showroomVideo;
                        return copy;
                      });
                    }}
                    className="w-full sm:w-auto py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer border border-slate-300"
                  >
                    Reset to Default Showroom Video
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleSaveSettings(e as any)}
                    className="w-full sm:w-auto py-2.5 px-6 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>{settingsSaved ? 'Video Settings Saved!' : 'Save & Sync Video to Website'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          SUB-MODAL: EDIT FULL PRODUCT SPECIFICATIONS & PHOTOS
         ========================================================================= */}
      {editingProduct && (
        <div
          onClick={() => {
            setEditingProduct(null);
            onClearInitialEdit?.();
          }}
          className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 sm:p-5 flex flex-col gap-3.5 text-xs text-slate-800 max-h-[90vh] overflow-y-auto my-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 sticky top-0 bg-white z-10">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 truncate pr-2">
                <Edit3 className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="truncate">Edit: {editingProduct.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  onClearInitialEdit?.();
                }}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
              {/* Product Name */}
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Design / Product Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                />
              </div>

              {/* Category & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value as ProductCategory,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                  >
                    <option value="tiles">Tiles</option>
                    <option value="sanitary">Sanitaryware</option>
                    <option value="fittings">Bath Fittings &amp; Taps</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.brand}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, brand: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                  />
                </div>
              </div>

              {/* Model Code & Sub-Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Model Code</label>
                  <input
                    type="text"
                    value={editingProduct.modelCode || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, modelCode: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Sub-Category / Type</label>
                  <input
                    type="text"
                    value={editingProduct.subCategory || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, subCategory: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Size & Finish (always editable for all categories) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Size / Dimensions</label>
                  <input
                    type="text"
                    value={editingProduct.size || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, size: e.target.value })
                    }
                    placeholder="e.g. 600x1200 mm (2x4 ft)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Surface Finish</label>
                  <input
                    type="text"
                    value={editingProduct.finish || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, finish: e.target.value })
                    }
                    placeholder="e.g. High Gloss / Carving Vein"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Extra Tile Specs */}
              {editingProduct.category === 'tiles' && (
                <>
                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Color / Shade Tone</label>
                    <input
                      type="text"
                      value={editingProduct.colorTone || ''}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, colorTone: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-slate-600 mb-1 font-medium text-[11px]">Sq.ft / Box</label>
                      <input
                        type="number"
                        step="0.05"
                        value={editingProduct.sqftPerBox || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            sqftPerBox: Number(e.target.value) || undefined,
                          })
                        }
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-slate-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1 font-medium text-[11px]">Tiles / Box</label>
                      <input
                        type="number"
                        value={editingProduct.tilesPerBox || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            tilesPerBox: Number(e.target.value) || undefined,
                          })
                        }
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-slate-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1 font-medium text-[11px]">Thickness</label>
                      <input
                        type="text"
                        value={editingProduct.thickness || ''}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, thickness: e.target.value })
                        }
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-slate-900"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Key Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Feature Highlight 1</label>
                  <input
                    type="text"
                    value={editingProduct.features?.[0] || ''}
                    onChange={(e) => {
                      const feats = [...(editingProduct.features || [])];
                      feats[0] = e.target.value;
                      setEditingProduct({
                        ...editingProduct,
                        features: feats,
                      });
                    }}
                    placeholder="e.g. Zero Water Absorption"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Feature Highlight 2</label>
                  <input
                    type="text"
                    value={editingProduct.features?.[1] || ''}
                    onChange={(e) => {
                      const feats = [...(editingProduct.features || [])];
                      if (feats.length === 0) feats.push('');
                      feats[1] = e.target.value;
                      setEditingProduct({
                        ...editingProduct,
                        features: feats,
                      });
                    }}
                    placeholder="e.g. Stain & Scratch Resistant"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Stock Status Toggle */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-700 font-semibold">Inventory Stock Status:</span>
                <button
                  type="button"
                  onClick={() =>
                    setEditingProduct({ ...editingProduct, inStock: !editingProduct.inStock })
                  }
                  className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                    editingProduct.inStock
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {editingProduct.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                </button>
              </div>

              {/* Multi-Photo Manager in Edit Modal */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-semibold text-xs">
                    Product Photos (Up to 3 Photos)
                  </label>
                  {isCompressingImage && (
                    <span className="text-[10px] font-bold text-amber-700 animate-pulse">
                      Optimizing photo...
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((slot) => {
                    const existingImg = editingProduct.images?.[slot] || (slot === 0 ? editingProduct.customImageUrl : '');
                    return (
                      <div key={slot} className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between">
                        <span className="text-[10px] text-slate-500 mb-1 font-medium">Photo {slot + 1}</span>
                        {existingImg ? (
                          <div className="relative aspect-[4/3] rounded overflow-hidden border border-slate-200 bg-slate-100 mb-1.5 shadow-xs">
                            <img src={existingImg} alt={`Slot ${slot + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                const currentImgs = editingProduct.images ? [...editingProduct.images] : (editingProduct.customImageUrl ? [editingProduct.customImageUrl] : []);
                                currentImgs[slot] = '';
                                const clean = currentImgs.filter(Boolean);
                                setEditingProduct({
                                  ...editingProduct,
                                  images: clean,
                                  customImageUrl: clean[0] || undefined,
                                });
                              }}
                              className="absolute top-1 right-1 p-0.5 bg-rose-600 text-white rounded hover:bg-rose-500 cursor-pointer shadow-xs"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="aspect-[4/3] border border-dashed border-slate-300 rounded flex items-center justify-center text-[10px] text-slate-400 mb-1.5">
                            Empty
                          </div>
                        )}
                        <label className="cursor-pointer py-1 px-1.5 bg-white hover:bg-amber-50 text-[10px] text-amber-700 border border-slate-300 rounded text-center block font-medium shadow-xs">
                          <span>{existingImg ? 'Replace' : 'Upload'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, true, slot)}
                            className="hidden"
                            disabled={isCompressingImage}
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    onClearInitialEdit?.();
                  }}
                  className="px-3.5 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit || isCompressingImage}
                  className="px-5 py-2 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-500 disabled:opacity-60 cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isSavingEdit ? 'Saving to Firebase...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
