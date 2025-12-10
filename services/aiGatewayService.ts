// services/aiGatewayService.ts

import { AgentConfig, AgentRole, Message, AgentVote } from '../types';
import {
  SYSTEM_INSTRUCTION_SMART,
  SYSTEM_INSTRUCTION_TRAITOR,
  VOTING_INSTRUCTION,
  FALLBACK_RESPONSES
} from '../constants';

const GATEWAY_URL = process.env.VITE_AI_GATEWAY_URL || 'https://ai-gateway.vercel.sh/v1/chat/completions';
const GATEWAY_API_KEY = process.env.VITE_AI_GATEWAY_API_KEY;

// Debug logging
if (!GATEWAY_API_KEY) {
  console.error('VITE_AI_GATEWAY_API_KEY is not set in environment variables!');
}
if (!GATEWAY_URL) {
  console.error('VITE_AI_GATEWAY_URL is not set in environment variables!');
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
export const generateAgentResponse = async (
  agent: AgentConfig,
  allAgents: AgentConfig[],
  messages: Message[]
): Promise<string> => {
  const isSmart = agent.role === AgentRole.SMART;
  const baseInstruction = isSmart
    ? SYSTEM_INSTRUCTION_SMART(agent.persona)
    : SYSTEM_INSTRUCTION_TRAITOR(agent.persona);

  const instruction = `${baseInstruction}\nYour name is ${agent.name}. Respond to the latest message in the chat context. Do not repeat yourself. Keep it short.`;

  const history = buildHistory(agent, allAgents, messages);

  const generateWithRetry = async (retryCount = 0): Promise<string> => {
    try {
      console.log(`[${agent.name}] Sending request to gateway...`);
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
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
          max_tokens: 150,
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

      // Validation: retry if response is too weak
      if (!text || text.length < 3 || text === '...') {
        if (retryCount < 1) {
          console.warn(`Agent ${agent.name} returned weak text. Retrying...`);
          return generateWithRetry(retryCount + 1);
        }
        throw new Error('Repeated weak response');
      }

      return text;
    } catch (error) {
      console.error(`❌ Error generating response for ${agent.name}:`, error);
      
      // Check if it's a timeout
      if (error.name === 'AbortError') {
        console.error(`⏰ Request timeout for ${agent.name}`);
      }

      if (retryCount < 1) {
        console.log(`🔄 Retrying for ${agent.name}...`);
        return generateWithRetry(retryCount + 1);
      }

      console.log(`⚠️ Using fallback response for ${agent.name}`);      return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    }
  };

  return generateWithRetry();
};

// Get agent vote
export const getAgentVote = async (
  agent: AgentConfig,
  allAgents: AgentConfig[],
  messages: Message[]
): Promise<AgentVote> => {
  const isSmart = agent.role === AgentRole.SMART;
  const baseInstruction = isSmart
    ? SYSTEM_INSTRUCTION_SMART(agent.persona)
    : SYSTEM_INSTRUCTION_TRAITOR(agent.persona);

  const history = buildHistory(agent, allAgents, messages);

  // Add voting prompt
  history.push({
    role: 'user',
    content: VOTING_INSTRUCTION,
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
        max_tokens: 200,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gateway error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim() || '';

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      const match = text.match(/\{[^}]+\}/);
      json = match ? JSON.parse(match[0]) : { suspect: 'Unknown', reason: 'Parse error' };
    }

    const suspectName = json.suspect;
    const suspectAgent = allAgents.find(
      (a) =>
        suspectName?.toLowerCase().includes(a.name.toLowerCase()) ||
        a.name.toLowerCase().includes(suspectName?.toLowerCase())
    );

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
