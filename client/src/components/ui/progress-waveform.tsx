import React from "react";
import { cn } from "@/lib/utils";

interface ProgressWaveformProps {
  progress: number; // 0-100
  className?: string;
  onClick?: (percent: number) => void;
}

export function ProgressWaveform({ 
  progress, 
  className,
  onClick
}: ProgressWaveformProps) {
  const waveformRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onClick || !waveformRef.current) return;
    
    const rect = waveformRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = (clickX / rect.width) * 100;
    
    onClick(Math.max(0, Math.min(100, percent)));
  };

  return (
    <div 
      ref={waveformRef}
      className={cn(
        "relative w-full h-2 bg-neutral-200 rounded-full overflow-hidden cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      <div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary/70 to-secondary/70 rounded-full"
        style={{ width: `${progress}%` }}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={progress}
        role="progressbar"
      />
    </div>
  );
}

import { useRef } from "react";
