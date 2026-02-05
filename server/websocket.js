const WebSocket = require('ws');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://yashm13114:sh5VlCTZNnkShVVP@cluster0.lgqyj4p.mongodb.net/praxisFeudExe';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Game Schema
const AnswerSchema = new mongoose.Schema({
  text: { type: String, required: true },
  points: { type: Number, required: true },
  revealed: { type: Boolean, default: false }
});

const QuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  answers: [AnswerSchema],
  currentAnswerIndex: { type: Number, default: 0 }
});

const RoundSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  questions: [QuestionSchema],
  currentQuestionIndex: { type: Number, default: 0 }
});

const PlayerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  teamId: { type: String, required: true },
  isConnected: { type: Boolean, default: true }
});

const TeamSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  score: { type: Number, default: 0 },
  players: [PlayerSchema],
  strikes: { type: Number, default: 0 }
});

const GameSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  hostId: { type: String, required: true },
  teams: [TeamSchema],
  rounds: [RoundSchema],
  currentRoundIndex: { type: Number, default: 0 },
  currentTeamTurn: { type: String, default: '' },
  gameState: { 
    type: String, 
    enum: ['waiting', 'playing', 'buzzer', 'answering', 'finished'],
    default: 'waiting'
  },
  buzzerPressed: {
    playerId: String,
    playerName: String,
    teamId: String,
    timestamp: Number
  },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

const Game = mongoose.model('Game', GameSchema);

// Sample questions
const sampleQuestions = [
  {
    id: 'q1',
    text: 'Name something you do when you wake up in the morning',
    answers: [
      { text: 'Brush teeth', points: 45, revealed: false },
      { text: 'Check phone', points: 35, revealed: false },
      { text: 'Take shower', points: 25, revealed: false },
      { text: 'Drink water/coffee', points: 20, revealed: false },
      { text: 'Get dressed', points: 15, revealed: false }
    ],
    currentAnswerIndex: 0
  },
  {
    id: 'q2',
    text: 'Name a popular social media platform',
    answers: [
      { text: 'Instagram', points: 40, revealed: false },
      { text: 'WhatsApp', points: 35, revealed: false },
      { text: 'Facebook', points: 30, revealed: false },
      { text: 'Twitter/X', points: 25, revealed: false },
      { text: 'YouTube', points: 20, revealed: false }
    ],
    currentAnswerIndex: 0
  },
  {
    id: 'q3',
    text: 'Name something students do during exams',
    answers: [
      { text: 'Study all night', points: 45, revealed: false },
      { text: 'Drink coffee', points: 30, revealed: false },
      { text: 'Pray', points: 25, revealed: false },
      { text: 'Panic', points: 20, revealed: false },
      { text: 'Copy from friends', points: 15, revealed: false }
    ],
    currentAnswerIndex: 0
  },
  {
    id: 'q4',
    text: 'Name a popular programming language',
    answers: [
      { text: 'Python', points: 40, revealed: false },
      { text: 'JavaScript', points: 35, revealed: false },
      { text: 'Java', points: 30, revealed: false },
      { text: 'C++', points: 25, revealed: false },
      { text: 'C', points: 20, revealed: false }
    ],
    currentAnswerIndex: 0
  },
  {
    id: 'q5',
    text: 'Name something you do when your code doesn\'t work',
    answers: [
      { text: 'Google the error', points: 45, revealed: false },
      { text: 'Ask ChatGPT', points: 35, revealed: false },
      { text: 'Debug step by step', points: 25, revealed: false },
      { text: 'Restart the computer', points: 20, revealed: false },
      { text: 'Cry', points: 15, revealed: false }
    ],
    currentAnswerIndex: 0
  },
  {
    id: 'q6',
    text: 'Name a popular code editor/IDE',
    answers: [
      { text: 'VS Code', points: 50, revealed: false },
      { text: 'IntelliJ IDEA', points: 25, revealed: false },
      { text: 'Sublime Text', points: 20, revealed: false },
      { text: 'Atom', points: 15, revealed: false },
      { text: 'Notepad++', points: 10, revealed: false }
    ],
    currentAnswerIndex: 0
  },
  {
    id: 'q7',
    text: 'Name something students eat during late night study sessions',
    answers: [
      { text: 'Maggi/Instant noodles', points: 45, revealed: false },
      { text: 'Pizza', points: 30, revealed: false },
      { text: 'Chips', points: 25, revealed: false },
      { text: 'Biscuits', points: 20, revealed: false },
      { text: 'Chocolate', points: 15, revealed: false }
    ],
    currentAnswerIndex: 0
  },
  {
    id: 'q8',
    text: 'Name a reason students are late to class',
    answers: [
      { text: 'Overslept', points: 40, revealed: false },
      { text: 'Traffic', points: 30, revealed: false },
      { text: 'Couldn\'t find the classroom', points: 25, revealed: false },
      { text: 'Forgot about the class', points: 20, revealed: false },
      { text: 'Bus was late', points: 15, revealed: false }
    ],
    currentAnswerIndex: 0
  },
  {
    id: 'q9',
    text: 'Name something students do during boring lectures',
    answers: [
      { text: 'Use phone', points: 45, revealed: false },
      { text: 'Sleep', points: 35, revealed: false },
      { text: 'Doodle', points: 25, revealed: false },
      { text: 'Chat with friends', points: 20, revealed: false },
      { text: 'Daydream', points: 15, revealed: false }
    ],
    currentAnswerIndex: 0
  }
];

function getRandomQuestions() {
  const shuffled = [...sampleQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 9);
}

function generateGameCode() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

// WebSocket Server
const wss = new WebSocket.Server({ port: 8080 });
const clients = new Map();

function broadcast(gameCode, message, excludeId) {
  clients.forEach((client, clientId) => {
    if (client.gameCode === gameCode && clientId !== excludeId && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

async function createGame(hostId) {
  const gameCode = generateGameCode();
  const questions = getRandomQuestions();
  
  const rounds = [
    {
      id: 'round1',
      name: 'Round 1',
      questions: questions.slice(0, 3),
      currentQuestionIndex: 0
    },
    {
      id: 'round2', 
      name: 'Round 2',
      questions: questions.slice(3, 6),
      currentQuestionIndex: 0
    },
    {
      id: 'round3',
      name: 'Round 3', 
      questions: questions.slice(6, 9),
      currentQuestionIndex: 0
    }
  ];

  const teams = [
    {
      id: 'team1',
      name: 'Team 1',
      score: 0,
      players: [],
      strikes: 0
    },
    {
      id: 'team2', 
      name: 'Team 2',
      score: 0,
      players: [],
      strikes: 0
    }
  ];

  const gameData = {
    id: uuidv4(),
    code: gameCode,
    hostId,
    teams,
    rounds,
    currentRoundIndex: 0,
    currentTeamTurn: 'team1',
    gameState: 'waiting',
    buzzerPressed: null,
    createdAt: new Date(),
    isActive: true
  };

  const game = new Game(gameData);
  await game.save();
  
  return gameData;
}

wss.on('connection', (ws) => {
  ws.id = uuidv4();
  ws.playerId = ws.id; // Store player ID for easy access
  clients.set(ws.id, ws);
  
  console.log(`Client connected: ${ws.id}`);

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('Received:', message);
      
      switch (message.type) {
        case 'host_create':
          try {
            const game = await createGame(ws.id);
            ws.gameCode = game.code;
            ws.role = 'host';
            
            ws.send(JSON.stringify({
              type: 'game_created',
              data: { game, hostId: ws.id }
            }));
            
            console.log(`Game created: ${game.code}`);
          } catch (error) {
            console.error('Create game error:', error);
            ws.send(JSON.stringify({
              type: 'error',
              data: { message: 'Failed to create game' }
            }));
          }
          break;

        case 'player_join':
          try {
            const game = await Game.findOne({ code: message.gameCode, isActive: true });
            
            if (!game) {
              ws.send(JSON.stringify({
                type: 'error',
                data: { message: 'Game not found' }
              }));
              return;
            }

            ws.gameCode = message.gameCode;
            ws.playerId = ws.id;
            ws.role = 'player';

            ws.send(JSON.stringify({
              type: 'joined_game',
              data: { 
                game: game.toObject(),
                playerId: ws.id,
                playerName: message.data.playerName
              }
            }));

            // Notify host of new player
            broadcast(message.gameCode, {
              type: 'player_joined',
              data: {
                playerId: ws.id,
                playerName: message.data.playerName
              }
            }, ws.id);

            console.log(`Player joined: ${message.data.playerName} in game ${message.gameCode}`);
          } catch (error) {
            console.error('Join game error:', error);
            ws.send(JSON.stringify({
              type: 'error',
              data: { message: 'Failed to join game' }
            }));
          }
          break;

        case 'buzzer_press':
          try {
            const game = await Game.findOne({ code: message.gameCode, isActive: true });
            
            if (!game || game.gameState !== 'buzzer') {
              return;
            }

            // Allow all players to press buzzer, but only record the first one
            if (game.buzzerPressed) {
              // Buzzer already pressed, but still send response to this player
              ws.send(JSON.stringify({
                type: 'buzzer_too_late',
                data: {
                  winner: game.buzzerPressed.playerName,
                  winnerTeam: game.buzzerPressed.teamId
                }
              }));
              return;
            }

            let playerName = '';
            let teamId = '';
            
            for (const team of game.teams) {
              const player = team.players.find(p => p.id === ws.id);
              if (player) {
                playerName = player.name;
                teamId = team.id;
                break;
              }
            }

            game.buzzerPressed = {
              playerId: ws.id,
              playerName,
              teamId,
              timestamp: Date.now()
            };
            game.gameState = 'answering';
            
            await game.save();

            broadcast(message.gameCode, {
              type: 'buzzer_pressed',
              data: {
                playerId: ws.id,
                playerName,
                teamId,
                timestamp: Date.now()
              }
            });

            // Also send game update to sync the full game state
            broadcast(message.gameCode, {
              type: 'game_update',
              data: { game: game.toObject() }
            });

            console.log(`Buzzer pressed by: ${playerName}`);
          } catch (error) {
            console.error('Buzzer press error:', error);
          }
          break;

        case 'host_action':
          try {
            const game = await Game.findOne({ code: message.gameCode, isActive: true });
            
            if (!game || game.hostId !== ws.id) {
              return;
            }

            const action = message.data;
            
            switch (action.type) {
              case 'start_game':
                game.gameState = 'playing';
                break;

              case 'enable_buzzer':
                game.gameState = 'buzzer';
                game.buzzerPressed = null;
                break;

              case 'add_points':
                const targetTeam = game.teams.find(t => t.id === action.data.teamId);
                if (targetTeam) {
                  targetTeam.score += action.data.points;
                }
                break;

              case 'reveal_answer':
                const currentRound = game.rounds[game.currentRoundIndex];
                const currentQuestion = currentRound.questions[currentRound.currentQuestionIndex];
                const answerIndex = action.data.answerIndex;
                
                if (currentQuestion.answers[answerIndex]) {
                  currentQuestion.answers[answerIndex].revealed = true;
                  
                  const currentTeam = game.teams.find(t => t.id === game.currentTeamTurn);
                  if (currentTeam) {
                    currentTeam.score += currentQuestion.answers[answerIndex].points;
                  }
                }
                break;

              case 'add_strike':
                const team = game.teams.find(t => t.id === action.data.teamId);
                if (team && team.strikes < 3) {
                  team.strikes += 1;
                }
                break;

              case 'reset_buzzer':
                game.buzzerPressed = null;
                game.gameState = 'buzzer';
                break;

              case 'next_question':
                const round = game.rounds[game.currentRoundIndex];
                if (round.currentQuestionIndex < round.questions.length - 1) {
                  round.currentQuestionIndex += 1;
                } else if (game.currentRoundIndex < game.rounds.length - 1) {
                  game.currentRoundIndex += 1;
                  game.rounds[game.currentRoundIndex].currentQuestionIndex = 0;
                } else {
                  game.gameState = 'finished';
                }
                
                game.teams.forEach(team => {
                  team.strikes = 0;
                });
                game.buzzerPressed = null;
                if (game.gameState !== 'finished') {
                  game.gameState = 'buzzer';
                }
                break;

              case 'manage_teams':
                if (action.data.operation === 'add_player') {
                  const targetTeam = game.teams.find(t => t.id === action.data.teamId);
                  if (targetTeam) {
                    targetTeam.players.push({
                      id: action.data.playerId,
                      name: action.data.playerName,
                      teamId: action.data.teamId,
                      isConnected: true
                    });
                  }
                } else if (action.data.operation === 'remove_player') {
                  const targetTeam = game.teams.find(t => t.id === action.data.teamId);
                  if (targetTeam) {
                    targetTeam.players = targetTeam.players.filter(p => p.id !== action.data.playerId);
                  }
                } else if (action.data.operation === 'create_team') {
                  const newTeam = {
                    id: `team_${Date.now()}`,
                    name: action.data.teamName,
                    score: 0,
                    players: [],
                    strikes: 0
                  };
                  game.teams.push(newTeam);
                }
                break;
            }

            await game.save();

            broadcast(message.gameCode, {
              type: 'game_update',
              data: { game: game.toObject() }
            });

            console.log(`Host action: ${action.type}`);
          } catch (error) {
            console.error('Host action error:', error);
          }
          break;
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        data: { message: 'Invalid message format' }
      }));
    }
  });

  ws.on('close', () => {
    clients.delete(ws.id);
    console.log(`Client disconnected: ${ws.id}`);
  });
});

console.log('WebSocket server running on port 8080');
console.log('MongoDB connected to:', MONGODB_URI);