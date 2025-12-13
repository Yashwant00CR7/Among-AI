import React, { useEffect } from 'react';
import { AVAILABLE_MODELS } from '../constants';

interface LobbyProps {
  onStart: () => void;
  participantCount: number;
  setParticipantCount: (count: number) => void;
  selectedModels: string[];
  setSelectedModels: (models: string[]) => void;
}

export const Lobby: React.FC<LobbyProps> = ({
  onStart,
  participantCount,
  setParticipantCount,
  selectedModels,
  setSelectedModels
}) => {

  // Ensure selectedModels length matches participantCount
  useEffect(() => {
    if (selectedModels.length !== participantCount) {
      const newModels = [...selectedModels];
      if (newModels.length < participantCount) {
        // Add default models if count increased
        const toAdd = participantCount - newModels.length;
        for (let i = 0; i < toAdd; i++) {
          newModels.push(AVAILABLE_MODELS[0].id);
        }
      } else {
        // Trim if count decreased
        newModels.splice(participantCount);
      }
      setSelectedModels(newModels);
    }
  }, [participantCount, selectedModels, setSelectedModels]);

  const handleModelChange = (index: number, modelId: string) => {
    const newModels = [...selectedModels];
    newModels[index] = modelId;
    setSelectedModels(newModels);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 text-center animate-fadeIn p-6 bg-slate-50/50 overflow-y-auto">
      <div className="space-y-4 max-w-2xl">
        <div className="inline-block p-3 rounded-full bg-blue-100 text-blue-600 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          Initialize <span className="text-blue-600">Model Evaluation</span>
        </h2>
        <p className="text-slate-600 text-lg leading-relaxed max-w-xl mx-auto">
          Protocol: {participantCount} agents. <br />
          Assign a specific AI model to each agent to evaluate their performance in a social deduction setting.
        </p>
      </div>

      <div className="w-full max-w-3xl flex flex-col gap-6">
        {/* Participant Count Control */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <label htmlFor="participant-count" className="block text-sm font-medium text-slate-700 mb-2">
            Number of Participants: <span className="font-bold text-blue-600">{participantCount}</span>
          </label>
          <input
            id="participant-count"
            type="range"
            min="3"
            max="10"
            value={participantCount}
            onChange={(e) => setParticipantCount(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
            <span>3</span>
            <span>10</span>
          </div>
        </div>

        {/* Model Assignment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {Array.from({ length: participantCount }).map((_, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
              <label htmlFor={`model-select-${idx}`} className="text-sm font-bold text-slate-700">
                Agent {idx + 1} Model
              </label>
              <select
                id={`model-select-${idx}`}
                value={selectedModels[idx] || AVAILABLE_MODELS[0].id}
                onChange={(e) => handleModelChange(idx, e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                {AVAILABLE_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onStart}
        className="mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-xl flex items-center gap-2"
      >
        <span>RUN SIMULATION</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>

      <p className="text-xs text-slate-400 font-mono mt-4">Powered by Vercel AI Gateway</p>
    </div>
  );
};