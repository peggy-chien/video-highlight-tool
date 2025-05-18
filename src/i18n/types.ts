export interface TranslationSchema {
  common: {
    mobile: string;
    desktop: string;
    suggested: string;
    error: string;
    networkError: string;
    unsupportedFile: string;
  };
  transcript: {
    timestamp: string;
    editingArea: {
      title: string;
      sentencesSelected: string;
      changeVideo: string;
      pickAnotherVideo: string;
      uploadVideo: string;
      uploadError: string;
    };
  };
  video: {
    controls: {
      play: string;
      pause: string;
      next: string;
      previous: string;
    };
  };
} 