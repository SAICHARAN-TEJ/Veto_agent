# 🧠 Veto: Customer Failure Memory System

**Veto** is an enterprise-grade intelligence layer that gives support teams a "corporate memory." It ensures that a customer never has to tell a company twice that a specific solution didn't work. 

By indexing **Failure Memories**, Veto intercepts redundant troubleshooting steps in real-time, preventing "solution fatigue" and preserving customer trust.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)

## 📉 The "Corporate Amnesia" Problem
In traditional support, memory is fragmented across tickets, agents, and time. A customer might have tried "Clearing Cache" three times across three different tickets, but the fourth agent—seeing a fresh ticket—suggests it again. 

This **Corporate Amnesia** leads to:
- **Customer Frustration**: "I already told the last person this didn't work!"
- **Brand Erosion**: The company appears disorganized and incompetent.
- **Inefficiency**: Hours wasted on "standard" scripts that are already proven failures for that specific environment.

## 💡 The Solution: Failure Memory
Veto replaces fragmented ticket history with a **Unified Failure Memory**. 

### How it Works:
1. **Memory Extraction**: As an agent drafts a response, Veto extracts the proposed solutions.
2. **Conflict Detection**: It queries the **Customer Failure Memory** (via Hindsight) to see if those exact solutions were previously attempted and failed.
3. **Intelligence Intercept**: If a conflict is found, Veto triggers a "Memory Conflict" alert, blocking the redundant suggestion.
4. **Positive Recall**: It then queries the **Global Solution Index** to find what *actually* worked for customers in similar environments (OS, Browser, SSO provider).

## 🏗️ Architecture of Memory

### The Memory Engine (Backend)
- **Hindsight Integration**: A specialized vector-like store that retains "failure chunks" associated with customer IDs.
- **Parallel Recall**: High-performance concurrent querying of multiple solution-failure pairs to ensure zero-latency interception.
- **The Solution Index**: A curated memory of high-resolution-rate fixes, mapped by environment metadata.

### The Intelligence Interface (Frontend)
- **Memory Intelligence Brief**: A real-time side-panel providing a condensed view of the customer's frustration level and failure history.
- **Conflict Overlay**: A high-priority alert that surface's the *exact date and ticket* where the proposed solution previously failed.

## 📦 Installation & Setup

### Prerequisites
- Node.js v18+
- Groq API Key
- Hindsight API Key (or use the built-in mock mode)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env # Fill in your API keys
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## ⚙️ Technical Highlights

- **Failure-First Indexing**: Unlike standard knowledge bases that store "how to fix," Veto prioritizes "what not to try."
- **Environment-Aware Recall**: Suggestions are filtered by environment/SAML provider, ensuring that a fix for Chrome doesn't get suggested to a Firefox user.
- **Real-time Interception**: Debounced API synchronization ensures the agent is guided without interrupting their typing flow.

## 🗺️ Roadmap
- [ ] **Automated Memory Writing**: Auto-index failures based on ticket closing notes.
- [ ] **Cross-Customer Pattern Recognition**: Identify "cluster failures" where a specific update breaks a solution for many customers simultaneously.
- [ ] **Integration with CRM**: Deep-link "Failure Memories" directly into Zendesk/Salesforce.

## 📄 License
Distributed under the MIT License.
