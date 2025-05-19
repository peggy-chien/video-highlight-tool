import { render, screen, fireEvent } from '@testing-library/react';
import PreviewArea from './PreviewArea';

// Mock the child components
vi.mock('./VideoPlayer', () => ({
  default: () => <div data-testid="video-player" />
}));

vi.mock('./VideoControls', () => ({
  default: ({ disabled }: { disabled: boolean }) => (
    <div data-testid="video-controls" data-disabled={disabled} />
  ),
}));

vi.mock('./TimelineBar', () => ({
  default: () => <div data-testid="timeline-bar" />
}));

// Mock the hooks
const mockHandlePlayPause = vi.fn();
const mockHandlePrevHighlight = vi.fn();
const mockHandleNextHighlight = vi.fn();

vi.mock('../hooks/useVideoHighlights', () => ({
  useVideoHighlights: () => ({
    handlePlayPause: mockHandlePlayPause,
    handlePrevHighlight: mockHandlePrevHighlight,
    handleNextHighlight: mockHandleNextHighlight,
  }),
}));

// Mock useVideoStore
const mockVideoFile = vi.fn();
vi.mock('../store/videoStore', () => ({
  useVideoStore: (selector: (state: { videoFile: File | null }) => unknown) => 
    selector({ videoFile: mockVideoFile() }),
}));

describe('PreviewArea', () => {
  const mockVideoRef = { current: document.createElement('video') };
  
  beforeEach(() => {
    vi.clearAllMocks();
    mockVideoFile.mockReturnValue(null);
  });

  it('renders all components correctly', () => {
    render(<PreviewArea videoRef={mockVideoRef} />);
    
    expect(screen.getByText('Preview Area')).toBeInTheDocument();
    expect(screen.getByTestId('video-player')).toBeInTheDocument();
    expect(screen.getByTestId('video-controls')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-bar')).toBeInTheDocument();
  });

  it('disables video controls when no video file is present', () => {
    render(<PreviewArea videoRef={mockVideoRef} />);
    
    const videoControls = screen.getByTestId('video-controls');
    expect(videoControls).toHaveAttribute('data-disabled', 'true');
  });

  it('enables video controls when video file is present', () => {
    mockVideoFile.mockReturnValue(new File([], 'test.mp4'));
    
    render(<PreviewArea videoRef={mockVideoRef} />);
    
    const videoControls = screen.getByTestId('video-controls');
    expect(videoControls).toHaveAttribute('data-disabled', 'false');
  });

  it('handles keyboard events correctly', () => {
    render(<PreviewArea videoRef={mockVideoRef} />);

    // Test Space key
    fireEvent.keyDown(window, { code: 'Space' });
    expect(mockHandlePlayPause).toHaveBeenCalledTimes(1);

    // Test ArrowLeft key
    fireEvent.keyDown(window, { code: 'ArrowLeft' });
    expect(mockHandlePrevHighlight).toHaveBeenCalledTimes(1);

    // Test ArrowRight key
    fireEvent.keyDown(window, { code: 'ArrowRight' });
    expect(mockHandleNextHighlight).toHaveBeenCalledTimes(1);
  });

  it('ignores keyboard events when focus is on input elements', () => {
    render(<PreviewArea videoRef={mockVideoRef} />);
    
    // Create and focus an input element
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    // Try to trigger space key with the input as the target
    fireEvent.keyDown(input, { code: 'Space' });
    expect(mockHandlePlayPause).not.toHaveBeenCalled();

    // Cleanup
    document.body.removeChild(input);
  });
}); 