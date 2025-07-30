'use client';

import { useState } from 'react';

interface MatchControlsProps {
  matchId: string;
  status: 'active' | 'paused' | 'completed';
  onStatusChange: (status: 'active' | 'paused' | 'completed') => void;
}

export default function MatchControls({ matchId, status, onStatusChange }: MatchControlsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStatusChange = async (newStatus: 'active' | 'paused' | 'completed') => {
    setLoading(true);
    setError('');

    try {
      let endpoint = '';
      switch (newStatus) {
        case 'paused':
          endpoint = 'pause';
          break;
        case 'active':
          endpoint = 'resume';
          break;
        case 'completed':
          endpoint = 'complete';
          break;
      }

      const response = await fetch(`http://localhost:3001/matches/${matchId}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update match status');
      }

      onStatusChange(newStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex flex-col gap-4">
        {status === 'active' && (
          <>
            <button
              className="button secondary"
              onClick={() => handleStatusChange('paused')}
              disabled={loading}
            >
              {loading ? 'Pausing...' : 'Pause Match'}
            </button>
            
            <button
              className="button danger"
              onClick={() => handleStatusChange('completed')}
              disabled={loading}
            >
              {loading ? 'Completing...' : 'Complete Match'}
            </button>
          </>
        )}

        {status === 'paused' && (
          <>
            <button
              className="button success"
              onClick={() => handleStatusChange('active')}
              disabled={loading}
            >
              {loading ? 'Resuming...' : 'Resume Match'}
            </button>
            
            <button
              className="button danger"
              onClick={() => handleStatusChange('completed')}
              disabled={loading}
            >
              {loading ? 'Completing...' : 'Complete Match'}
            </button>
          </>
        )}

        {status === 'completed' && (
          <div className="text-center">
            <p className="text-gray-600 mb-4">Match completed</p>
            <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-600">
              This match has been completed and cannot be modified.
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-600">
            {error}
          </div>
        )}
      </div>
    </div>
  );
} 