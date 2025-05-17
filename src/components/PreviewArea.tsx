import React from 'react';
import VideoPlayer from './VideoPlayer';
import TimelineBar from './TimelineBar';

const PreviewArea: React.FC = () => {
  return (
    <div className="h-full bg-gray-100 p-4 rounded flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Preview Area</h2>
      <VideoPlayer />
      <TimelineBar />
    </div>
  );
};

export default PreviewArea; 