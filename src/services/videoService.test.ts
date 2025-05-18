import { it, expect, describe, vi, beforeEach } from 'vitest';
import axios from 'axios';

// Mock import.meta before importing videoService
vi.mock('import.meta', () => ({
  env: {
    VITE_API_BASE_URL: 'http://localhost:3000/mock',
    VITE_USE_MOCK_API: 'false'
  }
}));

// Now import the service after env is set up
import { processVideo } from './videoService';
import type { VideoProcessingData } from '../models/video';

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}));

describe('videoService', () => {
  const mockData: VideoProcessingData = {
    fullTranscript: 'Hello world.',
    sections: [
      {
        title: 'Section 1',
        sentences: [
          {
            id: 's1',
            text: 'Hello world.',
            startTime: 0,
            endTime: 1.5,
            isSuggestedHighlight: true,
          },
        ],
      },
    ]
  };

  const file = new File(['dummy'], 'video.mp4', { type: 'video/mp4' });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch mock data with GET when VITE_USE_MOCK_API is true', async () => {
    // Set mock API mode
    vi.mocked(import.meta).env.VITE_USE_MOCK_API = 'true';
    // Reset modules and re-import videoService to get the new environment value
    vi.resetModules();
    const { processVideo } = await import('./videoService');
    
    vi.mocked(axios.get).mockResolvedValueOnce({ data: mockData });

    const result = await processVideo(file);

    expect(axios.get).toHaveBeenCalledWith(`${import.meta.env.VITE_API_BASE_URL}/videoProcess.json`);
    expect(result).toEqual(mockData);
  });

  it('should POST to real backend when VITE_USE_MOCK_API is false', async () => {
    // Ensure real API mode
    vi.mocked(import.meta).env.VITE_USE_MOCK_API = 'false';
    // Reset modules and re-import videoService to get the new environment value
    vi.resetModules();
    const { processVideo } = await import('./videoService');
    
    vi.mocked(axios.post).mockResolvedValue({ data: mockData });

    const result = await processVideo(file);

    expect(axios.post).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_BASE_URL}/videoProcess`,
      expect.any(FormData)
    );
    expect(result).toEqual(mockData);
  });

  it('should handle API errors gracefully', async () => {
    const error = new Error('API Error');
    vi.mocked(axios.post).mockRejectedValue(error);

    await expect(processVideo(file)).rejects.toThrow('API Error');
  });
});