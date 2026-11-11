import React from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Send,
  Navigation
} from 'lucide-react';
import { ShopSettings } from '../../types';

interface ShowroomShowcaseProps {
  shopSettings: ShopSettings;
}

export const ShowroomShowcase: React.FC<ShowroomShowcaseProps> = ({ shopSettings }) => {
  const primaryPhone = shopSettings.phoneNumber || '+91 87094 89716';
  const secondaryPhone = shopSettings.secondaryPhone || '+91 89868 42544';

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Hello ${shopSettings.shopName}! I would like to visit your showroom in Jainamore, Bokaro. Please share current tile catalog and directions.`
    );
    const num = shopSettings.whatsappNumber ? `/${shopSettings.whatsappNumber}` : '';
    window.open(`https://wa.me${num}?text=${text}`, '_blank');
  };

  return (
    <section id="showroom-story" className="w-full py-12 sm:py-16 bg-slate-50 text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Shop Real Photograph (Clean, Single Display) */}
          <div className="lg:col-span-6 overflow-hidden rounded-2xl shadow-md border border-slate-200 aspect-[4/3] bg-slate-950 relative group">
            <img
              src="/assets/aistudio/20261010_152610_fbe3c357.jpg"
              alt="Ratnesh Enterprises Showroom Front"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
              Ratnesh Enterprises · Jainamore, Bokaro
            </div>
          </div>

          {/* Clean Visit Details (Ganesh Ceramic Style) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1.5">
              Physical Experience Studio
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Visit Our Flagship Showroom
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Touch real tile textures, compare high gloss and carving veins under true natural lighting, and get expert consultation for your home or commercial project.
            </p>

            <div className="mt-6 space-y-3.5 text-xs text-slate-700 border-t border-slate-200 pt-5">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-bold">Address</strong>
                  <span>{shopSettings.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-bold">Showroom Hours</strong>
                  <span>Monday – Saturday: 9:30 AM – 8:30 PM (Sunday by Appointment)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-bold">Helpline &amp; Consultation</strong>
                  <span>{primaryPhone} / {secondaryPhone}</span>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={shopSettings.googleMapsUrl || 'https://maps.google.com'}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Google Maps Directions</span>
              </a>

              <button
                onClick={handleWhatsAppInquiry}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Message on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
