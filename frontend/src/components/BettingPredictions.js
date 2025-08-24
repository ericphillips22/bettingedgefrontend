import React from 'react';

function BettingPredictions({ gameId }) {
  // Simulated prediction data (until backend is ready)
  const pred = {
    winner: { team: "Lakers", confidence: "76%" },
    overUnder: { line: 220.5, projected: "224.3", pick: "Over" },
    playerProps: { highScorer: "LeBron James", pointsPrediction: 29 }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg mb-6 border border-purple-200">
      <h3 className="font-bold text-purple-800 mb-3">🎯 BettingEdge Predictions</h3>
      <div className="space-y-2 text-sm">
        <div>
          <strong>Best Bet:</strong>{' '}
          <span className="text-green-600 font-medium">{pred.winner.team}</span>{' '}
          to win ({pred.winner.confidence} confidence)
        </div>
        <div>
          <strong>Over/Under {pred.overUnder.line}:</strong>{' '}
          <span className="text-blue-600 font-bold">{pred.overUnder.pick}</span>{' '}
          (Projected: {pred.overUnder.projected})
        </div>
        <div>
          <strong>Player Prop:</strong> {pred.playerProps.highScorer}{' '}
          to score <strong>~{pred.playerProps.pointsPrediction}</strong> points
        </div>
      </div>
    </div>
  );
}

export default BettingPredictions;
