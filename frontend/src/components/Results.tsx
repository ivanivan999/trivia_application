import Confetti from 'react-confetti';
// import { useWindowSize } from 'react-use';
import type { GameState } from '../types/GameState';


interface ResultsProps {
  gameState: GameState;
  onRestart: () => void;
}

export default function Results({ gameState, onRestart }: ResultsProps) {
  // const { width, height } = useWindowSize();
  const percentage = Math.round((gameState.correctAnswers / gameState.questions.length) * 100);

  // Calculate difficulty success rates
  const getDifficultyStats = () => {
    if (!gameState.questionBreakdown) return null;
    
    const stats = [];
    const difficulties = [
      { key: 'easy', emoji: '😊', color: 'text-green-400' },
      { key: 'medium', emoji: '🤔', color: 'text-yellow-400' },
      { key: 'hard', emoji: '😤', color: 'text-red-400' }
    ];

    for (const diff of difficulties) {
      const data = gameState.questionBreakdown[diff.key as keyof typeof gameState.questionBreakdown];
      if (data && data.total > 0) {
        const rate = Math.round((data.correct / data.total) * 100);
        stats.push({
          ...diff,
          rate,
          correct: data.correct,
          total: data.total
        });
      }
    }

    return stats;
  };

  // Calculate category success rates
  const getCategoryStats = () => {
    if (!gameState.categoryBreakdown) return [];
    
    return Object.entries(gameState.categoryBreakdown)
      .map(([category, data]) => ({
        category,
        rate: Math.round((data.correct / data.total) * 100),
        correct: data.correct,
        total: data.total
      }))
      .sort((a, b) => b.rate - a.rate); // Sort by success rate
  };

  const difficultyStats = getDifficultyStats();
  const categoryStats = getCategoryStats();

  return (
    <div className="max-w-4xl mx-auto">
      <Confetti
        width={Math.min(window.innerWidth, document.documentElement.clientWidth)}
        height={window.innerHeight}
      />
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
        <h2 className="text-4xl font-bold text-white mb-2">Quiz Complete!</h2>
        
        {/* Main Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-2">🎯 Final Score</h3>
            <p className="text-3xl font-bold text-yellow-400">{gameState.score}</p>
            <p className="text-blue-200">points</p>
          </div>

          <div className="bg-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-2">📊 Accuracy</h3>
            <p className="text-3xl font-bold text-green-400">{percentage}%</p>
            <p className="text-blue-200">{gameState.correctAnswers} of {gameState.questions.length} correct</p>
          </div>
        </div>

        {/* Difficulty Performance */}
        {difficultyStats && difficultyStats.length > 0 && (
          <div className="bg-white/20 rounded-xl p-6 mb-6">
            <h3 className="text-2xl font-bold text-white mb-4">Performance by Difficulty</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {difficultyStats.map((stat) => (
                <div key={stat.key} className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl">{stat.emoji}</span>
                    <span className="text-white font-semibold capitalize">{stat.key}</span>
                  </div>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.rate}%</p>
                  <p className="text-blue-200 text-sm">{stat.correct}/{stat.total} correct</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Performance */}
        {categoryStats.length > 0 && (
          <div className="bg-white/20 rounded-xl p-6 mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Performance by Category</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {categoryStats.map((stat, index) => (
                <div key={stat.category} className="bg-white/10 rounded-lg p-4 flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-white font-semibold">{stat.category}</p>
                    <p className="text-blue-200 text-sm">{stat.correct}/{stat.total} questions</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${
                      stat.rate >= 80 ? 'text-green-400' :
                      stat.rate >= 60 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {stat.rate}%
                    </p>
                    {index === 0 && stat.rate === 100 && (
                      <span className="text-yellow-400 text-sm">🌟 Perfect!</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Special Messages */}
        {gameState.difficulty === 'random' && (
          <div className="bg-purple-500/20 border border-purple-400/30 rounded-xl p-4 mb-6">
            <p className="text-purple-200">
              🎲 <strong>Random Mode Completed!</strong> You tackled questions from multiple difficulty levels!
            </p>
          </div>
        )}

        {percentage === 100 && (
          <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-4 mb-6">
            <p className="text-yellow-200">
              🎉 <strong>Perfect Score!</strong> You answered every question correctly!
            </p>
          </div>
        )}

        <button
          onClick={onRestart}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-4 px-8 rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 text-lg transform hover:scale-105"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}