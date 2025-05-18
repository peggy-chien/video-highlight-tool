import React, { useEffect } from 'react';
import { useVideoStore } from '../store/videoStore';
import { useVideoHighlights } from '../hooks/useVideoHighlights';
import { getHighlightSegments } from '../store/videoSelectors';

interface VideoPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoRef }) => {
  const { videoFile, processingData, selectedSentences } = useVideoStore();
  const { currentTime, currentSentence, setCurrentTime } = useVideoHighlights({ videoRef });

  // Update video source when file changes
  useEffect(() => {
    if (videoRef.current && videoFile) {
      videoRef.current.src = URL.createObjectURL(videoFile);
    }
  }, [videoFile, videoRef]);

  // Update current time in store
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Sync video element's currentTime with the store's currentTime
  useEffect(() => {
    if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTime) > 0.1) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime, videoRef]);

  // Play only selected highlights: skip to next highlight when current ends
  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const onTimeUpdate = () => {
      const highlights = getHighlightSegments(processingData, selectedSentences);
      if (!highlights.length) return;
      // Only run highlight-skipping logic if video is playing
      if (video.paused) return;
      const t = video.currentTime;
      // Find the current highlight
      const current = highlights.find(seg => t >= seg.start && t < seg.end);
      if (!current) {
        // Not in any highlight, jump to the next
        const next = highlights.find(seg => seg.start > t);
        if (next) {
          video.currentTime = next.start;
        } else {
          // Snap to end of last highlight and pause
          const last = highlights[highlights.length - 1];
          if (last) {
            video.currentTime = last.end;
          }
          video.pause();
        }
      } else {
        // If at the end of the current highlight, jump to next or pause
        if (t >= current.end - 0.05) {
          const idx = highlights.indexOf(current);
          const next = highlights[idx + 1];
          if (next) {
            video.currentTime = next.start;
          } else {
            video.currentTime = current.end;
            video.pause();
          }
        }
      }
    };
    video.addEventListener('timeupdate', onTimeUpdate);
    return () => video.removeEventListener('timeupdate', onTimeUpdate);
  }, [videoRef, processingData, selectedSentences]);

  return (
    <div className="relative">
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full aspect-video bg-black rounded"
        controls
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Transcript Overlay */}
      {currentSentence && selectedSentences.has(currentSentence.id) && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white">
          <p className="text-lg">{currentSentence.text}</p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer; 