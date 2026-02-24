# 🔍 Debug Strike Persistence Issue

## The Problem

Strikes are reset to 0 when clicking "Next Question", but when clicking "Show Question on Display", the teams get all 3 strikes back.

## Debug Logging Added

I've added detailed logging to help identify where the strikes are coming from.

## How to Debug

1. **Start the WebSocket server**:
   ```bash
   npm run ws-server
   ```

2. **Watch the server console** when you:
   - Click "Next Question"
   - Click "Show Question on Display"

### Expected Console Output

#### When Clicking "Next Question":
```
➡️ Moving to next question
🔄 Resetting strikes for all teams...
   Team 0 (Team A) strikes before: 3
   Team 0 (Team A) strikes after: 0
   Team 1 (Team B) strikes before: 0
   Team 1 (Team B) strikes after: 0
✅ Game saved with reset strikes
🔍 Verifying saved strikes:
   Team 0 (Team A) strikes in DB: 0
   Team 1 (Team B) strikes in DB: 0
```

#### When Clicking "Show Question":
```
👁️ Showing question on display
🔍 Current strikes before showing question:
   Team 0 (Team A) strikes: 0
   Team 1 (Team B) strikes: 0
👁️ game.questionVisible after save: true
```

## What to Look For

### If strikes are NOT 0 in "Verifying saved strikes":
**Problem**: Strikes aren't being saved to database
**Solution**: The `markModified('teams')` should fix this

### If strikes ARE 0 in verification, but NOT 0 when showing question:
**Problem**: Game object is being reloaded from old cache
**Solution**: Need to reload game from database before showing

### If strikes ARE 0 when showing, but display shows 3 strikes:
**Problem**: Client-side issue - old state not being cleared
**Solution**: Need to fix client state management

## Next Steps

1. Run the game with server console visible
2. Click "Next Question"
3. Copy ALL console output
4. Click "Show Question"
5. Copy ALL console output
6. Share the logs so I can identify the exact issue

## Possible Fixes

### Fix 1: Force Reload Game Before Show Question
If the game object is cached, we need to reload it:

```javascript
case 'show_question':
  // Reload game from database to get fresh data
  game = await Game.findOne({ code: message.gameCode });
  game.questionVisible = true;
  await game.save();
  // ...
```

### Fix 2: Broadcast Full Game State After Reset
Send the complete game state after resetting strikes:

```javascript
case 'next_question':
  // Reset strikes
  game.teams.forEach(team => {
    team.strikes = 0;
  });
  await game.save();
  
  // Broadcast full game state
  broadcast(message.gameCode, {
    type: 'game_update',
    data: { game: game.toObject() }
  });
```

### Fix 3: Clear Client State More Aggressively
Force client to reset strikes immediately:

```javascript
broadcast(message.gameCode, {
  type: 'force_strike_reset',
  data: { }
});
```

## Testing Commands

Run these in the server console to check database:

```javascript
// Check current game state
const game = await Game.findOne({ code: 'YOUR_GAME_CODE' });
console.log('Team strikes:', game.teams.map(t => ({ name: t.name, strikes: t.strikes })));
```

## Summary

The logging will help us identify:
1. Are strikes being saved to database? ✅ or ❌
2. Are strikes being loaded correctly? ✅ or ❌
3. Is the client state the problem? ✅ or ❌

**Please run the game and share the console output!**
