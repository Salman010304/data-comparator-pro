import { AlertCircle, BookOpen, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WrongAnswer {
  question: string;
  wrongAnswer: string;
  correctAnswer: string;
  date: number;
}

interface StudentMistakesViewProps {
  wrongAnswers: Record<number, WrongAnswer[]>;
  onClose: () => void;
}

export const StudentMistakesView = ({ wrongAnswers, onClose }: StudentMistakesViewProps) => {
  const totalMistakes = Object.values(wrongAnswers).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl animate-pop-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-destructive/20 to-warning/20 p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">My Mistakes</h2>
                <p className="text-sm text-muted-foreground">
                  Review and learn from {totalMistakes} mistakes
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-background/50 hover:bg-background text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {totalMistakes === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-foreground mb-2">No Mistakes Yet!</h3>
              <p className="text-muted-foreground">
                Keep up the great work! Your test history is clean.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(wrongAnswers).map(([level, mistakes]) => (
                <div key={level} className="bg-muted/30 rounded-2xl overflow-hidden">
                  <div className="bg-primary/10 px-4 py-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="font-bold text-foreground">Level {level}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {mistakes.length} mistakes
                    </span>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    {mistakes.map((mistake, idx) => (
                      <div
                        key={idx}
                        className="bg-background rounded-xl p-4 border border-border"
                      >
                        <p className="text-sm text-foreground font-medium mb-3">
                          {mistake.question}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-destructive/10 rounded-lg p-3">
                            <p className="text-xs text-destructive font-semibold mb-1">
                              Your Answer ❌
                            </p>
                            <p className="text-sm text-foreground">{mistake.wrongAnswer}</p>
                          </div>
                          
                          <div className="bg-success/10 rounded-lg p-3">
                            <p className="text-xs text-success font-semibold mb-1">
                              Correct Answer ✓
                            </p>
                            <p className="text-sm text-foreground">{mistake.correctAnswer}</p>
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-2 text-right">
                          {new Date(mistake.date).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-muted/30 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            💡 Tip: Practice these questions to improve your scores!
          </p>
        </div>
      </div>
    </div>
  );
};
