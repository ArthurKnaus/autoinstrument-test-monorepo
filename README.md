# JavaScript Monorepo Boilerplate

A modern full-stack JavaScript monorepo with **Express** backend and **React** frontend, managed with npm workspaces.

## 📁 Structure

```
.
├── package.json              # Root package with workspaces config
├── packages/
│   ├── backend/              # Express.js API server
│   │   ├── package.json
│   │   ├── knexfile.js       # Knex database configuration
│   │   ├── data/
│   │   │   └── chat.sqlite   # SQLite database (auto-created)
│   │   ├── migrations/       # Database migrations
│   │   └── src/
│   │       ├── index.js      # Express server
│   │       └── db.js         # Database operations
│   └── frontend/             # React + Vite application
│       ├── package.json
│       ├── vite.config.js
│       ├── index.html
│       └── src/
│           ├── main.jsx
│           ├── App.jsx
│           ├── ChatUI.jsx    # AI Chat component
│           └── index.css
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 7.0.0 (for workspaces support)

### Installation

```bash
# Install all dependencies for all packages
npm install
```

### Development

Run both frontend and backend in development mode:

```bash
# Run all packages in dev mode (parallel)
npm run dev

# Or run individually:
npm run dev:backend    # Start Express server on port 3001
npm run dev:frontend   # Start Vite dev server on port 3000
```

The frontend dev server proxies `/api/*` requests to the backend automatically.

### Production Build

```bash
npm run build
```

## 🔧 Configuration

### Ports

- **Frontend (Vite)**: `http://localhost:3000`
- **Backend (Express)**: `http://localhost:3001`

### API Proxy

The Vite dev server is configured to proxy all `/api/*` requests to the backend server. See `packages/frontend/vite.config.js` for details.

## 🤖 AI Chat Feature

The app includes an AI-powered chat interface using the Anthropic Claude API.

### Setup

Set your Anthropic API key as an environment variable:

```bash
export ANTHROPIC_API_KEY=your_api_key_here
```

### Features

- Real-time chat with Claude AI
- **Persistent chat history** stored in SQLite database
- Session-based conversations that survive server restarts
- New conversation button to reset chat
- Typing indicators and smooth animations

### Database

Chat history is stored in a SQLite database at `packages/backend/data/chat.sqlite`. The database is automatically created on first run with the following tables:

- **sessions** - Stores chat session IDs and timestamps
- **messages** - Stores all messages with role (user/assistant) and content

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check with timestamp |
| GET | `/api/greeting?name=YourName` | Returns a greeting message |
| POST | `/api/chat/session` | Create a new chat session |
| POST | `/api/chat/message` | Send a message and get AI response |
| GET | `/api/chat/history/:sessionId` | Get chat history for a session |
| DELETE | `/api/chat/session/:sessionId` | Clear chat session |

## 🛠 Tech Stack

- **Backend**: Express.js with ES Modules
- **Frontend**: React 18 + Vite
- **AI**: Anthropic Claude API (claude-sonnet-4-20250514)
- **Database**: SQLite with Knex.js query builder
- **Monorepo**: npm workspaces
- **Styling**: CSS with custom properties

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run all packages in development mode |
| `npm run dev:backend` | Run only the backend |
| `npm run dev:frontend` | Run only the frontend |
| `npm run build` | Build all packages |
| `npm run clean` | Remove all node_modules and dist folders |

## 🤝 Adding New Packages

1. Create a new directory under `packages/`
2. Add a `package.json` with a scoped name (e.g., `@monorepo/new-package`)
3. Run `npm install` from the root to link the new package

## License

MIT
# autoinstrument-test-monorepo
