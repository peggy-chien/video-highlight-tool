import React, { useMemo, useRef } from 'react';
import { useVideoStore } from '../store/videoStore';
import { getHighlightSegments } from '../store/videoSelectors';

const TimelineBar: React.FC = () => {
  const { processingData, selectedSentences, currentTime, setCurrentTime } = useVideoStore();
  const timelineBarRef = useRef<HTMLDivElement>(null);

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

  // Get highlight segments (centralized)
  const segments = useMemo(() => getHighlightSegments(processingData, selectedSentences), [processingData, selectedSentences]);

  if (!processingData || selectedSentences.size === 0) return null;

  // Click-to-seek handler
  const handleBarClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!duration || !timelineBarRef.current) return;
    const rect = timelineBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.min(Math.max(x / rect.width, 0), 1);
    let seekTime = percent * duration;
    // If seeking to a selected highlight and at/after the end, snap to just before the end
    const inHighlight = segments.find(seg => seekTime >= seg.start && seekTime < seg.end);
    if (inHighlight && seekTime >= inHighlight.end - 0.05) {
      seekTime = inHighlight.end - 0.1;
    }
    setCurrentTime(seekTime);
  };

  return (
    <div
      ref={timelineBarRef}
      className="relative w-full h-6 mt-4 mb-2 bg-gray-300 rounded overflow-hidden cursor-pointer"
      onClick={handleBarClick}
      title="Click to seek"
    >
      {/* Highlight Segments */}
      {segments.map((seg, i) => {
        const left = duration ? `${(seg.start / duration) * 100}%` : '0%';
        const width = duration ? `${((seg.end - seg.start) / duration) * 100}%` : '0%';
        return (
          <div
            key={i}
            className="absolute top-0 h-full bg-blue-500 rounded"
            style={{ left, width }}
          />
        );
      })}
      {/* Playhead */}
      {duration > 0 && (
        <div
          className="absolute top-0 bottom-0 w-1 bg-red-500 rounded"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        />
      )}
    </div>
  );
};

export default TimelineBar; 