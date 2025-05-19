import { useVideoStore } from './videoStore';
import type { VideoProcessingData } from '../models/video';

describe('videoStore', () => {
  const mockFile = new File(['dummy'], 'test.mp4', { type: 'video/mp4' });
  const mockProcessingData: VideoProcessingData = {
    fullTranscript: 'Test transcript',
    sections: [
      {
        title: 'Section 1',
        sentences: [
          {
            id: 's1',
            text: 'Test sentence',
            startTime: 0,
            endTime: 2,
            isSuggestedHighlight: true,
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    // Reset store state before each test
    useVideoStore.setState({
      videoFile: null,
      processingData: null,
      selectedSentences: new Set(),
      currentTime: 0,
    });
  });

  it('should initialize with default values', () => {
    const state = useVideoStore.getState();
    expect(state.videoFile).toBeNull();
    expect(state.processingData).toBeNull();
    expect(state.selectedSentences).toEqual(new Set());
    expect(state.currentTime).toBe(0);
  });

  it('should set video file', () => {
    useVideoStore.getState().setVideoFile(mockFile);
    expect(useVideoStore.getState().videoFile).toBe(mockFile);
  });

  it('should set processing data', () => {
    useVideoStore.getState().setProcessingData(mockProcessingData);
    expect(useVideoStore.getState().processingData).toBe(mockProcessingData);
  });

  it('should toggle sentence selection', () => {
    const store = useVideoStore.getState();
    
    // Add sentence
    store.toggleSentenceSelection('s1');
    expect(useVideoStore.getState().selectedSentences).toEqual(new Set(['s1']));  // to get the updated state after an action, you need to call getState() again
    
    // Remove sentence
    store.toggleSentenceSelection('s1');
    expect(useVideoStore.getState().selectedSentences).toEqual(new Set());
    
    // Add multiple sentences
    store.toggleSentenceSelection('s1');
    store.toggleSentenceSelection('s2');
    expect(useVideoStore.getState().selectedSentences).toEqual(new Set(['s1', 's2']));
  });

  it('should set current time', () => {
    useVideoStore.getState().setCurrentTime(5.5);
    expect(useVideoStore.getState().currentTime).toBe(5.5);
  });

  it('should handle multiple state updates', () => {
    const store = useVideoStore.getState();
    
    store.setVideoFile(mockFile);
    store.setProcessingData(mockProcessingData);
    store.toggleSentenceSelection('s1');
    store.setCurrentTime(2.5);

    const state = useVideoStore.getState();
    expect(state.videoFile).toBe(mockFile);
    expect(state.processingData).toBe(mockProcessingData);
    expect(state.selectedSentences).toEqual(new Set(['s1']));
    expect(state.currentTime).toBe(2.5);
  });
}); 