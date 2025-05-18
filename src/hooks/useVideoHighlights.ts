import { useEffect, useMemo, useState } from 'react';
import { useVideoStore } from '../store/videoStore';
import { getHighlightSegments } from '../store/videoSelectors';
import type { HighlightSegment, Sentence } from '../models/video';

interface UseVideoHighlightsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

interface UseVideoHighlightsReturn {
  // Current state
  currentTime: number;
  isPlaying: boolean;
  duration: number;
  highlights: HighlightSegment[];
  currentSentence: Sentence | null;
  
  // Actions
  setCurrentTime: (time: number) => void;
  handlePlayPause: () => void;
  handlePrevHighlight: () => void;
  handleNextHighlight: () => void;
  handleSeek: (time: number) => void;
}

export function useVideoHighlights({ videoRef }: UseVideoHighlightsProps): UseVideoHighlightsReturn {
  const { 
    processingData, 
    selectedSentences, 
    currentTime, 
    setCurrentTime 
  } = useVideoStore();

  // Get highlight segments (memoized)
  const highlights = useMemo(() => 
    getHighlightSegments(processingData, selectedSentences),
    [processingData, selectedSentences]
  );

  // Get current sentence based on time
  const currentSentence = useMemo(() => {
    if (!processingData) return null;
    for (const section of processingData.sections) {
      for (const sentence of section.sentences) {
        if (currentTime >= sentence.startTime && currentTime <= sentence.endTime) {
          return sentence;
        }
      }
    }
    return null;
  }, [processingData, currentTime]);

  // Get video duration
  const duration = useMemo(() => {
    if (!processingData) return 0;
    let max = 0;
    processingData.sections.forEach(section => {
      section.sentences.forEach(sentence => {
        if (sentence.endTime > max) max = sentence.endTime;
      });
    });
    return max;
  }, [processingData]);

  // Play/pause state
  const [isPlaying, setIsPlaying] = useState(false);

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

  // Play/pause logic
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    const inHighlight = highlights.some(seg => currentTime >= seg.start && currentTime < seg.end);
    if (videoRef.current.paused) {
      if (!inHighlight) {
        const next = highlights.find(seg => seg.start > currentTime) || highlights[0];
        if (next) setCurrentTime(next.start);
      }
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  // Previous/Next highlight logic
  const handlePrevHighlight = () => {
    if (!highlights.length) return;
    const prev = [...highlights].reverse().find(seg => seg.end < currentTime);
    if (prev) setCurrentTime(prev.start);
    else setCurrentTime(highlights[0].start);
  };

  const handleNextHighlight = () => {
    if (!highlights.length) return;
    const next = highlights.find(seg => seg.start > currentTime);
    if (next) setCurrentTime(next.start);
    else setCurrentTime(highlights[highlights.length - 1].start);
  };

  // Seek logic with highlight snapping
  const handleSeek = (time: number) => {
    if (!duration) return;
    let seekTime = Math.min(Math.max(time, 0), duration);
    // If seeking to a selected highlight and at/after the end, snap to just before the end
    const inHighlight = highlights.find(seg => seekTime >= seg.start && seekTime < seg.end);
    if (inHighlight && seekTime >= inHighlight.end - 0.05) {
      seekTime = inHighlight.end - 0.1;
    }
    setCurrentTime(seekTime);
  };

  // Play only selected highlights: skip to next highlight when current ends
  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const onTimeUpdate = () => {
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
  }, [videoRef, highlights]);

  return {
    currentTime,
    isPlaying,
    duration,
    highlights,
    currentSentence,
    setCurrentTime,
    handlePlayPause,
    handlePrevHighlight,
    handleNextHighlight,
    handleSeek
  };
} 