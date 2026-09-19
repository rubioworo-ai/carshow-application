import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Sparkles, ShieldCheck } from 'lucide-react';

interface VehicleGalleryProps {
  images: string[];
  vehicleTitle: string;
  condition: string;
  isFeatured?: boolean;
}

export const VehicleGallery: React.FC<VehicleGalleryProps> = ({
  images,
  vehicleTitle,
  condition,
  isFeatured
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Main Image Viewport */}
      <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-slate-900 shadow-md group">
        <img
          src={images[currentIndex]}
          alt={`${vehicleTitle} - view ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-300 select-none"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-3 py-1 rounded-md text-xs font-bold shadow-md ${
            condition === 'New'
              ? 'bg-emerald-600 text-white'
              : condition === 'Certified Pre-Owned'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-100'
          }`}>
            {condition}
          </span>
          {isFeatured && (
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-400 text-slate-950 flex items-center gap-1 shadow-md">
              <Sparkles className="w-3.5 h-3.5" /> Featured
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={() => setLightboxOpen(true)}
            className="p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-colors shadow-md"
            title="View Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 shadow-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next photo"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 shadow-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Counter Overlay */}
        <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-lg">
          {currentIndex + 1} / {images.length} Photos
        </div>
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                currentIndex === idx 
                  ? 'border-blue-600 scale-95 shadow-sm ring-2 ring-blue-600/30' 
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[currentIndex]}
              alt={vehicleTitle}
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
            <div className="flex justify-between items-center text-white mt-4">
              <span className="font-bold text-sm">{vehicleTitle}</span>
              <div className="flex gap-2">
                <button
                  onClick={prevImage}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
                >
                  Prev
                </button>
                <button
                  onClick={nextImage}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
                >
                  Next
                </button>
                <button
                  onClick={() => setLightboxOpen(false)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
