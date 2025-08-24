import React, { useState, useEffect } from 'react';
import './App.css';

// Update this to your Render backend URL
const API_BASE = 'https://bettingedge-backend.onrender.com/api';

function App() {
  const [sport, setSport] = useState('nba');
  const [games, setGames] = useState([]);
  const [playerStats, setPlayerStats] = useState(null);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGames();
  }, [sport]);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${sport}/scoreboard`);
      const data = await res.json();
      setGames(data.games || []);
    } catch (err) {
      console.error('Failed to load games', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayer = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/nba/player/${id}`);
      const data = await res.json();
      setPlayerStats(data);
    } catch (err) {
      alert('Player not found');
    }
  };

  const samplePlayers = [
    { id: 3917, name: 'Stephen Curry', team: 'GSW' },
    { id: 3059, name: 'LeBron James', team: 'LAL' },
    { id: 4233, name: 'Luka Doncic', team: 'DAL' }
  ];

  return (
    <div className="App">
      <header className="bg-blue-800 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">BettingEdge Pro</h1>
        <p className="text-sm">Sports Analytics for Smarter Bets</p>
      </header>

      <div className="flex gap-4 p-4 bg-gray-100">
        <select
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="nba">NBA</option>
          <option value="nfl">NFL</option>
          <option value="mlb">MLB</option>
          <option value="nhl">NHL</option>
          <option value="cbb">College Basketball</option>
          <option value="cfb">College Football</option>
        </select>
      </div>

      {/* Player Search */}
      {sport === 'nba' && (
        <div className="p-4 bg-yellow-50 border-b">
          <strong>Quick Player Stats:</strong>
          {samplePlayers.map(p => (
            <button
              key={p.id}
              onClick={() => fetchPlayer(p.id)}
              className="ml-3 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      {/* Player Stats Modal */}
      {playerStats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold">{playerStats.name}</h3>
            <p>{playerStats.team} • #{playerStats.jersey} • {playerStats.position}</p>
            <p>Age: {playerStats.age} • {playerStats.height} • {playerStats.weight} lbs</p>
            <hr className="my-3" />
            <table className="w-full text-sm">
              <tbody>
                <tr><td>Points</td><td>{playerStats.stats.points}</td></tr>
                <tr><td>Rebounds</td><td>{playerStats.stats.rebounds}</td></tr>
                <tr><td>Assists</td><td>{playerStats.stats.assists}</td></tr>
                <tr><td>FG%</td><td>{playerStats.stats.fgPct}%</td></tr>
                <tr><td>3P%</td><td>{playerStats.stats.threePct}%</td></tr>
                <tr><td>FT%</td><td>{playerStats.stats.ftPct}%</td></tr>
              </tbody>
            </table>
            <button
              onClick={() => setPlayerStats(null)}
              className="mt-4 w-full bg-red-600 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Games List */}
      <main className="p-4">
        <h2 className="text-xl font-semibold mb-4 capitalize">{sport} Games</h2>
        {loading ? (
          <p>Loading...</p>
        ) : games.length === 0 ? (
          <p>No games scheduled or data unavailable.</p>
        ) : (
          <div className="space-y-4">
            {games.map(game => (
              <div
                key={game.id}
                className="border rounded-lg p-4 bg-white shadow-sm cursor-pointer"
                onClick={() => setSelectedGameId(game.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{game.name}</h3>
                    <p className="text-sm text-gray-600">{game.status}</p>
                  </div>
                  <div className="text-right">
                    <p><strong>{game.away.team}</strong> ({game.away.record}) - {game.away.score}</p>
                    <p><strong>{game.home.team}</strong> ({game.home.record}) - {game.home.score}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Betting Predictions */}
      {selectedGameId && (
        const BettingPredictions = lazy(() => import('./components/BettingPredictions'));
       import { lazy } from 'react';)}

      <footer className="text-center p-4 text-sm text-gray-500 border-t">
        For personal use only • Data from ESPN (unofficial API)
      </footer>
    </div>
  );
}

export default App;
