import React, { useEffect } from 'react';
import { AVAILABLE_MODELS } from '../constants';

interface LobbyProps {
  onStart: () => void;
  participantCount: number;
  setParticipantCount: (count: number) => void;
  selectedModels: string[];
  setSelectedModels: (models: string[]) => void;
  topic: string;
  setTopic: (topic: string) => void;
}

export const Lobby: React.FC<LobbyProps> = ({
  onStart,
  participantCount,
  setParticipantCount,
  selectedModels,
  setSelectedModels,
  topic,
  setTopic
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
    <div className="flex flex-col items-center justify-center h-full space-y-8 text-center animate-fadeIn p-6 overflow-y-auto">
      <div className="space-y-4 max-w-2xl">
        <div className="inline-block p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4 shadow-lg shadow-blue-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Initialize <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">Model Evaluation</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed max-w-xl mx-auto">
          Protocol: {participantCount} agents. <br />
          Assign a specific AI model to each agent to evaluate their performance in a social deduction setting.
        </p>

        {/* Guidelines / How it works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mx-auto mt-8 mb-8 text-left">
          <div className="bg-white/50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors backdrop-blur-sm">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-4xl font-black text-slate-900 dark:text-white">01</span>
            </div>
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-3 text-blue-600 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Configuration</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Select AI models. The system secretly assigns the <span className="font-semibold text-blue-600 dark:text-blue-400">weakest model</span> as the Impostor.
            </p>
          </div>

          <div className="bg-white/50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors backdrop-blur-sm">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-4xl font-black text-slate-900 dark:text-white">02</span>
            </div>
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-3 text-blue-600 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Observation</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Watch the debate. Look for hallucinations, inconsistencies, or odd phrasing.
            </p>
          </div>

          <div className="bg-white/50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors backdrop-blur-sm">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-4xl font-black text-slate-900 dark:text-white">03</span>
            </div>
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-3 text-blue-600 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Consensus</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Agents vote to eliminate. If the <span className="font-semibold text-blue-600 dark:text-blue-400">Impostor</span> is caught, Smart models win.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl flex flex-col gap-6">
        {/* Topic Selection */}
        <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-left backdrop-blur-sm">
          <label htmlFor="topic-input" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Conversation Topic
          </label>
          <input
            id="topic-input"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Is AI actually conscious?"
            className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
          />
        </div>

        {/* Participant Count Control */}
        <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-sm">
          <label htmlFor="participant-count" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">
            Number of Participants: <span className="text-blue-600 dark:text-blue-400 text-lg ml-1">{participantCount}</span>
          </label>
          <input
            id="participant-count"
            type="range"
            min="3"
            max="10"
            value={participantCount}
            onChange={(e) => setParticipantCount(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500"
          />
          <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-2 font-mono">
            <span>3</span>
            <span>10</span>
          </div>
        </div>

        {/* Model Assignment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {Array.from({ length: participantCount }).map((_, idx) => (
            <div key={idx} className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-2 backdrop-blur-sm transition-all hover:bg-white/80 dark:hover:bg-slate-800/80">
              <label htmlFor={`model-select-${idx}`} className="text-sm font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                <span>Agent {idx + 1}</span>
                <span className="text-xs font-normal text-slate-400">Model Selector</span>
              </label>
              <select
                id={`model-select-${idx}`}
                value={selectedModels[idx] || AVAILABLE_MODELS[0].id}
                onChange={(e) => handleModelChange(idx, e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
        className="mt-6 px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 flex items-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <span>INITIATE SIMULATION</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
        </svg>
      </button>

      <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-4">Powered by Vercel AI Gateway</p>
    </div>
  );
};