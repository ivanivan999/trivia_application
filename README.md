# Trivia Application

A full-stack trivia game built with Next.js backend and React + Vite frontend, featuring animated UI elements and comprehensive quiz analytics.

## 🎮 Features

- **Multiple Difficulty Levels**: Easy, Medium, Hard, or Random mix
- **Category Selection**: Choose from 10+ trivia categories or any category
- **Win Conditions**: Achieve victory by answering 70% of questions correctly
- **Animated UI**: Smooth animations powered by Framer Motion
- **Celebration Effects**: 
  - Fireworks for win conditions
  - Confetti for quiz completion
- **Detailed Analytics**: 
  - Performance breakdown by difficulty
  - Category-specific statistics
  - Real-time scoring system
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🛠️ Tech Stack

### Backend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Open Trivia Database API** for question data

### Frontend  
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Confetti** for celebration effects
- **@fireworks-js/react** for win celebrations

### Deployment
- **Vercel** for hosting
- **npm workspaces** for monorepo management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ivanivan999/trivia_application.git
cd trivia_application
```

2. Install dependencies:
```bash
npm install
```

3. Start development servers:

**Backend (Port 3001):**
```bash
npm run dev:backend
```

**Frontend (Port 5173):**
```bash
npm run dev:frontend
```

4. Open your browser and navigate to `http://localhost:5173`

### Production Build

```bash
# Build both frontend and backend
npm run build

# Start production servers
npm run start:backend
npm run start:frontend
```

## 🎯 How to Play

1. **Setup**: Choose difficulty level, category, and number of questions (5-20)
2. **Play**: Answer multiple-choice questions with real-time feedback
3. **Win Condition**: Get 70% correct answers to trigger victory celebration
4. **Results**: View detailed performance analytics with confetti celebration

## 📊 Game Mechanics

- **Scoring System**: 
  - Easy: 10 points
  - Medium: 20 points  
  - Hard: 30 points
- **Win Threshold**: 70% accuracy
- **Question Range**: 5-20 questions per game
- **Categories**: General Knowledge, Science, Entertainment, Sports, Geography, History, and more

## 🎨 UI/UX Features

- **Smooth Transitions**: Page and component animations
- **Visual Feedback**: Color-coded difficulty indicators
- **Progress Tracking**: Real-time progress bar and statistics
- **Celebration Effects**: Dynamic fireworks and confetti based on performance
- **Responsive Design**: Optimized for all screen sizes

## 📂 Project Structure

```
trivia_application/
├── backend/          # Next.js API backend
│   ├── src/
│   │   └── app/
│   │       └── api/  # API routes
├── frontend/         # React + Vite frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   └── types/       # TypeScript definitions
├── shared/           # Shared utilities
└── package.json      # Workspace configuration
```

## 🌐 Live Demo

Visit the live application: [Trivia Application on Vercel](https://your-app-url.vercel.app)


## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Open Trivia Database](https://opentdb.com/) for providing free trivia questions
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [React Confetti](https://github.com/alampros/react-confetti) for celebration effects

---

**Built with ❤️ by [Ivan](https://github.com/ivanivan999)**