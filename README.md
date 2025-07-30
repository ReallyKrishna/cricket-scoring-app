# Cricket Scoring App

A real-time cricket scoring application built with NestJS backend and Next.js frontend, featuring live commentary updates via Socket.IO.

## Features

### Backend (NestJS)
- **Start Match**: Create new matches with auto-incrementing 4-digit match IDs
- **Add Commentary**: Ball-by-ball commentary with various event types
- **Real-time Updates**: Socket.IO integration for live updates
- **Match Management**: Pause, resume, and complete matches
- **Data Persistence**: MongoDB for match and commentary storage
- **Caching**: Redis for latest 10 commentary entries
- **Auto-incrementing IDs**: Unique 4-digit match IDs using Redis counter

### Frontend (Next.js)
- **Match List**: View all ongoing matches with live status updates
- **Live Commentary**: Real-time commentary display with WebSocket updates
- **Add Commentary**: Comprehensive form for adding ball-by-ball commentary
- **Match Controls**: Pause, resume, and complete match functionality
- **Responsive Design**: Modern UI with plain CSS (no external libraries)
- **Real-time Updates**: Live score and commentary updates without page refresh

## Tech Stack

### Backend
- **Node.js** with **NestJS** framework
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **Redis** for caching and auto-incrementing counters
- **Socket.IO** for real-time communication
- **Validation** with class-validator

### Frontend
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Socket.IO Client** for real-time updates
- **Plain CSS** (no external UI libraries)
- **Responsive Design** with modern UI

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or cloud instance)
- Redis (running locally or cloud instance)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ReallyKrishna/cricket-scoring-app.git
   cd cricket-scoring-app
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   
   Create `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/cricket-scoring
   REDIS_URL=redis://localhost:6379
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

   This will start both backend (port 3001) and frontend (port 3000) concurrently.

## API Endpoints

### Matches
- `POST /matches/start` - Start a new match
- `GET /matches` - Get all matches
- `GET /matches/:id` - Get match details with commentary
- `POST /matches/:id/pause` - Pause a match
- `POST /matches/:id/resume` - Resume a match
- `POST /matches/:id/complete` - Complete a match

### Commentary
- `POST /matches/:id/commentary` - Add commentary for a ball
- `GET /matches/:id/commentaries/latest` - Get latest 10 commentaries from cache

## Real-time Events

The application uses Socket.IO for real-time updates:

- `matchStarted` - New match created
- `commentaryAdded` - New commentary added
- `matchPaused` - Match paused
- `matchResumed` - Match resumed
- `matchCompleted` - Match completed

## Usage

1. **Start a Match**
   - Fill in team names, venue, and date
   - Click "Start Match" to create a new match

2. **Add Commentary**
   - Navigate to a match by clicking on it
   - Use the commentary form to add ball-by-ball updates
   - Select event type, add description, and specify runs/extra runs
   - Commentary updates appear in real-time

3. **Match Controls**
   - Pause/Resume matches as needed
   - Complete matches when finished
   - View live score updates

4. **Live Updates**
   - All commentary and match status changes are broadcast in real-time
   - Multiple users can view the same match simultaneously
   - No page refresh required for updates

## Database Schema

### Match Collection
```typescript
{
  matchId: string,        // 4-digit auto-incremented ID
  team1: string,
  team2: string,
  venue: string,
  date: Date,
  status: 'active' | 'paused' | 'completed',
  team1Score: number,
  team2Score: number,
  team1Wickets: number,
  team2Wickets: number,
  currentOver: number,
  currentBall: number,
  battingTeam: 'team1' | 'team2'
}
```

### Commentary Collection
```typescript
{
  matchId: ObjectId,      // Reference to match
  over: number,
  ball: number,
  eventType: 'run' | 'wicket' | 'wide' | 'no-ball' | 'bye' | 'leg-bye' | 'dot' | 'four' | 'six',
  description: string,
  runs: number,
  isWicket: boolean,
  isExtra: boolean,
  extraType: string,
  extraRuns: number,
  batsman: string,
  bowler: string
}
```

## Bonus Features Implemented

1. **Pause/Resume Functionality**: Matches can be paused and resumed
2. **Redis Caching**: Latest 10 commentary entries are cached in Redis
3. **Auto-incrementing Match IDs**: 4-digit unique IDs using Redis counter
4. **Real-time Updates**: All changes broadcast via Socket.IO
5. **Comprehensive Commentary**: Support for various cricket events
6. **Modern UI**: Beautiful design with smooth animations

## Development

### Backend Development
```bash
cd backend
npm run start:dev
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Running Tests
```bash
cd backend
npm run test
```

## Project Structure

```
cricket-scoring-app/
├── backend/
│   ├── src/
│   │   ├── matches/
│   │   │   ├── dto/
│   │   │   ├── schemas/
│   │   │   ├── matches.controller.ts
│   │   │   ├── matches.service.ts
│   │   │   └── matches.module.ts
│   │   ├── redis/
│   │   │   ├── redis.service.ts
│   │   │   └── redis.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── app/
│   │   ├── match/[id]/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── AddCommentaryForm.tsx
│   │   ├── CommentaryList.tsx
│   │   ├── MatchControls.tsx
│   │   ├── MatchList.tsx
│   │   └── StartMatchForm.tsx
│   ├── package.json
│   └── tsconfig.json
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 