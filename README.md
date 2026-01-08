# Validation Matrix

AI-powered business idea analysis with interactive 3D visualization across Time, Money, and Opportunity dimensions.

![Validation Matrix](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue) ![Three.js](https://img.shields.io/badge/Three.js-0.170-green) ![tRPC](https://img.shields.io/badge/tRPC-11-purple)

## Features

- 🤖 **AI-Powered Deep Research**: Claude AI performs internal research using its massive knowledge base to evaluate your ideas across three critical dimensions.
- 📊 **3D Visualization**: Interactive Three.js visualization with React Three Fiber.
- ⚡ **Real-time Scoring**: Instant feedback on Time (build effort), Money (investment), and Opportunity (market potential).
- 📄 **PDF Reports**: Export professional analysis reports after deep research.
- 🔒 **User Accounts**: Save and track your research history.

## How it Works

The Validation Matrix connects to the **OpenAI API**. When you submit an idea, the system sends a structured research prompt to ChatGPT (specifically the `gpt-4o` model). The AI then simulates a market research session, drawing on its knowledge of industry trends, technological complexity, and economic factors to produce a structured validation report.

> [!IMPORTANT]
> **API Key Required**: You will need a valid `OPENAI_API_KEY` (from platform.openai.com) to perform new analyses.

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Three.js** + React Three Fiber for 3D visualization
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Wouter** for routing
- **React Query** + **tRPC** for data fetching

### Backend
- **Express** with TypeScript
- **tRPC 11** for type-safe API
- **Drizzle ORM** for database operations
- **MySQL/PlanetScale** for data storage
- **Claude AI** (Anthropic) for analysis

## Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm
- MySQL database (PlanetScale recommended)
- Anthropic API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd validation-matrix
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
DATABASE_URL=mysql://user:password@host:port/database
ANTHROPIC_API_KEY=sk-ant-...
```

4. Run database migrations:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Project Structure

```
validation-matrix/
├── src/                    # Frontend React app
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # shadcn/ui primitives
│   │   ├── IdeaForm.tsx    # Idea submission form
│   │   ├── ScoreCard.tsx   # Score display component
│   │   ├── Navbar.tsx      # Navigation bar
│   │   └── ValidationMatrix3D.tsx  # 3D visualization
│   ├── pages/              # Route pages
│   │   ├── Home.tsx        # Landing page
│   │   ├── Dashboard.tsx   # User dashboard
│   │   ├── SubmitIdea.tsx  # Idea form page
│   │   ├── IdeaDetail.tsx  # Analysis results
│   │   └── Login.tsx       # Authentication
│   ├── lib/                # Utilities
│   │   ├── trpc.ts         # tRPC client
│   │   ├── utils.ts        # Helper functions
│   │   └── exportPDF.ts    # PDF generation
│   ├── App.tsx             # Main app with routing
│   └── main.tsx            # Entry point
├── server/                 # Backend Express server
│   ├── index.ts            # Server entry
│   ├── routers.ts          # tRPC procedures
│   ├── trpc.ts             # tRPC setup
│   ├── db.ts               # Database operations
│   └── ai.ts               # Claude AI integration
├── drizzle/                # Database
│   └── schema.ts           # Drizzle ORM schema
├── shared/                 # Shared types
│   └── types.ts            # TypeScript types
└── package.json
```

## Scoring System

### Time Score (1-100, Lower is Better)
Represents estimated time to build an MVP:
- **1-25**: Quick build with existing tech
- **26-50**: Moderate complexity
- **51-75**: Significant development effort
- **76-100**: Extensive R&D required

### Money Score (1-100, Lower is Better)
Represents total investment needed:
- **1-25**: Bootstrap-friendly (<$10K)
- **26-50**: Seed-level ($10K-$100K)
- **51-75**: Series A level ($100K-$500K)
- **76-100**: Significant capital ($500K+)

### Opportunity Score (1-100, Higher is Better)
Represents market potential:
- **1-25**: Niche or declining market
- **26-50**: Moderate opportunity
- **51-75**: Good opportunity with clear demand
- **76-100**: Exceptional opportunity

## 3D Visualization

The 3D matrix plots ideas in a coordinate system:
- **X-axis (Red)**: Time score - closer to origin is better
- **Y-axis (Yellow)**: Money score - closer to origin is better
- **Z-axis (Green)**: Opportunity score - further from origin is better

The **optimal zone** (indicated by a green sphere) represents ideas with low time, low money, and high opportunity.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development servers |
| `npm run build` | Build for production |
| `npm run check` | TypeScript type checking |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run test` | Run tests |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MySQL connection string | ✅ |
| `ANTHROPIC_API_KEY` | Claude AI API key | ✅ |
| `PORT` | Backend server port (default: 3001) | ❌ |

## License

MIT License - see [LICENSE](LICENSE) for details.
