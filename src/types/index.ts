export interface PromptHistoryEntry {
  id: string;
  roughPrompt: string;
  platform: string;
  refinedPrompt: string;
  timestamp: number;
  photoBackground?: string;
  photoElements?: string;
  photoColorPalette?: string;
  photoStyle?: string;
}

export interface PromptSuggestion {
  title: string;
  description: string;
  platform: string;
}

export interface PromptCategory {
  name: string;
  icon?: React.ElementType;
  examples: PromptSuggestion[];
}
