import React, { useEffect } from 'react';
import { useVideoStore } from '../store/videoStore';
import type { Sentence } from '../models/video';

interface VideoPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoRef }) => {
  const { videoFile, processingData, selectedSentences, currentTime, setCurrentTime } = useVideoStore();

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

  // Get all selected highlight time ranges
  const getHighlights = () => {
    if (!processingData) return [];
    const segs: { start: number; end: number }[] = [];
    processingData.sections.forEach(section => {
      section.sentences.forEach(sentence => {
        if (selectedSentences.has(sentence.id)) {
          segs.push({ start: sentence.startTime, end: sentence.endTime });
        }
      });
    });
    return segs.sort((a, b) => a.start - b.start);
  };

  // Play only selected highlights: skip to next highlight when current ends
  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const highlights = getHighlights();
    if (!highlights.length) return;

    const onTimeUpdate = () => {
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

  // Get current sentence based on time
  const getCurrentSentence = (): Sentence | null => {
    if (!processingData) return null;

    for (const section of processingData.sections) {
      for (const sentence of section.sentences) {
        if (currentTime >= sentence.startTime && currentTime <= sentence.endTime) {
          return sentence;
        }
      }
    }
    return null;
  };

  const currentSentence = getCurrentSentence();

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