'use client';

import { useState } from 'react';

interface Match {
  _id: string;
  matchId: string;
  team1: string;
  team2: string;
  venue: string;
  date: string;
  status: 'active' | 'paused' | 'completed';
  team1Score: number;
  team2Score: number;
  team1Wickets: number;
  team2Wickets: number;
  currentOver: number;
  currentBall: number;
  battingTeam: 'team1' | 'team2';
}

interface StartMatchFormProps {
  onMatchStarted: (match: Match) => void;
}

export default function StartMatchForm({ onMatchStarted }: StartMatchFormProps) {
  const [formData, setFormData] = useState({
    team1: '',
    team2: '',
    venue: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/matches/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to start match');
      }

      const newMatch = await response.json();
      onMatchStarted(newMatch);
      
      // Reset form
      setFormData({
        team1: '',
        team2: '',
        venue: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="team1">Team 1</label>
          <input
            type="text"
            id="team1"
            name="team1"
            className="input"
            value={formData.team1}
            onChange={handleInputChange}
            placeholder="Enter team 1 name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="team2">Team 2</label>
          <input
            type="text"
            id="team2"
            name="team2"
            className="input"
            value={formData.team2}
            onChange={handleInputChange}
            placeholder="Enter team 2 name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="venue">Venue</label>
          <input
            type="text"
            id="venue"
            name="venue"
            className="input"
            value={formData.venue}
            onChange={handleInputChange}
            placeholder="Enter venue"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Match Date</label>
          <input
            type="date"
            id="date"
            name="date"
            className="input"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </div>

        {error && (
          <div className="p-4 mb-4 bg-red-100 border-l-4 border-red-500 text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="button"
          disabled={loading}
        >
          {loading ? 'Starting Match...' : 'Start Match'}
        </button>
      </form>
    </div>
  );
} 