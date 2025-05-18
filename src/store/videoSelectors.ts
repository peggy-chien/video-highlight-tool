import type { VideoProcessingData } from '../models/video';

export function getHighlightSegments(
  processingData: VideoProcessingData | null,
  selectedSentences: Set<string>
) {
  if (!processingData) return [];
  const segs: { start: number; end: number }[] = [];
  processingData.sections.forEach(section => {
    section.sentences.forEach(sentence => {
      if (selectedSentences.has(sentence.id)) {
        segs.push({ start: sentence.startTime, end: sentence.endTime });
      }
    });
  });
  return segs.sort((a, b) => a.start - b.start);
} 