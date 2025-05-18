import React, { useRef } from 'react';
import VideoPlayer from './VideoPlayer';
import TimelineBar from './TimelineBar';
import VideoControls from './VideoControls';

const PreviewArea: React.FC = () => {
  // Create a ref to pass to both VideoPlayer and VideoControls
  const videoRef = useRef<HTMLVideoElement>(null!);

  return (
    <div className="h-full bg-gray-100 p-4 rounded flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Preview Area</h2>
      <VideoPlayer videoRef={videoRef} />
      <VideoControls videoRef={videoRef} />
      <TimelineBar />
    </div>
  );
};

export default PreviewArea; 