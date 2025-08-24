import React, { useState, useEffect, lazy, Suspense } from 'react';
import './App.css';

// Lazy load components
const BettingPredictions = lazy(() => import('./components/BettingPredictions'));

// API Base (Update if your backend URL changes)
const API_BASE = 'https://bettingedge-backend.onrender.com/api';

// Sport Display Names
const SPORT_NAMES = {
  nba: 'NBA',
  nfl: 'NFL',
  mlb: 'MLB',
  nhl: 'NHL',
  cbb: 'College Basketball',
  cfb: 'College Football'
};

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
      const games = (data.games || []).map(game => {
        const comp = game.competitions?.[0];
        const home = comp?.competitors?.[0] || {};
        const away = comp?.competitors?.[1] || {};

        return {
          id: game.id,
          name: game.name,
          status: game.status?.type?.description || 'Scheduled',
          startTime: game.date,
          home: {
            team: home.team?.displayName || 'Home Team',
            score: home.score?.value || 0,
            winner: home.winner || false,
            record: (home.records || []).map(r => r.summary).join(', ') || '',
            teamId: home.team?.id
          },
          away: {
            team: away.team?.displayName || 'Away Team',
            score: away.score?.value || 0,
            winner: away.winner || false,
            record: (away.records || []).map(r => r.summary).join(', ') || '',
            teamId: away.team?.id
          }
        };
      });
      setGames(games);
    } catch (err) {
      console.error(`Failed to load ${sport} games`, err);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch NBA Player Stats
  const fetchPlayer = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/nba/player/${id}`);
      const data = await res.json();
      setPlayerStats(data);
    } catch (err) {
      alert('Player not found or API error');
    }
  };

  // Sample NBA Players for Quick Search
  const samplePlayers = [
    { id: 3917, name: 'Stephen Curry', team: 'GSW' },
    { id: 3059, name: 'LeBron James', team: 'LAL' },
    { id: 4233, name: 'Luka Doncic', team: 'DAL' },
    { id: 4395, name: 'Giannis Antetokounmpo', team: 'MIL' }
  ];

  return (
    <div className="App">
      <header className="bg-blue-800 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">BettingEdge Pro</h1>
        <p className="text-sm">Live Sports Analytics for Smarter Bets</p>
      </header>

      {/* Sport Selector */}
      <div className="flex gap-4 p-4 bg-gray-100 flex-wrap">
        {Object.entries(SPORT_NAMES).map(([key, name]) => (
          <button
            key={key}
            onClick={() => setSport(key)}
            className={`px-4 py-2 rounded font-medium ${
              sport === key
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 hover:bg-gray-200'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Player Search (NBA only) */}
      {sport === 'nba' && (
        <div className="p-4 bg-yellow-50 border-b">
          <strong>🔍 Quick Player Stats:</strong>
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
          <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-center mb-1">{playerStats.name}</h3>
            <p className="text-center text-gray-600">
              {playerStats.team} • #{playerStats.jersey} • {playerStats.position}
            </p>
            <p className="text-center text-sm text-gray-500 mb-4">
              Age: {playerStats.age} • {playerStats.height} • {playerStats.weight} lbs
            </p>

            <hr className="my-3" />

            <table className="w-full text-sm border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="font-medium py-1">Points</td>
                  <td className="py-1">{playerStats.stats.points}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-medium py-1">Rebounds</td>
                  <td className="py-1">{playerStats.stats.rebounds}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-medium py-1">Assists</td>
                  <td className="py-1">{playerStats.stats.assists}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-medium py-1">Steals</td>
                  <td className="py-1">{playerStats.stats.steals}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-medium py-1">Blocks</td>
                  <td className="py-1">{playerStats.stats.blocks}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-medium py-1">FG%</td>
                  <td className="py-1">{playerStats.stats.fgPct}%</td>
                </tr>
                <tr className="border-b">
                  <td className="font-medium py-1">3P%</td>
                  <td className="py-1">{playerStats.stats.threePct}%</td>
                </tr>
                <tr className="border-b">
                  <td className="font-medium py-1">FT%</td>
                  <td className="py-1">{playerStats.stats.ftPct}%</td>
                </tr>
              </tbody>
            </table>

            <button
              onClick={() => setPlayerStats(null)}
              className="mt-6 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Games List */}
      <main className="p-4">
        <h2 className="text-xl font-semibold mb-4">{SPORT_NAMES[sport]} Games</h2>
        {loading ? (
          <p>Loading...</p>
        ) : games.length === 0 ? (
          <p>No games scheduled or data unavailable.</p>
        ) : (
          <div className="space-y-4">
            {games.map(game => (
              <div
                key={game.id}
                className="border rounded-lg p-4 bg-white shadow-sm cursor-pointer hover:shadow-md transition"
                onClick={() => setSelectedGameId(game.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{game.name}</h3>
                    <p className="text-sm text-gray-600">{game.status}</p>
                  </div>
                  <div className="text-right">
                    <p>
                      <strong>{game.away.team}</strong>{' '}
                      {game.away.record && `(${game.away.record})`} -{' '}
                      {game.away.score > 0 ? game.away.score : '–'}
                    </p>
                    <p>
                      <strong>{game.home.team}</strong>{' '}
                      {game.home.record && `(${game.home.record})`} -{' '}
                      {game.home.score > 0 ? game.home.score : '–'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Betting Predictions (for NBA only) */}
      {sport === 'nba' && selectedGameId && (
        <Suspense fallback={<p className="text-sm text-gray-500 p-4">Loading predictions...</p>}>
          <BettingPredictions gameId={selectedGameId} />
        </Suspense>
      )}

      <footer className="text-center p-4 text-sm text-gray-500 border-t">
        For personal use only • Data from ESPN (unofficial API) • 
        <span className="block mt-1">Supports: NBA, NFL, MLB, NHL, CBB, CFB</span>
      </footer>
    </div>
  );
}

export default App;
