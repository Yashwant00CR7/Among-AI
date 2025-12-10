import React, { useState, useEffect, useRef } from 'react';
import { AgentConfig, AgentRole, Message, AGENT_COLORS, GameResult } from '../types';
import { SMART_MODEL, TRAITOR_MODEL, AGENT_NAMES, PERSONAS } from '../constants';
import { generateAgentResponse, getAgentVote } from '../services/aiGatewayService';

interface GameplayProps {
  onGameOver: (result: GameResult) => void;
}

const MAX_TURNS = 15; // Number of total messages before voting

export const Gameplay: React.FC<GameplayProps> = ({ onGameOver }) => {
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

    // 1. Assign Roles & Personas
    const roles = [AgentRole.SMART, AgentRole.SMART, AgentRole.TRAITOR];
    // Shuffle roles
    for (let i = roles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [roles[i], roles[j]] = [roles[j], roles[i]];
    }

    // Shuffle personas
    const shuffledPersonas = [...PERSONAS].sort(() => 0.5 - Math.random());

    const newAgents: AgentConfig[] = roles.map((role, index) => ({
      id: `agent-${index}`,
      name: AGENT_NAMES[index],
      role: role,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${index}&backgroundColor=transparent`,
      model: role === AgentRole.SMART ? SMART_MODEL : TRAITOR_MODEL,
      color: Object.values(AGENT_COLORS)[index],
      persona: shuffledPersonas[index]
    }));

    setAgents(newAgents);

    const initialMsg = {
      id: 'system-start',
      senderId: 'system',
      text: 'Protocol Start. Subject topic: "Is AI actually conscious?" Discuss.',
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
  }, []);

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
    console.log('🔍 gameActiveRef.current:', gameActiveRef.current);
    console.log('🔍 MAX_TURNS:', MAX_TURNS);
    let turns = 0;

    // Initial delay
    console.log('⏳ Waiting 1 second before starting...');
    await new Promise(r => setTimeout(r, 1000));
    console.log('✅ Initial delay complete, entering main loop...');
    console.log('🔍 About to enter while loop - turns:', turns, 'MAX_TURNS:', MAX_TURNS, 'gameActiveRef:', gameActiveRef.current);

    // Agent Loop
    while (turns < MAX_TURNS && gameActiveRef.current) {
      console.log(`🔄 Turn ${turns + 1}/${MAX_TURNS} starting`);
      setStatus(`Sequence ${turns + 1}/${MAX_TURNS}: Processing inputs...`);

      // Smart picking: Don't let the same person speak twice in a row if possible
      const lastSpeakerId = messagesRef.current[messagesRef.current.length - 1]?.senderId;
      const candidates = currentAgents.filter(a => a.id !== lastSpeakerId);
      const speaker = candidates.length > 0
        ? candidates[Math.floor(Math.random() * candidates.length)]
        : currentAgents[Math.floor(Math.random() * currentAgents.length)];

      console.log(`🗣️ Speaker selected: ${speaker.name} (${speaker.role})`);
      setCurrentSpeaker(speaker.name);

      // Simulate "thinking" time (Randomized but faster)
      await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));

      if (!gameActiveRef.current) break;

      console.log(`📡 Requesting response from ${speaker.name}...`);
      const responseText = await generateAgentResponse(speaker, currentAgents, messagesRef.current);
      console.log(`✅ ${speaker.name} responded: ${responseText}`);

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
    const votePromises = currentAgents.map(agent => getAgentVote(agent, currentAgents, history));
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
      scores
    });
  };

  return (
    <div className="flex flex-col h-full gap-4 p-2 md:p-4">
      {/* Status Bar */}
      <div className="bg-slate-100 border border-slate-200 p-3 rounded-lg flex items-center justify-between text-xs font-mono text-slate-600 shadow-inner">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="font-bold">STATUS: RUNNING</span>
        </div>
        <span className="uppercase tracking-wide hidden md:inline">{status}</span>
      </div>

      {/* Agents Visuals */}
      <div className="grid grid-cols-3 gap-3 md:gap-6 p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
        {agents.map((agent) => (
          <div key={agent.id} className="relative group">
            <div className={`
                p-4 rounded-xl border flex flex-col items-center justify-between h-full transition-all duration-300
                ${agent.color}
                ${currentSpeaker === agent.name ? 'ring-2 ring-blue-400 scale-[1.03] shadow-md bg-white' : 'bg-white opacity-90'}
             `}>
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <img
                    src={agent.avatarUrl}
                    alt={agent.name}
                    className="w-12 h-12 md:w-20 md:h-20 rounded-lg bg-slate-100 p-1 border border-slate-200 transition-transform duration-300"
                    style={{ transform: currentSpeaker === agent.name ? 'scale(1.05)' : 'scale(1)' }}
                  />
                  {currentSpeaker === agent.name && (
                    <div className="absolute -top-1 -right-1 flex gap-0.5 bg-white rounded-full p-1 shadow-sm border border-slate-100">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-100" />
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-200" />
                    </div>
                  )}
                </div>
                <div className="text-center w-full">
                  <span className="block font-bold text-slate-800 text-sm md:text-base truncate">{agent.name}</span>
                  <span className="block text-[10px] md:text-xs text-slate-500 italic truncate">{agent.persona.split('&')[0]}</span>
                </div>
              </div>

              {currentSpeaker === agent.name && (
                <div className="mt-2 w-12 h-0.5 bg-blue-400 rounded-full animate-pulse mx-auto"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Log */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-inner scroll-smooth"
      >
        {messages.map((msg) => {
          const isSystem = msg.senderId === 'system';
          const sender = agents.find(a => a.id === msg.senderId);

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-6">
                <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-mono rounded-full border border-slate-200 uppercase tracking-widest text-center">
                  {msg.text}
                </span>
              </div>
            )
          }

          // Visual alternating
          const align = sender && agents.indexOf(sender) % 2 === 0 ? 'justify-start' : 'justify-end';

          return (
            <div
              key={msg.id}
              className={`flex w-full ${align} animate-fadeIn group`}
            >
              <div className={`max-w-[85%] md:max-w-[75%] flex flex-col ${align === 'justify-end' ? 'items-end' : 'items-start'}`}>
                {sender && (
                  <span className={`text-[10px] font-bold mb-1 mx-2 uppercase tracking-wider text-slate-400`}>
                    {sender.name}
                  </span>
                )}
                <div className={`
                  px-5 py-3 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm break-words w-full
                  border
                  ${align === 'justify-end'
                    ? 'bg-blue-50 border-blue-100 text-slate-800 rounded-br-sm'
                    : 'bg-white border-slate-100 text-slate-700 rounded-bl-sm hover:border-slate-300 transition-colors'}
                `}>
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {currentSpeaker && currentSpeaker !== 'Voting System' && (
          <div className="flex justify-center mt-2 opacity-70">
            <div className="bg-slate-50 px-4 py-2 rounded-full border border-slate-100 flex items-center gap-2 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
              </div>
              <span className="text-xs text-slate-400 font-mono uppercase tracking-wide">
                {currentSpeaker} is processing
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
        <div
          className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
          style={{ width: `${(turnCount / MAX_TURNS) * 100}%` }}
        />
      </div>
    </div>
  );
};