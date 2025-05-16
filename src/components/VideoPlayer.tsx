import React, { useRef, useEffect } from 'react';
import { useVideoStore } from '../store/videoStore';
import type { Sentence } from '../models/video';

const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { videoFile, processingData, selectedSentences, currentTime, setCurrentTime } = useVideoStore();

  // Update video source when file changes
  useEffect(() => {
    if (videoRef.current && videoFile) {
      videoRef.current.src = URL.createObjectURL(videoFile);
    }
  }, [videoFile]);

  // Update current time in store
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

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