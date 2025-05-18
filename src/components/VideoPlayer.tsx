import React, { useEffect } from 'react';
import { useVideoStore } from '../store/videoStore';
import { useVideoHighlights } from '../hooks/useVideoHighlights';

interface VideoPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoRef }) => {
  const { videoFile } = useVideoStore();
  const { currentTime, currentSentence, setCurrentTime } = useVideoHighlights({ videoRef });

  // Update video source when file changes
  useEffect(() => {
    if (videoRef.current && videoFile) {
      const videoUrl = URL.createObjectURL(videoFile);
      videoRef.current.src = videoUrl;
      
      // Cleanup function to revoke the object URL when component unmounts or file changes
      return () => {
        URL.revokeObjectURL(videoUrl);
      };
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
    if (videoRef.current && currentTime !== undefined && Math.abs(videoRef.current.currentTime - currentTime) > 0.1) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime, videoRef]);

  return (
    <div className="relative">
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full aspect-video bg-black rounded"
        data-testid="video-player"
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Transcript Overlay */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white transition-opacity duration-300`}
        style={{ opacity: currentSentence ? 0.75 : 0 }}
      >
        <p className="text-lg" data-testid="overlay-text">
          {currentSentence?.text || ''}
        </p>
      </div>
    </div>
  );
};

export default VideoPlayer; 