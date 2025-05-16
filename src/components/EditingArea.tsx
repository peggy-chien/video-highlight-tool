import React, { useCallback } from 'react';
import { useVideoStore } from '../store/videoStore';
import { processVideo } from '../services/videoService';
import TranscriptSection from './TranscriptSection';

const EditingArea: React.FC = () => {
  const { processingData, setVideoFile, setProcessingData, selectedSentences, toggleSentenceSelection, videoFile } = useVideoStore();

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
    <div className="h-full bg-gray-100 p-4 rounded flex flex-col">
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
        <label
          htmlFor="video-upload"
          className="cursor-pointer px-3 py-1.5 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition-colors font-medium inline-block text-sm"
        >
          {videoFile ? "Pick Another One" : "Upload Video"}
          <input
            id="video-upload"
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
        {videoFile && (
          <span className="text-gray-700 truncate max-w-xs">{videoFile.name}</span>
        )}
      </div>

      {/* Scrollable Transcript Sections */}
      <div className="flex-1 overflow-y-auto">
        <TranscriptSection />
      </div>
    </div>
  );
};

export default EditingArea; 