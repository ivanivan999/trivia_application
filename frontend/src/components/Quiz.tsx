import { useState, useEffect, useRef } from 'react';
import type { GameState } from '../types/GameState';
import { Fireworks } from '@fireworks-js/react';

interface QuizProps {
  gameState: GameState;
  setGameState: (fn: (prev: GameState) => GameState) => void;
  onGameEnd: (score: number, correctCount: number) => void;
}

export default function Quiz({ gameState, setGameState, onGameEnd }: QuizProps) {
  const [loading, setLoading] = useState(true);
  const [_selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showWinMessage, setShowWinMessage] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  // Track which questions have been answered to prevent double counting
  const answeredQuestions = useRef(new Set<number>());

  // Define win condition - user wins after getting 70% of questions correct
  const winThreshold = Math.ceil(gameState.amount * 0.7);

  // Fetch questions when component mounts
  useEffect(() => {
    fetchQuestions();
  }, []);

  // Check for win condition whenever correctAnswers changes
  useEffect(() => {
    if (gameState.correctAnswers >= winThreshold && !hasWon) {
      setShowWinMessage(true);
      setHasWon(true);
    }
  }, [gameState.correctAnswers, winThreshold, showWinMessage]);

  const fetchQuestions = async () => {
    try {
      const { difficulty, category, amount } = gameState;
      let apiUrl = `/api/trivia?amount=${amount}&difficulty=${difficulty}`;
      
      if (category) {
        apiUrl += `&category=${category}`;
      }

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.questions && data.questions.length > 0) {
        setGameState(prev => ({
          ...prev,
          questions: data.questions,
          questionBreakdown: {
            easy: { correct: 0, total: 0 },
            medium: { correct: 0, total: 0 },
            hard: { correct: 0, total: 0 }
          },
          categoryBreakdown: {}
        }));
        setLoading(false);
        // Reset answered questions tracking
        answeredQuestions.current.clear();
      } else {
        console.error('No questions received:', data);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    // Prevent multiple submissions for the same question
    if (showResult || answeredQuestions.current.has(gameState.currentQuestion)) {
      return;
    }
    
    // Mark this question as answered
    answeredQuestions.current.add(gameState.currentQuestion);
    
    const currentQuestion = gameState.questions[gameState.currentQuestion];
    const correct = answer === currentQuestion.correct_answer;
    
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowResult(true);

    // Update metrics and scoring
    setGameState(prev => {
      const questionDifficulty = currentQuestion.difficulty as 'easy' | 'medium' | 'hard';
      const questionCategory = currentQuestion.category;

      // Ensure we have proper breakdown structures with defaults
      const defaultQuestionBreakdown = {
        easy: { correct: 0, total: 0 },
        medium: { correct: 0, total: 0 },
        hard: { correct: 0, total: 0 }
      };

      // Create a safe copy of questionBreakdown
      const existingQuestionBreakdown = prev.questionBreakdown || defaultQuestionBreakdown;
      const newQuestionBreakdown = {
        easy: { ...existingQuestionBreakdown.easy },
        medium: { ...existingQuestionBreakdown.medium },
        hard: { ...existingQuestionBreakdown.hard }
      };

      // Update the specific difficulty
      if (newQuestionBreakdown[questionDifficulty]) {
        newQuestionBreakdown[questionDifficulty].total++;
        if (correct) {
          newQuestionBreakdown[questionDifficulty].correct++;
        }
      }

      const newCategoryBreakdown = {
      ...(prev.categoryBreakdown || {}),
      [questionCategory]: {
        correct: ((prev.categoryBreakdown && prev.categoryBreakdown[questionCategory]?.correct) || 0) + (correct ? 1 : 0),
        total: ((prev.categoryBreakdown && prev.categoryBreakdown[questionCategory]?.total) || 0) + 1,
      },
    };

      // Calculate points based on actual question difficulty
      let points = 10;
      if (questionDifficulty === 'easy') points = 10;
      else if (questionDifficulty === 'medium') points = 20;
      else if (questionDifficulty === 'hard') points = 30;

      return {
        ...prev,
        score: correct ? prev.score + points : prev.score,
        correctAnswers: correct ? prev.correctAnswers + 1 : prev.correctAnswers,
        questionBreakdown: newQuestionBreakdown,
        categoryBreakdown: newCategoryBreakdown
      };
    });
  };

  const nextQuestion = () => {
    const nextIndex = gameState.currentQuestion + 1;
    
    if (nextIndex < gameState.questions.length) {
      setGameState(prev => ({
        ...prev,
        currentQuestion: nextIndex
      }));
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      onGameEnd(gameState.score, gameState.correctAnswers);
    }
  };

  const handleWinContinue = () => {
    setShowWinMessage(false);
    setShowResult(false);
    setSelectedAnswer('');
    nextQuestion();
  };

  const handleWinFinish = () => {
    onGameEnd(gameState.score, gameState.correctAnswers);
  };

  // Win condition modal
  if (showWinMessage) {
    return (
      <div className="max-w-4xl mx-auto relative">
        <div className="absolute inset-0 pointer-events-none">
          <Fireworks
            options={{
              rocketsPoint: {
                min: 0,
                max: 100
              },
              hue: {
                min: 0,
                max: 360
              },
              delay: {
                min: 30,
                max: 60
              },
              acceleration: 1.05,
              friction: 0.95,
              gravity: 1.5,
              particles: 50,
              // trace: 3,
              explosion: 5
            }}
            style={{
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              position: 'fixed',
              background: 'transparent',
              zIndex: 1
            }}
          />
        </div>
        <div className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 backdrop-blur-md rounded-2xl p-8 border border-yellow-400/30 text-center">
          <h2 className="text-4xl font-bold text-yellow-400 mb-4">Congratulations!</h2>
          <p className="text-2xl text-white mb-4">You've achieved the win condition!</p>
          <p className="text-lg text-yellow-200 mb-6">
            You got <span className="font-bold text-yellow-400">{gameState.correctAnswers}</span> out of{' '}
            <span className="font-bold">{winThreshold}</span> questions needed to win!
          </p>
          
          <div className="bg-white/20 rounded-xl p-6 mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">🎯 Current Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-green-400">{gameState.correctAnswers}</p>
                <p className="text-blue-200">Correct Answers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-yellow-400">{gameState.score}</p>
                <p className="text-blue-200">Current Score</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            {gameState.currentQuestion + 1 < gameState.questions.length ? (
              <>
                <button
                  onClick={handleWinContinue}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200"
                >
                  Continue Playing
                </button>
                <button
                  onClick={handleWinFinish}
                  className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold py-3 px-8 rounded-xl hover:from-yellow-600 hover:to-orange-700 transition-all duration-200"
                >
                  Finish as Winner
                </button>
              </>
            ) : (
              <button
                onClick={handleWinFinish}
                className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold py-3 px-8 rounded-xl hover:from-yellow-600 hover:to-orange-700 transition-all duration-200"
              >
                Finish Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-white mb-2">Loading Questions...</h2>
        <p className="text-blue-200">Fetching {gameState.amount} {gameState.difficulty} questions</p>
      </div>
    );
  }

  if (!gameState.questions.length) {
    return (
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
        <h2 className="text-2xl font-bold text-red-400 mb-4">❌ No Questions Available</h2>
        <p className="text-white mb-6">Unable to fetch questions. Please try again.</p>
        <button 
          onClick={() => setGameState(prev => ({ ...prev, screen: 'setup' }))}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
        >
          Back to Setup
        </button>
      </div>
    );
  }

  const currentQuestion = gameState.questions[gameState.currentQuestion];
  const progress = ((gameState.currentQuestion + 1) / gameState.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar with Win Condition Info */}
      <div className="mb-6">
        <div className="flex justify-between text-white mb-2">
          <span>Question {gameState.currentQuestion + 1} of {gameState.questions.length}</span>
          <span>Score: {gameState.score}</span>
        </div>
        <div className="flex justify-between text-sm text-blue-300 mb-2">
          <span>Correct: {gameState.correctAnswers}</span>
          <span>Win at: {winThreshold} correct</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        {/* Question */}
        <div className="text-center mb-4">
          <p className="text-sm text-blue-300 mb-2">
            {currentQuestion.category} • {currentQuestion.difficulty.toUpperCase()}
            {gameState.difficulty === 'random' && (
              <span className="ml-2 px-2 py-1 bg-purple-500/20 rounded-full text-purple-300">
                🎲 Random Mode
              </span>
            )}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Answers or Result */}
        {!showResult ? (
          <div className="grid gap-4 mt-8">
            {currentQuestion.all_answers.map((answer: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswer(answer)}
                className="p-4 text-left bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-200 border border-white/30 hover:border-white/50"
              >
                <span className="font-semibold text-blue-300">{String.fromCharCode(65 + index)}.</span> {answer}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center mt-8">
            <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-xl mb-6 ${
              isCorrect ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
            }`}>
              <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
              <span className="text-xl font-bold">
                {isCorrect ? 'Correct!' : 'Incorrect!'}
              </span>
            </div>

            <p className="text-white mb-4">
              <strong>Correct Answer:</strong> {currentQuestion.correct_answer}
            </p>

            {/* Show points earned for this question */}
            {isCorrect && (
              <p className="text-green-300 mb-4">
                <strong>Points Earned:</strong> {
                  currentQuestion.difficulty === 'easy' ? 10 :
                  currentQuestion.difficulty === 'medium' ? 20 : 30
                } points
              </p>
            )}

            <button
              onClick={nextQuestion}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200"
            >
              {gameState.currentQuestion + 1 < gameState.questions.length ? 'Next Question' : 'Finish Quiz'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}