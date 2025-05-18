import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Sentence } from '../models/video';
import CheckBadge from '../assets/check-badge-fill-12.svg';

interface TranscriptRowProps {
  sentence: Sentence;
  isCurrent: boolean;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onTimeClick: (startTime: number, id: string) => void;
  currentSentenceRef: React.RefObject<HTMLDivElement | null>;
}

const TranscriptRow: React.FC<TranscriptRowProps> = memo(({ sentence, isCurrent, isSelected, onToggle, onTimeClick, currentSentenceRef }) => {
  const { t } = useTranslation();

  return (
    <div
      key={sentence.id}
      ref={isCurrent ? currentSentenceRef : undefined}
      className={`flex items-start space-x-2 p-2 rounded cursor-pointer transition-colors border
        ${isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50 border-transparent'}
        ${isCurrent ? 'bg-yellow-100 border-yellow-400' : ''}`}
      onClick={() => onToggle(sentence.id)}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onToggle(sentence.id)}
        className="mt-1"
        onClick={(e) => e.stopPropagation()}
      />
      <span
        className="text-sm text-gray-500 min-w-[60px] underline cursor-pointer hover:text-blue-600"
        onClick={e => {
          e.stopPropagation();
          onTimeClick(sentence.startTime, sentence.id);
        }}
      >
        {t('transcript.timestamp', { time: sentence.startTime.toFixed(1) })}
      </span>
      <p className="flex-1">{sentence.text}</p>
      {sentence.isSuggestedHighlight && (
        <>
          <span className="block md:hidden flex-shrink-0">
            <img
              src={CheckBadge}
              alt={t('common.suggested')}
              className="w-5 h-5 [filter:invert(31%)_sepia(98%)_saturate(1234%)_hue-rotate(202deg)_brightness(97%)_contrast(101%)]"
            />
          </span>
          <span className="hidden md:inline text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded flex-shrink-0 whitespace-nowrap">
            {t('common.suggested')}
          </span>
        </>
      )}
    </div>
  );
});

export default TranscriptRow; 