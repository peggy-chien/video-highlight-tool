import { render, screen, fireEvent } from '@testing-library/react';
import VideoPlayer from './VideoPlayer';
import { useVideoStore } from '../store/videoStore';
import { useVideoHighlights } from '../hooks/useVideoHighlights';

// Mock the hooks
vi.mock('../store/videoStore', () => ({
  useVideoStore: vi.fn(),
}));

vi.mock('../hooks/useVideoHighlights', () => ({
  useVideoHighlights: vi.fn(),
}));

describe('VideoPlayer', () => {
  const mockVideoRef = { current: document.createElement('video') };
  const mockSetCurrentTime = vi.fn();
  const mockCurrentSentence = { id: 's1', text: 'Test sentence', startTime: 0, endTime: 2, isSuggestedHighlight: true };

  const defaultVideoHighlights = {
    currentTime: 0,
    currentSentence: null,
    setCurrentTime: mockSetCurrentTime,
    isPlaying: false,
    duration: 0,
    highlights: [],
    isLoading: false,
    error: null,
    handlePlayPause: vi.fn(),
    handlePrevHighlight: vi.fn(),
    handleNextHighlight: vi.fn(),
    handleSeek: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock store values
    vi.mocked(useVideoStore).mockReturnValue({
      videoFile: new File(['dummy'], 'test.mp4', { type: 'video/mp4' }),
      processingData: null,
      selectedSentences: new Set(),
      currentTime: 0,
      setVideoFile: vi.fn(),
      setProcessingData: vi.fn(),
      toggleSentenceSelection: vi.fn(),
      setCurrentTime: vi.fn(),
    });

    // Mock video highlights hook
    vi.mocked(useVideoHighlights).mockReturnValue(defaultVideoHighlights);
  });

  it('should render video element', () => {
    render(<VideoPlayer videoRef={mockVideoRef} />);
    const video = screen.getByTestId('video-player');
    expect(video).toBeInTheDocument();
    expect(video.tagName.toLowerCase()).toBe('video');
  });

  it('should update video source when file changes', () => {
    const mockFile = new File(['dummy'], 'test.mp4', { type: 'video/mp4' });
    vi.mocked(useVideoStore).mockReturnValue({
      ...useVideoStore(),
      videoFile: mockFile,
    });

    render(<VideoPlayer videoRef={mockVideoRef} />);
    expect(mockVideoRef.current.src).toContain('blob:');
  });

  it('should update current time on timeupdate event', () => {
    render(<VideoPlayer videoRef={mockVideoRef} />);
    
    // Simulate video time update
    mockVideoRef.current.currentTime = 1.5;
    fireEvent.timeUpdate(mockVideoRef.current);
    
    expect(mockSetCurrentTime).toHaveBeenCalledWith(1.5);
  });

  it('should show overlay text when current sentence exists', () => {
    vi.mocked(useVideoHighlights).mockReturnValue({
      ...defaultVideoHighlights,
      currentSentence: mockCurrentSentence,
    });

    render(<VideoPlayer videoRef={mockVideoRef} />);
    
    const overlay = screen.getByTestId('overlay-text');
    expect(overlay).toBeInTheDocument();
    expect(overlay.parentElement).toHaveStyle({ opacity: '0.75' });
  });

  it('should hide overlay text when no current sentence', () => {
    render(<VideoPlayer videoRef={mockVideoRef} />);
    
    const overlay = screen.getByTestId('overlay-text').parentElement;
    expect(overlay).toHaveStyle({ opacity: '0' });
  });

  it('should sync video time with store time', () => {
    vi.mocked(useVideoHighlights).mockReturnValue({
      ...defaultVideoHighlights,
      currentTime: 2.5,
    });

    render(<VideoPlayer videoRef={mockVideoRef} />);
    
    // Video time should be updated to match store time
    expect(mockVideoRef.current.currentTime).toBe(2.5);
  });
}); 