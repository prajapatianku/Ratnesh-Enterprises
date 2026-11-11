import React, { useState } from 'react';
import {
  ProductItem,
  Brand,
  ProductCategory,
  TexturePattern,
  ShopSettings
} from '../../types';
import {
  ShieldAlert,
  PlusCircle,
  Package,
  Settings,
  Database,
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  Edit3,
  Check,
  Search,
  Download,
  RotateCcw,
  Sparkles,
  PhoneCall,
  MapPin,
  Tag,
  Cloud,
  RefreshCw,
  Video,
  Play
} from 'lucide-react';
import { getTileTextureSvg } from '../../utils/textureGenerators';
import { compressImageFile } from '../../utils/imageCompressor';
import { saveLocalVideoBlob } from '../../utils/videoStorage';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  onAddProduct: (product: ProductItem) => void;
  onUpdateProduct: (product: ProductItem) => void;
  onDeleteProduct: (id: string) => void;
  onResetCatalog: () => void;
  onImportCatalog: (imported: ProductItem[]) => void;
  shopSettings: ShopSettings;
  onUpdateSettings: (settings: ShopSettings) => void;
  onSyncLocalToCloud?: () => Promise<void>;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetCatalog,
  onImportCatalog,
  shopSettings,
  onUpdateSettings,
  onSyncLocalToCloud,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'add' | 'inventory' | 'video' | 'settings' | 'backup'>('inventory');
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

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
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Settings State
  const [settingsForm, setSettingsForm] = useState<ShopSettings>(shopSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Handle Add Product Submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

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

    onAddProduct(newProduct);
    // Reset form
    setName('');
    setModelCode('');
    setCustomImageUrl('');
    setUploadedImages(['', '', '']);
    setActiveTab('inventory');
  };

  // Handle Edit Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    onUpdateProduct(editingProduct);
    setEditingProduct(null);
  };

  // Multi-slot image upload handler for Add Design form
  const handleSlotUpload = async (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompressingSlot(slotIndex);
      try {
        const compressed = await compressImageFile(file, 1024, 0.75);
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

  // Image Upload handler with automatic compression (<150KB for phone camera photos)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isForEdit = false, slotIndex = 0) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressingImage(true);
      try {
        const compressed = await compressImageFile(file, 1024, 0.75);
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

  // Export JSON Backup
  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `royal_tiles_catalog_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0) {
            onImportCatalog(parsed);
            alert(`Successfully restored ${parsed.length} products from backup!`);
          } else {
            alert('Invalid backup file format.');
          }
        } catch (err) {
          alert('Could not parse JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
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
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Shopkeeper & Admin Control Center
                <span className="text-[10px] bg-amber-600 text-white font-black px-2 py-0.5 rounded shadow-xs">
                  OWNER MODE
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Add your tile designs and bath fixtures one-by-one, manage stock & set WhatsApp details
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close Admin Portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 border-b border-slate-200 text-xs overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Manage All Items ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'add'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Add New Design (One-by-One)</span>
          </button>

          <button
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
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Store & WhatsApp Setup</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'backup'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Backup / Restore</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 text-xs text-slate-800">
          {/* =========================================================================
              TAB 1: INVENTORY & MANAGE ALL PRODUCTS
             ========================================================================= */}
          {activeTab === 'inventory' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, brand, model code..."
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {onSyncLocalToCloud && (
                    <button
                      type="button"
                      onClick={async () => {
                        setIsSyncing(true);
                        try {
                          await onSyncLocalToCloud();
                        } finally {
                          setIsSyncing(false);
                        }
                      }}
                      disabled={isSyncing}
                      className="flex-1 sm:flex-initial px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg flex items-center justify-center gap-1.5 font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                      title="Upload and sync all tiles saved on this phone to the cloud database"
                    >
                      <Cloud className={`w-4 h-4 ${isSyncing ? 'animate-bounce text-amber-600' : 'text-amber-600'}`} />
                      <span>{isSyncing ? 'Syncing to Cloud...' : 'Sync Phone to Cloud'}</span>
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab('add')}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-amber-600 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 hover:bg-amber-500 transition-colors shrink-0 cursor-pointer shadow-xs"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Next Tile</span>
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                        <th className="py-2.5 px-3">Item / Image</th>
                        <th className="py-2.5 px-3">Brand & Code</th>
                        <th className="py-2.5 px-3">Category & Size</th>
                        <th className="py-2.5 px-3">Type / Sub-Category</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredInventory.map((item) => {
                        const img = getTileTextureSvg(item.texturePattern, item.customImageUrl, item.finish);
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
                                  onClick={() => setEditingProduct(item)}
                                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                                  title="Edit full specifications"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
                                      onDeleteProduct(item.id);
                                    }
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                                  title="Delete item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
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
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-600/20 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Save Design & Publish Live to Showroom</span>
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

          {/* =========================================================================
              TAB 4: BACKUP & DATA
             ========================================================================= */}
          {activeTab === 'backup' && (
            <div className="max-w-2xl mx-auto flex flex-col gap-4">
              {/* Highlighted Direct Netlify Dist Download Card */}
              <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50/40 border border-amber-300 rounded-xl p-4 flex flex-col gap-2 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-sm">Download Production Build (dist.zip) for Netlify</span>
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">READY TO DEPLOY</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Click the button below to download the latest compiled <span className="font-mono text-amber-700 font-bold">dist.zip</span> file. Unzip it on your computer to get the <span className="font-mono text-amber-700 font-bold">dist</span> folder, then drag and drop that folder onto Netlify Drop!
                </p>
                <a
                  href="/dist.zip"
                  download="dist.zip"
                  className="mt-2 py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white font-extrabold rounded-xl flex items-center gap-2 self-start transition-all shadow-md hover:scale-105 cursor-pointer text-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download dist.zip for Netlify</span>
                </a>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-2 shadow-xs">
                <span className="font-bold text-slate-900 text-sm">Download Backup of Your Designs</span>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Export all your tile designs, photos, and specifications into a single JSON file. You can save this on your computer or phone so your catalog data is 100% safe.
                </p>
                <button
                  onClick={handleExportBackup}
                  className="mt-2 py-2 px-4 bg-white hover:bg-slate-100 text-amber-700 border border-slate-300 rounded-xl font-bold flex items-center gap-2 self-start transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Catalog Backup (.json)</span>
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-2 shadow-xs">
                <span className="font-bold text-slate-900 text-sm">Restore From Backup</span>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Upload a previously downloaded JSON catalog file to restore all your tiles and sanitary collections at once.
                </p>
                <label className="cursor-pointer mt-2 py-2 px-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl font-bold flex items-center gap-2 self-start transition-colors shadow-xs">
                  <Upload className="w-4 h-4 text-amber-600" />
                  <span>Choose Backup File (.json)</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-4 flex flex-col gap-2">
                <span className="font-bold text-rose-700 text-sm">Reset to Default Factory Catalog</span>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Restore the initial collection of Orientbell, Hels, Addon, Exotiles, Microvit, Juliet, and Polo designs.
                </p>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to restore the default initial catalog?')) {
                      onResetCatalog();
                      alert('Catalog restored to default authorized showroom brands!');
                    }
                  }}
                  className="mt-2 py-2 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold flex items-center gap-2 self-start transition-colors cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Catalog</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          SUB-MODAL: EDIT PRODUCT SPECIFICATIONS
         ========================================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 flex flex-col gap-4 text-xs text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-600" />
                <span>Edit: {editingProduct.name}</span>
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-slate-700 mb-1 font-medium">Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              {(() => {
                const isEditingSanitaryOrFittings =
                  ['Juliet', 'Microvit', 'Polo'].includes(editingProduct.brand) ||
                  editingProduct.category === 'sanitary' ||
                  editingProduct.category === 'fittings';

                return (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 mb-1 font-medium">Brand</label>
                        <input
                          type="text"
                          value={editingProduct.brand}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, brand: e.target.value })
                          }
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                        />
                      </div>
                      {isEditingSanitaryOrFittings ? (
                        <div>
                          <label className="block text-slate-700 mb-1 font-medium">Sub-Category / Type</label>
                          <input
                            type="text"
                            value={editingProduct.subCategory || ''}
                            onChange={(e) =>
                              setEditingProduct({ ...editingProduct, subCategory: e.target.value })
                            }
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-slate-700 mb-1 font-medium">Model Code</label>
                          <input
                            type="text"
                            value={editingProduct.modelCode}
                            onChange={(e) =>
                              setEditingProduct({ ...editingProduct, modelCode: e.target.value })
                            }
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 font-mono focus:outline-none focus:border-amber-500 focus:bg-white"
                          />
                        </div>
                      )}
                    </div>

                    {!isEditingSanitaryOrFittings && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-700 mb-1 font-medium">Size / Dimensions</label>
                          <input
                            type="text"
                            value={editingProduct.size}
                            onChange={(e) =>
                              setEditingProduct({ ...editingProduct, size: e.target.value })
                            }
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 mb-1 font-medium">Finish</label>
                          <input
                            type="text"
                            value={editingProduct.finish}
                            onChange={(e) =>
                              setEditingProduct({ ...editingProduct, finish: e.target.value })
                            }
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                          />
                        </div>
                      </div>
                    )}

                    {/* Stock Status Toggle */}
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <span className="text-slate-700 font-medium">Inventory Stock Status:</span>
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
                  </>
                );
              })()}

              {/* Multi-Photo Manager in Edit Modal */}
              <div>
                <label className="block text-slate-700 mb-1 font-semibold text-xs">
                  Product Photos (Up to 3 Photos)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((slot) => {
                    const existingImg = editingProduct.images?.[slot] || (slot === 0 ? editingProduct.customImageUrl : '');
                    return (
                      <div key={slot} className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between">
                        <span className="text-[10px] text-slate-500 mb-1 font-medium">Slot {slot + 1}</span>
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
                  onClick={() => setEditingProduct(null)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-500 cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
