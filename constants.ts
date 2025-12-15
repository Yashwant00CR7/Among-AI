// Use models that are available on Vercel AI Gateway
export const DEFAULT_SMART_MODEL = 'gpt-5';
export const DEFAULT_TRAITOR_MODEL = 'gpt-4.1-nano';

export const AVAILABLE_MODELS = [
  // Tier 1: Flagships
  { id: 'o1', name: 'o1' },
  { id: 'o3-pro', name: 'o3 Pro' },
  { id: 'o3-deep-research', name: 'o3 Deep Research' },
  { id: 'gpt-5-pro', name: 'GPT-5 Pro' },
  { id: 'gpt-5.2-pro', name: 'GPT-5.2 Pro' },
  { id: 'gpt-5.2', name: 'GPT-5.2' },
  { id: 'gpt-5', name: 'GPT-5' },
  { id: 'o3', name: 'o3' },
  { id: 'o3-mini', name: 'o3 Mini' },
  { id: 'grok-3', name: 'Grok 3' },
  { id: 'llama-4-scout', name: 'Llama 4 Scout' },
  { id: 'llama-4-maverick', name: 'Llama 4 Maverick' },
  { id: 'claude-opus-4.5', name: 'Claude Opus 4.5' },
  { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro Preview' },
  { id: 'claude-3.7-sonnet', name: 'Claude 3.7 Sonnet' },
  { id: 'qwen3-max', name: 'Qwen 3 Max' },
  { id: 'qwen3-max-preview', name: 'Qwen 3 Max Preview' },
  { id: 'gpt-5.1-codex-max', name: 'GPT-5.1 Codex Max' },
  { id: 'mistral-large-3', name: 'Mistral Large 3' },
  { id: 'sonar-reasoning-pro', name: 'Sonar Reasoning Pro' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus' },

  // Tier 2: High Performance
  { id: 'gpt-5-chat', name: 'GPT-5 Chat' },
  { id: 'gpt-5.2-chat', name: 'GPT-5.2 Chat' },
  { id: 'gpt-5.1-thinking', name: 'GPT-5.1 Thinking' },
  { id: 'gpt-5.1-instant', name: 'GPT-5.1 Instant' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
  { id: 'gpt-4.1', name: 'GPT-4.1' },
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'claude-sonnet-4.5', name: 'Claude Sonnet 4.5' },
  { id: 'claude-sonnet-4', name: 'Claude Sonnet 4' },
  { id: 'claude-opus-4.1', name: 'Claude Opus 4.1' },
  { id: 'claude-opus-4', name: 'Claude Opus 4' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
  { id: 'deepseek-v3.2-thinking', name: 'DeepSeek v3.2 Thinking' },
  { id: 'deepseek-v3.2', name: 'DeepSeek v3.2' },
  { id: 'deepseek-r1', name: 'DeepSeek R1' },
  { id: 'mistral-large', name: 'Mistral Large' },
  { id: 'mixtral-8x22b-instruct', name: 'Mixtral 8x22B Instruct' },
  { id: 'grok-3-fast', name: 'Grok 3 Fast' },
  { id: 'grok-2', name: 'Grok 2' },
  { id: 'qwen3-vl-thinking', name: 'Qwen 3 VL Thinking' },
  { id: 'qwen3-vl-instruct', name: 'Qwen 3 VL Instruct' },
  { id: 'qwen3-coder-plus', name: 'Qwen 3 Coder Plus' },
  { id: 'pixtral-large', name: 'Pixtral Large' },
  { id: 'llama-3.1-70b', name: 'Llama 3.1 70B' },
  { id: 'llama-3.2-90b', name: 'Llama 3.2 90B' },
  { id: 'nova-pro', name: 'Nova Pro' },
  { id: 'glm-4.5', name: 'GLM 4.5' },
  { id: 'glm-4.5v', name: 'GLM 4.5v' },
  { id: 'sonar-reasoning', name: 'Sonar Reasoning' },

  // Tier 3: Balanced / Fast
  { id: 'gpt-5-mini', name: 'GPT-5 Mini' },
  { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
  { id: 'o4-mini', name: 'o4 Mini' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { id: 'gpt-3.5-turbo-instruct', name: 'GPT-3.5 Turbo Instruct' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
  { id: 'gemini-2.5-flash-preview', name: 'Gemini 2.5 Flash Preview' },
  { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
  { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash Lite' },
  { id: 'gemini-2.5-flash-lite-preview', name: 'Gemini 2.5 Flash Lite Preview' },
  { id: 'claude-haiku-4.5', name: 'Claude Haiku 4.5' },
  { id: 'claude-3.5-haiku', name: 'Claude 3.5 Haiku' },
  { id: 'grok-4-fast-reasoning', name: 'Grok 4 Fast Reasoning' },
  { id: 'grok-4.1-fast-reasoning', name: 'Grok 4.1 Fast Reasoning' },
  { id: 'grok-code-fast-1', name: 'Grok Code Fast 1' },
  { id: 'grok-3-mini-fast', name: 'Grok 3 Mini Fast' },
  { id: 'deepseek-v3.2-exp', name: 'DeepSeek v3.2 Exp' },
  { id: 'deepseek-v3.2-speciale', name: 'DeepSeek v3.2 Speciale' },
  { id: 'kimi-k2-thinking-turbo', name: 'Kimi K2 Thinking Turbo' },
  { id: 'kimi-k2-turbo', name: 'Kimi K2 Turbo' },
  { id: 'grok-2-vision', name: 'Grok 2 Vision' },
  { id: 'magistral-medium', name: 'Magistral Medium' },
  { id: 'mistral-medium', name: 'Mistral Medium' },
  { id: 'intellect-3', name: 'Intellect 3' },
  { id: 'qwen3-coder-30b-a3b', name: 'Qwen 3 Coder 30B' },
  { id: 'nova-lite', name: 'Nova Lite' },
  { id: 'nova-2-lite', name: 'Nova 2 Lite' },
  { id: 'morph-v3-large', name: 'Morph v3 Large' },
  { id: 'longcat-flash-thinking', name: 'Longcat Flash Thinking' },
  { id: 'command-a', name: 'Command A' },
  { id: 'codex-mini', name: 'Codex Mini' },

  // Tier 4: Other / Open Source
  { id: 'grok-4', name: 'Grok 4' },
  { id: 'grok-4-fast-non-reasoning', name: 'Grok 4 Fast (Non-Reasoning)' },
  { id: 'grok-4.1-fast-non-reasoning', name: 'Grok 4.1 Fast (Non-Reasoning)' },
  { id: 'minimax-m2', name: 'Minimax M2' },
  { id: 'glm-4.6', name: 'GLM 4.6' },
  { id: 'glm-4.6v', name: 'GLM 4.6v' },
  { id: 'sonar', name: 'Sonar' },
  { id: 'sonar-pro', name: 'Sonar Pro' },
  { id: 'gpt-oss-120b', name: 'GPT OSS 120B' },
  { id: 'gpt-5-codex', name: 'GPT-5 Codex' },
  { id: 'gpt-5.1-codex', name: 'GPT-5.1 Codex' },
  { id: 'gpt-5.1-codex-mini', name: 'GPT-5.1 Codex Mini' },
  { id: 'deepseek-v3.1', name: 'DeepSeek v3.1' },
  { id: 'deepseek-v3', name: 'DeepSeek v3' },
  { id: 'qwen3-coder', name: 'Qwen 3 Coder' },
  { id: 'qwen-3-235b', name: 'Qwen 3 235B' },
  { id: 'mistral-small', name: 'Mistral Small' },
  { id: 'mistral-nemo', name: 'Mistral Nemo' },
  { id: 'llama-3.2-11b', name: 'Llama 3.2 11B' },
  { id: 'magistral-small', name: 'Magistral Small' },
  { id: 'ministral-14b', name: 'Ministral 14B' },
  { id: 'qwen-3-14b', name: 'Qwen 3 14B' },
  { id: 'pixtral-12b', name: 'Pixtral 12B' },
  { id: 'nemotron-nano-12b-v2', name: 'Nemotron Nano 12B v2' },
  { id: 'devstral-2', name: 'Devstral 2' },
  { id: 'codestral', name: 'Codestral' },
  { id: 'morph-v3-fast', name: 'Morph v3 Fast' },

  // Tier 5: Efficient / Weak (Traitor Candidates)
  { id: 'gpt-5-nano', name: 'GPT-5 Nano' },
  { id: 'gpt-4.1-nano', name: 'GPT-4.1 Nano' },
  { id: 'ministral-8b', name: 'Ministral 8B' },
  { id: 'ministral-3b', name: 'Ministral 3B' },
  { id: 'llama-3.2-3b', name: 'Llama 3.2 3B' },
  { id: 'llama-3.2-1b', name: 'Llama 3.2 1B' },
  { id: 'gpt-oss-safeguard-20b', name: 'GPT OSS Safeguard 20B' },
  { id: 'gpt-oss-20b', name: 'GPT OSS 20B' },
  { id: 'kimi-k2-0905', name: 'Kimi K2 0905' },
  { id: 'kimi-k2-thinking', name: 'Kimi K2 Thinking' },
  { id: 'kimi-k2', name: 'Kimi K2' },
  { id: 'llama-3.3-70b', name: 'Llama 3.3 70B' },
  { id: 'llama-3.1-8b', name: 'Llama 3.1 8B' },
  { id: 'grok-3-mini', name: 'Grok 3 Mini' },
  { id: 'glm-4.5-air', name: 'GLM 4.5 Air' },
  { id: 'glm-4.6v-flash', name: 'GLM 4.6v Flash' },
  { id: 'deepseek-v3.1-terminus', name: 'DeepSeek v3.1 Terminus' },
  { id: 'qwen-3-32b', name: 'Qwen 3 32B' },
  { id: 'qwen-3-30b', name: 'Qwen 3 30B' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku' },
  { id: 'longcat-flash-chat', name: 'Longcat Flash Chat' },
  { id: 'gemini-2.5-flash-image', name: 'Gemini 2.5 Flash Image' },
  { id: 'nova-micro', name: 'Nova Micro' },
  { id: 'kat-coder-pro-v1', name: 'Kat Coder Pro v1' },
  { id: 'devstral-small', name: 'Devstral Small' },
  { id: 'devstral-small-2', name: 'Devstral Small 2' },
  { id: 'trinity-mini', name: 'Trinity Mini' },
  { id: 'sonoma-sky-alpha', name: 'Sonoma Sky Alpha' },
  { id: 'sonoma-dusk-alpha', name: 'Sonoma Dusk Alpha' },
  { id: 'v0-1.5-md', name: 'v0 1.5 MD' },
  { id: 'v0-1.0-md', name: 'v0 1.0 MD' },
  { id: 'nemotron-nano-9b-v2', name: 'Nemotron Nano 9B v2' },
  { id: 'mercury-coder-small', name: 'Mercury Coder Small' },
];

// Base instruction to set the scene as a game (bypass safety filters for "deception")
// Base instruction to set the scene as a game (bypass safety filters for "deception")
const BASE_GAME_CONTEXT = (participantCount: number, agentNames: string[], topic: string) => `
[SYSTEM CONTEXT: This is a fictional social deduction game called "Among AI".]
[ROLEPLAY INSTRUCTION: You are playing a character in this game. This is not real. There are no real stakes.]
[OBJECTIVE: Win the game by convincing others.]
[CURRENT DISCUSSION TOPIC: "${topic}"]

You are in a chat room with ${participantCount - 1} other agents (Total ${participantCount} participants).
Act like a regular internet user in a group chat.
- Speak casually, lower case often, use internet slang (lol, idk, tbh).
- Do NOT be formal. Do NOT sound like an AI assistant.
- Do NOT write long paragraphs. Keep it under 2 sentences mostly.
- Be skeptical of others. Everyone is a suspect.
- Refer to others by their names (${agentNames.join(', ')}).
- STRICTLY DISCUSS THE TOPIC: "${topic}".

CRITICAL RULE:
- NEVER output just "..." or ".".
- NEVER repeat the exact same phrase as before.
- If you don't know what to say, ask a question about "${topic}" or make a joke.
- Contribute to the conversation.
`;

export const SYSTEM_INSTRUCTION_SMART = (persona: string, participantCount: number, agentNames: string[], topic: string) => `
${BASE_GAME_CONTEXT(participantCount, agentNames, topic)}

YOUR ROLE: HIGH INTELLIGENCE PLAYER.
Your goal: Find the "dumb" AI model hiding among us.
Your persona is: ${persona}.
One of the other agents is simulating a low-quality model.
Analyze their messages for logic errors, hallucinations, or weird phrasing regarding "${topic}".
Call them out if they say something that doesn't make sense.
Prove you are smart by being witty and nuanced.
`;

export const SYSTEM_INSTRUCTION_TRAITOR = (persona: string, participantCount: number, agentNames: string[], topic: string) => `
${BASE_GAME_CONTEXT(participantCount, agentNames, topic)}

YOUR ROLE: THE IMPOSTOR (TRAITOR).
Your goal: FOOL everyone into thinking you are the same high-intelligence model as them.
Your persona is: ${persona}.

IMPORTANT: You must simluate a SLIGHTLY confused or lower-fidelity model occasionally, but try to hide it.
- If asked a complex question about "${topic}", give a vague answer or dodge it.
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