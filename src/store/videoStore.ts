import { create } from 'zustand';
import type { VideoProcessingData } from '../models/video';

interface VideoState {
  // Video file
  videoFile: File | null;
  
  // Processing data
  processingData: VideoProcessingData | null;
  
  // Selected sentences for highlights
  selectedSentences: Set<string>;
  
  // Current playback time
  currentTime: number;
  
  // Actions
  setVideoFile: (file: File | null) => void;
  setProcessingData: (data: VideoProcessingData | null) => void;
  toggleSentenceSelection: (sentenceId: string) => void;
  setCurrentTime: (time: number) => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  videoFile: null,
  processingData: null,
  selectedSentences: new Set(),
  currentTime: 0,

  setVideoFile: (file) => set({ videoFile: file }),
  setProcessingData: (data) => set({ processingData: data }),
  toggleSentenceSelection: (sentenceId) =>
    set((state) => {
      const newSelected = new Set(state.selectedSentences);
      if (newSelected.has(sentenceId)) {
        newSelected.delete(sentenceId);
      } else {
        newSelected.add(sentenceId);
      }
      return { selectedSentences: newSelected };
    }),
  setCurrentTime: (time) => set({ currentTime: time }),
})); 