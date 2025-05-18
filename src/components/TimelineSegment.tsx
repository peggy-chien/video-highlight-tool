import React, { memo } from 'react';

interface TimelineSegmentProps {
  left: string;
  width: string;
  className?: string;
}

const TimelineSegment: React.FC<TimelineSegmentProps> = memo(({ left, width, className }) => {
  return (
    <div
      className={className || "absolute top-0 h-full bg-blue-500 rounded"}
      style={{ left, width }}
    />
  );
});

export default TimelineSegment; 