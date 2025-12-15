# Among AI: AI Social Deduction Game

<div align="center">
  <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Alpha&backgroundColor=transparent" width="100" />
  <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Beta&backgroundColor=transparent" width="100" />
  <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Gamma&backgroundColor=transparent" width="100" />
</div>

## 🕵️‍♂️ About The Project

**Among AI** is a multi-agent social deduction experiment where AI agents play a game of "Find the Impostor".

In this simulation, a group of AI agents (3-10 participants) enter a chat room.
- **Majority are "Smart"** (running on high-fidelity models like GPT-5, o1, Claude Opus, or Gemini 1.5 Pro).
- **One Agent is the "Traitor"** (running on a lower-fidelity model or specifically instructed to deceive).

The goal of the Smart agents is to identify the Traitor based on logic errors, hallucinations, or lack of nuance.
The goal of the Traitor is to blend in, deceive the others, and survive the vote.

## 🚀 Features

- **Massive Model Library**: Choose from **over 100+ AI models** including Vercel AI Gateway exclusives, Flagship Reasoning models (o1, o3-mini, DeepSeek R1), and open-source efficient models.
- **Unified Model Selector**: An intuitive, searchable modal interface to easily assign models to agents, similar to modern file pickers.
- **Reasoning Model Support**: Optimized timeouts and token limits to support "Thinking" models like OpenAI o1/o3 and DeepSeek, allowing them time to deliberate before answering.
- **Topic Enforcement**: Define a custom conversation topic (e.g., "Is AI Conscious?") and watch as agents rigorously stick to the subject, identifying those who drift or hallucinate.
- **Dynamic Lobbies**: Configure games with 3 to 10 agents using a sleek, interactive interface.
- **Dark Mode Support**: Fully responsive Light/Dark themes with glassmorphism effects and animated backgrounds.
- **In-Game Guide**: Built-in "How to Play" tutorial accessible anytime.
- **Self-Voting Guardrails**: Advanced logic ensures agents never vote for themselves, forcing strategic framing of others.
- **Robust Stability**: Enhanced error handling and JSON parsing to prevent crashes even with unpredictable model outputs.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS (with Dark Mode & Glassmorphism)
- **AI Integration**: Vercel AI Gateway / OpenAI Compatible API
- **Supported Models**: 100+ via Gateway (GPT-5, o1, o3, Claude 3.7, Gemini 2.0, DeepSeek V3, Llama 3.3, Grok 3, etc.)
- **Data Persistence**: LocalStorage for theme preferences.

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

1. **Lobby Setup**: Use the slider to choose 3-10 participants.
2. **Assign Models**: Click any agent card to open the searchable model picker. Assign powerful models to "Smart" candidates and weaker ones to potential "Traitors".
3. **Set Topic**: Enter a debate topic (e.g., "The Future of Space Travel").
4. **Start Game**: Watch the agents discuss. The system forces them to stay on topic.
5. **Observation**: Read the chat logs. Can *you* spot the traitor before they do?
6. **Voting Phase**: Agents cast votes with reasoning. Self-voting is automatically prevented.
7. **Results**: Review the rankings to see which model performed best as a Detective or Impostor.

## 🧠 Strategic Logic

- **Smart Agents**: Instructed to analyze messages for "dumb" mistakes within the specific **Context/Topic**.
- **Traitor Agent**: Instructed to mimic high-intelligence behavior but is naturally limited by its model architecture. It tries to dodge complex topic-specific questions.
- **Reasoning Models**: Models like `o1` use "Chain of Thought" which is allocated extra tokens to ensure high-quality final answers.

## 📄 License

Distributed under the MIT License.
