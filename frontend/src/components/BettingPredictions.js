import React, { useState, useEffect } from 'react';

function BettingPredictions({ gameId }) {
  const [pred, setPred] = useState(null);

  useEffect(() => {
    if (gameId) {
      fetch(`https://bettingedge-backend.onrender.com/api/nba/predictions/game/${gameId}`)
        .then(res => res.json())
        .then(data => setPred(data.predictions))
        .catch(() => setPred(null));
    }
  }, [gameId]);

  if (!gameId) return null;
  if (!pred) return <p className="text-sm text-gray-500">🔮 Calculating betting insights...</p>;

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg mb-6 border">
      <h3 className="font-bold text-indigo-800 mb-2">🎯 Smart Betting Predictions</h3>
      <div className="text-sm space-y-1">
        <p><strong>Best Bet:</strong> {pred.winner.team} to win ({pred.winner.confidence} confidence)</p>
        <p><strong>Over/Under {pred.overUnder.line}:</strong> <strong className="text-green-600">{pred.overUnder.pick}</strong> ({pred.overUnder.projected} projected)</p>
        <p><strong>Player Prop:</strong> {pred.playerProps.highScorer} > {pred.playerProps.pointsPrediction - 3} points</p>
      </div>
    </div>
  );
}

export default BettingPredictions;