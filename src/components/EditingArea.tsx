import React, { useCallback, memo } from 'react';
import { useVideoStore } from '../store/videoStore';
import { processVideo } from '../services/videoService';
import TranscriptSection from './TranscriptSection';
import { useVideoHighlights } from '../hooks/useVideoHighlights';

interface EditingAreaProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

const UploadInput = memo(({ videoFile, isPlaying, onFileChange }: {
  videoFile: File | null;
  isPlaying: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <label
    htmlFor="video-upload"
    className={`px-3 py-1.5 bg-blue-600 text-white rounded shadow transition-colors font-medium inline-block text-sm ${isPlaying ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-700'}`}
  >
    {/* Responsive button text */}
    {videoFile ? (
      <>
        <span className="block md:hidden">Change</span>
        <span className="hidden md:block">Pick Another One</span>
      </>
    ) : (
      <>
        <span className="block md:hidden">Upload</span>
        <span className="hidden md:block">Upload Video</span>
      </>
    )}
    <input
      key="video-upload"
      id="video-upload"
      type="file"
      accept="video/*"
      onChange={onFileChange}
      className="hidden"
      disabled={isPlaying}
    />
  </label>
));

const EditingArea: React.FC<EditingAreaProps> = ({ videoRef }) => {
  const processingData = useVideoStore(state => state.processingData);
  const setVideoFile = useVideoStore(state => state.setVideoFile);
  const setProcessingData = useVideoStore(state => state.setProcessingData);
  const selectedSentences = useVideoStore(state => state.selectedSentences);
  const toggleSentenceSelection = useVideoStore(state => state.toggleSentenceSelection);
  const videoFile = useVideoStore(state => state.videoFile);
  const { isPlaying } = useVideoHighlights({ videoRef });

  // Memoize with minimal dependencies
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
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
        console.error('Error processing video:', error);
      }
    }
  }, [setVideoFile, setProcessingData, selectedSentences, toggleSentenceSelection]);

  return (
    <div className="flex flex-col h-full bg-gray-100 p-4 rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Editing Area</h2>
        {processingData && (
          <span className="text-sm text-gray-600">
            {selectedSentences.size} sentences selected
          </span>
        )}
      </div>

      {/* Video Upload */}
      <div className="mb-6 flex items-center gap-4">
        <UploadInput videoFile={videoFile} isPlaying={isPlaying} onFileChange={handleFileUpload} />
        {videoFile && (
          <span className={`text-gray-700 truncate max-w-xs ${isPlaying ? 'opacity-50' : ''}`}>{videoFile.name}</span>
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