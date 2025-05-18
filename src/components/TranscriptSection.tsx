import React, { useEffect, useRef } from 'react';
import { useVideoStore } from '../store/videoStore';
import TranscriptRow from './TranscriptRow';

let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

const TranscriptSection: React.FC = () => {
  // use selectors instead of subscribing to the whole store to reduce unnecessary re-renders
  const processingData = useVideoStore(state => state.processingData);
  const selectedSentences = useVideoStore(state => state.selectedSentences);
  const toggleSentenceSelection = useVideoStore(state => state.toggleSentenceSelection);
  const currentTime = useVideoStore(state => state.currentTime);
  const setCurrentTime = useVideoStore(state => state.setCurrentTime);
  const currentSentenceRef = useRef<HTMLDivElement>(null);

  // Find the current sentence id
  let currentSentenceId: string | null = null;
  if (processingData) {
    processingData.sections.forEach(section => {
      section.sentences.forEach(sentence => {
        if (
          currentTime >= sentence.startTime &&
          currentTime <= sentence.endTime
        ) {
          currentSentenceId = sentence.id;
        }
      });
    });
  }

  // Debounced auto-scroll to the current sentence (to prevent excessive scroll events during rapid playback)
  useEffect(() => {
    // Only auto-scroll on md: screens and up
    if (window.matchMedia && window.matchMedia('(min-width: 768px)').matches) {
      if (currentSentenceRef.current) {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          currentSentenceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 80); // 80ms debounce
      }
    }
    return () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [currentSentenceId]);

  if (!processingData) return null;

  // Helper to check if a sentence is selected
  const isSentenceSelected = (id: string) => selectedSentences.has(id);

  // Helper to pause video
  const pauseVideo = () => {
    const video = document.querySelector('video');
    if (video) video.pause();
  };

  // Helper to check if video is playing
  const isVideoPlaying = () => {
    const video = document.querySelector('video');
    return video && !video.paused;
  };

  const handleTimeClick = (startTime: number, id: string) => {
    setCurrentTime(startTime);
    if (!isSentenceSelected(id) && isVideoPlaying()) {
      pauseVideo();
    }
  };

  return (
    <div className="space-y-6">
      {processingData.sections.map((section) => (
        <div key={section.title} className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium mb-3">{section.title}</h3>
          <div className="space-y-2">
            {section.sentences.map((sentence) => {
              const isCurrent = sentence.id === currentSentenceId;
              return (
                <TranscriptRow
                  key={sentence.id}
                  sentence={sentence}
                  isCurrent={isCurrent}
                  isSelected={selectedSentences.has(sentence.id)}
                  onToggle={toggleSentenceSelection}
                  onTimeClick={handleTimeClick}
                  currentSentenceRef={currentSentenceRef}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TranscriptSection; 