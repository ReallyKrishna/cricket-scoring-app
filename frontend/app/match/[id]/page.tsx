'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import CommentaryList from '../../../components/CommentaryList';
import AddCommentaryForm from '../../../components/AddCommentaryForm';
import MatchControls from '../../../components/MatchControls';

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
  commentaries: Commentary[];
}

export default function MatchPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.id as string;
  
  const [match, setMatch] = useState<Match | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const newSocket = io('http://localhost:3001', {
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('commentaryAdded', (data: { matchId: string; commentary: Commentary }) => {
      if (data.matchId === matchId) {
        setMatch(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            commentaries: [...prev.commentaries, data.commentary],
          };
        });
      }
    });

    newSocket.on('matchPaused', (data: { matchId: string }) => {
      if (data.matchId === matchId) {
        setMatch(prev => prev ? { ...prev, status: 'paused' } : null);
      }
    });

    newSocket.on('matchResumed', (data: { matchId: string }) => {
      if (data.matchId === matchId) {
        setMatch(prev => prev ? { ...prev, status: 'active' } : null);
      }
    });

    newSocket.on('matchCompleted', (data: { matchId: string }) => {
      if (data.matchId === matchId) {
        setMatch(prev => prev ? { ...prev, status: 'completed' } : null);
      }
    });

    setSocket(newSocket);

    fetchMatch();

    return () => {
      newSocket.close();
    };
  }, [matchId]);

  const fetchMatch = async () => {
    try {
      const response = await fetch(`http://localhost:3001/matches/${matchId}`);
      if (!response.ok) {
        throw new Error('Match not found');
      }
      const data = await response.json();
      setMatch(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load match');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentaryAdded = (newCommentary: Commentary) => {
    setMatch(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        commentaries: [...prev.commentaries, newCommentary],
      };
    });
  };

  const handleMatchStatusChange = (newStatus: 'active' | 'paused' | 'completed') => {
    setMatch(prev => prev ? { ...prev, status: newStatus } : null);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="header">
          <h1>Loading Match...</h1>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="container">
        <div className="header">
          <h1>Error</h1>
          <p>{error || 'Match not found'}</p>
        </div>
        <div className="card text-center">
          <button className="button" onClick={() => router.push('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <h1>{match.team1} vs {match.team2}</h1>
        <p>{match.venue} • Match ID: {match.matchId}</p>
      </div>
      
      <div className="container">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Match Status</h2>
            <span className={`match-status ${match.status}`}>
              {match.status}
            </span>
          </div>
          
          <div className="score-display">
            <div className="mb-2">
              <span className="font-bold">{match.team1}:</span> {match.team1Score}/{match.team1Wickets}
            </div>
            <div>
              <span className="font-bold">{match.team2}:</span> {match.team2Score}/{match.team2Wickets}
            </div>
          </div>
          
          <div className="over-display">
            Current: {match.currentOver}.{match.currentBall} 
            ({match.battingTeam === 'team1' ? match.team1 : match.team2} batting)
          </div>
        </div>

        <div className="grid grid-2">
          <div>
            <h2 className="text-lg font-bold mb-4">Add Commentary</h2>
            <AddCommentaryForm 
              matchId={matchId} 
              onCommentaryAdded={handleCommentaryAdded}
              disabled={match.status === 'completed'}
            />
          </div>
          
          <div>
            <h2 className="text-lg font-bold mb-4">Match Controls</h2>
            <MatchControls 
              matchId={matchId}
              status={match.status}
              onStatusChange={handleMatchStatusChange}
            />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">Live Commentary</h2>
          <CommentaryList commentaries={match.commentaries} />
        </div>
      </div>
    </div>
  );
} 