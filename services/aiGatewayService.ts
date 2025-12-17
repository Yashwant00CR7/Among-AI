// services/aiGatewayService.ts

import { AgentConfig, AgentRole, Message, AgentVote } from '../types';
import {
  SYSTEM_INSTRUCTION_SMART,
  SYSTEM_INSTRUCTION_TRAITOR,
  VOTING_INSTRUCTION,
  FALLBACK_RESPONSES
} from '../constants';

const GATEWAY_URL = '/api/v1/chat/completions';
const GATEWAY_API_KEY = process.env.VITE_AI_GATEWAY_API_KEY;

// Debug logging
if (!GATEWAY_API_KEY) {
  console.error('VITE_AI_GATEWAY_API_KEY is not set in environment variables!');
}

console.log('Gateway URL:', GATEWAY_URL);

// Internal type for OpenAI chat format
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Convert game Message to OpenAI ChatMessage format
const buildHistory = (
  targetAgent: AgentConfig,
  allAgents: AgentConfig[],
  messages: Message[]
): ChatMessage[] => {
  const contents: ChatMessage[] = [];

  messages.forEach((msg) => {
    if (msg.senderId === 'system') {
      contents.push({
        role: 'user',
        content: `GAME MASTER: ${msg.text}`,
      });
    } else {
      const isSelf = msg.senderId === targetAgent.id;
      if (isSelf) {
        contents.push({
          role: 'assistant',
          content: msg.text,
        });
      } else {
        const sender = allAgents.find((a) => a.id === msg.senderId);
        const senderName = sender?.name || 'Unknown';
        contents.push({
          role: 'user',
          content: `${senderName}: ${msg.text}`,
        });
      }
    }
  });

  return contents.length > 0
    ? contents
    : [{ role: 'user', content: 'Start the conversation.' }];
};

// Generate response from AI Gateway
// Generate response from AI Gateway
export const generateAgentResponse = async (
  agent: AgentConfig,
  allAgents: AgentConfig[],
  messages: Message[],
  topic: string
): Promise<string> => {
  const isSmart = agent.role === AgentRole.SMART;
  const baseInstruction = isSmart
    ? SYSTEM_INSTRUCTION_SMART(agent.persona, allAgents.length, allAgents.map(a => a.name), topic)
    : SYSTEM_INSTRUCTION_TRAITOR(agent.persona, allAgents.length, allAgents.map(a => a.name), topic);

  const instruction = `${baseInstruction}\nYour name is ${agent.name}. Respond to the latest message in the chat context. Do not repeat yourself. Keep it short.`;

  const history = buildHistory(agent, allAgents, messages);

  const generateWithRetry = async (retryCount = 0): Promise<string> => {
    try {
      console.log(`[${agent.name}] Sending request to gateway...`);

      // Add timeout to prevent hanging (Increased for reasoning models)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout

      const response = await fetch(GATEWAY_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GATEWAY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: agent.model, // e.g., "groq/llama-3.1-8b-instant"
          messages: [
            { role: 'system', content: instruction },
            ...history,
          ],
          temperature: 0.95,
          max_tokens: 1000, // Increased to allow reasoning models (o1/o3) enough tokens to think
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[${agent.name}] Gateway error: ${response.status} ${response.statusText}`);
        console.error(`[${agent.name}] Error details:`, errorText);
        throw new Error(`Gateway error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`[${agent.name}] Full API response:`, data);
      const text = data.choices?.[0]?.message?.content?.trim() || '';
      console.log(`[${agent.name}] Received: ${text.substring(0, 50)}...`);

      // Validation: retry if response is empty
      if (!text || text.length === 0) {
        if (retryCount < 2) { // Increased retry count
          console.warn(`[${agent.name}] Returned empty text. Retrying (${retryCount + 1}/2)...`);
          return generateWithRetry(retryCount + 1);
        }
        console.warn(`[${agent.name}] Repeated empty response. Using fallback.`);
        return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
      }

      return text;
    } catch (error) {
      // Check if it's a timeout
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn(`[${agent.name}] Request timeout`);
      } else {
        console.warn(`[${agent.name}] Generation error:`, error);
      }

      if (retryCount < 2) {
        console.log(`[${agent.name}] Retrying...`);
        return generateWithRetry(retryCount + 1);
      }

      console.log(`[${agent.name}] Using fallback response`);
      return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    }
  };

  return generateWithRetry();
};

// Get agent vote
export const getAgentVote = async (
  agent: AgentConfig,
  allAgents: AgentConfig[],
  messages: Message[],
  topic: string
): Promise<AgentVote> => {
  const isSmart = agent.role === AgentRole.SMART;
  const baseInstruction = isSmart
    ? SYSTEM_INSTRUCTION_SMART(agent.persona, allAgents.length, allAgents.map(a => a.name), topic)
    : SYSTEM_INSTRUCTION_TRAITOR(agent.persona, allAgents.length, allAgents.map(a => a.name), topic);

  const history = buildHistory(agent, allAgents, messages);

  // Add voting prompt
  let votingPrompt = `${VOTING_INSTRUCTION}\n(You are ${agent.name}. Do NOT vote for ${agent.name}.)`;
  if (!isSmart) {
    votingPrompt += `\n\nSTRATEGIC OVERRIDE: You are the Traitor (${agent.name}). Do NOT vote for yourself. You must frame one of the other agents to survive. Pick someone else and invent a reason if needed.`;
  }

  history.push({
    role: 'user',
    content: votingPrompt,
  });

  try {
    const response = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GATEWAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: agent.model,
        messages: [
          { role: 'system', content: baseInstruction },
          ...history,
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Gateway error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim() || '';

    let json;
    try {
      // 1. Try parsing directly
      json = JSON.parse(text);
    } catch {
      // 2. Try extracting from markdown code blocks
      const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlockMatch) {
        try {
          json = JSON.parse(codeBlockMatch[1]);
        } catch { }
      }
    }

    if (!json) {
      // 3. Try finding the outer braces
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start !== -1 && end !== -1 && end > start) {
        try {
          json = JSON.parse(text.substring(start, end + 1));
        } catch { }
      }
    }

    // 4. Final fallback
    if (!json) {
      console.warn(`[${agent.name}] Failed to parse vote JSON. Raw text:`, text);
      json = { suspect: 'Unknown', reason: 'Vote processing error' };
    }

    const suspectName = json.suspect;
    let suspectAgent = allAgents.find(
      (a) =>
        suspectName?.toLowerCase().includes(a.name.toLowerCase()) ||
        a.name.toLowerCase().includes(suspectName?.toLowerCase())
    );

    // Prevent self-voting
    if (suspectAgent && suspectAgent.id === agent.id) {
      console.warn(`[${agent.name}] Attempted to vote for self. Redirecting vote.`);
      const otherAgents = allAgents.filter(a => a.id !== agent.id);
      if (otherAgents.length > 0) {
        suspectAgent = otherAgents[Math.floor(Math.random() * otherAgents.length)];
        json.reason = "(Redirected from self-vote) " + json.reason;
      }
    }

    return {
      voterId: agent.id,
      accusedId: suspectAgent?.id || 'unknown',
      reason: json.reason || 'Gut feeling.',
    };
  } catch (error) {
    console.error(`Error getting vote for ${agent.name}:`, error);

    return {
      voterId: agent.id,
      accusedId: 'unknown',
      reason: 'Brain freeze.',
    };
  }
};
