import React, { useEffect } from 'react';
import VideoPlayer from './VideoPlayer';
import TimelineBar from './TimelineBar';
import VideoControls from './VideoControls';
import { useVideoHighlights } from '../hooks/useVideoHighlights';
import { useVideoStore } from '../store/videoStore';

interface PreviewAreaProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

const PreviewArea: React.FC<PreviewAreaProps> = ({ videoRef }) => {
  const { handlePlayPause, handlePrevHighlight, handleNextHighlight } = useVideoHighlights({ videoRef });
  const videoFile = useVideoStore(state => state.videoFile);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevHighlight();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNextHighlight();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayPause, handlePrevHighlight, handleNextHighlight]);

  return (
    <div className="h-full bg-gray-100 p-4 rounded flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Preview Area</h2>
      <VideoPlayer videoRef={videoRef} />
      <VideoControls videoRef={videoRef} disabled={!videoFile} />
      <TimelineBar videoRef={videoRef} />
    </div>
  );
};

export default PreviewArea; 