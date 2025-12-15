import React, { useState } from 'react';
import { Lobby } from './components/Lobby';
import { Gameplay } from './components/Gameplay';
import { ResultView } from './components/ResultView';
import { GameState, GameResult } from './types';
import { AVAILABLE_MODELS } from './constants';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.LOBBY);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [participantCount, setParticipantCount] = useState<number>(3);
  // Initialize with default models for 3 participants
  const [selectedModels, setSelectedModels] = useState<string[]>(
    Array(3).fill(AVAILABLE_MODELS[0].id)
  );
  const [topic, setTopic] = useState<string>("Is AI actually conscious?");

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const startGame = () => {
    setGameState(GameState.PLAYING);
    setGameResult(null);
  };

  const endGame = (result: GameResult) => {
    setGameResult(result);
    setGameState(GameState.GAME_OVER);
  };

  const resetGame = () => {
    setGameState(GameState.LOBBY);
    setGameResult(null);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ease-in-out
      ${isDarkMode
        ? 'bg-slate-900 text-slate-100 selection:bg-blue-500 selection:text-white'
        : 'bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900'}
    `}>
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob
          ${isDarkMode ? 'bg-purple-900' : 'bg-purple-300'}`}></div>
        <div className={`absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000
          ${isDarkMode ? 'bg-blue-900' : 'bg-blue-300'}`}></div>
        <div className={`absolute top-[40%] left-[40%] w-[60%] h-[60%] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000
          ${isDarkMode ? 'bg-indigo-900' : 'bg-indigo-300'}`}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-4 md:p-6 h-screen flex flex-col">
        {/* Header */}
        <header className={`
          flex items-center justify-between mb-6 pb-4 px-6 py-4 rounded-2xl shadow-sm border
          backdrop-blur-md transition-all duration-300
          ${isDarkMode
            ? 'bg-slate-900/60 border-slate-700/50'
            : 'bg-white/60 border-white/50'}
        `}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 transform hover:scale-105 transition-transform duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <div>
              <h1 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Among AI
              </h1>
              <p className={`text-xs font-mono tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                MULTI-AGENT SOCIAL DEDUCTION
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2.5 rounded-xl transition-all duration-300 shadow-sm border
                ${isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700'
                  : 'bg-white border-slate-200 text-orange-500 hover:bg-slate-50'}
              `}
              title="Toggle Theme"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
              )}
            </button>

            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">v2.3.0 Live</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className={`
          flex-1 relative overflow-hidden flex flex-col rounded-3xl shadow-2xl transition-all duration-300
          ${isDarkMode
            ? 'bg-slate-800/50 border-slate-700/50 backdrop-blur-xl'
            : 'bg-white/70 border-white/60 backdrop-blur-xl'}
          border
        `}>
          {gameState === GameState.LOBBY && (
            <Lobby
              onStart={startGame}
              participantCount={participantCount}
              setParticipantCount={setParticipantCount}
              selectedModels={selectedModels}
              setSelectedModels={setSelectedModels}
              topic={topic}
              setTopic={setTopic}
            />
          )}

          {gameState === GameState.PLAYING && (
            <Gameplay
              onGameOver={endGame}
              participantCount={participantCount}
              selectedModels={selectedModels}
              topic={topic}
            />
          )}

          {gameState === GameState.GAME_OVER && gameResult && (
            <ResultView result={gameResult} onReset={resetGame} />
          )}
        </main>
      </div>
    </div>
  );
}