'use client';

import { useState } from 'react';

interface Commentary {
  _id: string;
  over: number;
  ball: number;
  eventType: 'run' | 'wicket' | 'wide' | 'no-ball' | 'bye' | 'leg-bye' | 'dot' | 'four' | 'six';
  description: string;
  runs: number;
  isWicket: boolean;
  isExtra: boolean;
  extraType: string;
  extraRuns: number;
  batsman: string;
  bowler: string;
  createdAt: string;
}

interface AddCommentaryFormProps {
  matchId: string;
  onCommentaryAdded: (commentary: Commentary) => void;
  disabled?: boolean;
}

export default function AddCommentaryForm({ matchId, onCommentaryAdded, disabled }: AddCommentaryFormProps) {
  const [formData, setFormData] = useState({
    over: 1,
    ball: 1,
    eventType: 'run' as const,
    description: '',
    runs: 0,
    isWicket: false,
    isExtra: false,
    extraType: '',
    extraRuns: 0,
    batsman: '',
    bowler: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:3001/matches/${matchId}/commentary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add commentary');
      }

      const newCommentary = await response.json();
      onCommentaryAdded(newCommentary);
      
      // Reset form
      setFormData({
        over: formData.over,
        ball: formData.ball + 1,
        eventType: 'run',
        description: '',
        runs: 0,
        isWicket: false,
        isExtra: false,
        extraType: '',
        extraRuns: 0,
        batsman: '',
        bowler: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const eventTypes = [
    { value: 'run', label: 'Run' },
    { value: 'wicket', label: 'Wicket' },
    { value: 'wide', label: 'Wide' },
    { value: 'no-ball', label: 'No Ball' },
    { value: 'bye', label: 'Bye' },
    { value: 'leg-bye', label: 'Leg Bye' },
    { value: 'dot', label: 'Dot Ball' },
    { value: 'four', label: 'Four' },
    { value: 'six', label: 'Six' },
  ];

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="over">Over</label>
            <input
              type="number"
              id="over"
              name="over"
              className="input"
              value={formData.over}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ball">Ball</label>
            <input
              type="number"
              id="ball"
              name="ball"
              className="input"
              value={formData.ball}
              onChange={handleInputChange}
              min="1"
              max="6"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="eventType">Event Type</label>
          <select
            id="eventType"
            name="eventType"
            className="input"
            value={formData.eventType}
            onChange={handleInputChange}
            required
          >
            {eventTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="input"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe what happened..."
            rows={3}
            required
          />
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="runs">Runs</label>
            <input
              type="number"
              id="runs"
              name="runs"
              className="input"
              value={formData.runs}
              onChange={handleInputChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="extraRuns">Extra Runs</label>
            <input
              type="number"
              id="extraRuns"
              name="extraRuns"
              className="input"
              value={formData.extraRuns}
              onChange={handleInputChange}
              min="0"
            />
          </div>
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="batsman">Batsman</label>
            <input
              type="text"
              id="batsman"
              name="batsman"
              className="input"
              value={formData.batsman}
              onChange={handleInputChange}
              placeholder="Batsman name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bowler">Bowler</label>
            <input
              type="text"
              id="bowler"
              name="bowler"
              className="input"
              value={formData.bowler}
              onChange={handleInputChange}
              placeholder="Bowler name"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isWicket"
              checked={formData.isWicket}
              onChange={handleInputChange}
            />
            Is Wicket
          </label>
        </div>

        <div className="form-group">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isExtra"
              checked={formData.isExtra}
              onChange={handleInputChange}
            />
            Is Extra
          </label>
        </div>

        {formData.isExtra && (
          <div className="form-group">
            <label htmlFor="extraType">Extra Type</label>
            <input
              type="text"
              id="extraType"
              name="extraType"
              className="input"
              value={formData.extraType}
              onChange={handleInputChange}
              placeholder="e.g., wide, no-ball, bye"
            />
          </div>
        )}

        {error && (
          <div className="p-4 mb-4 bg-red-100 border-l-4 border-red-500 text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="button"
          disabled={loading || disabled}
        >
          {loading ? 'Adding Commentary...' : 'Add Commentary'}
        </button>
      </form>
    </div>
  );
} 