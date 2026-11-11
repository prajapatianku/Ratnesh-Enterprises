import React, { useState, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Video,
  Upload,
  Sparkles,
  MapPin,
  Phone,
  ShieldCheck,
  Send,
  ExternalLink,
  Edit3
} from 'lucide-react';
import { ShopSettings, VideoShowcaseSettings } from '../../types';

interface ShowroomVideoSectionProps {
  shopSettings: ShopSettings;
  onOpenAdminPortal?: () => void;
  isAdminAuthenticated?: boolean;
}

// Convert any YouTube link into a clean embed link
function getEmbedUrl(url?: string): { isYouTube: boolean; embedUrl: string } {
  if (!url) {
    // High-quality ceramic showroom walk-through default video (Ganesh Ceramic / Orientbell style)
    return {
      isYouTube: true,
      embedUrl: 'https://www.youtube.com/embed/kYjygXAHyBU?rel=0&modestbranding=1&controls=1',
    };
  }

  // YouTube standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) {
    return {
      isYouTube: true,
      embedUrl: `https://www.youtube.com/embed/${watchMatch[1]}?rel=0&modestbranding=1&controls=1`,
    };
  }

  // Direct MP4 / WebM / Blob video
  return {
    isYouTube: false,
    embedUrl: url,
  };
}

export const ShowroomVideoSection: React.FC<ShowroomVideoSectionProps> = ({
  shopSettings,
  onOpenAdminPortal,
  isAdminAuthenticated = false,
}) => {
  const videoConfig: VideoShowcaseSettings = shopSettings.showroomVideo || {};
  const videoUrl = videoConfig.videoUrl;
  const { isYouTube, embedUrl } = getEmbedUrl(videoUrl);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const title = videoConfig.videoTitle || 'Experience Ratnesh Enterprises in Motion';
  const subtitle =
    videoConfig.videoSubtitle || 'Take a Virtual Tour of Our Flagship Showroom in Jainamore, Bokaro';
  const description =
    videoConfig.videoDescription ||
    'Watch our ceramic showroom walk-through, full-scale vitrified slabs display, Microvit designer art basins, and Juliet & Polo luxury bath fittings under true natural lighting.';

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleWhatsAppVideoCallRequest = () => {
    const text = encodeURIComponent(
      `Hello ${shopSettings.shopName}! I watched your showroom video on the website. Can you show me live video samples or videos of 2x4 vitrified tiles and Microvit table top basins?`
    );
    const num = shopSettings.whatsappNumber ? `/${shopSettings.whatsappNumber}` : '';
    window.open(`https://wa.me${num}?text=${text}`, '_blank');
  };

  return (
    <section id="video-tour" className="w-full py-16 bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 border border-amber-300 px-3 py-1 rounded-md mb-3">
              <Video className="w-3.5 h-3.5 text-amber-700" />
              <span>Showroom Walkthrough & Video Tour</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {title}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onOpenAdminPortal && (
              <button
                onClick={onOpenAdminPortal}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Admin: Upload or change the showroom video"
              >
                <Upload className="w-3.5 h-3.5 text-amber-700" />
                <span>Upload / Change Video</span>
              </button>
            )}

            <button
              onClick={handleWhatsAppVideoCallRequest}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Live Video Request</span>
            </button>
          </div>
        </div>

        {/* Video Player Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Cinematic Video Player (8 cols on desktop) */}
          <div className="lg:col-span-8 bg-slate-950 rounded-2xl overflow-hidden shadow-xl border border-slate-300/80 aspect-video relative group">
            {isYouTube ? (
              <iframe
                src={embedUrl}
                title={title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  ref={videoRef}
                  src={embedUrl}
                  poster={videoConfig.thumbnailUrl || '/assets/aistudio/20261010_152610_fbe3c357.jpg'}
                  className="w-full h-full object-cover"
                  playsInline
                  muted={isMuted}
                  loop
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />

                {/* Big Center Play Overlay Button */}
                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors group cursor-pointer z-10"
                    title="Play Showroom Tour"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-slate-950 ml-1" />
                    </div>
                  </button>
                )}

                {/* HTML5 Video Controls Bar */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex items-center justify-between text-white z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                    </button>

                    <button
                      onClick={toggleMute}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>

                    <span className="text-xs font-semibold text-slate-300 hidden sm:inline">
                      Ratnesh Enterprises · Showroom Tour
                    </span>
                  </div>

                  <button
                    onClick={toggleFullscreen}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Showroom Highlights & Video Guidance (4 cols on desktop) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block mb-1">
                Visual Experience
              </span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                What You See in Our Showroom
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {description}
              </p>

              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-semibold">1000+ Slabs on Live Display</strong>
                    <span className="text-slate-500 text-[11px]">Compare glossy, matte, carving and satin finishes side-by-side.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-semibold">Designer Microvit Sanitaryware</strong>
                    <span className="text-slate-500 text-[11px]">Complete mockup setups with matching taps and basins.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-semibold">Direct Wholesale Brand Pricing</strong>
                    <span className="text-slate-500 text-[11px]">Orientbell, Hels, Addon, Exotiles, Juliet, Polo.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Visit & Navigation Card */}
            <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
                  Visit the physical boutique
                </span>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  Near Prajapati Dharamshala, Jainamore, Bokaro
                </h4>
                <p className="text-xs text-amber-800 mt-1">
                  Open Mon–Sat 9:30 AM – 8:30 PM · Ample customer parking
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200/80 flex items-center justify-between gap-2">
                <a
                  href={
                    shopSettings.googleMapsUrl ||
                    'https://www.google.com/maps/place/Ratnesh+Enterprises'
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-2xs"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Open in Maps</span>
                </a>

                <a
                  href={`tel:${(shopSettings.phoneNumber || '+91 87094 89716').replace(/\s+/g, '')}`}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-700" />
                  <span>Call Store</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
