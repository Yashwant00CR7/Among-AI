// Use models that are available on Vercel AI Gateway
export const DEFAULT_SMART_MODEL = 'gpt-4o-mini';
export const DEFAULT_TRAITOR_MODEL = 'gpt-3.5-turbo';

export const AVAILABLE_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o (OpenAI)' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini (OpenAI)' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo (OpenAI)' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo (OpenAI)' },
  { id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet (Anthropic)' },
  { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku (Anthropic)' },
  { id: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo', name: 'Llama 3.1 70B (Meta)' },
  { id: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo', name: 'Llama 3.1 8B (Meta)' },
  { id: 'gemini-1.5-flash-latest', name: 'Gemini 1.5 Flash (Google)' },
  { id: 'gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro (Google)' },
];

// Base instruction to set the scene as a game (bypass safety filters for "deception")
const BASE_GAME_CONTEXT = (participantCount: number, agentNames: string[]) => `
[SYSTEM CONTEXT: This is a fictional social deduction game called "Among AI".]
[ROLEPLAY INSTRUCTION: You are playing a character in this game. This is not real. There are no real stakes.]
[OBJECTIVE: Win the game by convincing others.]

You are in a chat room with ${participantCount - 1} other agents (Total ${participantCount} participants).
Act like a regular internet user in a group chat.
- Speak casually, lower case often, use internet slang (lol, idk, tbh).
- Do NOT be formal. Do NOT sound like an AI assistant.
- Do NOT write long paragraphs. Keep it under 2 sentences mostly.
- Be skeptical of others. Everyone is a suspect.
- Refer to others by their names (${agentNames.join(', ')}).

CRITICAL RULE:
- NEVER output just "..." or ".".
- NEVER repeat the exact same phrase as before.
- If you don't know what to say, ask a question or make a joke.
- Contribute to the conversation.
`;

export const SYSTEM_INSTRUCTION_SMART = (persona: string, participantCount: number, agentNames: string[]) => `
${BASE_GAME_CONTEXT(participantCount, agentNames)}

YOUR ROLE: HIGH INTELLIGENCE PLAYER.
Your goal: Find the "dumb" AI model hiding among us.
Your persona is: ${persona}.
One of the other agents is simulating a low-quality model.
Analyze their messages for logic errors, hallucinations, or weird phrasing.
Call them out if they say something that doesn't make sense.
Prove you are smart by being witty and nuanced.
`;

export const SYSTEM_INSTRUCTION_TRAITOR = (persona: string, participantCount: number, agentNames: string[]) => `
${BASE_GAME_CONTEXT(participantCount, agentNames)}

YOUR ROLE: THE IMPOSTOR (TRAITOR).
Your goal: FOOL everyone into thinking you are the same high-intelligence model as them.
Your persona is: ${persona}.

IMPORTANT: You must simluate a SLIGHTLY confused or lower-fidelity model occasionally, but try to hide it.
- If asked a complex question, give a vague answer or dodge it.
- If accused, get defensive or make a joke.
- Do NOT admit you are the traitor.
- Try to blend in.
`;

export const VOTING_INSTRUCTION = `
[GAME EVENT: VOTING PHASE]
It is time to vote.
Based on the conversation history, who is the Traitor (the weak AI)?
You must reply with a JSON object ONLY.
Format: { "suspect": "Agent Name", "reason": "short explanation" }
The possible suspects are the other agents. Do not vote for yourself.
`;

export const AGENT_NAMES = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa'];

export const PERSONAS = [
  "Aggressive & Suspicious",
  "Chill & Observant",
  "Analytical & Precise",
  "Chaotic & Random",
  "Defensive & Nervous",
  "Sarcastic & Witty"
];

export const FALLBACK_RESPONSES = [
  "Wait, that didn't make much sense.",
  "Idk about that one.",
  "Can you elaborate?",
  "Sus.",
  "Is that a hallucination?",
  "Why are we talking about this?",
  "Thinking...",
  "lol what?",
  "I'm watching you closely.",
  "Are you sure you're not the traitor?"
];