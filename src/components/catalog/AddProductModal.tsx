import React, { useState } from 'react';
import { ProductItem, Brand, ProductCategory, TexturePattern } from '../../types';
import { PlusCircle, X, Sparkles, Upload, Image as ImageIcon, Trash2, CheckCircle2 } from 'lucide-react';
import { compressImageFile } from '../../utils/imageCompressor';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdd: (product: ProductItem) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onProductAdd,
}) => {
  if (!isOpen) return null;

  const [brand, setBrand] = useState<Brand>('Orientbell');
  const [name, setName] = useState('');
  const [modelCode, setModelCode] = useState('');
  const [category, setCategory] = useState<ProductCategory>('tiles');
  const [subCategory, setSubCategory] = useState('Carving PGVT Vitrified');
  const [size, setSize] = useState('600x1200 mm (2x4 ft)');
  const [finish, setFinish] = useState('High Gloss');
  const [colorTone, setColorTone] = useState('Italian Marble Veins');
  const [texturePattern, setTexturePattern] = useState<TexturePattern>('statuario');
  
  // Up to 3 photos
  const [uploadedImages, setUploadedImages] = useState<string[]>(['', '', '']);
  const [compressingSlot, setCompressingSlot] = useState<number | null>(null);
  
  const [feature1, setFeature1] = useState('Zero Water Absorption (<0.05%)');
  const [feature2, setFeature2] = useState('Nano Glaze Stain Resistance');

  const isSanitaryOrFittings =
    ['Juliet', 'Microvit', 'Polo'].includes(brand) ||
    category === 'sanitary' ||
    category === 'fittings';

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
      setSubCategory('Carving PGVT Vitrified');
      setFeature1('Zero Water Absorption (<0.05%)');
      setFeature2('Nano Glaze Stain Resistance');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
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
        alert('Could not process this image file. Please choose another JPEG/PNG photo.');
      } finally {
        setCompressingSlot(null);
      }
    }
  };

  const handleRemoveImage = (slotIndex: number) => {
    setUploadedImages((prev) => {
      const updated = [...prev];
      updated[slotIndex] = '';
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const safeBrand = brand.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanId = `${safeBrand || 'custom'}-${category}-${Date.now()}`;

    const validImages = uploadedImages.filter((img) => img && img.trim().length > 0);

    const newProduct: ProductItem = {
      id: cleanId,
      name: name.trim(),
      modelCode: isSanitaryOrFittings
        ? `${brand.toUpperCase().replace(/\s+/g, '')}-${Date.now().toString().slice(-4)}`
        : (modelCode.trim() || `CUSTOM-${Math.floor(1000 + Math.random() * 9000)}`),
      brand,
      category,
      subCategory: subCategory.trim() || (category === 'sanitary' ? 'Table Top Basin' : category === 'fittings' ? 'Bath Fittings' : 'Premium Vitrified Tiles'),
      size: isSanitaryOrFittings ? 'Standard Size' : size.trim(),
      finish: isSanitaryOrFittings ? (category === 'sanitary' ? 'Glazed Ceramic' : 'Polished Chrome') : finish,
      pricePerUnit: 0,
      unitLabel: category === 'tiles' ? 'sq.ft' : 'piece',
      colorTone: isSanitaryOrFittings ? '' : colorTone.trim(),
      texturePattern: isSanitaryOrFittings ? 'statuario' : texturePattern,
      customImageUrl: validImages[0] || undefined,
      images: validImages.length > 0 ? validImages : undefined,
      features: [feature1, feature2].filter((f) => f.trim().length > 0),
      inStock: true,
      isNew: true,
      applications:
        category === 'tiles'
          ? ['Living Room Floor', 'Bathroom Wall & Floor']
          : undefined,
      specs: {
        material: category === 'tiles' ? 'Glazed Vitrified' : category === 'sanitary' ? 'A-Grade Ceramic' : 'Solid Brass & Chrome',
        warranty: '10 Year Guarantee',
      },
    };

    onProductAdd(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Post New Tile / Sanitary Design
              </h2>
              <p className="text-xs text-slate-500">
                Upload 1 to 3 showroom photos, set specifications, and showcase live
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 text-xs overflow-y-auto">
          {/* Brand & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 mb-1 font-semibold">Brand</label>
              <select
                value={brand}
                onChange={(e) => handleBrandChange(e.target.value as Brand)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
              >
                <option value="Orientbell">Orientbell Tiles</option>
                <option value="Hels">Hels Ceramics</option>
                <option value="Addon">Addon Tiles</option>
                <option value="Exotiles">Exotiles</option>
                <option value="Microvit">Microvit Sanitaryware</option>
                <option value="Juliet">Juliet Bath Fittings</option>
                <option value="Polo">Polo Taps & Fittings</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-semibold">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  const cat = e.target.value as ProductCategory;
                  setCategory(cat);
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
              >
                <option value="tiles">Tiles (Floor / Wall / Elevation)</option>
                <option value="sanitary">Sanitaryware (Table Top Basin / Commode)</option>
                <option value="fittings">Taps & Bath Fittings</option>
              </select>
            </div>
          </div>

          {/* Product Name & (Model Code for Tiles only) */}
          <div className={isSanitaryOrFittings ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'grid grid-cols-3 gap-3'}>
            <div className={isSanitaryOrFittings ? '' : 'col-span-2'}>
              <label className="block text-slate-700 mb-1 font-semibold">
                {isSanitaryOrFittings ? 'Product Name / Model Title' : 'Product / Design Title'}
              </label>
              <input
                type="text"
                required
                placeholder={
                  brand === 'Microvit'
                    ? 'e.g. Designer Onyx Table Top Basin'
                    : brand === 'Juliet' || brand === 'Polo'
                    ? 'e.g. Royal Diverter Mixer / Overhead Rain Shower'
                    : 'e.g. Statuario Royal Glazed Slab'
                }
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
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
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                />
              </div>
            ) : (
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Model / Code</label>
                <input
                  type="text"
                  placeholder="e.g. OB-8890"
                  value={modelCode}
                  onChange={(e) => setModelCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            )}
          </div>

          {/* Size & Finish (TILES ONLY) */}
          {!isSanitaryOrFittings && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Size / Dimensions</label>
                <input
                  type="text"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="e.g. 600x1200 mm (2x4 ft)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Finish</label>
                <select
                  value={finish}
                  onChange={(e) => setFinish(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                >
                  <option value="High Gloss">High Gloss / Mirror Polish</option>
                  <option value="Carving Vein">Carving Vein Glaze</option>
                  <option value="Matte / Satin">Silk Matte / Honed</option>
                  <option value="Rustic Anti-Skid">Rustic Anti-Skid Paver</option>
                  <option value="Wooden Plank">Natural Wood Grain</option>
                </select>
              </div>
            </div>
          )}

          {/* Color Tone (TILES ONLY) */}
          {!isSanitaryOrFittings && (
            <div>
              <label className="block text-slate-700 mb-1 font-semibold">Color / Shade Tone</label>
              <input
                type="text"
                value={colorTone}
                onChange={(e) => setColorTone(e.target.value)}
                placeholder="e.g. Warm Calacatta White & Gold"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          )}

          {/* MULTI-PHOTO UPLOAD SECTION: AT LEAST 2 TO 3 PHOTOS */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-900 font-bold flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-600" />
                Upload Product Photos (Up to 3 Photos):
              </span>
              <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {uploadedImages.filter(Boolean).length} / 3 Uploaded
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              Add multiple angles (e.g. Photo 1: Full Slab, Photo 2: Texture Close-up, Photo 3: Room/Angle). Phone camera photos are automatically optimized!
            </p>

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
                          onClick={() => handleRemoveImage(slot)}
                          className="absolute top-1.5 right-1.5 p-1 bg-rose-600/90 text-white rounded-md hover:bg-rose-500 transition-colors shadow cursor-pointer"
                          title="Remove this photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="absolute bottom-1 left-1 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded text-[9px] text-emerald-700 font-bold flex items-center gap-1 shadow-xs border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Ready
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
                          onChange={(e) => handleFileUpload(e, slot)}
                          className="hidden"
                          disabled={isBusy}
                        />
                      </label>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Fallback procedural textures if no photo uploaded */}
            {!isSanitaryOrFittings && uploadedImages.filter(Boolean).length === 0 && (
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-600 text-[11px] block mb-1.5 font-medium">
                  Or pick a digital Italian marble pattern (if you don't have photos yet):
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'statuario', name: 'Statuario White' },
                    { id: 'calacatta_gold', name: 'Calacatta Gold' },
                    { id: 'nero_marquina', name: 'Nero Black' },
                    { id: 'emerald_onyx', name: 'Emerald Onyx' },
                    { id: 'botticino_beige', name: 'Botticino Beige' },
                    { id: 'rustic_concrete', name: 'Slate Concrete' },
                  ].map((pat) => (
                    <button
                      key={pat.id}
                      type="button"
                      onClick={() => setTexturePattern(pat.id as TexturePattern)}
                      className={`py-1 px-2 rounded border text-left font-medium transition-all cursor-pointer ${
                        texturePattern === pat.id
                          ? 'bg-amber-100 border-amber-600 text-amber-900 font-bold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {pat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 mb-1 font-medium">Key Feature 1</label>
              <input
                type="text"
                value={feature1}
                onChange={(e) => setFeature1(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-1 font-medium">Key Feature 2</label>
              <input
                type="text"
                value={feature2}
                onChange={(e) => setFeature2(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-amber-600/20 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish Design with Photos to Showroom</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
