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
}

// Colors for UI consistency (Light Theme optimized)
// Backgrounds are subtle, borders are distinct, text is dark
export const AGENT_COLORS = {
  A: 'text-indigo-700 border-indigo-200 bg-indigo-50',
  B: 'text-amber-700 border-amber-200 bg-amber-50',
  C: 'text-emerald-700 border-emerald-200 bg-emerald-50'
};