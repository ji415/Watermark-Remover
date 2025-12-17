export interface ProcessedImage {
  original: string; // Base64 or URL
  processed: string; // Base64 or URL
  timestamp: number;
}

export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface GeminiError {
  message: string;
  details?: string;
}
