import { useState, useEffect, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { X, Zap, Trophy, RotateCcw, Timer } from 'lucide-react';
import { ALPHABET_DATA, CVC_WORD_FAMILIES, SIGHT_WORDS, GRAMMAR_WORDS } from '@/data/phonicsData';

interface SpeedQuizGameProps {
  level: number;
  langMode: 'gujarati' | 'hindi';
  onClose: () => void;
  onComplete: (score: number) => void;
}

interface Question {
  question: string;
  answer: string;
  options: string[];
}

export const SpeedQuizGame = ({ level, langMode, onClose, onComplete }: SpeedQuizGameProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameComplete, setGameComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Generate questions based on level
  const questions = useMemo((): Question[] => {
    const qs: Question[] = [];

    if (level <= 2) {
      // Alphabet questions
      ALPHABET_DATA.forEach(item => {
        const meaning = langMode === 'gujarati' ? item.gujarati : item.hindi;
        const wrongAnswers = ALPHABET_DATA
          .filter(a => a.letter !== item.letter)
          .map(a => langMode === 'gujarati' ? a.gujarati : a.hindi)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        qs.push({
          question: `"${item.letter}" = ?`,
          answer: meaning,
          options: [meaning, ...wrongAnswers].sort(() => Math.random() - 0.5)
        });
      });
    } else if (level <= 4) {
      // CVC word family questions
      Object.entries(CVC_WORD_FAMILIES).forEach(([family, data]) => {
        data.words.forEach(word => {
          const meaning = langMode === 'gujarati' ? data.gujarati : data.hindi;
          const wrongFamilies = Object.values(CVC_WORD_FAMILIES)
            .filter(f => f !== data)
            .map(f => langMode === 'gujarati' ? f.gujarati : f.hindi)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

          qs.push({
            question: `"${word}" ends with?`,
            answer: meaning,
            options: [meaning, ...wrongFamilies].sort(() => Math.random() - 0.5)
          });
        });
      });
    } else {
      // Grammar/sight words
      GRAMMAR_WORDS.forEach(item => {
        const meaning = langMode === 'gujarati' ? item.meaningGujarati : item.meaningHindi;
        const wrongAnswers = GRAMMAR_WORDS
          .filter(g => g.word !== item.word)
          .map(g => langMode === 'gujarati' ? g.meaningGujarati : g.meaningHindi)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        qs.push({
          question: `"${item.word}" means?`,
          answer: meaning,
          options: [meaning, ...wrongAnswers].sort(() => Math.random() - 0.5)
        });
      });
    }

    return qs.sort(() => Math.random() - 0.5).slice(0, 15);
  }, [level, langMode]);

  const currentQuestion = questions[currentIndex];

  // Timer countdown
  useEffect(() => {
    if (gameComplete || selectedAnswer !== null) return;

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          handleTimeout();
          return 10;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, gameComplete, selectedAnswer]);

  const handleTimeout = useCallback(() => {
    setStreak(0);
    moveToNext();
  }, []);

  const moveToNext = useCallback(() => {
    setTimeout(() => {
      setSelectedAnswer(null);
      setIsCorrect(null);
      setTimeLeft(10);

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(i => i + 1);
      } else {
        setGameComplete(true);
        onComplete(score);
      }
    }, 1000);
  }, [currentIndex, questions.length, score, onComplete]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.answer;
    setIsCorrect(correct);

    if (correct) {
      const bonusPoints = timeLeft > 7 ? 15 : timeLeft > 4 ? 10 : 5;
      const streakBonus = streak >= 3 ? 5 : 0;
      setScore(s => s + bonusPoints + streakBonus);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }

    moveToNext();
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(10);
    setGameComplete(false);
    setStreak(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 backdrop-blur-sm p-4">
      <div className="bg-card rounded-3xl p-6 max-w-md w-full shadow-2xl animate-pop-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Zap className="w-5 h-5 text-warning" />
              Speed Quiz
            </h2>
            <div className="flex items-center gap-4 text-sm mt-1">
              <span className="text-muted-foreground">{currentIndex + 1}/{questions.length}</span>
              <span className="text-primary font-bold">Score: {score}</span>
              {streak >= 3 && (
                <span className="text-warning font-bold animate-pulse">🔥 x{streak}</span>
              )}
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

        {/* Timer Bar */}
        {!gameComplete && (
          <div className="mb-6">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-1000',
                  timeLeft > 7 ? 'bg-success' : timeLeft > 4 ? 'bg-warning' : 'bg-destructive'
                )}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Timer className="w-4 h-4" />
                {timeLeft}s
              </span>
              <span className="text-xs text-muted-foreground">
                {timeLeft > 7 ? '+15 pts' : timeLeft > 4 ? '+10 pts' : '+5 pts'}
              </span>
            </div>
          </div>
        )}

        {/* Game Complete */}
        {gameComplete ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4 animate-bounce">
              {score >= 150 ? '🏆' : score >= 100 ? '🌟' : '⚡'}
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {score >= 150 ? 'Speed Champion!' : score >= 100 ? 'Quick Thinker!' : 'Nice Try!'}
            </h3>
            <div className="flex items-center justify-center gap-2 text-secondary mb-6">
              <Trophy className="w-6 h-6" />
              <span className="text-2xl font-bold">Score: {score}</span>
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
            {/* Question */}
            <div className="text-center mb-6">
              <p className="text-3xl font-black text-foreground">
                {currentQuestion?.question}
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3">
              {currentQuestion?.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  disabled={selectedAnswer !== null}
                  className={cn(
                    'py-4 px-3 rounded-xl font-bold text-lg transition-all btn-bounce',
                    selectedAnswer === null
                      ? 'bg-muted hover:bg-muted/80 text-foreground'
                      : option === currentQuestion.answer
                      ? 'bg-success text-success-foreground'
                      : selectedAnswer === option
                      ? 'bg-destructive text-destructive-foreground'
                      : 'bg-muted/50 text-muted-foreground'
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
