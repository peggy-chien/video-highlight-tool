import React from 'react';
import { useVideoStore } from '../store/videoStore';

const TimelinePreview: React.FC = () => {
  const { processingData, selectedSentences, setCurrentTime } = useVideoStore();

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    // Optionally, you could trigger a ref or event to sync the video player
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-medium mb-2">Timeline</h3>
      <div className="space-y-2">
        {processingData?.sections.map((section) => (
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
  );
};

export default TimelinePreview; 