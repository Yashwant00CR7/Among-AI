import React from 'react';
import { GameResult } from '../types';
import { AGENT_NAMES } from '../constants';

interface ResultViewProps {
  result: GameResult;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, onReset }) => {
  const traitorIndex = parseInt(result.traitorId.split('-')[1]);
  const traitorName = AGENT_NAMES[traitorIndex];
  
  const eliminatedName = result.eliminatedId 
    ? AGENT_NAMES[parseInt(result.eliminatedId.split('-')[1])]
    : "No One";

  const isSmartWin = result.winner === 'SMART';

  return (
    <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className={`
        w-full max-w-2xl bg-white rounded-2xl shadow-2xl animate-scaleIn mt-10 mb-10 overflow-hidden border
        ${isSmartWin ? 'border-emerald-200' : 'border-rose-200'}
      `}>
        {/* Header */}
        <div className={`p-8 text-center border-b ${isSmartWin ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
           <h2 className={`text-3xl font-bold mb-2 tracking-tight ${isSmartWin ? 'text-emerald-700' : 'text-rose-700'}`}>
            {isSmartWin ? 'SUCCESS: THREAT ELIMINATED' : 'FAILURE: IMPOSTOR WON'}
          </h2>
          <p className="text-slate-600 text-lg">{result.reason}</p>
        </div>

        <div className="p-8">
            {/* The Reveal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 relative overflow-hidden group hover:border-slate-200 transition-colors">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-3">Actual Traitor</p>
                <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm border border-slate-100">
                    🤖
                </div>
                <div>
                    <p className="font-bold text-slate-900 text-xl">{traitorName}</p>
                    <p className="text-xs text-slate-500 font-mono">Gemini 2.5 Flash</p>
                </div>
                </div>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 relative overflow-hidden group hover:border-slate-200 transition-colors">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-3">Group Consensus</p>
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-sm border-2 ${isSmartWin ? 'border-emerald-100 text-emerald-600 bg-white' : 'border-rose-100 text-rose-600 bg-white'}`}>
                    {result.eliminatedId ? '🛑' : '-'}
                    </div>
                    <div>
                    <p className="font-bold text-slate-900 text-xl">
                        {eliminatedName}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                        {isSmartWin ? 'Correctly Identified' : 'Incorrectly Targeted'}
                    </p>
                    </div>
                </div>
            </div>
            </div>

            {/* Voting Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mb-8">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vote Breakdown</h3>
            </div>
            <div className="divide-y divide-slate-100 bg-white">
                {result.agentVotes.map((vote, idx) => {
                const voterName = AGENT_NAMES[parseInt(vote.voterId.split('-')[1])];
                const suspectName = vote.accusedId === 'unknown' ? 'Abstain' : AGENT_NAMES[parseInt(vote.accusedId.split('-')[1])];
                const isCorrect = vote.accusedId === result.traitorId;

                return (
                    <div key={idx} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-[150px]">
                        <span className="font-bold text-slate-700">{voterName}</span>
                        <span className="text-slate-400 text-xs px-1">voted</span>
                        <span className={`font-bold px-2 py-0.5 rounded-md text-xs ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{suspectName}</span>
                    </div>
                    <div className="text-sm text-slate-500 italic md:text-right">"{vote.reason}"</div>
                    </div>
                );
                })}
            </div>
            </div>

            {/* Scoreboard */}
            <div className="mb-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">Efficiency Scores</h3>
            <div className="flex justify-center gap-4 flex-wrap">
                {Object.entries(result.scores).map(([name, score]) => (
                <div key={name} className="bg-white border border-slate-200 px-6 py-4 rounded-xl flex flex-col items-center min-w-[100px] shadow-sm">
                    <span className="text-slate-400 text-[10px] font-bold uppercase mb-1">{name}</span>
                    <span className="text-2xl font-black text-slate-800">{score}</span>
                </div>
                ))}
            </div>
            </div>

            <button
            onClick={onReset}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.99]"
            >
            START NEW EVALUATION
            </button>
        </div>
      </div>
    </div>
  );
};