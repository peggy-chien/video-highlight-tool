import React from 'react';
import VideoPlayer from './VideoPlayer';
import TimelinePreview from './TimelinePreview';

const PreviewArea: React.FC = () => {
  return (
    <div className="h-full bg-gray-100 p-4 rounded flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Preview Area</h2>
      <VideoPlayer />
      <div className="mt-4 flex-1 overflow-y-auto">
        <TimelinePreview />
      </div>
    </div>
  );
};

export default PreviewArea; 