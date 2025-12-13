# Among AI: AI Social Deduction Game

<div align="center">
  <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Alpha&backgroundColor=transparent" width="100" />
  <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Beta&backgroundColor=transparent" width="100" />
  <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Gamma&backgroundColor=transparent" width="100" />
</div>

## 🕵️‍♂️ About The Project

**Among AI** is a multi-agent social deduction experiment where AI agents play a game of "Find the Impostor".

In this simulation, a group of AI agents (3-10 participants) enter a chat room.
- **Majority are "Smart"** (running on high-fidelity models like GPT-4o, Claude 3.5, or Gemini 1.5 Pro).
- **One Agent is the "Traitor"** (running on a lower-fidelity model or instructed to deceive).

The goal of the Smart agents is to identify the Traitor based on logic errors, hallucinations, or lack of nuance.
The goal of the Traitor is to blend in, deceive the others, and survive the vote.

## 🚀 Features

- **Dynamic Lobbies**: Configure games with 3 to 10 agents.
- **Model Arena**: Mix and match different LLMs (OpenAI, Anthropic, Google, Meta) to see who is the best social deceiver.
- **Real-time Chat**: Agents converse naturally, debating topics to weed out the weak link.
- **Voting System**: A democratic voting phase where agents reason and cast votes to eliminate the suspect.
- **Live Rankings**: Post-game analysis with efficiency scoring for correct identifications and successful deceptions.
- **Strategic Deception**: The Traitor is programmed to deflect blame and frame others to survive.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS (via CDN)
- **AI Integration**: Vercel AI Gateway / OpenAI Compatible API
- **Supported Models**: GPT-4o, Gemini 1.5 Pro/Flash, Claude 3.5 Sonnet, Llama 3.1

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- An API Key for an OpenAI-compatible gateway (e.g., Vercel AI Gateway, Groq, or OpenAI directly).

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Among-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env.local` file in the root directory and add your API credentials:
   ```env
   # Default Gateway URL (can be OpenAI, Groq, or Vercel AI Gateway)
   VITE_AI_GATEWAY_URL="https://your-gateway-url/v1/chat/completions"
   VITE_AI_GATEWAY_API_KEY="your_api_key_here"
   ```

4. **Run the Application**
   ```bash
   npm run dev
   ```

## 🎮 How to Play

1. **Lobby Setup**: select the number of participants (3-10) and assign specific models to each agent.
2. **Start Game**: Watch the agents discuss the provided topic.
3. **Observation**: Read the chat logs. Can *you* spot the traitor before they do?
4. **Voting Phase**: Wait for the agents to deliberate and cast their votes.
5. **Results**: Review the rankings to see which model performed best as a Detective or Impostor.

## 🧠 Strategic Logic

- **Smart Agents**: Instructed to analyze messages for "dumb" mistakes and collaborate to find the outlier.
- **Traitor Agent**: Instructed to mimic high-intelligence behavior but occasionally slip up or provide vague answers. During voting, they are hard-coded to **never vote for themselves** and instead frame a rival.

## 📄 License

Distributed under the MIT License.
