import React, { useEffect, useRef } from 'react';
import { useVideoStore } from '../store/videoStore';

const TranscriptSection: React.FC = () => {
  const { processingData, selectedSentences, toggleSentenceSelection, currentTime, setCurrentTime } = useVideoStore();
  const currentSentenceRef = useRef<HTMLDivElement | null>(null);

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

  // Auto-scroll to the current sentence
  useEffect(() => {
    if (currentSentenceRef.current) {
      currentSentenceRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentSentenceId]);

  if (!processingData) return null;

  return (
    <div className="space-y-6">
      {processingData.sections.map((section) => (
        <div key={section.title} className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium mb-3">{section.title}</h3>
          <div className="space-y-2">
            {section.sentences.map((sentence) => {
              const isCurrent = sentence.id === currentSentenceId;
              return (
                <div
                  key={sentence.id}
                  ref={isCurrent ? currentSentenceRef : null}
                  className={`flex items-start space-x-2 p-2 rounded cursor-pointer transition-colors border
                    ${selectedSentences.has(sentence.id) ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50 border-transparent'}
                    ${isCurrent ? 'bg-yellow-100 border-yellow-400' : ''}`}
                  onClick={() => toggleSentenceSelection(sentence.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedSentences.has(sentence.id)}
                    onChange={() => toggleSentenceSelection(sentence.id)}
                    className="mt-1"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span
                    className="text-sm text-gray-500 min-w-[60px] underline cursor-pointer hover:text-blue-600"
                    onClick={e => {
                      e.stopPropagation();
                      setCurrentTime(sentence.startTime);
                    }}
                  >
                    {sentence.startTime.toFixed(1)}s
                  </span>
                  <p className="flex-1">{sentence.text}</p>
                  {sentence.isSuggestedHighlight && (
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      Suggested
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TranscriptSection; 