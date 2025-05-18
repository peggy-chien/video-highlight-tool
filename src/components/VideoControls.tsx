import React, { useEffect, useState } from 'react';
import { useVideoStore } from '../store/videoStore';
import { getHighlightSegments } from '../store/videoSelectors';

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
  const { processingData, selectedSentences, currentTime, setCurrentTime } = useVideoStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  // Get all selected highlight time ranges (centralized)
  const highlights = React.useMemo(() => getHighlightSegments(processingData, selectedSentences), [processingData, selectedSentences]);

  // Get video duration
  useEffect(() => {
    if (videoRef.current) {
      const onLoadedMetadata = () => setDuration(videoRef.current?.duration || 0);
      videoRef.current.addEventListener('loadedmetadata', onLoadedMetadata);
      return () => videoRef.current?.removeEventListener('loadedmetadata', onLoadedMetadata);
    }
  }, [videoRef]);

  // Play/pause logic
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    // If paused on a non-selected sentence, jump to the next selected highlight
    const inHighlight = highlights.some(seg => currentTime >= seg.start && currentTime < seg.end);
    if (videoRef.current.paused) {
      if (!inHighlight) {
        const next = highlights.find(seg => seg.start > currentTime) || highlights[0];
        if (next) setCurrentTime(next.start);
      }
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Sync play state
  useEffect(() => {
    if (!videoRef.current) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    videoRef.current.addEventListener('play', onPlay);
    videoRef.current.addEventListener('pause', onPause);
    return () => {
      videoRef.current?.removeEventListener('play', onPlay);
      videoRef.current?.removeEventListener('pause', onPause);
    };
  }, [videoRef]);

  // Previous/Next highlight logic
  const handlePrev = () => {
    if (!highlights.length) return;
    const prev = [...highlights].reverse().find(seg => seg.end < currentTime);
    if (prev) setCurrentTime(prev.start);
    else setCurrentTime(highlights[0].start);
  };
  const handleNext = () => {
    if (!highlights.length) return;
    const next = highlights.find(seg => seg.start > currentTime);
    if (next) setCurrentTime(next.start);
    else setCurrentTime(highlights[highlights.length - 1].start);
  };

  return (
    <div className="flex items-center justify-between w-full gap-2 px-2 py-2 bg-gray-800 rounded text-white mt-4">
      <button onClick={handlePrev} className="px-2 py-1 rounded hover:bg-gray-700" title="Previous Highlight">
        &#124;&lt;
      </button>
      <button onClick={handlePlayPause} className="px-3 py-1 rounded hover:bg-gray-700 text-lg" title="Play/Pause">
        {isPlaying ? '⏸' : '▶'}
      </button>
      <button onClick={handleNext} className="px-2 py-1 rounded hover:bg-gray-700" title="Next Highlight">
        &gt;&#124;
      </button>
      <span className="ml-2 text-sm font-mono">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
};

export default VideoControls; 