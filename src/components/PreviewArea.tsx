import React from 'react';
import VideoPlayer from './VideoPlayer';
import TimelineBar from './TimelineBar';
import VideoControls from './VideoControls';

interface PreviewAreaProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

const PreviewArea: React.FC<PreviewAreaProps> = ({ videoRef }) => {
  return (
    <div className="h-full bg-gray-100 p-4 rounded flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Preview Area</h2>
      <VideoPlayer videoRef={videoRef} />
      <VideoControls videoRef={videoRef} />
      <TimelineBar videoRef={videoRef} />
    </div>
  );
};

export default PreviewArea; 