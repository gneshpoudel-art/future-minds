import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGallery } from '@/lib/api';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface GalleryImage {
  id: number;
  image_url: string;
  caption?: string;
  comment?: string;
}

// Static fallback images
const FALLBACK: GalleryImage[] = [
  { id: 1, image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=800&q=80', caption: 'Graduation Ceremony 2023' },
  { id: 2, image_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80', caption: 'Campus Life in Korea' },
  { id: 3, image_url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80', caption: 'Cultural Exchange' },
  { id: 4, image_url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80', caption: 'Pre-departure Orientation' },
  { id: 5, image_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80', caption: 'University Visit Day' },
  { id: 6, image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80', caption: 'Language Class Session' },
  { id: 7, image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80', caption: 'IELTS Preparation' },
  { id: 8, image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80', caption: 'Career Counselling' },
];

const GalleryCarousel: React.FC = () => {
  const { data } = useQuery<GalleryImage[]>({ queryKey: ['gallery'], queryFn: getGallery, staleTime: 5 * 60 * 1000 });
  const images = (data && data.length > 0) ? data : FALLBACK;

  // Infinite scroll strip = images duplicated 3x
  const strip = [...images, ...images, ...images];

  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const posRef = useRef(0);
  const itemWidth = 340; // px including gap
  const speed = 0.6; // px per frame
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  // Auto-scroll
  useEffect(() => {
    const totalWidth = itemWidth * images.length;

    const tick = () => {
      if (!pausedRef.current && trackRef.current) {
        posRef.current += speed;
        if (posRef.current >= totalWidth) posRef.current -= totalWidth;
        trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [images.length]);

  const setPause = (v: boolean) => { setPaused(v); pausedRef.current = v; };

  const scrollBy = (dir: -1 | 1) => {
    const totalWidth = itemWidth * images.length;
    posRef.current = (posRef.current + dir * itemWidth + totalWidth) % totalWidth;
    if (trackRef.current) trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
  };

  return (
    <section className="py-16 overflow-hidden bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Our Gallery</h2>
          <p className="text-slate-600 max-w-xl mx-auto">Moments from our students' journeys — from classrooms to global campuses.</p>
        </div>
      </div>

      <div
        className="relative group"
        onMouseEnter={() => setPause(true)}
        onMouseLeave={() => setPause(false)}
      >
        {/* Navigation arrows */}
        <button
          onClick={() => scrollBy(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5 text-slate-700" />
        </button>
        <button
          onClick={() => scrollBy(1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5 text-slate-700" />
        </button>

        {/* Scroll track */}
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-4 will-change-transform"
            style={{ width: `${itemWidth * strip.length}px` }}
          >
            {strip.map((img, idx) => (
              <div
                key={`${img.id}-${idx}`}
                className="flex-shrink-0 cursor-pointer group/card"
                style={{ width: `${itemWidth - 16}px` }}
                onClick={() => setLightbox(img)}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-md h-56 bg-slate-200">
                  <img
                    src={img.image_url}
                    alt={img.caption || 'Gallery image'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                    loading="lazy"
                    draggable={false}
                  />
                  {img.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-full group-hover/card:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-sm font-medium">{img.caption}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white"
            onClick={() => setLightbox(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <div
            className="max-w-4xl w-full"
            onClick={e => e.stopPropagation()}
          >
            <img src={lightbox.image_url} alt={lightbox.caption} className="w-full rounded-2xl shadow-2xl object-contain max-h-[80vh]" />
            {(lightbox.caption || lightbox.comment) && (
              <div className="mt-4 text-center">
                {lightbox.caption && <p className="text-white font-semibold text-lg">{lightbox.caption}</p>}
                {lightbox.comment && <p className="text-slate-400 text-sm mt-1">{lightbox.comment}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default GalleryCarousel;
