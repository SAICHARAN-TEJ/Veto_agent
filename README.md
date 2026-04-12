# Veto: Customer Failure Memory System

## Overview

Veto is an enterprise-grade intelligence layer that gives support teams a "corporate memory." It ensures that a customer never has to tell a company twice that a specific solution did not work.

By indexing Failure Memories, Veto intercepts redundant troubleshooting steps in real-time, preventing "solution fatigue" and preserving customer trust.

## The Problem: Corporate Amnesia

In traditional support, memory is fragmented across tickets, agents, and time. A customer might have tried "Clearing Cache" three times across three different tickets, but the fourth agent, seeing a fresh ticket, suggests it again.

This Corporate Amnesia leads to:

- Customer Frustration: "I already told the last person this did not work!"
- Brand Erosion: The company appears disorganized and incompetent.
- Inefficiency: Hours wasted on "standard" scripts that are already proven failures for that specific environment.

## The Solution: Failure Memory

Veto replaces fragmented ticket history with a Unified Failure Memory. Instead of repeating failed solutions, agents are guided toward solutions that have actually worked for similar customers in similar environments.

## How It Works

1. Memory Extraction: As an agent drafts a response, Veto extracts the proposed solutions using AI.
2. Conflict Detection: It queries the Customer Failure Memory to see if those exact solutions were previously attempted and failed for this specific customer.
3. Intelligence Intercept: If a conflict is found, Veto triggers a "Memory Conflict" alert, blocking the redundant suggestion before it reaches the customer.
4. Positive Recall: It then queries the Global Solution Index to find what actually worked for customers in similar environments, complete with success rates and step-by-step instructions.

## Key Features

- Memory Trace Visualization: See the AI reasoning process in real-time with a step-by-step timeline showing how conclusions were reached.
- Business Value Dashboard: Track measurable impact including Memory-Driven Resolution Rate, Time-to-Resolution reduction, and Customer Satisfaction uplift.
- Environment-Aware Suggestions: Recommendations are filtered by customer environment including OS, Browser, and SSO provider.
- Real-time Interception: Debounced API calls ensure the agent is guided without interrupting their natural typing flow.

## Architecture

### Backend (Node.js and Express)

The backend handles the core intelligence processing:

- Veto Engine: Orchestrates solution extraction, memory recall, and conflict detection.
- Hindsight Integration: Interfaces with the long-term memory store for customer history retrieval.
- Groq AI: Uses the Qwen model for fast, low-latency solution extraction and alternative generation.
- Security: Implements rate limiting, input sanitization, and strict CORS policies.

### Frontend (React and Vite)

The frontend provides the user interface:

- Support Console: A professional CRM-style interface for managing tickets and customers.
- Memory Intelligence Brief: A real-time side-panel showing customer frustration levels and failure history.
- Conflict Overlay: A high-visibility alert system that blocks redundant responses and offers actionable alternatives.

## Installation & Running Locally

### Prerequisites

- Node.js version 18 or higher
- Groq API Key (Available at [console.groq.com](https://console.groq.com/))
- *[Optional]* Docker (If you wish to run the real Hindsight memory backend; otherwise an in-memory fallback is used)

### 1. Project Setup

Since this is a full-stack monorepo, both the React frontend and Express backend share dependencies.

```bash
# Install all dependencies at the project root
npm install
```

### 2. Configure Environment Variables

```bash
# The .env file has already been prepared with placeholders
# Open the .env file and set your API key:
```

Edit your `.env` to include:
```env
GROQ_API_KEY=your_groq_api_key_here
HINDSIGHT_URL=http://localhost:8888
VITE_API_URL=http://localhost:3001
```

### 3. Start the VETO System

Start both the backend server and frontend application simultaneously using Vite and concurrently:

```bash
npm run dev
```

- The React application will run on `http://localhost:5173`
- The Express/Groq backend will run on `http://localhost:3001`
- Add `?demo=true` to your URL to see the system autonomously working on the Meridian Corp scenario.

### 4. Running the Hindsight Memory Bank (Docker)

VETO is fully integrated with the official `@vectorize-io/hindsight-client`. If you want true biomimetic memory persistence rather than the in-memory fallback, you need to run Hindsight locally:

```bash
docker run --rm -it --pull always -p 8888:8888 -p 9999:9999 \
  -e HINDSIGHT_API_LLM_PROVIDER=groq \
  -e HINDSIGHT_API_LLM_API_KEY=your_groq_api_key_here \
  ghcr.io/vectorize-io/hindsight:latest
```

## Project Structure

```text
veto-agent/
├── server/                 # Express Backend
│   ├── lib/
│   │   ├── groq.js         # Solution extraction via LLaMA3
│   │   └── hindsight.js    # Hindsight client integration & fallback
│   ├── routes/             # API Endpoints (/analyze, /resolve)
│   └── index.js            # Express server entry
├── src/                    # React Frontend
│   ├── components/         # Dashboard & Landing sections
│   ├── pages/              # Landing.jsx, Dashboard.jsx
│   ├── store/              # Zustand global state management
│   ├── index.css           # Global design system & theme vars
│   ├── App.jsx             # React Router setup
│   └── main.jsx            # React root
├── .env                    # Environment API keys
├── package.json            # Unified dependencies
├── vite.config.js          # Vite config w/ backend proxy
└── README.md
```

## Roadmap

- Automated Memory Writing: Auto-index failures based on ticket closing notes to continuously improve the memory system.
- Cross-Customer Pattern Recognition: Identify "cluster failures" where a specific update breaks a solution for many customers simultaneously.
- CRM Integration: Deep-link Failure Memories directly into Zendesk, Salesforce, or Intercom for seamless agent workflow.

## License

This project is distributed under the MIT License. See the LICENSE file for more information.
