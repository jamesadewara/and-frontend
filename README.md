# AnD Mobile-First Workspace (Frontend)

The command-center for the AnD Agentic Framework. Built for extreme density, observability, and real-time interaction.

## 🚀 Key Features

### 1. Extreme Mobile Density
- **Micro-UI Design**: Reduced component padding and border radii optimized for high-density information display.
- **Horizontal JSON Editor**: High-precision JSON editing with mobile-first horizontal scrolling for complex payloads.
- **Glassmorphic Aesthetics**: Modern, premium dark-mode interface designed to "WOW" judges at first glance.

### 2. Agent Observability Suite
- **Stateful Agent Console**: A real-time terminal that captures the agent's internal "Chain of Thought" as it happens.
- **Model Rotation Visualizer**: Automatic notification when the system switches from the primary LLM to a fallback provider (GLM-4.5 🔄 Nemotron-3).
- **Live SSE Heartbeats**: Persistent status monitoring for Task A and Task B services with sub-second failure detection.

### 3. Developer Experience
- **Pre-Submission Validation**: Hard-gate validation of payloads against expected schemas with immediate toast feedback.
- **Resizable Console**: Drag-to-resize terminal height for dynamic debugging sessions.
- **Clear & Export**: Single-click console clearing to maintain clean debug logs.

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Streaming**: Server-Sent Events (SSE) via `fetch-event-source`
- **Validation**: Custom stateless payload validators

## 🚦 Getting Started

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment
Create a `.env.local` file:
```env
NEXT_PUBLIC_AND_TASK_A_URL=http://localhost:8000/api/v1/
NEXT_PUBLIC_AND_TASK_B_URL=http://localhost:8001/api/v1/
```

### 3. Run Development Server
```bash
pnpm dev
```

## ⚖️ Competition Compliance
- **Stateless**: All data resides in the client state; zero persistent databases used.
- **Transparency**: Every agent reasoning step is exposed via the UI console.
- **Accessibility**: Optimized for both high-end desktop monitors and budget Android devices common in the Nigerian market.