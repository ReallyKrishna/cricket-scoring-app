'use client';

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import MatchList from '../components/MatchList';
import StartMatchForm from '../components/StartMatchForm';

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

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io('http://localhost:3001', {
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('matchStarted', (match: Match) => {
      setMatches(prev => [match, ...prev]);
    });

    newSocket.on('matchPaused', ({ matchId }) => {
      setMatches(prev => prev.map(match => 
        match.matchId === matchId ? { ...match, status: 'paused' } : match
      ));
    });

    newSocket.on('matchResumed', ({ matchId }) => {
      setMatches(prev => prev.map(match => 
        match.matchId === matchId ? { ...match, status: 'active' } : match
      ));
    });

    newSocket.on('matchCompleted', ({ matchId }) => {
      setMatches(prev => prev.map(match => 
        match.matchId === matchId ? { ...match, status: 'completed' } : match
      ));
    });

    setSocket(newSocket);

    // Fetch existing matches
    fetchMatches();

    return () => {
      newSocket.close();
    };
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await fetch('http://localhost:3001/matches');
      const data = await response.json();
      setMatches(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMatchStarted = (newMatch: Match) => {
    setMatches(prev => [newMatch, ...prev]);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="header">
          <h1>Cricket Scoring App</h1>
          <p>Loading matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <h1>Cricket Scoring App</h1>
        <p>Real-time cricket scoring and commentary</p>
      </div>
      
      <div className="container">
        <div className="grid grid-2">
          <div>
            <h2 className="text-lg font-bold mb-4">Start New Match</h2>
            <StartMatchForm onMatchStarted={handleMatchStarted} />
          </div>
          
          <div>
            <h2 className="text-lg font-bold mb-4">Ongoing Matches</h2>
            <MatchList matches={matches} />
          </div>
        </div>
      </div>
    </div>
  );
} 