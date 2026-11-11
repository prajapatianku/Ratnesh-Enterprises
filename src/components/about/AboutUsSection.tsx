import React from 'react';
import {
  Users,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Award,
  Building2,
  MessageSquare
} from 'lucide-react';
import { ShopSettings } from '../../types';

interface AboutUsSectionProps {
  shopSettings: ShopSettings;
}

export const AboutUsSection: React.FC<AboutUsSectionProps> = ({ shopSettings }) => {
  const primaryPhone = shopSettings.phoneNumber || '+91 87094 89716';
  const secondaryPhone = shopSettings.secondaryPhone || '+91 89868 42544';
  const email = shopSettings.email || 'jhratneshenterprises@gmail.com';
  const founder = shopSettings.founderName || 'Mr. Ratnesh';
  const manager = shopSettings.managerName || 'Mr. Ankit';

  return (
    <section id="about-us" className="w-full py-12 sm:py-16 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean Header (Ganesh Ceramic Style) */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">
            About Our Enterprise
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Premier Ceramics &amp; Bath Fittings in Bokaro
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Authorized showroom delivering first-choice vitrified slabs, designer sanitaryware, and precision bath fittings directly to homes and commercial builders across Jharkhand.
          </p>
        </div>

        {/* 3 Simple Value Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">100% Factory Direct</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Direct authorized dealership prices from Orientbell, Hels, Addon, Microvit &amp; Juliet.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">1,000+ Live Mockups</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Inspect physical marble veining, carving textures, and water fittings in person.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Safe Site Delivery</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Careful hydraulic loading and direct doorstep drop-off across Bokaro and Dhanbad.
              </p>
            </div>
          </div>
        </div>

        {/* Management Contacts */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">{founder}</span>
            <span className="text-slate-400">·</span>
            <a href={`tel:${primaryPhone.replace(/\s+/g, '')}`} className="text-amber-700 font-semibold hover:underline">
              {primaryPhone}
            </a>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">{manager}</span>
            <span className="text-slate-400">·</span>
            <a href={`tel:${secondaryPhone.replace(/\s+/g, '')}`} className="text-amber-700 font-semibold hover:underline">
              {secondaryPhone}
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <a href={`mailto:${email}`} className="text-slate-700 hover:underline">
              {email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
