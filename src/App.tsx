import React, { useState, useEffect } from 'react';
import { ProductItem, QuoteItem, ShopSettings, Brand, ProductCategory } from './types';
import { INITIAL_PRODUCTS } from './data/initialCatalog';
import { Navbar } from './components/navbar/Navbar';
import { HeroSlider, DEFAULT_BANNER_SLIDES } from './components/hero/HeroSlider';
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
import { Footer } from './components/footer/Footer';
import { MessageSquare, Sparkles, Check, ShieldCheck, Cloud, Trash2, X } from 'lucide-react';
import {
  testConnection,
  subscribeToProducts,
  saveProductToCloud,
  deleteProductFromCloud,
  seedInitialProducts,
  subscribeToSettings,
  saveSettingsToCloud,
  onAuthChanged,
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
  showroomVideo: {
    videoUrl: '',
    videoTitle: 'Ratnesh Enterprises Showroom Tour',
    videoSubtitle: 'Flagship Tiles & Sanitaryware Experience in Bokaro',
  },
  heroBanners: DEFAULT_BANNER_SLIDES,
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
          heroBanners:
            parsed.heroBanners && Array.isArray(parsed.heroBanners) && parsed.heroBanners.length > 0
              ? parsed.heroBanners
              : DEFAULT_BANNER_SLIDES,
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
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('ratnesh_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState<boolean>(false);
  const [productToEdit, setProductToEdit] = useState<ProductItem | null>(null);
  const [adminInitialTab, setAdminInitialTab] = useState<'inventory' | 'add' | 'banners' | 'video' | 'settings'>('inventory');
  const [pendingDeleteProduct, setPendingDeleteProduct] = useState<ProductItem | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState<boolean>(false);

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
    setTimeout(() => setToastMessage(null), 2800);
  };

  // Admin Security Handlers
  const handleOpenAdminPortal = (tab: 'inventory' | 'add' | 'banners' | 'video' | 'settings' = 'inventory') => {
    setAdminInitialTab(tab);
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
    setIsAdminMode(true);
    setIsAdminPortalOpen(true);
    showToast('Owner access verified! Management portal unlocked.');
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
    setProductToEdit(null);
    showToast('Owner session locked.');
  };

  // Cloud Database Sync (Firebase Firestore - Single Source of Truth)
  useEffect(() => {
    testConnection();

    // Subscribe directly to Firebase cloud products (never re-upload local cache on delete)
    const unsubscribeProducts = subscribeToProducts(
      (cloudProds) => {
        if (cloudProds && cloudProds.length > 0) {
          try {
            localStorage.setItem('ratnesh_catalog_seeded', 'true');
          } catch {}
          setProducts(cloudProds);
        } else {
          // Only seed initial products on a brand new empty database that has never been initialized
          const alreadySeededLocal = localStorage.getItem('ratnesh_catalog_seeded') === 'true';
          if (!alreadySeededLocal) {
            seedInitialProducts(INITIAL_PRODUCTS).then(() => {
              try {
                localStorage.setItem('ratnesh_catalog_seeded', 'true');
              } catch {}
            });
          } else {
            setProducts([]);
          }
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
          setShopSettings((prev) => {
            const hasLocalActiveVideo =
              prev.showroomVideo?.videoUrl?.startsWith('blob:') ||
              prev.showroomVideo?.videoUrl === 'local_indexeddb';

            const effectiveVideoUrl = hasLocalActiveVideo
              ? prev.showroomVideo?.videoUrl
              : (cloudSettings.showroomVideo?.videoUrl || prev.showroomVideo?.videoUrl);

            return {
              ...prev,
              ...cloudSettings,
              heroBanners:
                cloudSettings.heroBanners && Array.isArray(cloudSettings.heroBanners) && cloudSettings.heroBanners.length > 0
                  ? cloudSettings.heroBanners
                  : (prev.heroBanners || DEFAULT_BANNER_SLIDES),
              showroomVideo: {
                ...(prev.showroomVideo || {}),
                ...(cloudSettings.showroomVideo || {}),
                videoUrl: effectiveVideoUrl,
              },
            };
          });
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
        setIsAdminMode(true);
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

  // URL Hash (#admin) & Keyboard shortcut (Ctrl + Shift + A) for Owner Management
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        handleOpenAdminPortal();
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        handleOpenAdminPortal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAdminAuthenticated]);

  // Restore showroom video from IndexedDB on startup (persists video files and URLs across reloads)
  useEffect(() => {
    let isMounted = true;
    getLocalVideoBlob('showroom_video').then((storedVideo) => {
      if (isMounted && storedVideo) {
        let metaTitle = 'Ratnesh Enterprises Showroom Tour';
        let metaSubtitle = 'Flagship Tiles & Sanitaryware Experience in Bokaro';
        try {
          const rawMeta = localStorage.getItem('ratnesh_showroom_video_meta');
          if (rawMeta) {
            const parsed = JSON.parse(rawMeta);
            if (parsed.title) metaTitle = parsed.title;
            if (parsed.subtitle) metaSubtitle = parsed.subtitle;
          }
        } catch {}

        setShopSettings((prev) => ({
          ...prev,
          showroomVideo: {
            videoTitle: metaTitle,
            videoSubtitle: metaSubtitle,
            ...(prev.showroomVideo || {}),
            videoUrl: storedVideo,
          },
        }));
      }
    });
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
    setProducts((prev) => [newProd, ...prev.filter((p) => p.id !== newProd.id)]);
    showToast(`Saving "${newProd.name}" to Firebase...`);
    try {
      await saveProductToCloud(newProd);
      showToast(`✓ Added "${newProd.name}" to Firebase!`);
    } catch (err) {
      console.error('Firebase save failed:', err);
      showToast(`Failed to save to Firebase: ${err instanceof Error ? err.message : 'Check connection'}`);
      throw err;
    }
  };

  const handleUpdateProduct = async (updatedProd: ProductItem) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProd.id ? updatedProd : p))
    );
    if (activeDetailProduct?.id === updatedProd.id) {
      setActiveDetailProduct(updatedProd);
    }
    try {
      await saveProductToCloud(updatedProd);
      showToast(`✓ Updated "${updatedProd.name}" in Firebase!`);
    } catch (err) {
      console.error('Firebase update failed:', err);
      showToast(`Failed to update in Firebase: ${err instanceof Error ? err.message : 'Check connection'}`);
      throw err;
    }
  };

  const handleDeleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    if (target) {
      setPendingDeleteProduct(target);
    } else {
      // Fallback if product not found in state
      setPendingDeleteProduct({
        id,
        name: 'Selected Product',
        modelCode: '',
        brand: '',
        category: 'tiles',
        subCategory: '',
        size: '',
        finish: '',
        pricePerUnit: 0,
        unitLabel: 'sq.ft',
        colorTone: '',
        texturePattern: 'statuario',
        features: [],
        inStock: true,
      });
    }
  };

  const handleConfirmDeleteProduct = async () => {
    if (!pendingDeleteProduct || isDeletingProduct) return;
    const id = pendingDeleteProduct.id;
    const deletedName = pendingDeleteProduct.name;
    setIsDeletingProduct(true);
    try {
      await deleteProductFromCloud(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (activeDetailProduct?.id === id) {
        setIsDetailModalOpen(false);
        setActiveDetailProduct(null);
      }
      if (productToEdit?.id === id) {
        setProductToEdit(null);
      }
      setPendingDeleteProduct(null);
      showToast(`✓ Deleted "${deletedName}" permanently from Firebase!`);
    } catch (err) {
      console.error('Firebase delete failed:', err);
      showToast(`Delete failed in Firebase: ${err instanceof Error ? err.message : 'Check connection'}`);
    } finally {
      setIsDeletingProduct(false);
    }
  };

  const handleUpdateSettings = async (newSettings: ShopSettings) => {
    setShopSettings(newSettings);
    try {
      await saveSettingsToCloud(newSettings);
      showToast('Showroom settings saved to Firebase!');
    } catch (err) {
      console.warn('Could not save settings to Firebase:', err);
      showToast('Settings saved locally (Firebase sync error).');
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
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-600 selection:text-white relative">
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
        onOpenAdminPortal={() => handleOpenAdminPortal('inventory')}
        shopSettings={shopSettings}
        isAdminAuthenticated={isAdminAuthenticated}
        onLockAdmin={handleLockAdmin}
        onSelectCategory={handleSelectCategory}
        activeCategory={selectedCategoryFilter}
      />

      {/* Main Hero & Content */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
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
          onOpenAdminPortal={() => handleOpenAdminPortal('video')}
          isAdminAuthenticated={isAdminAuthenticated}
        />

        {/* Product Catalog Grid with Filters */}
        <ProductGrid
          products={products}
          onOpenDetails={handleOpenDetails}
          onAddToQuote={(prod) => handleAddToQuote(prod)}
          onOpenAdminPortal={() => handleOpenAdminPortal('inventory')}
          onOpenAddProduct={() => {
            setProductToEdit(null);
            handleOpenAdminPortal('add');
          }}
          isAdminMode={isAdminMode}
          onToggleAdminMode={handleToggleAdminMode}
          onEditProduct={(p) => {
            setProductToEdit(p);
            handleOpenAdminPortal('inventory');
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
        isAdminAuthenticated={isAdminAuthenticated}
        onEditProduct={(p) => {
          setIsDetailModalOpen(false);
          setActiveDetailProduct(null);
          setProductToEdit(p);
          handleOpenAdminPortal('inventory');
        }}
        onDeleteProduct={handleDeleteProduct}
      />

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onProductAdd={handleAddProduct}
      />

      {isAdminPortalOpen && (
        <AdminPortalModal
          isOpen={isAdminPortalOpen}
          onClose={() => {
            setIsAdminPortalOpen(false);
            setProductToEdit(null);
          }}
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          shopSettings={shopSettings}
          onUpdateSettings={handleUpdateSettings}
          initialEditProduct={productToEdit}
          onClearInitialEdit={() => setProductToEdit(null)}
          initialTab={adminInitialTab}
        />
      )}

      {/* DELETE PRODUCT CONFIRMATION MODAL (Appears over all modals & cards) */}
      {pendingDeleteProduct && (
        <div
          onClick={() => !isDeletingProduct && setPendingDeleteProduct(null)}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 flex flex-col gap-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Delete Product?</h3>
                  <p className="text-xs text-slate-500">This removes it permanently from Firebase.</p>
                </div>
              </div>
              <button
                type="button"
                disabled={isDeletingProduct}
                onClick={() => setPendingDeleteProduct(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
              <div className="font-bold text-slate-900 truncate">{pendingDeleteProduct.name}</div>
              {(pendingDeleteProduct.brand || pendingDeleteProduct.modelCode) && (
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {pendingDeleteProduct.brand} {pendingDeleteProduct.modelCode ? `· ${pendingDeleteProduct.modelCode}` : ''}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={isDeletingProduct}
                onClick={() => setPendingDeleteProduct(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingProduct}
                onClick={handleConfirmDeleteProduct}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-60"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeletingProduct ? 'Deleting...' : 'Delete Permanently'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
