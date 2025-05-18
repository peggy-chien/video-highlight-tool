import React from 'react';
import { useVideoHighlights } from '../hooks/useVideoHighlights';

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
};

const VideoControls: React.FC<{ videoRef: React.RefObject<HTMLVideoElement> }> = ({ videoRef }) => {
  const { 
    currentTime, 
    isPlaying, 
    duration, 
    handlePlayPause, 
    handlePrevHighlight, 
    handleNextHighlight 
  } = useVideoHighlights({ videoRef });

  return (
    <div className="flex items-center justify-between w-full gap-2 px-2 py-2 bg-gray-800 rounded text-white mt-4">
      <button onClick={handlePrevHighlight} className="px-2 py-1 rounded hover:bg-gray-700" title="Previous Highlight">
        &#124;&lt;
      </button>
      <button onClick={handlePlayPause} className="px-3 py-1 rounded hover:bg-gray-700 text-lg" title="Play/Pause">
        {isPlaying ? '⏸' : '▶'}
      </button>
      <button onClick={handleNextHighlight} className="px-2 py-1 rounded hover:bg-gray-700" title="Next Highlight">
        &gt;&#124;
      </button>
      <span className="ml-2 text-sm font-mono">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
};

export default VideoControls; 