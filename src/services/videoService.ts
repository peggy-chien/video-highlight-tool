import axios from 'axios';
import type { VideoProcessingData } from '../models/video';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

// Mock API call to simulate video processing
export const processVideo = async (file: File): Promise<VideoProcessingData> => {
  if (USE_MOCK_API) {
    // Use GET for mock JSON
    const response = await axios.get(`${API_BASE_URL}/videoProcess.json`);
    return response.data;
  } else {
    // Use POST for real backend
    const formData = new FormData();
    formData.append('video', file);
    const response = await axios.post(`${API_BASE_URL}/videoProcess`, formData);
    return response.data;
  }
}; 