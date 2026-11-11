import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle2,
  Calendar,
  Send,
  ZoomIn,
  X,
  Camera,
  Eye
} from 'lucide-react';
import { ShopSettings } from '../../types';

interface ShowroomShowcaseProps {
  shopSettings: ShopSettings;
}

const SHOWROOM_PHOTO = {
  url: '/assets/aistudio/20261010_152610_fbe3c357.jpg',
  title: 'Official Storefront & Signboard',
  subtitle: 'Near Prajapati Dharamshala, Teacher Colony, Jainamore, Bokaro (829301)',
  tag: 'Physical Experience Studio',
  description:
    'Step into Ratnesh Enterprises to explore first-choice vitrified tiles, marble slabs, and designer Microvit table top sanitaryware with authorized pricing.',
  badges: ['GSTIN: 20BLIPM6393Q1ZG', 'Mob: 8709489716 / 8986842544', 'Authorized Brand Boutique', 'Free Customer Parking']
};

export const ShowroomShowcase: React.FC<ShowroomShowcaseProps> = ({ shopSettings }) => {
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingArea, setBookingArea] = useState('Full House (Tiles + Bath)');
  const [submitted, setSubmitted] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingPhone) return;

    const text = encodeURIComponent(
      `Hello ${shopSettings.shopName}! I would like to book a Showroom Consultation:\n\n` +
      `Name: ${bookingName || 'Customer'}\n` +
      `Phone: ${bookingPhone}\n` +
      `Preferred Date: ${bookingDate || 'This Weekend'}\n` +
      `Requirement: ${bookingArea}\n\n` +
      `Please confirm showroom appointment and keep samples ready.`
    );
    const num = shopSettings.whatsappNumber ? `/${shopSettings.whatsappNumber}` : '';
    window.open(`https://wa.me${num}?text=${text}`, '_blank');
    setSubmitted(true);
  };

  return (
    <section id="showroom-story" className="w-full py-16 bg-slate-50 text-slate-900 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Headline */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-md mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Visit Our Experience Studio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            The Premier Tiles & Bath Boutique in Bokaro
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Touch real textures, inspect full slab marble patterns under natural showroom lighting, and get expert guidance for your dream project with direct authorized brand pricing.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 mb-1">
              <ShieldCheck className="w-5 h-5 text-amber-700" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Direct Authorized Dealer</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Genuine first-quality batch guarantee for Orientbell, Hels, Addon, Exotiles, Microvit, Juliet, and Polo. No seconds, no shade discrepancies.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 mb-1">
              <Sparkles className="w-5 h-5 text-amber-700" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Expert Design Consultation</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our specialists help you select matching tile combinations, wall accents, and complementary Microvit table top sanitaryware.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 mb-1">
              <Truck className="w-5 h-5 text-amber-700" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Zero-Breakage Delivery</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Safe hydraulic forklift site transport. Any tile damaged during transit is replaced immediately with matching factory shade batches.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 mb-1">
              <Clock className="w-5 h-5 text-amber-700" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Wholesale Project Quotes</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Special tiered discounts for contractors, architects, builders, and full-house residential renovations across Jharkhand.
            </p>
          </div>
        </div>

        {/* Real Showroom Photo - Single Featured Showcase */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-md mb-2">
              <Camera className="w-3.5 h-3.5 text-amber-700" />
              <span>Real Photo of Our Showroom</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Visit Our Storefront in Jainamore, Bokaro
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Located near Prajapati Dharamshala on Jaridih Road, Teacher Colony, Jainamore, Bokaro. Tap to inspect full size.
            </p>
          </div>

          <div
            onClick={() => setShowPhotoModal(true)}
            className="group relative bg-white border border-slate-200 hover:border-amber-400 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 cursor-pointer max-w-4xl mx-auto flex flex-col"
          >
            {/* Image Container */}
            <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden bg-slate-100">
              <img
                src={SHOWROOM_PHOTO.url}
                alt={SHOWROOM_PHOTO.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              {/* Subtle Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-black/20" />

              {/* Top Floating Badge */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white/95 text-slate-900 backdrop-blur-xs border border-white/40 shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>{SHOWROOM_PHOTO.tag}</span>
                </span>
                <span className="hidden sm:inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-600/90 text-white backdrop-blur-xs border border-amber-400/40 shadow-xs">
                  GSTIN: 20BLIPM6393Q1ZG
                </span>
              </div>

              {/* Top Right Zoom Trigger */}
              <div className="absolute top-3 right-3 z-10">
                <span className="w-8 h-8 rounded-full bg-slate-900/70 group-hover:bg-amber-600 text-white flex items-center justify-center backdrop-blur-xs transition-colors shadow-xs">
                  <ZoomIn className="w-4 h-4" />
                </span>
              </div>

              {/* Bottom Image Overlay Text */}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white z-10">
                <div>
                  <h4 className="text-base sm:text-xl font-bold text-white drop-shadow-sm">
                    {SHOWROOM_PHOTO.title}
                  </h4>
                  <p className="text-xs text-amber-200 font-medium drop-shadow-sm mt-0.5">
                    {SHOWROOM_PHOTO.subtitle}
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-amber-200 flex items-center gap-1 group-hover:text-white transition-colors bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-xs shrink-0">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Tap to Enlarge</span>
                </span>
              </div>
            </div>

            {/* Content Bar Below Image */}
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {SHOWROOM_PHOTO.badges.map((b) => (
                  <span key={b} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                    {b}
                  </span>
                ))}
              </div>
              <span className="text-amber-700 font-bold text-xs inline-flex items-center gap-1 shrink-0">
                <span>View Full Signboard & Details</span>
                <span>→</span>
              </span>
            </div>
          </div>
        </div>

        {/* Showroom Visit & Consultation Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left 6 cols: Location & Hours */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/assets/aistudio/image_7777a093.png"
                  alt="Ratnesh Enterprises Logo"
                  className="h-12 w-12 object-contain rounded-xl bg-white p-1 border border-slate-300 shadow-2xs shrink-0"
                />
                <div>
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block">
                    Flagship Experience Studio
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {shopSettings.shopName || 'Ratnesh Enterprises'}
                  </h3>
                </div>
              </div>

              <div className="flex flex-col gap-4 text-xs text-slate-700">

                {/* Highlighted Interactive Address Card with Google Maps Navigation */}
                <a
                  href={
                    shopSettings.googleMapsUrl ||
                    "https://www.google.com/maps/place/Ratnesh+Enterprises/@23.6586294,85.9750885,9249m/data=!3m1!1e3!4m10!1m2!2m1!1sPrajapati+Dharamshala,+Jaridih+Rd,+Teacher's+Colony,+Jena,+Bokaro+Steel+City,+Bandhdih,+Jharkhand+829301!3m6!1s0x39f43d359de74e53:0x77e1c7d97f0076f9!8m2!3d23.6586294!4d86.0162872!15sCmhQcmFqYXBhdGkgRGhhcmFtc2hhbGEsIEphcmlkaWggUmQsIFRlYWNoZXIncyBDb2xvbnksIEplbmEsIEJva2FybyBTdGVlbCBDaXR5LCBCYW5kaGRpaCwgSmhhcmtoYW5kIDgyOTMwMZIBCnRpbGVfc3RvcmXgAQA!16s%2Fg%2F11p1r52pj5?entry=ttu&g_ep=EgoyMDI2MTEwMi4wIKXMDSoASAFQAw%3D%3D"
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="group block p-4 rounded-xl bg-amber-50/70 border border-amber-300 hover:border-amber-400 shadow-xs transition-all hover:scale-[1.01]"
                  title="Click to open showroom in Google Maps directly"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <MapPin className="w-5 h-5 fill-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs uppercase font-extrabold tracking-wider text-amber-900 flex items-center gap-1.5">
                          <span>Showroom Address</span>
                        </span>
                        <span className="text-[11px] font-bold text-amber-900 bg-amber-200/80 border border-amber-300 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                          <span>Open Google Maps ↗</span>
                        </span>
                      </div>
                      <span className="text-sm font-bold text-slate-900 group-hover:text-amber-950 transition-colors leading-snug block">
                        {shopSettings.address ||
                          "Prajapati Dharamshala, Jaridih Rd, Teacher's Colony, Jena, Bokaro Steel City, Bandhdih, Jharkhand 829301"}
                      </span>
                      <span className="block text-[11px] text-amber-800 mt-1 font-medium">
                        📍 Click address for live turn-by-turn driving directions · Free customer parking
                      </span>
                    </div>
                  </div>
                </a>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block text-sm">Store Hours:</strong>
                    <span>Monday – Saturday: 9:30 AM – 8:30 PM</span>
                    <span className="block text-slate-500">Sunday: 10:00 AM – 6:00 PM</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block text-sm">Direct Phone & WhatsApp:</strong>
                    <div className="flex flex-col gap-0.5 mt-0.5">
                      <a
                        href={`tel:${(shopSettings.phoneNumber || '+91 87094 89716').replace(/\s+/g, '')}`}
                        className="font-mono text-amber-700 hover:text-amber-800 font-bold hover:underline"
                      >
                        {shopSettings.phoneNumber || '+91 87094 89716'} (Primary / WhatsApp)
                      </a>
                      {shopSettings.secondaryPhone && (
                        <a
                          href={`tel:${shopSettings.secondaryPhone.replace(/\s+/g, '')}`}
                          className="font-mono text-slate-600 hover:text-slate-900"
                        >
                          {shopSettings.secondaryPhone} (Sales & Inquiries)
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block text-sm">Email Inquiries:</strong>
                    <a
                      href={`mailto:${shopSettings.email || 'jhratneshenterprises@gmail.com'}`}
                      className="text-amber-700 hover:text-amber-800 hover:underline font-medium"
                    >
                      {shopSettings.email || 'jhratneshenterprises@gmail.com'}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-3">
              <a
                href={
                  shopSettings.googleMapsUrl ||
                  "https://www.google.com/maps/place/Ratnesh+Enterprises/@23.6586294,85.9750885,9249m/data=!3m1!1e3!4m10!1m2!2m1!1sPrajapati+Dharamshala,+Jaridih+Rd,+Teacher's+Colony,+Jena,+Bokaro+Steel+City,+Bandhdih,+Jharkhand+829301!3m6!1s0x39f43d359de74e53:0x77e1c7d97f0076f9!8m2!3d23.6586294!4d86.0162872!15sCmhQcmFqYXBhdGkgRGhhcmFtc2hhbGEsIEphcmlkaWggUmQsIFRlYWNoZXIncyBDb2xvbnksIEplbmEsIEJva2FybyBTdGVlbCBDaXR5LCBCYW5kaGRpaCwgSmhhcmtoYW5kIDgyOTMwMZIBCnRpbGVfc3RvcmXgAQA!16s%2Fg%2F11p1r52pj5?entry=ttu&g_ep=EgoyMDI2MTEwMi4wIKXMDSoASAFQAw%3D%3D"
                }
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-300"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                <span>Open in Google Maps</span>
              </a>
              <span className="text-xs text-slate-500">Directions to Jena, Bokaro Showroom</span>
            </div>
          </div>

          {/* Right 6 cols: Book a Sample Consultation */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
                <Calendar className="w-4 h-4 text-amber-700" />
                <span>Complimentary Consultation</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                Book In-Store Sample Viewing
              </h3>
              <p className="text-xs text-slate-600 mb-6">
                Reserve 1-on-1 time with our ceramic design specialist. We’ll prepare actual tile samples and matching Microvit basins before you arrive.
              </p>

              {submitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-emerald-900">Consultation Request Received!</h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    We have opened WhatsApp to confirm your appointment time and showroom sample list.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="flex flex-col gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 mb-1 font-medium">Your Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 mb-1 font-medium">Mobile / WhatsApp Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-amber-600 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1 font-medium">Preferred Date</label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-medium">Project Scope</label>
                    <select
                      value={bookingArea}
                      onChange={(e) => setBookingArea(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                    >
                      <option value="Full House (Tiles + Bath)">Complete Home (Living + Bed + Bath)</option>
                      <option value="Bathroom & Sanitaryware Renovation">Bathroom & Microvit Sanitaryware</option>
                      <option value="Kitchen Backsplash & Floor">Kitchen Backsplash & Floor</option>
                      <option value="Commercial / Builder Project">Commercial / Apartment Project</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="mt-3 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Confirm Consultation via WhatsApp</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Showroom Photo Lightbox Modal */}
      {showPhotoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={() => setShowPhotoModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                    Showroom Storefront
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {SHOWROOM_PHOTO.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 truncate max-w-xl">
                  {SHOWROOM_PHOTO.subtitle}
                </p>
              </div>
              <button
                onClick={() => setShowPhotoModal(false)}
                className="w-9 h-9 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-800 flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Photo Display Container */}
            <div className="relative bg-slate-950 flex items-center justify-center overflow-hidden flex-1 min-h-[260px] max-h-[560px]">
              <img
                src={SHOWROOM_PHOTO.url}
                alt={SHOWROOM_PHOTO.title}
                className="w-full h-full object-contain max-h-[560px]"
              />
            </div>

            {/* Modal Bottom Details and Navigation */}
            <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1 text-center sm:text-left">
                <p className="text-xs text-slate-700 leading-relaxed">
                  {SHOWROOM_PHOTO.description}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mt-2">
                  {SHOWROOM_PHOTO.badges.map((b) => (
                    <span
                      key={b}
                      className="text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <a
                  href={
                    shopSettings.googleMapsUrl ||
                    "https://www.google.com/maps/place/Ratnesh+Enterprises/@23.6586294,85.9750885,9249m/data=!3m1!1e3!4m10!1m2!2m1!1sPrajapati+Dharamshala,+Jaridih+Rd,+Teacher's+Colony,+Jena,+Bokaro+Steel+City,+Bandhdih,+Jharkhand+829301!3m6!1s0x39f43d359de74e53:0x77e1c7d97f0076f9!8m2!3d23.6586294!4d86.0162872!15sCmhQcmFqYXBhdGkgRGhhcmFtc2hhbGEsIEphcmlkaWggUmQsIFRlYWNoZXIncyBDb2xvbnksIEplbmEsIEJva2FybyBTdGVlbCBDaXR5LCBCYW5kaGRpaCwgSmhhcmtoYW5kIDgyOTMwMZIBCnRpbGVfc3RvcmXgAQA!16s%2Fg%2F11p1r52pj5?entry=ttu&g_ep=EgoyMDI2MTEwMi4wIKXMDSoASAFQAw%3D%3D"
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-initial px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>

                <a
                  href={`https://wa.me/${shopSettings.whatsappNumber}?text=${encodeURIComponent(
                    'Hello Ratnesh Enterprises! I am looking at your showroom photo on the website and would like to visit or ask about tile availability.'
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>WhatsApp Us</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
