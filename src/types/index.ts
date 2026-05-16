export type Technique = 'zero-shot' | 'few-shot' | 'chain-of-thought';

export interface PromptExample {
  id: string;
  input: string;
  output: string;
}

export interface RefinedPromptResult {
  precision: number;
  analysis: string;
  refinedPrompt: string;
  components: {
    role: string;
    task: string;
    context: string;
    format: string;
  };
  suggestions: string[];
}

export interface SavedPrompt {
  id: string;
  timestamp: number;
  original: string;
  refined: string;
  technique: Technique;
  result: RefinedPromptResult;
  name: string;
}
