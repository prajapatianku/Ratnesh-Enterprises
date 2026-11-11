import React, { useState, useEffect } from 'react';
import { ProductItem, QuoteItem, ShopSettings, Brand, ProductCategory } from './types';
import { INITIAL_PRODUCTS } from './data/initialCatalog';
import { Navbar } from './components/navbar/Navbar';
import { HeroSlider } from './components/hero/HeroSlider';
import { ShowroomVideoSection } from './components/video/ShowroomVideoSection';
import { BrandShowcaseSection } from './components/brands/BrandShowcaseSection';
import { ProductGrid } from './components/catalog/ProductGrid';
import { TileCalculatorModal } from './components/calculator/TileCalculatorModal';
import { ProductDetailModal } from './components/catalog/ProductDetailModal';
import { AddProductModal } from './components/catalog/AddProductModal';
import { AdminPortalModal } from './components/admin/AdminPortalModal';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { QuoteDrawer } from './components/quote/QuoteDrawer';
import { ShowroomShowcase } from './components/showroom/ShowroomShowcase';
import { AboutUsSection } from './components/about/AboutUsSection';
import { LuxuryStudioVisualizer } from './components/interactive/LuxuryStudioVisualizer';
import { Footer } from './components/footer/Footer';
import { MessageSquare, Sparkles, Check, ShieldCheck, Cloud } from 'lucide-react';
import {
  testConnection,
  subscribeToProducts,
  saveProductToCloud,
  deleteProductFromCloud,
  seedInitialProducts,
  subscribeToSettings,
  saveSettingsToCloud,
  onAuthChanged,
  batchSaveProductsToCloud,
} from './lib/firebase';
import { safeSetLocalStorage, sanitizeSettingsForStorage } from './utils/safeStorage';
import { getLocalVideoBlob } from './utils/videoStorage';

export const EXACT_MAPS_URL =
  "https://www.google.com/maps/place/Ratnesh+Enterprises/@23.6586294,85.9750885,9249m/data=!3m1!1e3!4m10!1m2!2m1!1sPrajapati+Dharamshala,+Jaridih+Rd,+Teacher's+Colony,+Jena,+Bokaro+Steel+City,+Bandhdih,+Jharkhand+829301!3m6!1s0x39f43d359de74e53:0x77e1c7d97f0076f9!8m2!3d23.6586294!4d86.0162872!15sCmhQcmFqYXBhdGkgRGhhcmFtc2hhbGEsIEphcmlkaWggUmQsIFRlYWNoZXIncyBDb2xvbnksIEplbmEsIEJva2FybyBTdGVlbCBDaXR5LCBCYW5kaGRpaCwgSmhhcmtoYW5kIDgyOTMwMZIBCnRpbGVfc3RvcmXgAQA!16s%2Fg%2F11p1r52pj5?entry=ttu&g_ep=EgoyMDI2MTEwMi4wIKXMDSoASAFQAw%3D%3D";

const DEFAULT_SETTINGS: ShopSettings = {
  shopName: 'Ratnesh Enterprises',
  tagline: 'Tiles, Sanitaryware & Bath Fittings Showroom',
  logoUrl: '/assets/aistudio/image_7777a093.png',
  founderName: 'Mr. Ratnesh',
  managerName: 'Mr. Ankit',
  adminPin: '9931',
  whatsappNumber: '918709489716',
  phoneNumber: '+91 87094 89716',
  secondaryPhone: '+91 89868 42544',
  email: 'jhratneshenterprises@gmail.com',
  address: "Prajapati Dharamshala, Jaridih Rd, Teacher's Colony, Jena, Bokaro Steel City, Bandhdih, Jharkhand 829301",
  googleMapsUrl: EXACT_MAPS_URL,
  announcementText:
    'RATNESH ENTERPRISES: Premium Vitrified Tiles, Microvit Sanitaryware & Bath Fittings in Bokaro! Visit our Jena showroom or order online.',
  discountOfferText: 'Showroom Special Offer',
};

export default function App() {
  // Products state (persisted to localStorage)
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem('grand_royal_products');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read cached products:', e);
    }
    return INITIAL_PRODUCTS;
  });

  // Shop Settings state (persisted to localStorage)
  const [shopSettings, setShopSettings] = useState<ShopSettings>(() => {
    try {
      const saved = localStorage.getItem('grand_royal_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          shopName: 'Ratnesh Enterprises',
          logoUrl: '/assets/aistudio/image_7777a093.png',
          phoneNumber:
            parsed.phoneNumber && !parsed.phoneNumber.includes('98765')
              ? parsed.phoneNumber
              : DEFAULT_SETTINGS.phoneNumber,
          secondaryPhone:
            parsed.secondaryPhone && !parsed.secondaryPhone.includes('91234')
              ? parsed.secondaryPhone
              : DEFAULT_SETTINGS.secondaryPhone,
          whatsappNumber:
            parsed.whatsappNumber && !parsed.whatsappNumber.includes('98765')
              ? parsed.whatsappNumber
              : DEFAULT_SETTINGS.whatsappNumber,
          email:
            parsed.email && !parsed.email.includes('royalceramics') && !parsed.email.includes('ratneshankit123')
              ? parsed.email
              : DEFAULT_SETTINGS.email,
          address:
            parsed.address && !parsed.address.includes('Plot 42')
              ? parsed.address
              : DEFAULT_SETTINGS.address,
          googleMapsUrl:
            parsed.googleMapsUrl && parsed.googleMapsUrl.includes('google.com/maps')
              ? parsed.googleMapsUrl
              : EXACT_MAPS_URL,
          adminPin:
            parsed.adminPin && parsed.adminPin !== '1234'
              ? parsed.adminPin
              : '9931',
        };
      }
    } catch (e) {
      console.warn('Could not read cached settings:', e);
    }
    return DEFAULT_SETTINGS;
  });

  // Quote items state (persisted to localStorage)
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>(() => {
    try {
      const saved = localStorage.getItem('grand_royal_quote');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read cached quote:', e);
    }
    return [];
  });

  // Admin Security & Mode state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('ratnesh_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState<boolean>(false);

  // Modals & Panels
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [activeCalculatorProduct, setActiveCalculatorProduct] = useState<ProductItem | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeDetailProduct, setActiveDetailProduct] = useState<ProductItem | null>(null);

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isQuoteDrawerOpen, setIsQuoteDrawerOpen] = useState(false);

  // Category and Brand Filter state
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<ProductCategory | 'all'>('all');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('all');

  const handleSelectCategory = (cat: ProductCategory | 'all') => {
    setSelectedCategoryFilter(cat);
    // If switching to sanitary or fittings and an exclusive tile brand is selected, reset brand to 'all'
    if ((cat === 'sanitary' || cat === 'fittings') && ['Orientbell', 'Hels', 'Addon', 'Exotiles'].includes(selectedBrandFilter)) {
      setSelectedBrandFilter('all');
    } else if (cat === 'tiles' && ['Microvit', 'Juliet', 'Polo'].includes(selectedBrandFilter)) {
      setSelectedBrandFilter('all');
    }
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectBrandFilter = (brand: Brand) => {
    setSelectedBrandFilter(brand);
    // If selecting a brand belonging to a different category, align category
    if (['Orientbell', 'Hels', 'Addon', 'Exotiles'].includes(brand)) {
      if (selectedCategoryFilter === 'sanitary' || selectedCategoryFilter === 'fittings') {
        setSelectedCategoryFilter('all');
      }
    } else if (['Microvit'].includes(brand)) {
      if (selectedCategoryFilter === 'tiles') {
        setSelectedCategoryFilter('sanitary');
      }
    } else if (['Juliet', 'Polo'].includes(brand)) {
      if (selectedCategoryFilter === 'tiles') {
        setSelectedCategoryFilter('fittings');
      }
    }
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Admin Security Handlers
  const handleOpenAdminPortal = () => {
    if (isAdminAuthenticated) {
      setIsAdminPortalOpen(true);
    } else {
      setIsAdminAuthModalOpen(true);
    }
  };

  const handleToggleAdminMode = () => {
    if (!isAdminAuthenticated) {
      setIsAdminAuthModalOpen(true);
      return;
    }
    setIsAdminMode((prev) => !prev);
  };

  const handleAdminAuthenticated = () => {
    try {
      sessionStorage.setItem('ratnesh_admin_auth', 'true');
    } catch (e) {
      console.error(e);
    }
    setIsAdminAuthenticated(true);
    setIsAdminPortalOpen(true);
    showToast('Admin access verified! Welcome Mr. Ratnesh & Mr. Ankit.');
  };

  const handleLockAdmin = () => {
    try {
      sessionStorage.removeItem('ratnesh_admin_auth');
    } catch (e) {
      console.error(e);
    }
    setIsAdminAuthenticated(false);
    setIsAdminMode(false);
    setIsAdminPortalOpen(false);
    showToast('Admin locked. Public visitor mode active.');
  };

  // Cloud Database Sync (Firebase Firestore)
  useEffect(() => {
    testConnection();

    // Subscribe to cloud products
    const unsubscribeProducts = subscribeToProducts(
      async (cloudProds) => {
        if (cloudProds && cloudProds.length > 0) {
          // Check if there are local products stored on this phone/device that are not yet in the cloud
          try {
            const savedLocalRaw = localStorage.getItem('grand_royal_products');
            if (savedLocalRaw) {
              const localList: ProductItem[] = JSON.parse(savedLocalRaw);
              const cloudIdMap = new Map(cloudProds.map((p) => [p.id, p]));
              const unSynced = localList.filter((lp) => !cloudIdMap.has(lp.id));

              if (unSynced.length > 0) {
                console.log(`[Auto-Sync] Found ${unSynced.length} local products not in cloud. Syncing to Firestore...`);
                for (const item of unSynced) {
                  await saveProductToCloud(item);
                }
                showToast(`Auto-synced ${unSynced.length} custom tiles from phone to cloud!`);
                return;
              }
            }
          } catch (syncErr) {
            console.warn('Auto-sync check encountered:', syncErr);
          }

          setProducts(cloudProds);
        } else {
          // First run: seed default showroom collection
          seedInitialProducts(INITIAL_PRODUCTS);
        }
      },
      (err) => {
        console.warn('Realtime cloud sync using offline cache:', err);
      }
    );

    // Subscribe to cloud settings
    const unsubscribeSettings = subscribeToSettings(
      (cloudSettings) => {
        if (cloudSettings && cloudSettings.shopName) {
          setShopSettings((prev) => ({
            ...prev,
            ...cloudSettings,
            showroomVideo: {
              ...(prev.showroomVideo || {}),
              ...(cloudSettings.showroomVideo || {}),
              // Retain locally attached video file URL if cloud document does not supply one
              videoUrl: cloudSettings.showroomVideo?.videoUrl || prev.showroomVideo?.videoUrl,
            },
          }));
        }
      },
      (err) => {
        console.warn('Realtime settings sync using offline cache:', err);
      }
    );

    // Sync admin auth state with Firebase Auth
    const unsubscribeAuth = onAuthChanged((user) => {
      if (user && user.email === 'ratneshankit123@gmail.com') {
        setIsAdminAuthenticated(true);
        try {
          sessionStorage.setItem('ratnesh_admin_auth', 'true');
        } catch {}
      }
    });

    return () => {
      unsubscribeProducts();
      unsubscribeSettings();
      unsubscribeAuth();
    };
  }, []);

  // Restore local showroom video from IndexedDB if needed
  useEffect(() => {
    let isMounted = true;
    if (shopSettings.showroomVideo?.videoUrl === 'local_indexeddb') {
      getLocalVideoBlob('showroom_video').then((blobUrl) => {
        if (isMounted && blobUrl) {
          setShopSettings((prev) => ({
            ...prev,
            showroomVideo: prev.showroomVideo
              ? { ...prev.showroomVideo, videoUrl: blobUrl }
              : undefined,
          }));
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, []);

  // Persist products to local cache
  useEffect(() => {
    try {
      safeSetLocalStorage('grand_royal_products', JSON.stringify(products));
    } catch (e) {
      console.warn('Failed to cache products locally:', e);
    }
  }, [products]);

  // Persist settings to local cache (sanitized of bulky video/blob binaries)
  useEffect(() => {
    try {
      const sanitized = sanitizeSettingsForStorage(shopSettings);
      safeSetLocalStorage('grand_royal_settings', JSON.stringify(sanitized));
    } catch (e) {
      console.warn('Failed to cache settings locally:', e);
    }
  }, [shopSettings]);

  // Persist quote
  useEffect(() => {
    try {
      safeSetLocalStorage('grand_royal_quote', JSON.stringify(quoteItems));
    } catch (e) {
      console.warn('Failed to cache quote locally:', e);
    }
  }, [quoteItems]);

  // Handlers
  const handleOpenCalculator = (product?: ProductItem) => {
    setActiveCalculatorProduct(product || null);
    setIsCalculatorOpen(true);
  };

  const handleOpenDetails = (product: ProductItem) => {
    setActiveDetailProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleAddProduct = async (newProd: ProductItem) => {
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Uploading "${newProd.name}" to cloud database...`);
    try {
      await saveProductToCloud(newProd);
      showToast(`✓ Published "${newProd.name}" to cloud database!`);
    } catch (err) {
      console.error('Cloud save failed:', err);
      showToast(`Saved locally. Cloud sync: ${err instanceof Error ? err.message : 'pending'}`);
    }
  };

  const handleUpdateProduct = async (updatedProd: ProductItem) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProd.id ? updatedProd : p))
    );
    try {
      await saveProductToCloud(updatedProd);
      showToast(`✓ Updated "${updatedProd.name}" in cloud database!`);
    } catch (err) {
      console.error('Cloud update failed:', err);
      showToast('Updated locally. Cloud sync pending.');
    }
  };

  const handleSyncLocalToCloud = async () => {
    try {
      showToast('Scanning and syncing local tiles to cloud...');
      const savedLocalRaw = localStorage.getItem('grand_royal_products');
      if (!savedLocalRaw) {
        showToast('No local offline products found.');
        return;
      }
      const localList: ProductItem[] = JSON.parse(savedLocalRaw);
      let count = 0;
      for (const item of localList) {
        await saveProductToCloud(item);
        count++;
      }
      showToast(`✓ Synced ${count} products to cloud database!`);
    } catch (err) {
      console.error('Sync failed:', err);
      showToast(`Sync error: ${err instanceof Error ? err.message : 'failed'}`);
    }
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    deleteProductFromCloud(id).catch(console.error);
    showToast('Product removed from cloud database.');
  };

  const handleResetCatalog = () => {
    setProducts(INITIAL_PRODUCTS);
    seedInitialProducts(INITIAL_PRODUCTS).catch(console.error);
    showToast('Catalog restored to default showroom products in cloud.');
  };

  const handleImportCatalog = async (imported: ProductItem[]) => {
    setProducts(imported);
    showToast(`Uploading ${imported.length} items to cloud database...`);
    try {
      await batchSaveProductsToCloud(imported);
      showToast(`✓ Synced all ${imported.length} items to cloud database!`);
    } catch (err) {
      console.error('Import sync error:', err);
      showToast(`Imported locally. Cloud error: ${err instanceof Error ? err.message : 'failed'}`);
    }
  };

  const handleUpdateSettings = async (newSettings: ShopSettings) => {
    setShopSettings(newSettings);
    try {
      await saveSettingsToCloud(newSettings);
      showToast('Showroom settings updated & synced to cloud!');
    } catch (err) {
      console.warn('Could not sync settings to cloud (saved locally):', err);
      showToast('Showroom settings saved locally!');
    }
  };

  const handleAddToQuote = (
    product: ProductItem,
    customSqFt?: number,
    customBoxes?: number
  ) => {
    setQuoteItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? {
                ...i,
                quantity: i.quantity + 1,
                boxesNeeded: (i.boxesNeeded || 1) + (customBoxes || 1),
              }
            : i
        );
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          boxesNeeded: customBoxes || (product.category === 'tiles' ? 10 : 1),
          areaSqFt: customSqFt,
        },
      ];
    });
    showToast(`Added ${product.name} to estimate quote!`);
  };

  const handleRemoveQuoteItem = (id: string) => {
    setQuoteItems((prev) => prev.filter((i) => i.product.id !== id));
  };

  const handleUpdateQuoteQuantity = (id: string, delta: number) => {
    setQuoteItems((prev) =>
      prev
        .map((i) => {
          if (i.product.id === id) {
            const nextQty = Math.max(1, i.quantity + delta);
            const nextBoxes = Math.max(1, (i.boxesNeeded || 1) + delta);
            return { ...i, quantity: nextQty, boxesNeeded: nextBoxes };
          }
          return i;
        })
        .filter((i) => i.quantity > 0)
    );
  };

  const handleClearAllQuote = () => {
    setQuoteItems([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-amber-600 text-white px-4 py-2.5 rounded-xl shadow-2xl font-bold text-xs flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        onOpenCalculator={() => handleOpenCalculator()}
        onOpenAdminPortal={handleOpenAdminPortal}
        shopSettings={shopSettings}
        isAdminAuthenticated={isAdminAuthenticated}
        onLockAdmin={handleLockAdmin}
        onSelectCategory={handleSelectCategory}
        activeCategory={selectedCategoryFilter}
      />

      {/* Main Hero & Content */}
      <main className="flex-1">
        {/* Flipkart / Amazon Style Auto-Sliding Hero Banners + Quick Category Strip */}
        <HeroSlider
          onOpenCalculator={() => handleOpenCalculator()}
          shopSettings={shopSettings}
          onSelectCategory={handleSelectCategory}
          onSelectBrandFilter={setSelectedBrandFilter}
        />

        {/* Authorized Brand Partners Showcase & Logos */}
        <BrandShowcaseSection
          onSelectBrandFilter={handleSelectBrandFilter}
          activeBrandFilter={selectedBrandFilter}
        />

        {/* Ganesh Ceramic Style Showroom Video Tour Section */}
        <ShowroomVideoSection
          shopSettings={shopSettings}
          onUpdateSettings={handleUpdateSettings}
          onOpenAdminPortal={handleOpenAdminPortal}
          isAdminAuthenticated={isAdminAuthenticated}
        />

        {/* Interactive Luxury Studio Visualizer (Tiles, Marble, Washbasins & Taps) */}
        <LuxuryStudioVisualizer shopSettings={shopSettings} />

        {/* Product Catalog Grid with Filters */}
        <ProductGrid
          products={products}
          onOpenDetails={handleOpenDetails}
          onAddToQuote={(prod) => handleAddToQuote(prod)}
          onOpenAdminPortal={handleOpenAdminPortal}
          isAdminMode={isAdminMode}
          onToggleAdminMode={handleToggleAdminMode}
          onEditProduct={(p) => {
            setActiveDetailProduct(p);
            setIsAdminPortalOpen(true);
          }}
          onDeleteProduct={handleDeleteProduct}
          isAdminAuthenticated={isAdminAuthenticated}
          selectedBrand={selectedBrandFilter}
          onSelectBrand={setSelectedBrandFilter}
          selectedCategory={selectedCategoryFilter}
          onSelectCategory={handleSelectCategory}
        />

        {/* Who We Are & Management Leadership */}
        <AboutUsSection shopSettings={shopSettings} />

        {/* Showroom Experience, Consultation & Visit Details */}
        <ShowroomShowcase shopSettings={shopSettings} />
      </main>

      {/* Footer */}
      <Footer
        onOpenCalculator={() => handleOpenCalculator()}
        shopSettings={shopSettings}
      />

      {/* Modals & Drawers */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onAuthenticate={handleAdminAuthenticated}
        currentPin={shopSettings.adminPin || '9931'}
      />

      <TileCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        selectedProduct={activeCalculatorProduct}
        onAddToQuote={(prod, sqft, boxes) => handleAddToQuote(prod, sqft, boxes)}
      />

      <ProductDetailModal
        isOpen={isDetailModalOpen}
        product={activeDetailProduct}
        onClose={() => {
          setIsDetailModalOpen(false);
          setActiveDetailProduct(null);
        }}
        onOpenCalculator={(prod) => {
          setIsDetailModalOpen(false);
          setActiveDetailProduct(null);
          handleOpenCalculator(prod);
        }}
        onAddToQuote={(prod) => handleAddToQuote(prod)}
        shopSettings={shopSettings}
      />

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onProductAdd={handleAddProduct}
      />

      <AdminPortalModal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetCatalog={handleResetCatalog}
        onImportCatalog={handleImportCatalog}
        shopSettings={shopSettings}
        onUpdateSettings={handleUpdateSettings}
        onSyncLocalToCloud={handleSyncLocalToCloud}
      />

      {/* FLOATING ACTION: WhatsApp Direct Showroom Chat */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
        <button
          onClick={() => {
            const text = encodeURIComponent(
              `Hello ${shopSettings.shopName}! I am looking for tiles and sanitaryware from your online showroom. Can you help me with designs and pricing?`
            );
            const num = shopSettings.whatsappNumber ? `/${shopSettings.whatsappNumber}` : '';
            window.open(`https://wa.me${num}?text=${text}`, '_blank');
          }}
          className="p-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl flex items-center gap-2 group transition-all hover:scale-110 border border-emerald-400/40"
          title="Direct WhatsApp with Showroom Owner"
        >
          <MessageSquare className="w-5 h-5 fill-white" />
          <span className="hidden sm:inline-block text-xs font-bold pr-1">
            WhatsApp Inquiry
          </span>
        </button>
      </div>
    </div>
  );
}
