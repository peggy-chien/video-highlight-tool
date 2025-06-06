import React from 'react';
import { useTranslation } from 'react-i18next';
import { useVideoHighlights } from '../hooks/useVideoHighlights';

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
};

interface VideoControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  disabled?: boolean;
}

const VideoControls: React.FC<VideoControlsProps> = ({ videoRef, disabled = false }) => {
  const { t } = useTranslation();
  const { 
    currentTime, 
    isPlaying, 
    duration, 
    isLoading,
    error,
    handlePlayPause, 
    handlePrevHighlight, 
    handleNextHighlight 
  } = useVideoHighlights({ videoRef });

  const controlsDisabled = disabled || isLoading;

  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="flex items-center justify-between w-full gap-2 px-2 py-2 bg-gray-800 rounded text-white">
        <button 
          onClick={handlePrevHighlight} 
          className="px-2 py-1 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" 
          title={t('video.controls.previous')}
          disabled={controlsDisabled}
        >
          &#124;&lt;
        </button>
        <button 
          onClick={handlePlayPause} 
          className="px-3 py-1 rounded hover:bg-gray-700 text-lg disabled:opacity-50 disabled:cursor-not-allowed" 
          title={isPlaying ? t('video.controls.pause') : t('video.controls.play')}
          disabled={controlsDisabled}
        >
          {isLoading ? '⌛' : isPlaying ? '⏸' : '▶'}
        </button>
        <button 
          onClick={handleNextHighlight} 
          className="px-2 py-1 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" 
          title={t('video.controls.next')}
          disabled={controlsDisabled}
        >
          &gt;&#124;
        </button>
        <span className="ml-2 text-sm font-mono">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
      {error && (
        <div className="text-red-500 text-sm bg-red-100 p-2 rounded">
          {t('common.error', { message: error.message })}
        </div>
      )}
    </div>
  );
};

export default VideoControls; 