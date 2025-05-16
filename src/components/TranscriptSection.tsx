import React from 'react';
import { useVideoStore } from '../store/videoStore';

const TranscriptSection: React.FC = () => {
  const { processingData, selectedSentences, toggleSentenceSelection } = useVideoStore();

  if (!processingData) return null;

  return (
    <div className="space-y-6">
      {processingData.sections.map((section) => (
        <div key={section.title} className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium mb-3">{section.title}</h3>
          <div className="space-y-2">
            {section.sentences.map((sentence) => (
              <div
                key={sentence.id}
                className={`flex items-start space-x-2 p-2 rounded cursor-pointer transition-colors
                  ${selectedSentences.has(sentence.id) ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}
                onClick={() => toggleSentenceSelection(sentence.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedSentences.has(sentence.id)}
                  onChange={() => toggleSentenceSelection(sentence.id)}
                  className="mt-1"
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="text-sm text-gray-500 min-w-[60px]">
                  {sentence.startTime.toFixed(1)}s
                </span>
                <p className="flex-1">{sentence.text}</p>
                {sentence.isSuggestedHighlight && (
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    Suggested
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TranscriptSection; 