import React from 'react';
import {
  Users,
  PhoneCall,
  Mail,
  MapPin,
  CheckCircle2,
  Award,
  Building2,
  Phone,
  MessageSquare
} from 'lucide-react';
import { ShopSettings } from '../../types';
import { BrandLogo } from '../brands/BrandLogos';

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
    <section id="about-us" className="w-full py-16 bg-white text-slate-900 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-md mb-3">
            <Users className="w-3.5 h-3.5 text-amber-700" />
            <span>Company Profile & Management</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Who We Are & How We Manage Ratnesh Enterprises
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            A trusted family-owned enterprise committed to transforming homes and commercial properties with India's finest ceramics, designer table-top sanitaryware, and precision bath fittings.
          </p>
        </div>

        {/* 2-Column Split: Who We Are & Who Manages It */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* LEFT 7 COLS: Who We Are Story */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img
                  src="/assets/aistudio/image_7777a093.png"
                  alt="Ratnesh Enterprises Logo"
                  className="h-14 w-14 object-contain rounded-xl bg-white p-1 border border-slate-300 shadow-xs shrink-0"
                />
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Ratnesh Enterprises
                  </h3>
                  <span className="text-xs text-amber-700 font-bold uppercase tracking-wider block">
                    Authorized Ceramic Slabs, Sanitaryware & Bath Fittings
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <p>
                  Founded with a vision to eliminate middleman markups and bring authentic, first-choice tile designs to discerning homeowners, <strong className="text-slate-900">Ratnesh Enterprises</strong> has grown into one of the most reliable authorized showroom dealers in the region.
                </p>
                <p>
                  We are proud authorized showroom partners for leading brands: <strong className="text-slate-900">Orientbell Tiles</strong>, <strong className="text-slate-900">Hels</strong>, <strong className="text-slate-900">Addon</strong>, <strong className="text-slate-900">Exotiles</strong>, <strong className="text-slate-900">Microvit</strong>, <strong className="text-slate-900">Juliet</strong>, and <strong className="text-slate-900">Polo</strong>.
                </p>

                {/* Direct Brand Partner Logos */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  {(['Orientbell', 'Hels', 'Addon', 'Exotiles', 'Microvit', 'Juliet', 'Polo'] as const).map((b) => (
                    <a key={b} href="#brands" className="hover:scale-105 transition-transform">
                      <BrandLogo brand={b} variant="compact" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Core Commitments */}
              <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">100% Genuine First-Choice Batch Assurance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">Direct Factory Wholesale Margins</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">Accurate Room Box Estimation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">Zero-Breakage Site Transit Delivery</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLS: Who Manages It (Leadership Cards) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-xs">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block mb-1">
                Executive Management
              </span>
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Hands-On Proprietor Leadership
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-5">
                At Ratnesh Enterprises, you work directly with the owners. Every order, consignment, and delivery is personally overseen to guarantee matching shades and flaw-free goods.
              </p>

              {/* Leader 1: Ratnesh */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 mb-3 flex items-center justify-between shadow-2xs">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{founder}</div>
                  <div className="text-[11px] text-amber-700 font-bold">Founder & Managing Director</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Manufacturer Relations, Brand Procurement & Major Project Quotations
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
                  <Award className="w-4 h-4 text-amber-700" />
                </div>
              </div>

              {/* Leader 2: Ankit */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{manager}</div>
                  <div className="text-[11px] text-amber-700 font-bold">Operations & Client Support Director</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Showroom Consultation, Selection Assistance & Site Delivery Logistics
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
                  <Building2 className="w-4 h-4 text-amber-700" />
                </div>
              </div>
            </div>

            {/* Direct Contact Phone Box */}
            <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-300 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block mb-1">
                  Immediate Showroom Assistance
                </span>
                <h4 className="text-base font-bold text-slate-900 mb-1">
                  Call or WhatsApp Us Directly
                </h4>
                <p className="text-xs text-slate-600 mb-4">
                  Speak directly with Mr. Ratnesh or Mr. Ankit for immediate stock checks, quotes, or contractor inquiries.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
                  className="flex-1 py-2.5 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {primaryPhone}</span>
                </a>

                <a
                  href={`https://wa.me/${shopSettings.whatsappNumber}?text=${encodeURIComponent('Hello Ratnesh Enterprises! I need assistance with tiles and sanitaryware.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-white" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Column Quick Contact Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-200 text-xs">
          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
              <Phone className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Direct Phone Lines</span>
              <a href={`tel:${primaryPhone.replace(/\s+/g, '')}`} className="font-bold text-slate-900 hover:text-amber-700 block">
                {primaryPhone}
              </a>
              <a href={`tel:${secondaryPhone.replace(/\s+/g, '')}`} className="text-slate-600 hover:text-slate-900 block">
                {secondaryPhone} (Sales Desk)
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
              <Mail className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Official Email</span>
              <a href={`mailto:${email}`} className="font-bold text-slate-900 hover:text-amber-700 block truncate max-w-[220px]">
                {email}
              </a>
              <span className="text-slate-500 text-[11px]">Prompt Quotation Response</span>
            </div>
          </div>

          <a
            href={
              shopSettings.googleMapsUrl ||
              "https://www.google.com/maps/place/Ratnesh+Enterprises/@23.6586294,85.9750885,9249m/data=!3m1!1e3!4m10!1m2!2m1!1sPrajapati+Dharamshala,+Jaridih+Rd,+Teacher's+Colony,+Jena,+Bokaro+Steel+City,+Bandhdih,+Jharkhand+829301!3m6!1s0x39f43d359de74e53:0x77e1c7d97f0076f9!8m2!3d23.6586294!4d86.0162872!15sCmhQcmFqYXBhdGkgRGhhcmFtc2hhbGEsIEphcmlkaWggUmQsIFRlYWNoZXIncyBDb2xvbnksIEplbmEsIEJva2FybyBTdGVlbCBDaXR5LCBCYW5kaGRpaCwgSmhhcmtoYW5kIDgyOTMwMZIBCnRpbGVfc3RvcmXgAQA!16s%2Fg%2F11p1r52pj5?entry=ttu&g_ep=EgoyMDI2MTEwMi4wIKXMDSoASAFQAw%3D%3D"
            }
            target="_blank"
            rel="noreferrer"
            className="group flex items-start gap-3 bg-slate-50 hover:bg-amber-50/50 p-4 rounded-xl border border-slate-200 hover:border-amber-300 transition-all hover:scale-[1.01]"
            title="Click to open showroom in Google Maps directly"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 mt-0.5 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-amber-800 block text-[10px] uppercase font-bold flex items-center gap-1">
                <span>Showroom Address</span>
                <span>(Open Google Maps ↗)</span>
              </span>
              <span className="font-bold text-slate-900 group-hover:text-amber-900 transition-colors block leading-snug">
                {shopSettings.address}
              </span>
              <span className="text-slate-500 text-[11px] block mt-1">Open Mon–Sat: 9:30 AM – 8:30 PM · Free Customer Parking</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
