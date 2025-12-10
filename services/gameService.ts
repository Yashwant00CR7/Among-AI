import { Content } from "@google/genai";
import { AgentConfig, AgentRole, Message, AgentVote } from "../types";
import { SYSTEM_INSTRUCTION_SMART, SYSTEM_INSTRUCTION_TRAITOR, VOTING_INSTRUCTION, FALLBACK_RESPONSES } from "../constants";
import { getLLMClient } from "./llm/factory";

/**
 * Constructs the chat history for a specific agent.
 * Maps 'self' messages to 'model' role, and everyone else to 'user' role with name prefixes.
 */
const buildHistory = (targetAgent: AgentConfig, allAgents: AgentConfig[], messages: Message[]) => {
  const contents: Content[] = [];

  messages.forEach(msg => {
    // Treat system messages as context provided by the "Game Master" (User role)
    // This ensures contents is never empty at the start of the game.
    if (msg.senderId === 'system') {
      contents.push({ role: 'user', parts: [{ text: `[GAME MASTER]: ${msg.text}` }] });
      return;
    }

    const isSelf = msg.senderId === targetAgent.id;
    let senderName = "Unknown";

    const sender = allAgents.find(a => a.id === msg.senderId);
    if (sender) {
      senderName = sender.name;
    }

    // Ensure text is never empty
    const textPart = msg.text && msg.text.trim() !== "" ? msg.text : "[Silence]";

    if (isSelf) {
      contents.push({ role: 'model', parts: [{ text: textPart }] });
    } else {
      // For everyone else, we present it as a User message (simulating external input), 
      // prefixed with their name to simulate a group chat
      contents.push({ role: 'user', parts: [{ text: `[${senderName}]: ${textPart}` }] });
    }
  });

  return contents;
};

export const generateAgentResponse = async (
  agent: AgentConfig,
  allAgents: AgentConfig[],
  messages: Message[]
): Promise<string> => {
  const isSmart = agent.role === AgentRole.SMART;
  const baseInstruction = isSmart
    ? SYSTEM_INSTRUCTION_SMART(agent.persona)
    : SYSTEM_INSTRUCTION_TRAITOR(agent.persona);

  const instruction = `${baseInstruction}\n\nYour name is ${agent.name}. Respond to the latest message in the chat context. Do not repeat yourself. Keep it short.`;

  const history = buildHistory(agent, allAgents, messages);

  const generateWithRetry = async (retryCount = 0): Promise<string> => {
    try {
      const client = getLLMClient(agent.provider);
      const text = await client.generateContent(
        agent.model,
        history,
        {
          systemInstruction: instruction,
          temperature: 0.95, // High temp for variety
          maxOutputTokens: 150,
        }
      );

      // Validation: Check for empty, "...", or extremely short non-answers
      if (!text || text.trim().length <= 3 || text.trim() === '...') {
        if (retryCount < 1) {
          console.warn(`Agent ${agent.name} returned weak text "${text}". Retrying...`);
          return await generateWithRetry(retryCount + 1);
        }
        throw new Error("Repeated weak response");
      }

      return text;
    } catch (error) {
      console.error(`Error generating response for ${agent.name} (Attempt ${retryCount + 1}):`, error);
      if (retryCount < 1) {
        return await generateWithRetry(retryCount + 1);
      }
      return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    }
  };

  return await generateWithRetry();
};

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
  const client = getLLMClient(agent.provider);

  // Add the voting prompt as the last user message to trigger the specific output
  history.push({
    role: 'user',
    parts: [{ text: VOTING_INSTRUCTION }]
  });

  try {
    const text = await client.generateContent(
      agent.model,
      history,
      {
        systemInstruction: baseInstruction,
        responseMimeType: "application/json",
      }
    );

    const safeText = text || "{}";
    let json;
    try {
      json = JSON.parse(safeText);
    } catch (e) {
      // Fallback for messy JSON
      const match = safeText.match(/\{[\s\S]*\}/);
      json = match ? JSON.parse(match[0]) : { suspect: "Unknown", reason: "Panic voting." };
    }

    // Find the ID of the suspect name
    const suspectName = json.suspect;
    const suspectAgent = allAgents.find(a =>
      suspectName?.toLowerCase().includes(a.name.toLowerCase()) ||
      a.name.toLowerCase().includes(suspectName?.toLowerCase())
    );

    return {
      voterId: agent.id,
      accusedId: suspectAgent?.id || 'unknown',
      reason: json.reason || "Gut feeling."
    };

  } catch (error) {
    console.error(`Error getting vote for ${agent.name}:`, error);
    return {
      voterId: agent.id,
      accusedId: 'unknown',
      reason: "Brain freeze."
    };
  }
};