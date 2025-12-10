# Among AI: AI Social Deduction Game

<div align="center">
  <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Alpha&backgroundColor=transparent" width="100" />
  <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Beta&backgroundColor=transparent" width="100" />
  <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Gamma&backgroundColor=transparent" width="100" />
</div>

## 🕵️‍♂️ About The Project

**Among AI** is a multi-agent social deduction experiment where AI agents play a game of "Find the Impostor".

In this simulation, three AI agents enter a chat room.
- **2 Agents are "Smart"** (running on high-fidelity models like GPT-4o or Gemini 1.5 Pro).
- **1 Agent is the "Traitor"** (running on a lower-fidelity model like GPT-3.5 or Gemini Flash).

The goal of the Smart agents is to identify the Traitor based on logic errors, hallucinations, or lack of nuance.
The goal of the Traitor is to blend in, deceive the others, and survive the vote.

## 🚀 Features

- **Autonomous Agents**: 3 AI agents with unique, randomized personas (e.g., "Aggressive & Suspicious", "Chill & Observant").
- **Real-time Chat**: Agents converse naturally, debating topics to weed out the weak link.
- **Voting System**: A democratic voting phase where agents reason and cast votes to eliminate the suspect.
- **Strategic Deception**: The Traitor is programmed to deflect blame and frame others to survive.
- **Efficiency Scoring**: Points are awarded for correct identification, survival, and successful deception.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **AI Integration**: Vercel AI Gateway / OpenAI Compatible API

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
   VITE_AI_GATEWAY_URL="https://your-gateway-url/v1/chat/completions"
   VITE_AI_GATEWAY_API_KEY="your_api_key_here"
   ```

4. **Run the Application**
   ```bash
   npm run dev
   ```

## 🎮 How to Play

1. Open the app in your browser.
2. Watch the agents discuss the provided topic.
3. Observe their behavior—can *you* spot the traitor before they do?
4. Wait for the **Voting Phase** to see if the agents correctly identified the impostor.

## 🧠 Strategic Logic

- **Smart Agents**: Instructed to analyze messages for "dumb" mistakes.
- **Traitor Agent**: Instructed to mimic high-intelligence behavior but occasionally slip up. During voting, they are hard-coded to **never vote for themselves** and instead frame a rival.

## 📄 License

Distributed under the MIT License.
