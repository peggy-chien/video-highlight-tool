import React from 'react';
import EditingArea from './EditingArea';
import PreviewArea from './PreviewArea';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen min-h-[500px] overflow-y-auto">
      {/* Left side: Editing Area */}
      <div className="w-1/2 h-full p-4 border-r border-gray-300">
        <EditingArea />
      </div>

      {/* Right side: Preview Area */}
      <div className="w-1/2 h-full p-4">
        <PreviewArea />
      </div>
    </div>
  );
};

export default Layout; 