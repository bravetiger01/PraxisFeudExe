# Feud.Exe - Execution Begins With The Beep

An engaging quiz-style event inspired by Family Feud, where teams of friends compete instead of families. Built with Next.js, WebSocket, and MongoDB.

## Features

- **Host Interface**: Create games, manage teams, control questions and answers
- **Player Interface**: Join games with buzzer functionality
- **Display Interface**: TV/Projector display for audience viewing
- **Real-time Communication**: WebSocket-based real-time updates
- **Team Management**: Add/remove players, track scores and strikes
- **3 Rounds**: 9 questions total (3 per round)
- **Survey-based Questions**: Mix of technical and non-technical questions

## Game Flow

1. **Host creates a game** → Gets a 4-digit game code
2. **Players join** using the game code and their names
3. **Host assigns players to teams** (Team 1 vs Team 2)
4. **Display screen** shows questions and answers for audience
5. **Players use buzzer** to answer questions
6. **Host reveals answers** and manages scoring
7. **3 rounds of 3 questions each** with cumulative scoring

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone and install dependencies:**
```bash
git clone <your-repo>
cd feud-exe
npm install
```

2. **Environment Setup:**
Create `.env.local` file:
```env
MONGODB_URI=mongodb+srv://yashm13114:sh5VlCTZNnkShVVP@cluster0.lgqyj4p.mongodb.net/praxisFeudExe
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

3. **Run the application:**

**Option 1: Run both servers together**
```bash
npm run dev-full
```

**Option 2: Run separately**
```bash
# Terminal 1: WebSocket Server
npm run ws-server

# Terminal 2: Next.js App
npm run dev
```

4. **Access the application:**
- Main page: http://localhost:3000
- Host interface: http://localhost:3000/host
- Player interface: http://localhost:3000/player?code=XXXX&name=PlayerName
- Display interface: http://localhost:3000/display?code=XXXX

## How to Play

### For Hosts:
1. Click "Host New Game" on the main page
2. Share the 4-digit game code with players
3. Assign joining players to Team 1 or Team 2
4. Start the game and manage questions:
   - Click answers to reveal them
   - Add strikes for wrong answers
   - Reset buzzer between questions
   - Move to next question/round

### For Players:
1. Enter the game code and your name
2. Wait for host to assign you to a team
3. When a question appears, press the buzzer if you know the answer
4. Wait for the host to call on you if you buzzed first

### For Display (TV/Projector):
1. Enter the game code
2. Display will show:
   - Current question
   - Team scores and strikes
   - Revealed answers
   - Buzzer status

## Game Rules

- **Teams**: 2 teams of up to 4 players each
- **Rounds**: 3 rounds with 3 questions each
- **Buzzer System**: First player to buzz gets to answer
- **Strikes**: Teams get up to 3 strikes per question
- **Scoring**: Points based on survey popularity (higher = more points)
- **Winning**: Team with highest total score after all rounds

## Technical Architecture

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Node.js WebSocket server
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: WebSocket connections for live updates
- **State Management**: React hooks with WebSocket synchronization

## File Structure

```
feud-exe/
├── app/                    # Next.js app directory
│   ├── host/              # Host interface
│   ├── player/            # Player buzzer interface
│   ├── display/           # TV display interface
│   └── page.tsx           # Main landing page
├── server/                # WebSocket server
│   └── websocket.js       # Main server file
├── types/                 # TypeScript definitions
├── lib/                   # Utilities and database
├── models/                # MongoDB schemas
└── public/                # Static assets
```

## Customization

### Adding Questions:
Edit `lib/gameData.ts` or `server/websocket.js` to modify the question pool.

### Styling:
Modify Tailwind classes in components for different themes.

### Game Rules:
Adjust scoring, strikes, or round structure in the WebSocket server logic.

## Deployment

### Development:
```bash
npm run dev-full
```

### Production:
1. Build the Next.js app: `npm run build`
2. Deploy the WebSocket server to a cloud service
3. Update WebSocket URL in environment variables
4. Deploy Next.js app to Vercel/Netlify

## Troubleshooting

**WebSocket Connection Issues:**
- Ensure WebSocket server is running on port 8080
- Check firewall settings
- Verify MongoDB connection

**Players Can't Join:**
- Confirm game code is correct (4 characters)
- Check WebSocket server logs
- Ensure game is still active

**Display Not Updating:**
- Refresh the display page
- Check WebSocket connection
- Verify game code

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use for your college events!

---

**Event Details:**
- Name: Feud.Exe
- Tagline: Execution Begins With The Beep
- Expected Participants: 80
- Entry Fee: ₹60
- Team Size: 4
- Duration: 2 Hours
- Budget: ₹2,000