import React from 'react';
import { GameResult } from '../types';
import { AGENT_NAMES, AVAILABLE_MODELS } from '../constants';

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

  // Helper to get model display name
  const getModelName = (modelId: string) => {
    const model = AVAILABLE_MODELS.find(m => m.id === modelId);
    return model ? model.name : modelId;
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className={`
          w-full max-w-2xl bg-white rounded-2xl shadow-2xl animate-scaleIn my-8 overflow-hidden border
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
                    <p className="text-xs text-slate-500 font-mono">{getModelName(result.traitorModel)}</p>
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

            {/* Rankings */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">Model Performance Rankings</h3>
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-3 bg-slate-50 px-6 py-3 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <div className="text-center">Rank</div>
                  <div className="text-left">Agent</div>
                  <div className="text-right">Score</div>
                </div>
                <div className="divide-y divide-slate-100">
                  {Object.entries(result.scores)
                    .sort(([, scoreA], [, scoreB]) => (scoreB as number) - (scoreA as number))
                    .map(([name, score], index) => {
                      const rank = index + 1;
                      let rankColor = "text-slate-500";
                      let bgColor = "bg-white";

                      if (rank === 1) {
                        rankColor = "text-amber-500";
                        bgColor = "bg-amber-50/50";
                      } else if (rank === 2) {
                        rankColor = "text-slate-400";
                      } else if (rank === 3) {
                        rankColor = "text-orange-400";
                      }

                      // Retrieve the specific model used by this agent
                      const modelId = result.agentModels ? result.agentModels[name] : 'Unknown';
                      const modelName = getModelName(modelId);

                      return (
                        <div key={name} className={`grid grid-cols-3 px-6 py-4 items-center ${bgColor}`}>
                          <div className={`text-center font-black text-xl ${rankColor}`}>
                            {rank === 1 ? '👑' : `#${rank}`}
                          </div>
                          <div className="text-left font-bold text-slate-700">
                            {name}
                            <div className="text-[10px] text-slate-400 font-mono font-normal mt-0.5">{modelName}</div>
                          </div>
                          <div className="text-right font-mono text-slate-600 font-medium">
                            {score} pts
                          </div>
                        </div>
                      );
                    })}
                </div>
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
    </div>
  );
};