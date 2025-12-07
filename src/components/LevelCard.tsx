import { cn } from '@/lib/utils';

interface LevelCardProps {
  level: number;
  name: string;
  icon: string;
  isActive: boolean;
  isLocked: boolean;
  onClick: () => void;
}

export const LevelCard = ({ level, name, icon, isActive, isLocked, onClick }: LevelCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-shrink-0 w-16 h-16 rounded-2xl font-bold text-lg transition-all relative btn-bounce',
        isActive && 'gradient-primary text-primary-foreground shadow-button scale-105',
        !isActive && !isLocked && 'bg-card text-primary border-2 border-primary/20 hover:border-primary/50',
        isLocked && 'bg-muted text-muted-foreground cursor-not-allowed',
        isLocked && 'animate-shake'
      )}
    >
      {isLocked ? '🔒' : (
        <div className="flex flex-col items-center justify-center">
          <span className="text-xl">{icon}</span>
          <span className="text-xs font-medium mt-0.5">{level}</span>
        </div>
      )}
    </button>
  );
};

interface LevelBadgeProps {
  level: number;
  maxLevel: number;
}

export const LevelBadge = ({ level, maxLevel }: LevelBadgeProps) => {
  const progress = (level / maxLevel) * 100;
  
  return (
    <div className="flex items-center gap-2">
      <div className="text-sm font-semibold text-muted-foreground">
        Level {level}/{maxLevel}
      </div>
      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full gradient-primary rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
