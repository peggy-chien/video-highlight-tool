import axios from 'axios';
import type { VideoProcessingData } from '../models/video';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Mock API call to simulate video processing
export const processVideo = async (file: File): Promise<VideoProcessingData> => {
  // In a real app, this would be an actual API call
  // For now, we'll just return the mock data using POST for future readiness
  const formData = new FormData();
  formData.append('video', file);
  const response = await axios.post<VideoProcessingData>(`${API_BASE_URL}/videoProcess.json`, formData);
  return response.data;
}; 