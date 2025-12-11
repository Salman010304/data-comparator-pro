import { useEffect, useState } from 'react';
import { Trophy, Star, Sparkles, PartyPopper } from 'lucide-react';
import { soundManager } from '@/utils/sounds';

interface LevelCelebrationProps {
  newLevel: number;
  onClose: () => void;
}

export const LevelCelebration = ({ newLevel, onClose }: LevelCelebrationProps) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    soundManager.playLevelUp();
    
    // Auto close after 4 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/90 backdrop-blur-md">
      {/* Animated confetti background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            {['🎉', '⭐', '🌟', '✨', '🎊', '🏆'][Math.floor(Math.random() * 6)]}
          </div>
        ))}
      </div>

      <div className="relative bg-card rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl animate-celebration-pop text-center">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 via-secondary/20 to-success/20 blur-xl -z-10" />
        
        {/* Trophy */}
        <div className="relative mb-6">
          <div className="text-8xl animate-bounce-slow">🏆</div>
          <div className="absolute -top-2 -right-2 animate-spin-slow">
            <Sparkles className="w-8 h-8 text-secondary" />
          </div>
          <div className="absolute -top-2 -left-2 animate-spin-slow" style={{ animationDirection: 'reverse' }}>
            <Star className="w-8 h-8 text-primary fill-primary" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-black text-foreground mb-2 animate-pulse">
          🎉 Congratulations! 🎉
        </h1>
        
        <p className="text-xl text-muted-foreground mb-4">
          You passed the test!
        </p>

        {/* Level Badge */}
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground px-6 py-4 rounded-2xl mb-6 animate-glow">
          <PartyPopper className="w-6 h-6" />
          <span className="text-2xl font-black">Level {newLevel} Unlocked!</span>
          <PartyPopper className="w-6 h-6" />
        </div>

        <p className="text-muted-foreground mb-6">
          Keep up the amazing work! 🌟
        </p>

        <button
          onClick={onClose}
          className="px-8 py-3 gradient-primary text-primary-foreground rounded-xl font-bold text-lg shadow-button btn-bounce"
        >
          Continue Learning →
        </button>
      </div>
    </div>
  );
};
