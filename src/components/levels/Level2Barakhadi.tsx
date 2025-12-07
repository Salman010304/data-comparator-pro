import { useState } from 'react';
import { BARAKHADI_ROOTS, BARAKHADI_MATRAS } from '@/data/phonicsData';
import { speak } from '@/utils/speech';
import { cn } from '@/lib/utils';
import { ArrowLeft, Volume2 } from 'lucide-react';

interface Level2BarakhadiProps {
  langMode: 'gujarati' | 'hindi';
}

export const Level2Barakhadi = ({ langMode }: Level2BarakhadiProps) => {
  const [activeRoot, setActiveRoot] = useState<typeof BARAKHADI_ROOTS[0] | null>(null);
  const [activeCell, setActiveCell] = useState<string | null>(null);

  const handleRootClick = (root: typeof BARAKHADI_ROOTS[0]) => {
    setActiveRoot(root);
    speak(langMode === 'gujarati' ? root.gujarati : root.hindi);
  };

  const handleMatraClick = (matra: typeof BARAKHADI_MATRAS[0]) => {
    if (!activeRoot) return;
    
    const combined = langMode === 'gujarati' 
      ? activeRoot.gujarati + matra.gujarati 
      : activeRoot.hindi + matra.hindi;
    
    setActiveCell(matra.suffix);
    speak(combined);
    setTimeout(() => setActiveCell(null), 500);
  };

  return (
    <div className="bg-card rounded-3xl shadow-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">📝</span>
        <div>
          <h2 className="text-xl font-bold text-foreground">Level 2: Barakhadi</h2>
          <p className="text-sm text-muted-foreground">Learn letter combinations with matras</p>
        </div>
      </div>

      <div className="flex-1 scroll-area">
        {!activeRoot ? (
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-3">
            {BARAKHADI_ROOTS.map((root, i) => (
              <button
                key={i}
                onClick={() => handleRootClick(root)}
                className={cn(
                  'p-4 rounded-2xl font-bold transition-all card-hover btn-bounce',
                  'bg-gradient-to-br from-secondary/30 to-secondary/10',
                  'border-2 border-secondary/20 hover:border-secondary/50',
                  'flex flex-col items-center justify-center h-20'
                )}
              >
                <span className="text-2xl text-foreground">
                  {langMode === 'gujarati' ? root.gujarati : root.hindi}
                </span>
                <span className="text-xs font-bold text-primary mt-1">
                  ({root.english})
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setActiveRoot(null)}
              className="mb-6 flex items-center gap-2 text-sm font-bold px-4 py-2 bg-muted rounded-xl hover:bg-muted/80 transition-colors btn-bounce"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Letters
            </button>

            <div className="text-center mb-6">
              <span className="text-5xl font-bold text-primary">
                {langMode === 'gujarati' ? activeRoot.gujarati : activeRoot.hindi}
              </span>
              <span className="text-xl text-muted-foreground ml-2">
                ({activeRoot.english})
              </span>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {BARAKHADI_MATRAS.map((matra, i) => {
                const combined = langMode === 'gujarati'
                  ? activeRoot.gujarati + matra.gujarati
                  : activeRoot.hindi + matra.hindi;
                
                return (
                  <div
                    key={i}
                    onClick={() => handleMatraClick(matra)}
                    className={cn(
                      'p-4 rounded-2xl text-center cursor-pointer transition-all card-hover',
                      'bg-card border-2 border-primary/20 hover:border-primary/50',
                      'flex flex-col items-center justify-center h-24',
                      activeCell === matra.suffix && 'scale-105 border-primary shadow-glow'
                    )}
                  >
                    <span className="text-3xl font-bold text-foreground">
                      {combined}
                    </span>
                    <span className="text-xs text-muted-foreground mt-2">
                      {activeRoot.english}{matra.english}
                    </span>
                    <Volume2 className="w-3 h-3 text-muted-foreground/50 mt-1" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
