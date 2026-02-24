# ✅ Strike System - Already Correct!

## Current Implementation

The strike system is already implemented correctly as per your requirements:
- **3 strikes per question** (not per round)
- **Strikes reset to 0** when moving to next question
- **Scores are preserved** across questions

## How It Works

### When Host Clicks "Next Question":

1. **Server** (`server/websocket.js`):
   ```javascript
   // Reset strikes and buzzer for new question
   game.teams.forEach(team => {
     team.strikes = 0;
   });
   ```

2. **Display Page** (`app/display/page.tsx`):
   ```javascript
   teams: prevGame.teams.map(team => ({
     ...team,
     strikes: 0,      // Reset strikes
     score: team.score // Keep the score!
   }))
   ```

3. **Host Page** (`app/host/page.tsx`):
   ```javascript
   teams: prevGame.teams.map((team: any) => ({
     ...team,
     strikes: 0,      // Reset strikes
     score: team.score // Keep the score!
   }))
   ```

## Example Flow

### Question 1:
- Team A: 0 strikes, 0 points
- Host adds strike → Team A: 1 strike
- Host adds strike → Team A: 2 strikes
- Host adds strike → Team A: 3 strikes
- Team A reveals answer → Team A: 3 strikes, 50 points

### Host Clicks "Next Question":
- **Strikes reset to 0**
- **Scores preserved**

### Question 2:
- Team A: 0 strikes, 50 points ✅
- Team B: 0 strikes, 0 points ✅

## What Resets vs What Persists

### Resets on Question Change:
- ✅ Strikes (back to 0)
- ✅ Buzzer state (cleared)
- ✅ Question visibility (hidden)
- ✅ Answer reveals (all hidden again)

### Persists Across Questions:
- ✅ Team scores
- ✅ Team names
- ✅ Team players
- ✅ Round progress

## Testing

1. Start a game
2. Add 3 strikes to Team A
3. Click "Next Question"
4. Check Team A strikes → Should be 0
5. Check Team A score → Should be preserved

## Console Logging

When you click "Next Question", you'll see:
```
➡️ Moving to next question
✅ Next question in round 1
📨 QUESTION_CHANGED from server
   New round index: 0
   New question index: 1
✅ Host game state updated
```

## Summary

✅ Strike system is already working correctly
✅ 3 strikes per question (not per round)
✅ Strikes reset to 0 on question change
✅ Scores are preserved
✅ No changes needed!

The implementation is already exactly as you described!
