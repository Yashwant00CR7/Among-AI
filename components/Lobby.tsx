import React from 'react';

interface LobbyProps {
  onStart: () => void;
}

export const Lobby: React.FC<LobbyProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 text-center animate-fadeIn p-6 bg-slate-50/50">
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
          Protocol: Three agents. One Impostor. <br/>
          Observe the conversation between two high-fidelity models and one lower-parameter model attempting to mimic them.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-8">
        {[
          { title: "Conversation", icon: "💬", desc: "Agents generate multi-turn dialogue autonomously." },
          { title: "Analysis", icon: "📊", desc: "Models evaluate peer output for inconsistencies." },
          { title: "Consensus", icon: "🗳️", desc: "Automated voting system removes the outlier." }
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200 p-6 rounded-xl hover:shadow-lg transition-all duration-300 group">
            <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all">{item.icon}</div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
            <p className="text-sm text-slate-500 leading-snug">{item.desc}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="mt-10 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-xl flex items-center gap-2"
      >
        <span>RUN SIMULATION</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>
      
      <p className="text-xs text-slate-400 font-mono mt-4">Powered by Gemini 2.5 Flash & 3.0 Pro</p>
    </div>
  );
};