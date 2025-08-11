export interface GameState {
  screen: 'setup' | 'quiz' | 'results';
  difficulty: 'easy' | 'medium' | 'hard' | 'random';
  category: string;
  amount: number;
  questions: any[];
  currentQuestion: number;
  score: number;
  correctAnswers: number;
  questionBreakdown?: {
    easy: { correct: number; total: number };
    medium: { correct: number; total: number };
    hard: { correct: number; total: number };
  };
  categoryBreakdown?: {
    [categoryName: string]: { correct: number; total: number };
  };
}

export type GameSettings = Pick<GameState, 'difficulty' | 'category' | 'amount'>;