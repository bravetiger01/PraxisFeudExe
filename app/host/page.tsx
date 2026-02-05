'use client';

import { useState, useEffect, useRef } from 'react';
import { Game, WSMessage, Team, Player } from '../../types/game';

export default function HostPage() {
  const [game, setGame] = useState<Game | null>(null);
  const [waitingPlayers, setWaitingPlayers] = useState<{id: string, name: string}[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [showTeamManagement, setShowTeamManagement] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket
    wsRef.current = new WebSocket('ws://localhost:8080');
    
    wsRef.current.onopen = () => {
      setIsConnected(true);
      // Create game
      wsRef.current?.send(JSON.stringify({
        type: 'host_create',
        data: {}
      }));
    };

    wsRef.current.onmessage = (event) => {
      const message: WSMessage = JSON.parse(event.data);
      
      switch (message.type) {
        case 'game_created':
          setGame(message.data.game);
          break;
        case 'player_joined':
          setWaitingPlayers(prev => [...prev, {
            id: message.data.playerId,
            name: message.data.playerName
          }]);
          break;
        case 'game_update':
          setGame(message.data.game);
          break;
        case 'buzzer_pressed':
          // Update game state when buzzer is pressed
          setGame(prevGame => prevGame ? {
            ...prevGame,
            buzzerPressed: message.data,
            gameState: 'answering'
          } : null);
          break;
      }
    };

    wsRef.current.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  const sendHostAction = (action: any) => {
    if (wsRef.current && game) {
      wsRef.current.send(JSON.stringify({
        type: 'host_action',
        gameCode: game.code,
        data: action
      }));
    }
  };

  const addPointsToTeam = (teamId: string, points: number) => {
    sendHostAction({
      type: 'add_points',
      data: { teamId, points }
    });
  };

  const createTeam = (teamName: string) => {
    sendHostAction({
      type: 'manage_teams',
      data: {
        operation: 'create_team',
        teamName
      }
    });
  };

  const removePlayerFromTeam = (playerId: string, teamId: string) => {
    sendHostAction({
      type: 'manage_teams',
      data: {
        operation: 'remove_player',
        playerId,
        teamId
      }
    });
  };

  const addPlayerToTeam = (playerId: string, playerName: string, teamId: string) => {
    sendHostAction({
      type: 'manage_teams',
      data: {
        operation: 'add_player',
        playerId,
        playerName,
        teamId
      }
    });
    
    // Remove from waiting list
    setWaitingPlayers(prev => prev.filter(p => p.id !== playerId));
  };

  const revealAnswer = (answerIndex: number) => {
    sendHostAction({
      type: 'reveal_answer',
      data: { answerIndex }
    });
  };

  const addStrike = (teamId: string) => {
    sendHostAction({
      type: 'add_strike',
      data: { teamId }
    });
  };

  const startGame = () => {
    sendHostAction({
      type: 'start_game'
    });
  };

  const enableBuzzer = () => {
    sendHostAction({
      type: 'enable_buzzer'
    });
  };

  const resetBuzzer = () => {
    sendHostAction({
      type: 'reset_buzzer'
    });
  };

  const nextQuestion = () => {
    sendHostAction({
      type: 'next_question'
    });
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Connecting to server...</div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Creating game...</div>
      </div>
    );
  }

  const currentRound = game.rounds[game.currentRoundIndex];
  const currentQuestion = currentRound?.questions[currentRound.currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Feud.Exe - Host Control</h1>
              <p className="text-gray-300">Game Code: <span className="text-2xl font-mono bg-blue-600 px-3 py-1 rounded">{game.code}</span></p>
            </div>
            <div className="text-right">
              <p className="text-lg">Round {game.currentRoundIndex + 1} of 3</p>
              <p className="text-gray-300">Question {currentRound?.currentQuestionIndex + 1} of 3</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Teams Management */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Teams</h2>
              <button
                onClick={() => setShowTeamManagement(true)}
                className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm"
              >
                Team Management
              </button>
            </div>
            
            {game.teams.map((team: Team) => (
              <div key={team.id} className="mb-6 p-4 bg-gray-700 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{team.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">{team.score}</span>
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 rounded-full ${
                            i < team.strikes ? 'bg-red-500' : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {team.players.map((player: Player) => (
                    <div key={player.id} className="flex justify-between items-center text-sm bg-gray-600 p-2 rounded">
                      <span>{player.name}</span>
                      <button
                        onClick={() => removePlayerFromTeam(player.id, team.id)}
                        className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 space-y-2">
                  <button
                    onClick={() => addStrike(team.id)}
                    className="w-full bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                    disabled={team.strikes >= 3}
                  >
                    Add Strike
                  </button>
                  
                  {/* Point Addition Buttons */}
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => addPointsToTeam(team.id, 10)}
                      className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => addPointsToTeam(team.id, 25)}
                      className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
                    >
                      +25
                    </button>
                    <button
                      onClick={() => addPointsToTeam(team.id, 50)}
                      className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
                    >
                      +50
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Waiting Players */}
            {waitingPlayers.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Waiting Players</h3>
                {waitingPlayers.map((player) => (
                  <div key={player.id} className="bg-gray-700 p-3 rounded mb-2">
                    <div className="flex justify-between items-center">
                      <span>{player.name}</span>
                      <div className="space-x-2">
                        <button
                          onClick={() => addPlayerToTeam(player.id, player.name, 'team1')}
                          className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
                        >
                          Team 1
                        </button>
                        <button
                          onClick={() => addPlayerToTeam(player.id, player.name, 'team2')}
                          className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
                        >
                          Team 2
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Current Question */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6">
            {/* Buzzer Alert */}
            {game.buzzerPressed && (
              <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-lg p-6 mb-6 text-center animate-pulse shadow-2xl border-4 border-yellow-400">
                <div className="text-4xl mb-2">🚨</div>
                <h2 className="text-3xl font-bold text-white mb-2">BUZZER PRESSED!</h2>
                <p className="text-2xl text-yellow-300 font-bold mb-1">
                  {game.buzzerPressed.playerName}
                </p>
                <p className="text-lg text-red-200">
                  Team: {game.teams.find(t => t.id === game.buzzerPressed?.teamId)?.name || 'Unknown'}
                </p>
                <div className="text-sm text-yellow-200 mt-2 animate-bounce">
                  ⚡ FIRST TO BUZZ! ⚡
                </div>
                <div className="mt-4">
                  <button
                    onClick={resetBuzzer}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-2 rounded-lg"
                  >
                    Reset Buzzer
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Current Question</h2>
              <div className="space-x-2">
                {game.gameState === 'waiting' && (
                  <button
                    onClick={startGame}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                  >
                    Start Game
                  </button>
                )}
                {game.gameState === 'playing' && (
                  <button
                    onClick={enableBuzzer}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                  >
                    Enable Buzzer
                  </button>
                )}
                <button
                  onClick={resetBuzzer}
                  className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded"
                  disabled={!game.buzzerPressed}
                >
                  Reset Buzzer
                </button>
                <button
                  onClick={nextQuestion}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                >
                  Next Question
                </button>
              </div>
            </div>

            {currentQuestion && (
              <div>
                <div className="bg-gray-700 p-4 rounded-lg mb-4">
                  <h3 className="text-lg font-semibold mb-2">{currentQuestion.text}</h3>
                  
                  {game.buzzerPressed && (
                    <div className="bg-red-600 p-3 rounded mb-4">
                      <p className="font-bold">
                        🔥 {game.buzzerPressed.playerName} buzzed in!
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {currentQuestion.answers.map((answer, index) => (
                    <div key={index} className="space-y-2">
                      <div
                        className={`p-3 rounded-lg flex justify-between items-center ${
                          answer.revealed 
                            ? 'bg-green-600' 
                            : 'bg-gray-700 hover:bg-gray-600 cursor-pointer'
                        }`}
                        onClick={() => !answer.revealed && revealAnswer(index)}
                      >
                        <span className="font-semibold">
                          {answer.revealed ? answer.text : `Answer ${index + 1}`}
                        </span>
                        <span className="text-xl font-bold">
                          {answer.revealed ? answer.points : '?'}
                        </span>
                      </div>
                      
                      {/* Point Assignment Buttons - Only show when answer is revealed */}
                      {answer.revealed && (
                        <div className="flex justify-center space-x-2">
                          <span className="text-sm text-gray-300">Give {answer.points} points to:</span>
                          {game.teams.map((team) => (
                            <button
                              key={team.id}
                              onClick={() => addPointsToTeam(team.id, answer.points)}
                              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
                            >
                              {team.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Game State */}
        <div className="mt-6 bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span>Game State: <span className="font-bold capitalize">{game.gameState}</span></span>
            <span>Current Turn: <span className="font-bold">{
              game.teams.find(t => t.id === game.currentTeamTurn)?.name || 'None'
            }</span></span>
          </div>
        </div>
      </div>

      {/* Team Management Modal */}
      {showTeamManagement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Team Management</h2>
              <button
                onClick={() => setShowTeamManagement(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Create New Team */}
            <div className="mb-6 p-4 bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Create New Team</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Enter team name"
                  className="flex-1 px-3 py-2 bg-gray-600 text-white rounded"
                />
                <button
                  onClick={() => {
                    if (newTeamName.trim()) {
                      createTeam(newTeamName.trim());
                      setNewTeamName('');
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                >
                  Create
                </button>
              </div>
            </div>

            {/* Existing Teams */}
            <div className="space-y-4">
              {game?.teams.map((team) => (
                <div key={team.id} className="p-4 bg-gray-700 rounded-lg">
                  <h4 className="text-lg font-semibold mb-2">{team.name}</h4>
                  <div className="space-y-2">
                    {team.players.map((player) => (
                      <div key={player.id} className="flex justify-between items-center bg-gray-600 p-2 rounded">
                        <span>{player.name}</span>
                        <button
                          onClick={() => removePlayerFromTeam(player.id, team.id)}
                          className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Waiting Players */}
            {waitingPlayers.length > 0 && (
              <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">Assign Waiting Players</h4>
                {waitingPlayers.map((player) => (
                  <div key={player.id} className="flex justify-between items-center bg-gray-600 p-2 rounded mb-2">
                    <span>{player.name}</span>
                    <div className="space-x-2">
                      {game?.teams.map((team) => (
                        <button
                          key={team.id}
                          onClick={() => addPlayerToTeam(player.id, player.name, team.id)}
                          className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
                        >
                          {team.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}