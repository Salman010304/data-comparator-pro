import { useState, useEffect, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { X, Volume2, Check, X as WrongIcon, Trophy, RotateCcw } from 'lucide-react';
import { CVC_WORD_FAMILIES, SIGHT_WORDS } from '@/data/phonicsData';
import { speak } from '@/utils/speech';

interface SpellingBeeGameProps {
  level: number;
  langMode: 'gujarati' | 'hindi';
  onClose: () => void;
  onComplete: (score: number) => void;
}

export const SpellingBeeGame = ({ level, langMode, onClose, onComplete }: SpellingBeeGameProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [totalQuestions] = useState(10);
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Generate words based on level - level-appropriate only
  const words = useMemo(() => {
    const wordList: string[] = [];
    
    if (level === 1) {
      // Level 1: Simple letter sounds - use alphabet examples
      import('@/data/phonicsData').then(({ ALPHABET_DATA }) => {
        ALPHABET_DATA.forEach(item => wordList.push(item.example));
      });
      return ['apple', 'ball', 'cat', 'dog', 'egg', 'fan', 'gun', 'hat', 'ink', 'jug'];
    } else if (level === 2) {
      // Level 2: Barakhadi - consonant sounds
      return ['ka', 'kha', 'ga', 'gha', 'cha', 'ja', 'ta', 'da', 'na', 'pa'];
    } else if (level === 3) {
      // Level 3: Two-letter blending words
      return ['am', 'an', 'at', 'in', 'it', 'on', 'up', 'us', 'if', 'or'];
    } else if (level === 4) {
      // Level 4: CVC words only
      Object.values(CVC_WORD_FAMILIES).forEach(family => {
        wordList.push(...family.words.slice(0, 2));
      });
    } else if (level === 5) {
      // Level 5: Sight words level 1
      SIGHT_WORDS.level1.forEach(item => wordList.push(item.word));
    } else if (level === 6) {
      // Level 6: Sight words level 2 + Grammar
      SIGHT_WORDS.level2.slice(0, 10).forEach(item => wordList.push(item.word));
    } else {
      // Level 7-8: Mix of sight words level 3
      SIGHT_WORDS.level3.forEach(item => wordList.push(item.word));
      SIGHT_WORDS.level2.slice(10).forEach(item => wordList.push(item.word));
    }

    // Shuffle and take 10
    return wordList
      .sort(() => Math.random() - 0.5)
      .slice(0, totalQuestions);
  }, [level, totalQuestions]);

  const currentWord = words[currentWordIndex];

  const speakWord = useCallback(() => {
    if (currentWord) {
      speak(currentWord, 1);
    }
  }, [currentWord, langMode]);

  // Auto-speak on word change
  useEffect(() => {
    if (currentWord && !gameComplete) {
      speakWord();
    }
  }, [currentWord, speakWord, gameComplete]);

  const handleSubmit = () => {
    if (!userInput.trim()) return;

    const isCorrect = userInput.toLowerCase().trim() === currentWord.toLowerCase();
    setShowResult(isCorrect ? 'correct' : 'wrong');
    
    if (isCorrect) {
      setScore(s => s + 10);
    }
    
    setAttempts(a => a + 1);

    setTimeout(() => {
      setShowResult(null);
      setUserInput('');
      
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
    setUserInput('');
    setScore(0);
    setShowResult(null);
    setGameComplete(false);
    setAttempts(0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 backdrop-blur-sm p-4">
      <div className="bg-card rounded-3xl p-6 max-w-md w-full shadow-2xl animate-pop-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">🐝 Spelling Bee</h2>
            <p className="text-sm text-muted-foreground">
              {currentWordIndex + 1}/{totalQuestions} • Score: {score}
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
              {score >= 80 ? 'Spelling Champion!' : score >= 50 ? 'Great Job!' : 'Keep Practicing!'}
            </h3>
            <div className="flex items-center justify-center gap-2 text-secondary mb-6">
              <Trophy className="w-6 h-6" />
              <span className="text-2xl font-bold">Score: {score}/{totalQuestions * 10}</span>
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
            {/* Listen Button */}
            <div className="text-center mb-8">
              <p className="text-muted-foreground mb-4">Listen and spell the word:</p>
              <button
                onClick={speakWord}
                className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center mx-auto shadow-button btn-bounce hover:scale-105 transition-transform"
              >
                <Volume2 className="w-12 h-12 text-primary-foreground" />
              </button>
              <p className="text-sm text-muted-foreground mt-4">Tap to hear again</p>
            </div>

            {/* Result Feedback */}
            {showResult && (
              <div className={cn(
                'flex items-center justify-center gap-3 py-4 rounded-xl mb-4 animate-pop-in',
                showResult === 'correct' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
              )}>
                {showResult === 'correct' ? (
                  <>
                    <Check className="w-6 h-6" />
                    <span className="font-bold">Correct! +10</span>
                  </>
                ) : (
                  <>
                    <WrongIcon className="w-6 h-6" />
                    <span className="font-bold">Wrong! It was "{currentWord}"</span>
                  </>
                )}
              </div>
            )}

            {/* Input */}
            {!showResult && (
              <div className="space-y-4">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type the word..."
                  autoFocus
                  className="w-full px-4 py-4 text-center text-2xl font-bold rounded-xl border-2 border-border bg-background text-foreground focus:border-primary transition-colors"
                />
                <button
                  onClick={handleSubmit}
                  disabled={!userInput.trim()}
                  className={cn(
                    'w-full py-4 rounded-xl font-bold text-lg transition-all btn-bounce gradient-primary text-primary-foreground shadow-button',
                    !userInput.trim() && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  Check Spelling
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
