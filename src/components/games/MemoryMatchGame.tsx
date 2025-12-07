import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { X, RotateCcw, Trophy, Clock } from 'lucide-react';
import { ALPHABET_DATA, CVC_WORD_FAMILIES } from '@/data/phonicsData';

interface MemoryMatchGameProps {
  level: number;
  langMode: 'gujarati' | 'hindi';
  onClose: () => void;
  onComplete: (score: number) => void;
}

interface Card {
  id: string;
  content: string;
  matchId: string;
  type: 'word' | 'meaning';
}

export const MemoryMatchGame = ({ level, langMode, onClose, onComplete }: MemoryMatchGameProps) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Generate cards based on level
  const generateCards = useMemo(() => {
    const pairs: { word: string; meaning: string }[] = [];
    
    if (level <= 2) {
      // Alphabet matching
      ALPHABET_DATA.slice(0, 8).forEach(item => {
        pairs.push({
          word: item.letter,
          meaning: langMode === 'gujarati' ? item.gujarati : item.hindi
        });
      });
    } else {
      // CVC words matching
      const families = Object.values(CVC_WORD_FAMILIES).slice(0, 4);
      families.forEach(family => {
        family.words.slice(0, 2).forEach(word => {
          pairs.push({
            word,
            meaning: langMode === 'gujarati' ? family.gujarati : family.hindi
          });
        });
      });
    }

    const cardList: Card[] = [];
    pairs.forEach((pair, idx) => {
      cardList.push({ id: `word-${idx}`, content: pair.word, matchId: `pair-${idx}`, type: 'word' });
      cardList.push({ id: `meaning-${idx}`, content: pair.meaning, matchId: `pair-${idx}`, type: 'meaning' });
    });

    return cardList.sort(() => Math.random() - 0.5);
  }, [level, langMode]);

  useEffect(() => {
    setCards(generateCards);
  }, [generateCards]);

  // Timer
  useEffect(() => {
    if (gameComplete) return;
    const timer = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, [gameComplete]);

  // Check for match
  useEffect(() => {
    if (flipped.length === 2) {
      setIsChecking(true);
      const [first, second] = flipped;
      const card1 = cards.find(c => c.id === first);
      const card2 = cards.find(c => c.id === second);

      if (card1 && card2 && card1.matchId === card2.matchId) {
        setMatched(prev => [...prev, first, second]);
        setFlipped([]);
        setIsChecking(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setIsChecking(false);
        }, 1000);
      }
      setMoves(m => m + 1);
    }
  }, [flipped, cards]);

  // Check for game complete
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameComplete(true);
      const score = Math.max(100 - (moves * 2) - Math.floor(time / 5), 10);
      onComplete(score);
    }
  }, [matched, cards, moves, time, onComplete]);

  const handleCardClick = (cardId: string) => {
    if (isChecking || flipped.includes(cardId) || matched.includes(cardId) || flipped.length >= 2) {
      return;
    }
    setFlipped(prev => [...prev, cardId]);
  };

  const resetGame = () => {
    setCards(generateCards.sort(() => Math.random() - 0.5));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTime(0);
    setGameComplete(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 backdrop-blur-sm p-4">
      <div className="bg-card rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-pop-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">🧠 Memory Match</h2>
            <div className="flex gap-4 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTime(time)}
              </span>
              <span>Moves: {moves}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetGame}
              className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <RotateCcw className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Game Complete */}
        {gameComplete ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Awesome!</h3>
            <p className="text-muted-foreground mb-4">
              Completed in {moves} moves and {formatTime(time)}!
            </p>
            <div className="flex items-center justify-center gap-2 text-secondary mb-6">
              <Trophy className="w-6 h-6" />
              <span className="text-2xl font-bold">
                Score: {Math.max(100 - (moves * 2) - Math.floor(time / 5), 10)}
              </span>
            </div>
            <button
              onClick={resetGame}
              className="px-6 py-3 gradient-primary text-primary-foreground rounded-xl font-bold btn-bounce"
            >
              Play Again
            </button>
          </div>
        ) : (
          /* Card Grid */
          <div className="grid grid-cols-4 gap-3">
            {cards.map((card) => {
              const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
              const isMatched = matched.includes(card.id);

              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={isChecking || isFlipped}
                  className={cn(
                    'aspect-square rounded-xl font-bold text-lg transition-all duration-300 transform',
                    isFlipped ? 'rotate-y-180' : '',
                    isMatched
                      ? 'bg-success/20 text-success border-2 border-success'
                      : isFlipped
                      ? 'gradient-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80 text-transparent'
                  )}
                  style={{ perspective: '1000px' }}
                >
                  {isFlipped ? card.content : '?'}
                </button>
              );
            })}
          </div>
        )}

        {/* Instructions */}
        {!gameComplete && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Match English words with their {langMode === 'gujarati' ? 'Gujarati' : 'Hindi'} sounds!
          </p>
        )}
      </div>
    </div>
  );
};
