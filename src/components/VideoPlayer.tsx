import React, { useEffect, useState } from 'react';
import { useVideoStore } from '../store/videoStore';
import { useVideoHighlights } from '../hooks/useVideoHighlights';

interface VideoPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoRef }) => {
  const { videoFile } = useVideoStore();
  const { currentTime, currentSentence, setCurrentTime } = useVideoHighlights({ videoRef });
  const [overlayText, setOverlayText] = useState('');

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

  // Always update overlay text to match the current sentence
  useEffect(() => {
    if (currentSentence) {
      setOverlayText(currentSentence.text);
    } else {
      setOverlayText('');
    }
  }, [currentSentence]);

  return (
    <div className="relative">
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full aspect-video bg-black rounded"
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Transcript Overlay */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white transition-opacity duration-300`}
        style={{ opacity: overlayText ? 1 : 0 }}
      >
        <p className="text-lg">{overlayText}</p>
      </div>
    </div>
  );
};

export default VideoPlayer; 