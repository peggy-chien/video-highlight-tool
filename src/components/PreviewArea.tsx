import React from 'react';

const PreviewArea: React.FC = () => {
  return (
    <div className="h-full bg-gray-100 p-4 rounded">
      <h2 className="text-xl font-semibold mb-4">Preview Area</h2>
      {/* Video player and timeline will go here */}
      <div className="aspect-video bg-black text-white flex items-center justify-center">
        <p>Video Player Placeholder</p>
      </div>
      <div className="mt-4">
        <p>Timeline Placeholder</p>
      </div>
    </div>
  );
};

export default PreviewArea; 