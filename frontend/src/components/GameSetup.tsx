import { useState } from 'react';
import { motion } from 'framer-motion';
import type { GameSettings } from '../types/GameState';


interface GameSetupProps {
  onStartGame: (settings: GameSettings) => void;
}

const CATEGORIES = [
  { id: '', name: 'Any Category' },
  { id: '9', name: 'General Knowledge' },
  { id: '10', name: 'Entertainment: Books' },
  { id: '11', name: 'Entertainment: Film' },
  { id: '12', name: 'Entertainment: Music' },
  { id: '17', name: 'Science & Nature' },
  { id: '18', name: 'Science: Computers' },
  { id: '21', name: 'Sports' },
  { id: '22', name: 'Geography' },
  { id: '23', name: 'History' },
];

const DIFFICULTY_OPTIONS = [
  { level: 'easy' as const, emoji: '😊', color: 'from-green-500 to-emerald-600' },
  { level: 'medium' as const, emoji: '🤔', color: 'from-yellow-500 to-orange-600' },
  { level: 'hard' as const, emoji: '😤', color: 'from-red-500 to-pink-600' },
  { level: 'random' as const, emoji: '🎲', color: 'from-purple-500 to-indigo-600' }
];

export default function GameSetup({ onStartGame }: GameSetupProps) {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'random'>('easy');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState(10);

  const handleStart = () => {
    onStartGame({ difficulty, category, amount });
  };

  return (
    <motion.div 
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-3xl font-bold text-white">Game Setup</h2>
        </div>

        <div className="space-y-6">
          {/* Difficulty Selection */}
          <div>
            <label className="block text-blue-200 font-semibold mb-3 text-lg">
              🎯 Difficulty Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {DIFFICULTY_OPTIONS.map(({ level, emoji, color }) => (
                <motion.button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`p-4 rounded-xl font-semibold transition-all duration-200 ${
                    difficulty === level
                      ? `bg-gradient-to-r ${color} text-white transform scale-105 shadow-lg`
                      : 'bg-white/20 text-blue-100 hover:bg-white/30 hover:scale-102'
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}  // Lift up slightly on hover
                  whileTap={{ scale: 0.95 }}           // Shrink slightly when clicked
                >
                  {emoji} {level.charAt(0).toUpperCase() + level.slice(1)}
                </motion.button>
              ))}
            </div>
            {difficulty === 'random' && (
              <p className="text-blue-300 text-sm mt-2 text-center">
                🎲 Questions will be mixed across all difficulty levels!
              </p>
            )}
          </div>
          

          {/* Category Selection */}
          <div>
            <label className="block text-blue-200 font-semibold mb-3 text-lg">
              📚 Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-4 rounded-xl bg-white/20 text-white border border-white/30 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-gray-800 text-white">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block text-blue-200 font-semibold mb-3 text-lg">
              ❓ Number of Questions: <span className="text-white font-bold">{amount}</span>
            </label>
            <input
              type="range"
              min="5"
              max="20"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-blue-300 text-sm mt-1">
              <span>5 questions</span>
              <span>20 questions</span>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-3 text-lg transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
             Start Quiz
          </button>
        </div>
      </div>
    </div>
    </motion.div>
  );
}