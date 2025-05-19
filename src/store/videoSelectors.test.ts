import { getHighlightSegments } from './videoSelectors';
import type { VideoProcessingData } from '../models/video';

describe('videoSelectors', () => {
  const mockProcessingData: VideoProcessingData = {
    fullTranscript: 'Test transcript',
    sections: [
      {
        title: 'Section 1',
        sentences: [
          {
            id: 's1',
            text: 'First sentence',
            startTime: 0,
            endTime: 2,
            isSuggestedHighlight: true,
          },
          {
            id: 's2',
            text: 'Second sentence',
            startTime: 2.5,
            endTime: 4,
            isSuggestedHighlight: false,
          },
        ],
      },
      {
        title: 'Section 2',
        sentences: [
          {
            id: 's3',
            text: 'Third sentence',
            startTime: 5,
            endTime: 7,
            isSuggestedHighlight: true,
          },
        ],
      },
    ],
  };

  it('should return empty array when processingData is null', () => {
    const result = getHighlightSegments(null, new Set());
    expect(result).toEqual([]);
  });

  it('should return empty array when no sentences are selected', () => {
    const result = getHighlightSegments(mockProcessingData, new Set());
    expect(result).toEqual([]);
  });

  it('should return segments for selected sentences in chronological order', () => {
    const selectedSentences = new Set(['s1', 's3']);
    const result = getHighlightSegments(mockProcessingData, selectedSentences);
    
    expect(result).toEqual([
      { start: 0, end: 2 },    // s1
      { start: 5, end: 7 },    // s3
    ]);
  });

  it('should handle multiple selected sentences in the same section', () => {
    const selectedSentences = new Set(['s1', 's2']);
    const result = getHighlightSegments(mockProcessingData, selectedSentences);
    
    expect(result).toEqual([
      { start: 0, end: 2 },    // s1
      { start: 2.5, end: 4 },  // s2
    ]);
  });
}); 