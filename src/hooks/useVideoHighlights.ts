import { useEffect, useMemo, useState, useCallback } from 'react';
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
  isLoading: boolean;
  error: Error | null;
  
  // Actions
  setCurrentTime: (time: number) => void;
  handlePlayPause: () => Promise<void>;
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

  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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

  // Sync play state and handle video events
  useEffect(() => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = (e: ErrorEvent) => setError(new Error(e.message));
    const onLoadedMetadata = () => setIsLoading(false);
    const onLoadStart = () => setIsLoading(true);
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
          // If we're past the last highlight, stop at the end of the last one
          const last = highlights[highlights.length - 1];
          if (last) {
            video.currentTime = last.end;
            video.pause();
          }
        }
      } else {
        // If at the end of the current highlight, jump to next
        if (t >= current.end - 0.05) {
          const idx = highlights.indexOf(current);
          const next = highlights[idx + 1];
          if (next) {
            video.currentTime = next.start;
          } else {
            // If this is the last highlight, stop at its end
            video.currentTime = current.end;
            video.pause();
          }
        }
      }
    };

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('error', onError as EventListener);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('loadstart', onLoadStart);
    video.addEventListener('timeupdate', onTimeUpdate);

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('error', onError as EventListener);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('loadstart', onLoadStart);
      video.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [videoRef, highlights]);

  // Play/pause logic with error handling
  const handlePlayPause = useCallback(async () => {
    if (!videoRef.current) return;
    try {
      const inHighlight = highlights.some(seg => currentTime >= seg.start && currentTime < seg.end);
      const last = highlights[highlights.length - 1];
      if (videoRef.current.paused) {
        // If at or past the end of the last highlight, reset to first highlight
        if (last && currentTime >= last.end - 0.05) {
          setCurrentTime(highlights[0].start);
          await new Promise(res => setTimeout(res, 10)); // ensure time is set before playing
        } else if (!inHighlight) {
          const next = highlights.find(seg => seg.start > currentTime) || highlights[0];
          if (next) setCurrentTime(next.start);
        }
        await videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to play/pause video'));
    }
  }, [videoRef, highlights, currentTime, setCurrentTime]);

  // Previous/Next highlight logic
  const handlePrevHighlight = useCallback(() => {
    if (!highlights.length) return;
    const prev = [...highlights].reverse().find(seg => seg.end < currentTime);
    if (prev) setCurrentTime(prev.start);
    else setCurrentTime(highlights[0].start);
  }, [highlights, currentTime, setCurrentTime]);

  const handleNextHighlight = useCallback(() => {
    if (!highlights.length) return;
    const epsilon = 0.01;
    const next = highlights.find(seg => seg.start > currentTime + epsilon);
    if (next) setCurrentTime(next.start);
    else setCurrentTime(highlights[highlights.length - 1].start);
  }, [highlights, currentTime, setCurrentTime]);

  // Seek logic with highlight snapping
  const handleSeek = useCallback((time: number) => {
    if (!duration) return;
    let seekTime = Math.min(Math.max(time, 0), duration);
    // If seeking to a selected highlight and at/after the end, snap to just before the end
    const inHighlight = highlights.find(seg => seekTime >= seg.start && seekTime < seg.end);
    if (inHighlight && seekTime >= inHighlight.end - 0.05) {
      seekTime = inHighlight.end - 0.1;
    }
    setCurrentTime(seekTime);
  }, [duration, highlights, setCurrentTime]);

  return {
    currentTime,
    isPlaying,
    duration,
    highlights,
    currentSentence,
    isLoading,
    error,
    setCurrentTime,
    handlePlayPause,
    handlePrevHighlight,
    handleNextHighlight,
    handleSeek
  };
} 