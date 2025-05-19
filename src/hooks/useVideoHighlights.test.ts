import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVideoHighlights } from './useVideoHighlights';
import { useVideoStore } from '../store/videoStore';
import type { VideoProcessingData, Sentence } from '../models/video';

// Mock the video store
vi.mock('../store/videoStore', () => ({
  useVideoStore: vi.fn(),
}));

// Mock the video selectors
vi.mock('../store/videoSelectors', () => ({
  getHighlightSegments: (processingData: VideoProcessingData | null) => {
    if (!processingData) return [];
    return [
      { start: 0, end: 5, text: 'First highlight' },
      { start: 10, end: 15, text: 'Second highlight' },
      { start: 20, end: 25, text: 'Third highlight' },
    ];
  },
}));

describe('useVideoHighlights', () => {
  const mockVideoRef = { current: document.createElement('video') };
  const mockSetCurrentTime = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    (useVideoStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      processingData: {
        fullTranscript: 'Test transcript',
        sections: [
          {
            title: 'Test Section',
            sentences: [
              { id: '1', startTime: 0, endTime: 5, text: 'First sentence', isSuggestedHighlight: true },
              { id: '2', startTime: 10, endTime: 15, text: 'Second sentence', isSuggestedHighlight: true },
              { id: '3', startTime: 20, endTime: 25, text: 'Third sentence', isSuggestedHighlight: true },
            ] as Sentence[],
          },
        ],
      } as VideoProcessingData,
      selectedSentences: [0, 1, 2],
      currentTime: 0,
      setCurrentTime: mockSetCurrentTime,
    });
  });

  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useVideoHighlights({ videoRef: mockVideoRef }));
    
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.highlights).toHaveLength(3);
    expect(result.current.duration).toBe(25);
  });

  it('handles play/pause correctly', async () => {
    const { result } = renderHook(() => useVideoHighlights({ videoRef: mockVideoRef }));
    
    // Mock video play and pause
    const mockPlay = vi.fn().mockResolvedValue(undefined);
    const mockPause = vi.fn();
    Object.defineProperty(mockVideoRef.current, 'play', { value: mockPlay });
    Object.defineProperty(mockVideoRef.current, 'pause', { value: mockPause });
    Object.defineProperty(mockVideoRef.current, 'paused', { 
      get: vi.fn()
        .mockReturnValueOnce(true)  // First call: video is paused
        .mockReturnValueOnce(false) // Second call: video is playing
    });
    
    // Test play
    await act(async () => {
      await result.current.handlePlayPause();
    });
    
    expect(mockPlay).toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(true);
    
    // Test pause
    await act(async () => {
      await result.current.handlePlayPause();
    });
    
    expect(mockPause).toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(false);
  });

  it('handles navigation between highlights', () => {
    const { result } = renderHook(() => useVideoHighlights({ videoRef: mockVideoRef }));
    
    // Test next highlight
    act(() => {
      result.current.handleNextHighlight();
    });
    expect(mockSetCurrentTime).toHaveBeenCalledWith(10); // Should move to second highlight
    
    // Test previous highlight
    act(() => {
      result.current.handlePrevHighlight();
    });
    expect(mockSetCurrentTime).toHaveBeenCalledWith(0); // Should move to first highlight
  });

  it('handles seek with highlight snapping', () => {
    const { result } = renderHook(() => useVideoHighlights({ videoRef: mockVideoRef }));
    
    // Test seeking to middle of highlight
    act(() => {
      result.current.handleSeek(12);
    });
    expect(mockSetCurrentTime).toHaveBeenCalledWith(12);
    
    // Test seeking near end of highlight (should snap back)
    act(() => {
      result.current.handleSeek(14.9);
    });
    expect(mockSetCurrentTime).toHaveBeenCalledWith(14.9);
  });

  it('handles video errors', () => {
    const { result } = renderHook(() => useVideoHighlights({ videoRef: mockVideoRef }));
    
    // Simulate video error
    act(() => {
      const errorEvent = new ErrorEvent('error', { message: 'Test error' });
      mockVideoRef.current.dispatchEvent(errorEvent);
    });
    
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Test error');
  });

  it('updates current sentence based on time', () => {
    const { result, rerender } = renderHook(() => useVideoHighlights({ videoRef: mockVideoRef }));
    
    // Update store with new time
    (useVideoStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      processingData: {
        fullTranscript: 'Test transcript',
        sections: [
          {
            title: 'Test Section',
            sentences: [
              { id: '1', startTime: 0, endTime: 5, text: 'First sentence', isSuggestedHighlight: true },
              { id: '2', startTime: 10, endTime: 15, text: 'Second sentence', isSuggestedHighlight: true },
              { id: '3', startTime: 20, endTime: 25, text: 'Third sentence', isSuggestedHighlight: true },
            ] as Sentence[],
          },
        ],
      } as VideoProcessingData,
      selectedSentences: [0, 1, 2],
      currentTime: 12,
      setCurrentTime: mockSetCurrentTime,
    });
    
    rerender();
    
    expect(result.current.currentSentence?.text).toBe('Second sentence');
  });

  it('handles loading states correctly', () => {
    const { result } = renderHook(() => useVideoHighlights({ videoRef: mockVideoRef }));
    
    // Simulate load start
    act(() => {
      mockVideoRef.current.dispatchEvent(new Event('loadstart'));
    });
    expect(result.current.isLoading).toBe(true);
    
    // Simulate metadata loaded
    act(() => {
      mockVideoRef.current.dispatchEvent(new Event('loadedmetadata'));
    });
    expect(result.current.isLoading).toBe(false);
  });
}); 