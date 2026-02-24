# ✅ Strike Bug Fixed!

## The Bug

When host clicked "Show Question" button, the 3 strikes from the previous question were reappearing, even though they were reset to 0 when moving to the next question.

## Root Cause

In the `show_question` handler, the server was broadcasting a full `game_update` message with the entire game object from the database. This was overwriting the client's state with old data.

```javascript
// OLD CODE (BUGGY):
case 'show_question':
  game.questionVisible = true;
  await game.save();
  
  broadcast(message.gameCode, {
    type: 'question_visibility_changed',
    data: { questionVisible: true }
  });
  
  // This was causing the bug - sending full game state
  broadcast(message.gameCode, {
    type: 'game_update',
    data: { game: gameObj }  // ❌ Overwrites client state
  });
```

## The Fix

Removed the unnecessary `game_update` broadcast from the `show_question` handler. The `question_visibility_changed` message is sufficient.

```javascript
// NEW CODE (FIXED):
case 'show_question':
  game.questionVisible = true;
  await game.save();
  
  broadcast(message.gameCode, {
    type: 'question_visibility_changed',
    data: { questionVisible: true }
  });
  
  // No game_update needed - just toggle visibility
  return;
```

## Why This Works

1. **Next Question** resets strikes to 0 and saves to database
2. **Show Question** only changes visibility flag
3. Client state maintains the correct strike count (0)
4. No full game state overwrite occurs

## File Changed

- `server/websocket.js` - Removed `game_update` broadcast from `show_question` handler

## Testing

1. Start a game
2. Add 3 strikes to Team A in Question 1
3. Click "Next Question"
4. Verify strikes show as 0
5. Click "Show Question on Display"
6. Verify strikes remain at 0 ✅ (Bug fixed!)

## Flow After Fix

### Question 1:
- Team A: 3 strikes
- Host clicks "Next Question"
- Strikes reset to 0 in database ✅
- Strikes reset to 0 in client ✅

### Question 2:
- Team A: 0 strikes ✅
- Host clicks "Show Question"
- Only visibility changes ✅
- Strikes remain at 0 ✅ (Fixed!)

## Summary

✅ Bug fixed
✅ Strikes properly reset per question
✅ Show question doesn't overwrite strike data
✅ Client state remains consistent

The strike system now works correctly:
- 3 strikes per question
- Strikes reset to 0 on question change
- Strikes stay at 0 when showing/hiding questions
