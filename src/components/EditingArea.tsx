import React from 'react';
import { useTranslation } from 'react-i18next';
import { useVideoStore } from '../store/videoStore';
import { processVideo } from '../services/videoService';
import TranscriptSection from './TranscriptSection';
import { useVideoHighlights } from '../hooks/useVideoHighlights';
import FileUpload from './FileUpload';

interface EditingAreaProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

const EditingArea: React.FC<EditingAreaProps> = ({ videoRef }) => {
  const { t } = useTranslation();
  const processingData = useVideoStore(state => state.processingData);
  const setVideoFile = useVideoStore(state => state.setVideoFile);
  const setProcessingData = useVideoStore(state => state.setProcessingData);
  const selectedSentences = useVideoStore(state => state.selectedSentences);
  const toggleSentenceSelection = useVideoStore(state => state.toggleSentenceSelection);
  const videoFile = useVideoStore(state => state.videoFile);
  const { isPlaying } = useVideoHighlights({ videoRef });
  const [uploadError, setUploadError] = React.useState<string | null>(null);

  // No need for useCallback since this is not passed to deeply memoized children
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      try {
        const data = await processVideo(file);
        setProcessingData(data);
        // Auto-select all sentences where `isSuggestedHighlight` is `true`
        data.sections.forEach(section => {
          section.sentences.forEach(sentence => {
            if (sentence.isSuggestedHighlight && !selectedSentences.has(sentence.id)) {
              toggleSentenceSelection(sentence.id);
            }
          });
        });
      } catch (error) {
        setUploadError(t('transcript.editingArea.uploadError'));
        console.error('Error processing video:', error);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 p-4 rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t('transcript.editingArea.title')}</h2>
        {processingData && (
          <span className="text-sm text-gray-600">
            {t('transcript.editingArea.sentencesSelected', { count: selectedSentences.size })}
          </span>
        )}
      </div>

      {/* Video Upload */}
      <div className="mb-6 flex items-center gap-2">
        <FileUpload
          file={videoFile}
          disabled={isPlaying}
          onFileChange={handleFileUpload}
          accept="video/*"
          mobileLabel={videoFile ? t('transcript.editingArea.changeVideo') : t('transcript.editingArea.uploadVideo')}
          desktopLabel={videoFile ? t('transcript.editingArea.pickAnotherVideo') : t('transcript.editingArea.uploadVideo')}
        />
        {uploadError && (
          <span className="text-red-600 text-sm ml-2">{uploadError}</span>
        )}
      </div>

      {/* Scrollable Transcript Sections */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <TranscriptSection />
      </div>
    </div>
  );
};

export default EditingArea; 