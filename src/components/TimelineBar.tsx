import React, { useRef } from 'react';
import { useVideoHighlights } from '../hooks/useVideoHighlights';

interface TimelineBarProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

const TimelineBar: React.FC<TimelineBarProps> = ({ videoRef }) => {
  const timelineBarRef = useRef<HTMLDivElement>(null);
  const { 
    currentTime, 
    duration, 
    highlights, 
    handleSeek 
  } = useVideoHighlights({ videoRef });

  if (!duration || highlights.length === 0) return null;

  // Click-to-seek handler
  const handleBarClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!duration || !timelineBarRef.current) return;
    const rect = timelineBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.min(Math.max(x / rect.width, 0), 1);
    const seekTime = percent * duration;
    handleSeek(seekTime);
  };

  return (
    <div
      ref={timelineBarRef}
      className="relative w-full h-6 mt-4 mb-2 bg-gray-300 rounded overflow-hidden cursor-pointer"
      onClick={handleBarClick}
      title="Click to seek"
    >
      {/* Highlight Segments */}
      {highlights.map((seg, i) => {
        const left = duration ? `${(seg.start / duration) * 100}%` : '0%';
        const width = duration ? `${((seg.end - seg.start) / duration) * 100}%` : '0%';
        return (
          <div
            key={i}
            className="absolute top-0 h-full bg-blue-500 rounded"
            style={{ left, width }}
          />
        );
      })}
      {/* Playhead */}
      {duration > 0 && (
        <div
          className="absolute top-0 bottom-0 w-1 bg-red-500 rounded"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        />
      )}
    </div>
  );
};

export default TimelineBar; 