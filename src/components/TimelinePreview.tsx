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

  return (
    <div className="relative w-full h-6 mt-4 mb-2 bg-gray-300 rounded overflow-hidden">
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

const TimelinePreview: React.FC = () => {
  const { processingData, selectedSentences, setCurrentTime } = useVideoStore();

  if (!processingData || selectedSentences.size === 0) return null;

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    // Optionally, you could trigger a ref or event to sync the video player
  };

  return (
    <>
      <TimelineBar />
      <div className="p-4 bg-white rounded shadow">
        <h3 className="text-lg font-medium mb-2">Timeline</h3>
        <div className="space-y-2">
          {processingData.sections.map((section) => (
            <div key={section.title} className="space-y-1">
              <h4 className="text-sm font-medium text-gray-600">{section.title}</h4>
              <div className="flex flex-wrap gap-2">
                {section.sentences
                  .filter((sentence) => selectedSentences.has(sentence.id))
                  .map((sentence) => (
                    <button
                      key={sentence.id}
                      onClick={() => handleSeek(sentence.startTime)}
                      className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                    >
                      {sentence.startTime.toFixed(1)}s
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TimelinePreview; 