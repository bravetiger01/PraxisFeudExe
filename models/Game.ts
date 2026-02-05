import mongoose from 'mongoose';

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

export default mongoose.models.Game || mongoose.model('Game', GameSchema);