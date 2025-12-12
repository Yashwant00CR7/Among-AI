export enum GameState {
  LOBBY = 'LOBBY',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}

export enum AgentRole {
  SMART = 'SMART',
  TRAITOR = 'TRAITOR'
}

export interface AgentConfig {
  id: string;
  name: string;
  role: AgentRole;
  avatarUrl: string;
  model: string;
  color: string;
  persona: string; // e.g., "Skeptical", "Friendly", "Aggressive"
}

export interface Message {
  id: string;
  senderId: string; // 'system' or agent ID
  text: string;
  timestamp: number;
}

export interface AgentVote {
  voterId: string;
  accusedId: string;
  reason: string;
}

export interface GameResult {
  winner: 'SMART' | 'TRAITOR';
  traitorId: string;
  eliminatedId: string | null; // Who got the most votes
  reason: string;
  agentVotes: AgentVote[];
  scores: Record<string, number>; // Points for everyone
  smartModel: string;
  traitorModel: string;
  agentModels: Record<string, string>; // Map of agent name to model ID
}

// Colors for UI consistency (Light Theme optimized)
// Backgrounds are subtle, borders are distinct, text is dark
export const AGENT_COLORS = {
  A: 'text-indigo-700 border-indigo-200 bg-indigo-50',
  B: 'text-amber-700 border-amber-200 bg-amber-50',
  C: 'text-emerald-700 border-emerald-200 bg-emerald-50',
  D: 'text-rose-700 border-rose-200 bg-rose-50',
  E: 'text-cyan-700 border-cyan-200 bg-cyan-50',
  F: 'text-fuchsia-700 border-fuchsia-200 bg-fuchsia-50',
  G: 'text-lime-700 border-lime-200 bg-lime-50',
  H: 'text-violet-700 border-violet-200 bg-violet-50',
  I: 'text-orange-700 border-orange-200 bg-orange-50',
  J: 'text-teal-700 border-teal-200 bg-teal-50'
};