import React, { useRef } from 'react';
import EditingArea from './EditingArea';
import PreviewArea from './PreviewArea';

const Layout: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null!);
  return (
    <div className="flex flex-col-reverse md:flex-row h-auto md:h-screen min-h-[500px] overflow-y-auto">
      {/* Editing Area (bottom on mobile, left on desktop) */}
      <div className="w-full md:w-1/2 h-auto md:h-full p-4 pt-0 md:pt-4 border-b md:border-b-0 md:border-r border-gray-300">
        <EditingArea videoRef={videoRef} />
      </div>

      {/* Preview Area (top on mobile, right on desktop) */}
      <div className="w-full md:w-1/2 h-auto md:h-full p-4">
        <PreviewArea videoRef={videoRef} />
      </div>
    </div>
  );
};

export default Layout; 