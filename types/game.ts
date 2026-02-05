export interface Player {
  id: string;
  name: string;
  teamId: string;
  isConnected: boolean;
}

export interface Team {
  id: string;
  name: string;
  score: number;
  players: Player[];
  strikes: number;
}

export interface Answer {
  text: string;
  points: number;
  revealed: boolean;
}

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
  currentAnswerIndex: number;
}

export interface Round {
  id: string;
  name: string;
  questions: Question[];
  currentQuestionIndex: number;
}

export interface Game {
  id: string;
  code: string;
  hostId: string;
  teams: Team[];
  rounds: Round[];
  currentRoundIndex: number;
  currentTeamTurn: string;
  gameState: 'waiting' | 'playing' | 'buzzer' | 'answering' | 'finished';
  buzzerPressed: {
    playerId: string;
    playerName: string;
    teamId: string;
    timestamp: number;
  } | null;
  createdAt: Date;
  isActive: boolean;
}

export interface WSMessage {
  type: 'host_create' | 'player_join' | 'buzzer_press' | 'host_action' | 'game_update' | 'error' | 'game_created' | 'joined_game' | 'player_joined' | 'buzzer_pressed' | 'buzzer_too_late';
  data: any;
  gameCode?: string;
  playerId?: string;
  teamId?: string;
}

export interface HostAction {
  type: 'reveal_answer' | 'next_question' | 'next_round' | 'reset_buzzer' | 'add_strike' | 'update_score' | 'manage_teams' | 'start_game' | 'enable_buzzer' | 'add_points';
  data?: any;
}