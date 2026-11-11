import React, { useState, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Video,
  Upload,
  Send,
  X,
  Check,
  Film,
  MapPin,
  Phone,
  Link as LinkIcon
} from 'lucide-react';
import { ShopSettings, VideoShowcaseSettings } from '../../types';
import { saveLocalVideoBlob } from '../../utils/videoStorage';

interface ShowroomVideoSectionProps {
  shopSettings: ShopSettings;
  onUpdateSettings?: (newSettings: ShopSettings) => void;
  onOpenAdminPortal?: () => void;
  isAdminAuthenticated?: boolean;
}

// Helper to convert YouTube link into clean embed link
function getEmbedUrl(url?: string): { isYouTube: boolean; embedUrl: string } {
  if (!url) {
    // High-quality luxury ceramic showroom tour default
    return {
      isYouTube: true,
      embedUrl: 'https://www.youtube.com/embed/kYjygXAHyBU?rel=0&modestbranding=1&controls=1',
    };
  }

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
  onUpdateSettings,
  onOpenAdminPortal,
}) => {
  const videoConfig: VideoShowcaseSettings = shopSettings.showroomVideo || {};
  const currentVideoUrl = videoConfig.videoUrl;
  const { isYouTube, embedUrl } = getEmbedUrl(currentVideoUrl);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Video Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTab, setUploadTab] = useState<'device' | 'url'>('device');
  const [tempVideoUrl, setTempVideoUrl] = useState(currentVideoUrl || '');
  const [tempVideoTitle, setTempVideoTitle] = useState(videoConfig.videoTitle || 'Ratnesh Enterprises Showroom Tour');
  const [tempVideoSubtitle, setTempVideoSubtitle] = useState(videoConfig.videoSubtitle || 'Flagship Tiles & Sanitaryware Experience in Bokaro');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const title = videoConfig.videoTitle || 'Experience Our Showroom in Motion';
  const subtitle =
    videoConfig.videoSubtitle || 'Take a Virtual Walkthrough of Our Tiles & Bath Boutique in Bokaro';

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
    if (videoRef.current && videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleWhatsAppVideoCallRequest = () => {
    const text = encodeURIComponent(
      `Hello ${shopSettings.shopName}! I saw your showroom video on the website. Can you show me live video samples or options of vitrified tiles and sanitaryware?`
    );
    const num = shopSettings.whatsappNumber ? `/${shopSettings.whatsappNumber}` : '';
    window.open(`https://wa.me${num}?text=${text}`, '_blank');
  };

  // Video file upload from device
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024 * 1024) {
        alert('Video file is larger than 200MB. Please select a smaller video or paste a YouTube link.');
        return;
      }
      setSelectedFileName(file.name);
      // Store safely in IndexedDB (handles large video files without 5MB localStorage limits)
      await saveLocalVideoBlob('showroom_video', file);
      const blobUrl = URL.createObjectURL(file);
      setTempVideoUrl(blobUrl);
    }
  };

  const handleSaveVideoSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updatedSettings: ShopSettings = {
      ...shopSettings,
      showroomVideo: {
        ...shopSettings.showroomVideo,
        videoUrl: tempVideoUrl,
        videoTitle: tempVideoTitle,
        videoSubtitle: tempVideoSubtitle,
      },
    };

    if (onUpdateSettings) {
      onUpdateSettings(updatedSettings);
    }

    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsUploadModalOpen(false);
    }, 1200);
  };

  return (
    <section id="video-tour" className="w-full py-12 sm:py-16 bg-slate-50 border-b border-slate-200 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Simple Title & Direct Upload Button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1.5">
              <Film className="w-3.5 h-3.5 text-amber-600" />
              <span>Showroom Experience</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              {subtitle}
            </p>
          </div>

          {/* Action Buttons: Upload Video & Live WhatsApp Request */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                setTempVideoUrl(currentVideoUrl || '');
                setIsUploadModalOpen(true);
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              title="Upload your own shop walkthrough video"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>Upload Showroom Video</span>
            </button>

            <button
              onClick={handleWhatsAppVideoCallRequest}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp Video Tour</span>
            </button>
          </div>
        </div>

        {/* Cinematic Video Player Container */}
        <div className="w-full bg-slate-950 rounded-2xl overflow-hidden shadow-xl border border-slate-300 aspect-video relative group max-h-[620px] mx-auto">
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
                poster="/assets/aistudio/20261010_152610_fbe3c357.jpg"
                className="w-full h-full object-cover"
                playsInline
                muted={isMuted}
                loop
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Big Center Play Button */}
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

              {/* HTML5 Controls Bar */}
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

                  <span className="text-xs font-semibold text-slate-300">
                    {shopSettings.shopName} · Showroom Video Tour
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

        {/* Showroom Visit Location Pill */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-5 py-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold text-slate-900 truncate">
              {shopSettings.address}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={shopSettings.googleMapsUrl || 'https://maps.google.com'}
              target="_blank"
              rel="noreferrer"
              className="text-amber-700 hover:text-amber-800 font-bold underline"
            >
              Open in Google Maps →
            </a>
            <span className="text-slate-300">|</span>
            <a
              href={`tel:${(shopSettings.phoneNumber || '+91 87094 89716').replace(/\s+/g, '')}`}
              className="text-slate-700 hover:text-slate-900 font-semibold flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-amber-600" />
              <span>{shopSettings.phoneNumber}</span>
            </a>
          </div>
        </div>
      </div>

      {/* =========================================================================
          UPLOAD SHOWROOM VIDEO MODAL
         ========================================================================= */}
      {isUploadModalOpen && (
        <div
          onClick={() => setIsUploadModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Upload Showroom Video
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Add your real showroom video so customers can take a virtual walkthrough.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveVideoSettings} className="p-5 space-y-4">
              {/* Tab Selector */}
              <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setUploadTab('device')}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                    uploadTab === 'device'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Upload Video File
                </button>
                <button
                  type="button"
                  onClick={() => setUploadTab('url')}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                    uploadTab === 'url'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  YouTube / Video Link
                </button>
              </div>

              {/* Option 1: File Upload */}
              {uploadTab === 'device' && (
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-amber-500 transition-colors bg-slate-50">
                  <Upload className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-900">
                    Click to select a video file from your computer or phone
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Supports MP4, WebM, MOV (up to 200MB)
                  </p>
                  <label className="mt-3 inline-block px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors">
                    <span>Browse Video File</span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  {selectedFileName && (
                    <p className="mt-2 text-xs font-semibold text-emerald-700">
                      ✓ Selected: {selectedFileName}
                    </p>
                  )}
                </div>
              )}

              {/* Option 2: YouTube / Video URL */}
              {uploadTab === 'url' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    YouTube URL or MP4 Link:
                  </label>
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="url"
                      value={tempVideoUrl}
                      onChange={(e) => setTempVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    YouTube links sync across all devices instantly and load at high speed.
                  </p>
                </div>
              )}

              {/* Video Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Video Title (Optional):
                </label>
                <input
                  type="text"
                  value={tempVideoTitle}
                  onChange={(e) => setTempVideoTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <span>Save & Display Video</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
