'use client';

import { useRouter } from 'next/navigation';

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

interface MatchListProps {
  matches: Match[];
}

export default function MatchList({ matches }: MatchListProps) {
  const router = useRouter();

  const handleMatchClick = (matchId: string) => {
    router.push(`/match/${matchId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'match-status active';
      case 'paused':
        return 'match-status paused';
      case 'completed':
        return 'match-status completed';
      default:
        return 'match-status';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (matches.length === 0) {
    return (
      <div className="card text-center">
        <p className="text-gray-600">No matches found. Start a new match to begin!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {matches.map((match) => (
        <div
          key={match._id}
          className="card match-card"
          onClick={() => handleMatchClick(match.matchId)}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">
              {match.team1} vs {match.team2}
            </h3>
            <span className={getStatusColor(match.status)}>
              {match.status}
            </span>
          </div>
          
          <div className="text-sm text-gray-600 mb-2">
            {match.venue} • {formatDate(match.date)}
          </div>
          
          <div className="score-display">
            <div className="mb-2">
              <span className="font-bold">{match.team1}:</span> {match.team1Score}/{match.team1Wickets}
            </div>
            <div>
              <span className="font-bold">{match.team2}:</span> {match.team2Score}/{match.team2Wickets}
            </div>
          </div>
          
          {match.status === 'active' && (
            <div className="over-display">
              Current: {match.currentOver}.{match.currentBall} 
              ({match.battingTeam === 'team1' ? match.team1 : match.team2} batting)
            </div>
          )}
          
          <div className="text-sm text-gray-600 mt-2">
            Match ID: {match.matchId}
          </div>
        </div>
      ))}
    </div>
  );
} 