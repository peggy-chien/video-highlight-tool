import React, { useCallback } from 'react';
import { useVideoStore } from '../store/videoStore';
import { processVideo } from '../services/videoService';
import TranscriptSection from './TranscriptSection';

const EditingArea: React.FC = () => {
  const { processingData, setVideoFile, setProcessingData, selectedSentences } = useVideoStore();

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      try {
        const data = await processVideo(file);
        setProcessingData(data);
      } catch (error) {
        console.error('Error processing video:', error);
      }
    }
  }, [setVideoFile, setProcessingData]);

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
      <div className="mb-6">
        <label className="block mb-2">
          <span className="text-gray-700">Upload Video</span>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            className="mt-1 block w-full"
          />
        </label>
      </div>

      {/* Scrollable Transcript Sections */}
      <div className="flex-1 overflow-y-auto">
        <TranscriptSection />
      </div>
    </div>
  );
};

export default EditingArea; 