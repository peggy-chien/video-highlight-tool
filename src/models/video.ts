export interface Sentence {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  isSuggestedHighlight: boolean;
}

export interface Section {
  title: string;
  sentences: Sentence[];
}

export interface VideoProcessingData {
  fullTranscript: string;
  sections: Section[];
  suggestedHighlights: string[];
} 