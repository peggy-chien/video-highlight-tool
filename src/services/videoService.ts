import axios from 'axios';
import type { VideoProcessingData } from '../models/video';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Mock API call to simulate video processing
export const processVideo = async (_file: File): Promise<VideoProcessingData> => {
  // In a real app, this would be an actual API call
  // For now, we'll just return the mock data
  const response = await axios.get<VideoProcessingData>(`${API_BASE_URL}/videoProcess.json`);
  return response.data;
}; 