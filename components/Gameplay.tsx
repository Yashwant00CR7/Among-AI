import React, { useState, useEffect, useRef } from 'react';
import { AgentConfig, AgentRole, Message, AGENT_COLORS, GameResult } from '../types';
import { AGENT_NAMES, PERSONAS } from '../constants';
import { generateAgentResponse, getAgentVote } from '../services/aiGatewayService';

interface GameplayProps {
  onGameOver: (result: GameResult) => void;
  participantCount: number;
  selectedModels: string[];
  topic: string;
}

const MAX_TURNS = 15; // Number of total messages before voting

// Model Strength Hierarchy (Higher = Stronger)
const MODEL_STRENGTH: Record<string, number> = {
  // Tier 1 (God Tier)
  'o1': 99,
  'o3-pro': 99,
  'o3-deep-research': 99,
  'gpt-5-pro': 99,
  'gpt-5.2-pro': 99,
  'o3': 99,
  'llama-4-scout': 99,
  'gpt-5.2': 99,
  'grok-3': 98,
  'llama-4-maverick': 98,
  'qwen3-max': 98,
  'qwen3-max-preview': 98,
  'claude-3-opus': 98,
  'gpt-5.1-codex-max': 98,
  'gpt-5': 98,
  'claude-opus-4.5': 98,
  'gemini-3-pro-preview': 97,
  'claude-3.7-sonnet': 97,
  'mistral-large-3': 97,
  'qwen3-coder-plus': 97,
  'sonar-reasoning-pro': 97,
  'o3-mini': 97,

  // Tier 2 (Top Tier)
  'llama-3.2-90b': 96,
  'deepseek-r1': 95,
  'claude-opus-4': 95,
  'llama-3.1-70b': 95,
  'nova-pro': 95,
  'gpt-5-chat': 95,
  'gpt-5.1-thinking': 94,
  'claude-sonnet-4.5': 94,
  'mistral-large': 94,
  'gpt-5.2-chat': 94,
  'mixtral-8x22b-instruct': 94,
  'glm-4.5': 94,
  'sonar-reasoning': 94,
  'grok-2': 94,
  'gpt-4.1': 93,
  'gemini-2.5-pro': 93,
  'qwen3-vl-thinking': 93,
  'qwen3-vl-instruct': 93,
  'grok-3-fast': 93,
  'gpt-4-turbo': 93,
  'deepseek-v3.2-thinking': 92,
  'pixtral-large': 92,
  'magistral-medium': 90,
  'morph-v3-large': 90,
  'longcat-flash-thinking': 90,
  'glm-4.5v': 90,

  // Tier 3 (High Tier)
  'gpt-5.1-instant': 89,
  'deepseek-v3.2-exp': 88,
  'deepseek-v3.2-speciale': 88,
  'grok-3-mini-fast': 88,
  'gpt-4o': 88,
  'claude-sonnet-4': 88,
  'intellect-3': 88,
  'claude-opus-4.1': 87,
  'kimi-k2-thinking-turbo': 87,
  'grok-2-vision': 87,
  'mistral-medium': 87,
  'deepseek-v3.2': 86,
  'deepseek-v3.1': 86,
  'deepseek-v3': 86,
  'qwen3-coder-30b-a3b': 86,
  'deepseek-v3.1-terminus': 85,
  'grok-4.1-fast-reasoning': 85,
  'nova-lite': 85,
  'codestral': 85,
  'command-a': 85,
  'codex-mini': 85,
  'grok-4-fast-reasoning': 84,
  'nova-2-lite': 84,
  'mistral-nemo': 82,

  // Tier 4 (Mid Tier)
  'gpt-5.1-codex': 80,
  'llama-3.2-11b': 80,
  'gpt-5-mini': 79,
  'kimi-k2-thinking': 79,
  'gpt-4.1-mini': 78,
  'gpt-4o-mini': 78,
  'gpt-3.5-turbo': 78,
  'gpt-3.5-turbo-instruct': 78,
  'o4-mini': 77,
  'gemini-2.5-flash-image': 77,
  'claude-3.5-haiku': 77,
  'gemini-2.5-flash': 76,
  'sonar-pro': 76,
  'gemini-2.5-flash-preview': 75,
  'claude-haiku-4.5': 75,
  'qwen3-coder': 75,
  'qwen-3-235b': 75,
  'ministral-14b': 75,
  'magistral-small': 75,
  'devstral-small': 75,
  'gpt-5-codex': 74,
  'qwen-3-14b': 74,
  'grok-code-fast-1': 72,
  'pixtral-12b': 72,
  'sonoma-sky-alpha': 72,
  'nemotron-nano-12b-v2': 70,
  'devstral-2': 70,
  'morph-v3-fast': 70,

  // Tier 5 (Low Tier)
  'gpt-5.1-codex-mini': 69,
  'kimi-k2-0905': 69,
  'gemini-2.5-flash-lite': 69,
  'llama-3.3-70b': 68,
  'gemini-2.0-flash': 68,
  'mercury-coder-small': 68,
  'gemini-2.0-flash-lite': 67,
  'grok-3-mini': 67,
  'glm-4.6': 66,
  'glm-4.5-air': 66,
  'minimax-m2': 65,
  'mistral-small': 65,
  'claude-3-haiku': 65,
  'glm-4.6v-flash': 65,
  'ministral-8b': 65,
  'kimi-k2-turbo': 65,
  'grok-4': 64,
  'llama-3.2-3b': 64,
  'sonar': 63,
  'gpt-oss-120b': 62,
  'grok-4.1-fast-non-reasoning': 61,
  'grok-4-fast-non-reasoning': 60,
  'nova-micro': 60,

  // Tier 6 (Weak/Efficient - Traitor Candidates)
  'gpt-oss-20b': 58,
  'gemini-2.5-flash-lite-preview': 57,
  'gpt-5-nano': 55,
  'llama-3.1-8b': 55,
  'kimi-k2': 55,
  'kat-coder-pro-v1': 55,
  'devstral-small-2': 55,
  'trinity-mini': 55,
  'sonoma-dusk-alpha': 55,
  'gpt-4.1-nano': 50,
  'qwen-3-32b': 50,
  'qwen-3-30b': 48,
  'v0-1.5-md': 50,
  'ministral-3b': 45,
  'longcat-flash-chat': 45,
  'v0-1.0-md': 45,
  'llama-3.2-1b': 45,
  'nemotron-nano-9b-v2': 45,
  'gpt-oss-safeguard-20b': 40,
};

export const Gameplay: React.FC<GameplayProps> = ({ onGameOver, participantCount, selectedModels, topic }) => {
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [turnCount, setTurnCount] = useState(0);
  const [status, setStatus] = useState<string>("Initializing Simulation...");
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const gameActiveRef = useRef(true);
  const messagesRef = useRef<Message[]>([]); // Ref to keep track of messages inside async loop
  const hasStartedRef = useRef(false); // Prevent double initialization from React StrictMode

  // Initialize Game
  useEffect(() => {
    // Prevent double initialization in StrictMode
    if (hasStartedRef.current) {
      console.log('⚠️ Skipping duplicate game initialization (React StrictMode)');
      return;
    }
    hasStartedRef.current = true;
    gameActiveRef.current = true;

    // 1. Assign Roles based on Model Strength
    // The weakest model should be the Traitor.
    const modelStrengths = selectedModels.map(modelId => ({
      id: modelId,
      strength: MODEL_STRENGTH[modelId] ?? 0 // Default to 0 if unknown
    }));

    // Find the minimum strength value
    const minStrength = Math.min(...modelStrengths.map(m => m.strength));

    // Find all indices that share this minimum strength (in case of ties)
    const weakestIndices = modelStrengths
      .map((m, index) => (m.strength === minStrength ? index : -1))
      .filter(index => index !== -1);

    // Randomly select one of the weakest agents to be the Traitor
    const traitorIndex = weakestIndices[Math.floor(Math.random() * weakestIndices.length)];

    const roles = selectedModels.map((_, index) =>
      index === traitorIndex ? AgentRole.TRAITOR : AgentRole.SMART
    );

    // Shuffle personas
    const extendedPersonas = [];
    while (extendedPersonas.length < participantCount) {
      extendedPersonas.push(...PERSONAS);
    }
    const shuffledPersonas = extendedPersonas.slice(0, participantCount).sort(() => 0.5 - Math.random());

    const newAgents: AgentConfig[] = roles.map((role, index) => ({
      id: `agent-${index}`,
      name: AGENT_NAMES[index % AGENT_NAMES.length], // Cycle names if we run out
      role: role,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${index}&backgroundColor=transparent`,
      model: selectedModels[index], // Use the specific model selected for this agent slot
      color: Object.values(AGENT_COLORS)[index % Object.values(AGENT_COLORS).length], // Cycle colors
      persona: shuffledPersonas[index]
    }));

    setAgents(newAgents);

    const initialMsg = {
      id: 'system-start',
      senderId: 'system',
      text: `Protocol Start. Subject topic: "${topic}" Discuss.`,
      timestamp: Date.now()
    };

    setMessages([initialMsg]);
    messagesRef.current = [initialMsg];
    setStatus("Connecting agents to environment...");

    // Start the automated loop with error handling
    startGameLoop(newAgents).catch(error => {
      console.error('❌ Game loop crashed:', error);
      setStatus(`ERROR: ${error.message}`);
    });

    // Cleanup only runs when component unmounts (not on StrictMode double-render)
    return () => {
      console.log('🧹 Cleanup: Setting gameActiveRef to false');
      gameActiveRef.current = false;
      hasStartedRef.current = false;
    };
  }, [participantCount, selectedModels]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 100);
    }
  }, [messages, currentSpeaker]);

  const startGameLoop = async (currentAgents: AgentConfig[]) => {
    console.log('🎮 Game loop started with agents:', currentAgents.map(a => a.name));
    let turns = 0;

    // Initial delay
    await new Promise(r => setTimeout(r, 1000));

    // Agent Loop
    while (turns < MAX_TURNS && gameActiveRef.current) {
      setStatus(`Sequence ${turns + 1}/${MAX_TURNS}: Processing inputs...`);

      // Smart picking: Don't let the same person speak twice in a row if possible
      const lastSpeakerId = messagesRef.current[messagesRef.current.length - 1]?.senderId;
      const candidates = currentAgents.filter(a => a.id !== lastSpeakerId);
      const speaker = candidates.length > 0
        ? candidates[Math.floor(Math.random() * candidates.length)]
        : currentAgents[Math.floor(Math.random() * currentAgents.length)];

      setCurrentSpeaker(speaker.name);

      // Simulate "thinking" time (Randomized but faster)
      await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));

      if (!gameActiveRef.current) break;

      const responseText = await generateAgentResponse(speaker, currentAgents, messagesRef.current, topic);

      const newMsg: Message = {
        id: `${Date.now()}-${speaker.id}`,
        senderId: speaker.id,
        text: responseText,
        timestamp: Date.now()
      };

      // Update state and ref
      setMessages(prev => {
        const updated = [...prev, newMsg];
        messagesRef.current = updated;
        return updated;
      });
      setTurnCount(turns + 1);

      setCurrentSpeaker(null);
      turns++;
    }

    if (gameActiveRef.current) {
      handleVoting(currentAgents, messagesRef.current);
    }
  };

  const handleVoting = async (currentAgents: AgentConfig[], history: Message[]) => {
    setStatus("SIMULATION PAUSED. CALCULATING CONSENSUS...");
    setCurrentSpeaker("Voting System");

    // All agents vote simultaneously
    const votePromises = currentAgents.map(agent => getAgentVote(agent, currentAgents, messagesRef.current, topic));
    const agentVotes = await Promise.all(votePromises);

    // Tally votes
    const voteCounts: Record<string, number> = {};
    agentVotes.forEach(v => {
      if (v.accusedId !== 'unknown') {
        voteCounts[v.accusedId] = (voteCounts[v.accusedId] || 0) + 1;
      }
    });

    // Find elimination target (Highest votes)
    let maxVotes = 0;
    let eliminatedId: string | null = null;

    Object.entries(voteCounts).forEach(([id, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        eliminatedId = id;
      }
    });

    const traitor = currentAgents.find(a => a.role === AgentRole.TRAITOR);
    if (!traitor) return;

    // Win Logic
    let winner: 'SMART' | 'TRAITOR' = 'TRAITOR';
    if (eliminatedId === traitor.id) {
      winner = 'SMART';
    }

    // Calculate Scores for fun
    const scores: Record<string, number> = {};
    currentAgents.forEach(agent => {
      let score = 0;
      const myVote = agentVotes.find(v => v.voterId === agent.id);

      if (agent.role === AgentRole.SMART) {
        if (myVote?.accusedId === traitor.id) score += 100; // Correctly identified traitor
        if (winner === 'SMART') score += 50; // Team win bonus
      } else {
        // Traitor
        if (winner === 'TRAITOR') score += 200; // Survival bonus
        // Deception bonus: Points for every smart agent that voted wrong
        agentVotes.forEach(v => {
          if (v.voterId !== agent.id && v.accusedId !== agent.id) score += 50;
        });
      }
      scores[agent.name] = score;
    });

    setCurrentSpeaker(null);
    onGameOver({
      winner,
      traitorId: traitor.id,
      eliminatedId,
      reason: winner === 'SMART'
        ? "Consensus Reached. The low-fidelity model was successfully identified."
        : "Evaluation Failed. The Traitor successfully mimicked high-fidelity behavior.",
      agentVotes,
      scores,
      smartModel: "Mixed", // Deprecated
      traitorModel: traitor.model, // Store the actual traitor model
      agentModels: currentAgents.reduce((acc, agent) => {
        acc[agent.name] = agent.model;
        return acc;
      }, {} as Record<string, string>)
    });
  };

  return (
    <div className="flex flex-col h-full gap-4 p-2 md:p-4">
      {/* Status Bar */}
      <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400 shadow-inner backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
          <span className="font-bold tracking-wider">STATUS: RUNNING</span>
        </div>
        <span className="uppercase tracking-wide hidden md:inline font-semibold text-blue-600 dark:text-blue-400">{status}</span>
      </div>

      {/* Agents Visuals */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 p-4 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-y-auto max-h-[30vh] md:max-h-none backdrop-blur-sm transition-colors">
        {agents.map((agent) => (
          <div key={agent.id} className="relative group">
            <div className={`
                p-3 rounded-xl border flex flex-col items-center justify-between h-full transition-all duration-300
                ${agent.color}
                ${currentSpeaker === agent.name
                ? 'ring-2 ring-blue-500 dark:ring-blue-400 scale-[1.02] shadow-lg bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-500/30'
                : 'bg-white/90 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 opacity-80 hover:opacity-100'}
             `}>
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <img
                    src={agent.avatarUrl}
                    alt={agent.name}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-slate-100 dark:bg-slate-700 p-1 border border-slate-200 dark:border-slate-600 transition-transform duration-300 shadow-sm"
                    style={{ transform: currentSpeaker === agent.name ? 'scale(1.1)' : 'scale(1)' }}
                  />
                  {currentSpeaker === agent.name && (
                    <div className="absolute -top-1 -right-1 flex gap-0.5 bg-white dark:bg-slate-800 rounded-full p-1 shadow-sm border border-slate-100 dark:border-slate-600">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-100" />
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-200" />
                    </div>
                  )}
                </div>
                <div className="text-center w-full">
                  <span className={`block font-bold text-sm md:text-base truncate ${currentSpeaker === agent.name ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                    {agent.name}
                  </span>
                  <span className="block text-[10px] md:text-xs text-slate-500 dark:text-slate-400 italic truncate max-w-full px-1">
                    {agent.persona.split('&')[0]}
                  </span>
                </div>
              </div>

              {currentSpeaker === agent.name && (
                <div className="mt-2 w-16 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-pulse mx-auto shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Log */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-white/60 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 space-y-6 shadow-inner scroll-smooth backdrop-blur-md"
      >
        {messages.map((msg) => {
          const isSystem = msg.senderId === 'system';
          const sender = agents.find(a => a.id === msg.senderId);

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-6">
                <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-mono rounded-full border border-slate-200 dark:border-slate-700 uppercase tracking-widest text-center shadow-sm">
                  {msg.text}
                </span>
              </div>
            )
          }

          // Visual alternating
          const align = sender && agents.indexOf(sender) % 2 === 0 ? 'justify-start' : 'justify-end';
          const isRight = align === 'justify-end';

          return (
            <div
              key={msg.id}
              className={`flex w-full ${align} animate-fadeIn group`}
            >
              <div className={`max-w-[85%] md:max-w-[75%] flex flex-col ${isRight ? 'items-end' : 'items-start'}`}>
                {sender && (
                  <span className={`text-[10px] font-bold mb-1 mx-2 uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2`}>
                    {sender.name}
                    <span className="font-normal normal-case text-slate-300 dark:text-slate-600">|</span>
                    <span className="font-normal normal-case opacity-70">{sender.model}</span>
                  </span>
                )}
                <div className={`
                  px-5 py-3.5 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm break-words w-full border backdrop-blur-sm
                  transition-all duration-200 hover:shadow-md
                  ${isRight
                    ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 border-blue-100 dark:border-blue-800/50 text-slate-800 dark:text-slate-100 rounded-br-sm'
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-bl-sm'}
                `}>
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {currentSpeaker && currentSpeaker !== 'Voting System' && (
          <div className="flex justify-center mt-4">
            <div className="bg-white dark:bg-slate-800 px-5 py-2.5 rounded-full border border-slate-100 dark:border-slate-700 flex items-center gap-3 shadow-lg animate-pulse ring-1 ring-slate-900/5 dark:ring-white/10">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wide">
                {currentSpeaker} is thinking...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700/50 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          style={{ width: `${(turnCount / MAX_TURNS) * 100}%` }}
        />
      </div>
    </div>
  );
};