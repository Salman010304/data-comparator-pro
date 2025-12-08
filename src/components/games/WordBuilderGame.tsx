import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { X, RotateCcw, Trophy, Trash2, Volume2 } from 'lucide-react';
import { CVC_WORD_FAMILIES } from '@/data/phonicsData';
import { speak } from '@/utils/speech';

interface WordBuilderGameProps {
  level: number;
  langMode: 'gujarati' | 'hindi';
  onClose: () => void;
  onComplete: (score: number) => void;
}

export const WordBuilderGame = ({ level, langMode, onClose, onComplete }: WordBuilderGameProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);

  // Generate words based on level
  const words = useMemo(() => {
    const wordList: string[] = [];
    
    Object.values(CVC_WORD_FAMILIES).forEach(family => {
      wordList.push(...family.words.slice(0, 2));
    });

    return wordList.sort(() => Math.random() - 0.5).slice(0, 10);
  }, [level]);

  const currentWord = words[currentWordIndex];

  // Shuffle letters for current word
  useEffect(() => {
    if (currentWord) {
      const letters = currentWord.split('');
      // Add some extra random letters
      const extraLetters = 'bcdfghlmnprstvw'.split('')
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      setShuffledLetters([...letters, ...extraLetters].sort(() => Math.random() - 0.5));
      setSelectedLetters([]);
    }
  }, [currentWord]);

  const handleLetterClick = (letter: string, index: number) => {
    setSelectedLetters(prev => [...prev, letter]);
    setShuffledLetters(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveLetter = (index: number) => {
    const letter = selectedLetters[index];
    setSelectedLetters(prev => prev.filter((_, i) => i !== index));
    setShuffledLetters(prev => [...prev, letter]);
  };

  const handleClear = () => {
    setShuffledLetters(prev => [...prev, ...selectedLetters]);
    setSelectedLetters([]);
  };

  const handleCheck = () => {
    const builtWord = selectedLetters.join('');
    const isCorrect = builtWord.toLowerCase() === currentWord.toLowerCase();
    
    setShowResult(isCorrect ? 'correct' : 'wrong');
    
    if (isCorrect) {
      setScore(s => s + 10);
      speak(currentWord, 1);
    }

    setTimeout(() => {
      setShowResult(null);
      
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(i => i + 1);
      } else {
        setGameComplete(true);
        onComplete(score + (isCorrect ? 10 : 0));
      }
    }, 1500);
  };

  const resetGame = () => {
    setCurrentWordIndex(0);
    setSelectedLetters([]);
    setScore(0);
    setShowResult(null);
    setGameComplete(false);
  };

  const speakHint = () => {
    speak(currentWord, 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 backdrop-blur-sm p-4">
      <div className="bg-card rounded-3xl p-6 max-w-md w-full shadow-2xl animate-pop-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">🔤 Word Builder</h2>
            <p className="text-sm text-muted-foreground">
              {currentWordIndex + 1}/{words.length} • Score: {score}
            </p>
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
            <div className="text-6xl mb-4 animate-bounce">
              {score >= 80 ? '🏆' : score >= 50 ? '🌟' : '👍'}
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {score >= 80 ? 'Word Master!' : score >= 50 ? 'Great Builder!' : 'Keep Building!'}
            </h3>
            <div className="flex items-center justify-center gap-2 text-secondary mb-6">
              <Trophy className="w-6 h-6" />
              <span className="text-2xl font-bold">Score: {score}/{words.length * 10}</span>
            </div>
            <button
              onClick={resetGame}
              className="px-6 py-3 gradient-primary text-primary-foreground rounded-xl font-bold btn-bounce"
            >
              Play Again
            </button>
          </div>
        ) : (
          <>
            {/* Hint Button */}
            <div className="text-center mb-4">
              <button
                onClick={speakHint}
                className="flex items-center gap-2 px-4 py-2 bg-muted rounded-xl mx-auto hover:bg-muted/80 transition-colors"
              >
                <Volume2 className="w-5 h-5 text-foreground" />
                <span className="text-sm font-medium text-foreground">Hear the word</span>
              </button>
            </div>

            {/* Built Word Area */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground text-center mb-2">Build the word:</p>
              <div className={cn(
                'min-h-[60px] rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 p-3',
                showResult === 'correct' ? 'border-success bg-success/10' : 
                showResult === 'wrong' ? 'border-destructive bg-destructive/10' : 'border-border'
              )}>
                {selectedLetters.length === 0 ? (
                  <span className="text-muted-foreground">Tap letters below</span>
                ) : (
                  selectedLetters.map((letter, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRemoveLetter(idx)}
                      className="w-12 h-12 rounded-xl gradient-primary text-primary-foreground font-bold text-xl shadow-sm btn-bounce uppercase"
                    >
                      {letter}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Result Feedback */}
            {showResult && (
              <div className={cn(
                'text-center py-3 rounded-xl mb-4 font-bold animate-pop-in',
                showResult === 'correct' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
              )}>
                {showResult === 'correct' ? '✓ Correct! +10' : `✗ Wrong! It was "${currentWord}"`}
              </div>
            )}

            {/* Available Letters */}
            {!showResult && (
              <>
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {shuffledLetters.map((letter, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLetterClick(letter, idx)}
                      className="w-12 h-12 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xl shadow-sm btn-bounce uppercase transition-colors"
                    >
                      {letter}
                    </button>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleClear}
                    disabled={selectedLetters.length === 0}
                    className="flex-1 py-3 rounded-xl bg-muted font-bold text-foreground flex items-center justify-center gap-2 hover:bg-muted/80 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                    Clear
                  </button>
                  <button
                    onClick={handleCheck}
                    disabled={selectedLetters.length === 0}
                    className={cn(
                      'flex-1 py-3 rounded-xl font-bold btn-bounce gradient-primary text-primary-foreground shadow-button',
                      selectedLetters.length === 0 && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    Check Word
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
