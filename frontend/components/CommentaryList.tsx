'use client';

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

interface CommentaryListProps {
  commentaries: Commentary[];
}

export default function CommentaryList({ commentaries }: CommentaryListProps) {
  const getCommentaryClass = (commentary: Commentary) => {
    let className = 'commentary-item';
    
    if (commentary.isWicket) {
      className += ' wicket';
    } else if (commentary.eventType === 'four') {
      className += ' four';
    } else if (commentary.eventType === 'six') {
      className += ' six';
    }
    
    return className;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'wicket':
        return '🏏';
      case 'four':
        return '4️⃣';
      case 'six':
        return '6️⃣';
      case 'wide':
        return '🚫';
      case 'no-ball':
        return '⚠️';
      case 'dot':
        return '•';
      default:
        return '🏃';
    }
  };

  if (commentaries.length === 0) {
    return (
      <div className="card text-center">
        <p className="text-gray-600">No commentary yet. Add the first ball!</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="max-h-96 overflow-y-auto">
        {commentaries.map((commentary) => (
          <div key={commentary._id} className={getCommentaryClass(commentary)}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold">
                    {commentary.over}.{commentary.ball}
                  </span>
                  <span className="text-lg">{getEventIcon(commentary.eventType)}</span>
                  <span className="font-bold text-sm">
                    {commentary.runs > 0 && `+${commentary.runs} runs`}
                    {commentary.isWicket && ' WICKET!'}
                    {commentary.isExtra && commentary.extraType && ` ${commentary.extraType}`}
                    {commentary.extraRuns > 0 && ` +${commentary.extraRuns} extra`}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-1">
                  {commentary.description}
                </div>
                
                {(commentary.batsman || commentary.bowler) && (
                  <div className="text-xs text-gray-500">
                    {commentary.batsman && `Batsman: ${commentary.batsman}`}
                    {commentary.batsman && commentary.bowler && ' • '}
                    {commentary.bowler && `Bowler: ${commentary.bowler}`}
                  </div>
                )}
              </div>
              
              <div className="text-xs text-gray-400 ml-2">
                {formatTime(commentary.createdAt)}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        Total Commentary Entries: {commentaries.length}
      </div>
    </div>
  );
} 