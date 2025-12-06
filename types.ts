export interface AnalysisResult {
  translation: string;
  vibeCheck: string;
  proTip: string;
  flavorProfile?: string;
}

export interface LoadingState {
  isLoading: boolean;
  message: string;
}