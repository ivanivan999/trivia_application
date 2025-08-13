import { useState } from 'react';
import type { GameState, GameSettings } from './types/GameState';
import GameSetup from './components/GameSetup';
import Quiz from './components/Quiz';
import Results from './components/Results';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    screen: 'setup',
    difficulty: 'easy',
    category: '',
    amount: 10,
    questions: [],
    currentQuestion: 0,
    score: 0,
    correctAnswers: 0
  });

  const startGame = (settings: GameSettings) => {
    setGameState(prev => ({
      ...prev,
      ...settings,
      screen: 'quiz'
    }));
  };

  const endGame = (finalScore: number, correctCount: number) => {
    setGameState(prev => ({
      ...prev,
      screen: 'results',
      score: finalScore,
      correctAnswers: correctCount
    }));
  };

  const restartGame = () => {
    setGameState({
      screen: 'setup',
      difficulty: 'easy',
      category: '',
      amount: 10,
      questions: [],
      currentQuestion: 0,
      score: 0,
      correctAnswers: 0,
      // Clear the breakdown data
      questionBreakdown: undefined,
      categoryBreakdown: undefined
    });
  };

  return (
    <div className="min-h-screen bg-grid">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">Trivia Challenge</h1>
          <p className="text-blue-200 text-lg">Test your knowledge across different topics!</p>
        </header>

        {gameState.screen === 'setup' && (
          <GameSetup onStartGame={startGame} />
        )}

        {gameState.screen === 'quiz' && (
          <Quiz 
            gameState={gameState}
            setGameState={setGameState}
            onGameEnd={endGame}
          />
        )}

        {gameState.screen === 'results' && (
          <Results 
            gameState={gameState}
            onRestart={restartGame}
          />
        )}
      </div>
    </div>
  );
}

export default App;