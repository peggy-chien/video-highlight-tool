import type { VideoProcessingData, HighlightSegment } from '../models/video';

export function getHighlightSegments(
  processingData: VideoProcessingData | null,
  selectedSentences: Set<string>
): HighlightSegment[] {
  if (!processingData) return [];
  const segs: HighlightSegment[] = [];
  processingData.sections.forEach(section => {
    section.sentences.forEach(sentence => {
      if (selectedSentences.has(sentence.id)) {
        segs.push({ start: sentence.startTime, end: sentence.endTime });
      }
    });
  });
  return segs.sort((a, b) => a.start - b.start);
} 