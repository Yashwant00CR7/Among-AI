import React, { useState } from 'react';
import { Lobby } from './components/Lobby';
import { Gameplay } from './components/Gameplay';
import { ResultView } from './components/ResultView';
import { GameState, GameResult } from './types';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.LOBBY);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-5xl mx-auto p-4 md:p-8 h-screen flex flex-col">
        {/* Header - Lab Interface Style */}
        <header className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 bg-white/50 backdrop-blur-sm px-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Turing Traitor <span className="text-slate-400 font-light">| Evaluation Protocol</span>
              </h1>
              <p className="text-xs text-slate-500 font-mono">MULTI-AGENT SOCIAL DEDUCTION ENVIRONMENT</p>
            </div>
          </div>
          <div className="hidden md:block">
             <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
               v2.1.0 STABLE
             </span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 relative overflow-hidden flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200">
          {gameState === GameState.LOBBY && (
            <Lobby onStart={startGame} />
          )}
          
          {gameState === GameState.PLAYING && (
            <Gameplay onGameOver={endGame} />
          )}

          {gameState === GameState.GAME_OVER && gameResult && (
            <ResultView result={gameResult} onReset={resetGame} />
          )}
        </main>
      </div>
    </div>
  );
}