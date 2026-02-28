
export interface Detection {
  box: [number, number, number, number]; // [x1, y1, x2, y2]
  label: string;
  score: number;
}

export interface PredictionResult {
  detections: Detection[];
  inferenceTime?: number;
}

export interface GeminiAnalysis {
  summary: string;
  detailedInsights: string;
}
