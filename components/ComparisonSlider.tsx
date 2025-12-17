import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MoveHorizontal } from 'lucide-react';

interface ComparisonSliderProps {
  original: string;
  processed: string;
}

const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ original, processed }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(() => {
    setIsResizing(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    // Calculate percentage and clamp between 0 and 100
    const position = Math.max(0, Math.min(100, (x / width) * 100));
    setSliderPosition(position);
  }, [isResizing]);

  // Touch support
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isResizing || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const width = rect.width;
    
    const position = Math.max(0, Math.min(100, (x / width) * 100));
    setSliderPosition(position);
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900 select-none cursor-ew-resize group shadow-2xl"
      style={{ aspectRatio: '16/9', maxHeight: '70vh' }}
    >
      {/* Background Image (Original) */}
      <img 
        src={original} 
        alt="Original" 
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />
      
      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full z-10 pointer-events-none">
        ORIGINAL
      </div>
      <div className="absolute top-4 right-4 bg-blue-600/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full z-10 pointer-events-none">
        CLEANED
      </div>

      {/* Foreground Image (Processed) - Clipped */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          clipPath: `inset(0 0 0 ${sliderPosition}%)` 
        }}
      >
        <img 
          src={processed} 
          alt="Processed" 
          className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
        />
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_20px_rgba(0,0,0,0.5)] z-20 hover:bg-blue-400 transition-colors"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg transform active:scale-110 transition-transform">
          <MoveHorizontal className="w-5 h-5 text-blue-600" />
        </div>
      </div>
    </div>
  );
};

export default ComparisonSlider;
