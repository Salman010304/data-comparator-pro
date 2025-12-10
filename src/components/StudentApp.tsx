import { useState } from 'react';
import { cn } from '@/lib/utils';
import { LEVELS } from '@/data/phonicsData';
import { Level1Alphabet } from './levels/Level1Alphabet';
import { Level2Barakhadi } from './levels/Level2Barakhadi';
import { Level3Blending } from './levels/Level3Blending';
import { Level4CVCWords } from './levels/Level4CVCWords';
import { Level5SightWords } from './levels/Level5SightWords';
import { Level6Grammar } from './levels/Level6Grammar';
import { Level7Sentences } from './levels/Level7Sentences';
import { Level8Paragraphs } from './levels/Level8Paragraphs';
import { QuizGame } from './QuizGame';
import { FullTest } from './FullTest';
import { GamesMenu } from './games/GamesMenu';
import { Star, FileText, Phone, Gamepad2, ClipboardList, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const StudentApp = () => {
  const { userData, updateStudentProgress, logout } = useAuth();
  const navigate = useNavigate();
  
  // Type guard for student data
  if (!userData || userData.role !== 'student') {
    return null;
  }
  const [activeLevel, setActiveLevel] = useState(userData.maxLevel || 1);
  const [langMode, setLangMode] = useState<'gujarati' | 'hindi'>('gujarati');
  const [isTestMode, setIsTestMode] = useState(false);
  const [isFullTestMode, setIsFullTestMode] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const [lockedToast, setLockedToast] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const addStar = () => {
    updateStudentProgress({ stars: (userData.stars || 0) + 1 });
  };

  const handleTestPass = () => {
    const nextLevel = Math.min(8, activeLevel + 1);
    updateStudentProgress({ maxLevel: nextLevel });
    setActiveLevel(nextLevel);
    setIsTestMode(false);
  };

  const handleFullTestComplete = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    const passed = percentage >= 70; // 70% required to pass
    
    const updates: any = { 
      testScores: { ...(userData.testScores || {}), [activeLevel]: { score, total, date: Date.now() } }
    };
    
    // Upgrade level if passed and not at max level
    if (passed && activeLevel === userData.maxLevel && activeLevel < 8) {
      updates.maxLevel = activeLevel + 1;
      setActiveLevel(activeLevel + 1);
    }
    
    updateStudentProgress(updates);
    setIsFullTestMode(false);
  };

  const handleGameComplete = (gameName: string, score: number) => {
    const currentGameScores = userData.gameScores || {};
    const currentHighScore = currentGameScores[gameName]?.score || 0;
    if (score > currentHighScore) {
      updateStudentProgress({
        gameScores: { ...currentGameScores, [gameName]: { score, date: Date.now() } }
      });
    }
  };

  const handleLevelClick = (level: number) => {
    if (level > userData.maxLevel) {
      setLockedToast(`🔒 Level ${level} is Locked. Complete Level ${userData.maxLevel} first!`);
      setTimeout(() => setLockedToast(null), 3000);
    } else {
      setActiveLevel(level);
    }
  };

  const renderLevel = () => {
    switch (activeLevel) {
      case 1:
        return <Level1Alphabet langMode={langMode} />;
      case 2:
        return <Level2Barakhadi langMode={langMode} />;
      case 3:
        return <Level3Blending langMode={langMode} onAddStar={addStar} />;
      case 4:
        return <Level4CVCWords langMode={langMode} onAddStar={addStar} />;
      case 5:
        return <Level5SightWords langMode={langMode} onAddStar={addStar} />;
      case 6:
        return <Level6Grammar langMode={langMode} onAddStar={addStar} />;
      case 7:
        return <Level7Sentences langMode={langMode} onAddStar={addStar} />;
      case 8:
        return <Level8Paragraphs langMode={langMode} onAddStar={addStar} />;
      default:
        return <Level1Alphabet langMode={langMode} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-card sticky top-0 z-40 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="font-bold text-primary text-2xl">
                Hi {userData.name}! 👋
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                Standard: {userData.standard}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-secondary/20 text-secondary-foreground px-3 py-1.5 rounded-full text-sm font-bold">
                <Star className="w-4 h-4 fill-secondary text-secondary" />
                {userData.stars}
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex bg-muted p-1 rounded-xl">
              <button
                onClick={() => setLangMode('gujarati')}
                className={cn(
                  'px-4 py-1.5 rounded-lg text-sm font-bold transition-all btn-bounce',
                  langMode === 'gujarati' 
                    ? 'bg-card shadow-sm text-primary' 
                    : 'text-muted-foreground'
                )}
              >
                ગુજરાતી
              </button>
              <button
                onClick={() => setLangMode('hindi')}
                className={cn(
                  'px-4 py-1.5 rounded-lg text-sm font-bold transition-all btn-bounce',
                  langMode === 'hindi' 
                    ? 'bg-card shadow-sm text-primary' 
                    : 'text-muted-foreground'
                )}
              >
                हिंदी
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Level Navigation */}
      <div className="bg-card/50 py-4 px-4 overflow-x-auto scroll-area-x no-scrollbar">
        <div className="max-w-4xl mx-auto flex gap-3">
          {LEVELS.map((level) => {
            const isLocked = level.id > userData.maxLevel;
            const isActive = level.id === activeLevel;
            
            return (
              <button
                key={level.id}
                onClick={() => handleLevelClick(level.id)}
                className={cn(
                  'flex-shrink-0 w-16 h-16 rounded-2xl font-bold transition-all btn-bounce',
                  'flex flex-col items-center justify-center gap-1',
                  isActive && 'gradient-primary text-primary-foreground shadow-button scale-105',
                  !isActive && !isLocked && 'bg-card text-foreground border-2 border-border hover:border-primary/50',
                  isLocked && 'bg-muted text-muted-foreground cursor-not-allowed'
                )}
              >
                {isLocked ? (
                  <span className="text-xl">🔒</span>
                ) : (
                  <>
                    <span className="text-xl">{level.icon}</span>
                    <span className="text-xs">{level.id}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-4xl mx-auto w-full px-4 py-3">
        <div className="flex justify-between items-center gap-2">
          <div className="text-sm text-muted-foreground">
            Level {activeLevel}: <span className="font-semibold text-foreground">{LEVELS[activeLevel - 1]?.name}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowGames(true)}
              className="flex items-center gap-1 px-3 py-2 bg-success/20 text-success rounded-xl font-bold text-sm btn-bounce"
            >
              <Gamepad2 className="w-4 h-4" />
              Games
            </button>
            <button
              onClick={() => setIsTestMode(true)}
              className="flex items-center gap-1 px-3 py-2 gradient-secondary text-secondary-foreground rounded-xl font-bold text-sm shadow-sm btn-bounce"
            >
              <FileText className="w-4 h-4" />
              Quiz
            </button>
            <button
              onClick={() => setIsFullTestMode(true)}
              className="flex items-center gap-1 px-3 py-2 bg-foreground text-background rounded-xl font-bold text-sm shadow-sm btn-bounce"
            >
              <ClipboardList className="w-4 h-4" />
              100 Test
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-6">
        <div className="max-w-4xl mx-auto h-full">
          {renderLevel()}
        </div>
      </main>

      {/* Quiz Modal */}
      {isTestMode && (
        <QuizGame
          level={activeLevel}
          langMode={langMode}
          onClose={() => setIsTestMode(false)}
          onPass={handleTestPass}
        />
      )}

      {/* Full Test Modal */}
      {isFullTestMode && (
        <FullTest
          level={activeLevel}
          langMode={langMode}
          onClose={() => setIsFullTestMode(false)}
          onComplete={handleFullTestComplete}
        />
      )}

      {/* Games Menu */}
      {showGames && (
        <GamesMenu
          level={activeLevel}
          langMode={langMode}
          onClose={() => setShowGames(false)}
          onGameComplete={handleGameComplete}
        />
      )}

      {/* Locked Toast */}
      {lockedToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-foreground text-background px-6 py-3 rounded-full shadow-lg text-sm font-bold animate-slide-up z-50 whitespace-nowrap">
          {lockedToast}
        </div>
      )}

      {/* Footer */}
      <footer className="bg-foreground text-background py-6 px-4 text-center mt-auto">
        <h3 className="font-bold text-lg mb-1">Nurani Tuition Classes 🌟</h3>
        <p className="text-sm opacity-80">Master Salman</p>
        <div className="flex items-center justify-center gap-2 text-sm opacity-60 mt-2">
          <Phone className="w-4 h-4" />
          9408097177
        </div>
      </footer>
    </div>
  );
};
