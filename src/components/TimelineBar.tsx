import React, { useMemo } from 'react';
import { useVideoStore } from '../store/videoStore';

const TimelineBar: React.FC = () => {
  const { processingData, selectedSentences, currentTime } = useVideoStore();

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

  // Get highlight segments
  const segments = useMemo(() => {
    if (!processingData) return [];
    const segs: { start: number; end: number }[] = [];
    processingData.sections.forEach(section => {
      section.sentences.forEach(sentence => {
        if (selectedSentences.has(sentence.id)) {
          segs.push({ start: sentence.startTime, end: sentence.endTime });
        }
      });
    });
    return segs;
  }, [processingData, selectedSentences]);

  if (!processingData || selectedSentences.size === 0) return null;

  return (
    <div
      className="relative w-full h-6 mt-4 mb-2 bg-gray-300 rounded overflow-hidden"
      title="Timeline"
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