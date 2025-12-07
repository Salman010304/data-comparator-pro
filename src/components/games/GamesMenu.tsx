import { useState } from 'react';
import { cn } from '@/lib/utils';
import { X, Brain, Zap, BookA, Puzzle } from 'lucide-react';
import { MemoryMatchGame } from './MemoryMatchGame';
import { SpellingBeeGame } from './SpellingBeeGame';
import { SpeedQuizGame } from './SpeedQuizGame';
import { WordBuilderGame } from './WordBuilderGame';

interface GamesMenuProps {
  level: number;
  langMode: 'gujarati' | 'hindi';
  onClose: () => void;
  onGameComplete: (gameName: string, score: number) => void;
}

type GameType = 'memory' | 'spelling' | 'speed' | 'builder' | null;

const games = [
  {
    id: 'memory' as const,
    name: 'Memory Match',
    icon: Brain,
    emoji: '🧠',
    description: 'Match words with meanings',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'spelling' as const,
    name: 'Spelling Bee',
    icon: BookA,
    emoji: '🐝',
    description: 'Listen and spell correctly',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'speed' as const,
    name: 'Speed Quiz',
    icon: Zap,
    emoji: '⚡',
    description: 'Answer before time runs out',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'builder' as const,
    name: 'Word Builder',
    icon: Puzzle,
    emoji: '🔤',
    description: 'Drag letters to build words',
    color: 'from-green-500 to-emerald-500',
  },
];

export const GamesMenu = ({ level, langMode, onClose, onGameComplete }: GamesMenuProps) => {
  const [activeGame, setActiveGame] = useState<GameType>(null);

  const handleGameComplete = (gameName: string) => (score: number) => {
    onGameComplete(gameName, score);
  };

  if (activeGame === 'memory') {
    return (
      <MemoryMatchGame
        level={level}
        langMode={langMode}
        onClose={() => setActiveGame(null)}
        onComplete={handleGameComplete('memory-match')}
      />
    );
  }

  if (activeGame === 'spelling') {
    return (
      <SpellingBeeGame
        level={level}
        langMode={langMode}
        onClose={() => setActiveGame(null)}
        onComplete={handleGameComplete('spelling-bee')}
      />
    );
  }

  if (activeGame === 'speed') {
    return (
      <SpeedQuizGame
        level={level}
        langMode={langMode}
        onClose={() => setActiveGame(null)}
        onComplete={handleGameComplete('speed-quiz')}
      />
    );
  }

  if (activeGame === 'builder') {
    return (
      <WordBuilderGame
        level={level}
        langMode={langMode}
        onClose={() => setActiveGame(null)}
        onComplete={handleGameComplete('word-builder')}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 backdrop-blur-sm p-4">
      <div className="bg-card rounded-3xl p-6 max-w-md w-full shadow-2xl animate-pop-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">🎮 Fun Games</h2>
            <p className="text-sm text-muted-foreground">Learn while playing!</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 gap-4">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => setActiveGame(game.id)}
              className="group p-4 rounded-2xl bg-muted hover:bg-muted/80 transition-all btn-bounce text-left"
            >
              <div className={cn(
                'w-14 h-14 rounded-xl flex items-center justify-center mb-3 text-3xl bg-gradient-to-br',
                game.color
              )}>
                {game.emoji}
              </div>
              <h3 className="font-bold text-foreground mb-1">{game.name}</h3>
              <p className="text-xs text-muted-foreground">{game.description}</p>
            </button>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Games are based on Level {level} content
        </p>
      </div>
    </div>
  );
};
