import { useState } from 'react';
import { BARAKHADI_ROOTS, BARAKHADI_MATRAS } from '@/data/phonicsData';
import { speak } from '@/utils/speech';
import { cn } from '@/lib/utils';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { LessonIntro } from '../LessonIntro';

interface Level2BarakhadiProps {
  langMode: 'gujarati' | 'hindi';
}

export const Level2Barakhadi = ({ langMode }: Level2BarakhadiProps) => {
  const [activeRoot, setActiveRoot] = useState<typeof BARAKHADI_ROOTS[0] | null>(null);
  const [activeCell, setActiveCell] = useState<string | null>(null);
  const [showLesson, setShowLesson] = useState(false);

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

  const lessonSteps = [
    {
      title: "What is Barakhadi? 📝",
      content: "Barakhadi is a special way to learn how consonants combine with vowels to make new sounds. It's like magic mixing!",
      emoji: "✨"
    },
    {
      title: "Consonants + Vowels = New Sounds! 🔀",
      content: "When we add a vowel sound (matra) to a consonant, we get a new sound. Like K + A = KA, K + I = KI!",
      example: "K + A = KA",
      emoji: "➕"
    },
    {
      title: "The Matras (Vowel Signs) 🎵",
      content: "Matras are the vowel marks that change how a consonant sounds. Each matra has its own shape and sound!",
      example: "ा ि ी ु ू",
      emoji: "🎶"
    },
    {
      title: "Building Words 🏗️",
      content: "Once you know Barakhadi, you can read any word! It's like knowing the secret code to unlock reading.",
      emoji: "🔓"
    },
    {
      title: "Let's Practice! 🎮",
      content: "First, tap a consonant to select it. Then tap different matras to hear how the sound changes!",
      emoji: "👆"
    }
  ];

  if (!showLesson) {
    return (
      <LessonIntro
        levelNumber={2}
        levelTitle="Barakhadi"
        levelEmoji="📝"
        description="Learn how consonants combine with vowel sounds"
        objective="Master letter combinations to read any word"
        steps={lessonSteps}
        funFact="Barakhadi has been used for thousands of years to teach reading in Indian languages!"
        onStartLesson={() => setShowLesson(true)}
      />
    );
  }

  return (
    <div className="bg-card rounded-3xl shadow-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">📝</span>
        <div>
          <h2 className="text-xl font-bold text-foreground">Level 2: Barakhadi</h2>
          <p className="text-sm text-muted-foreground">Learn letter combinations with matras</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
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
                  'flex flex-col items-center justify-center h-24'
                )}
              >
                <span className="text-2xl font-black text-primary">
                  {root.english}
                </span>
                <span className="text-sm text-foreground mt-1">
                  {langMode === 'gujarati' ? root.gujarati : root.hindi}
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
              <span className="text-5xl font-black text-primary">
                {activeRoot.english}
              </span>
              <span className="text-2xl text-muted-foreground ml-3">
                ({langMode === 'gujarati' ? activeRoot.gujarati : activeRoot.hindi})
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
                      'flex flex-col items-center justify-center h-28',
                      activeCell === matra.suffix && 'scale-105 border-primary shadow-glow'
                    )}
                  >
                    <span className="text-2xl font-black text-primary">
                      {activeRoot.english}{matra.english}
                    </span>
                    <span className="text-lg font-medium text-foreground mt-2">
                      {combined}
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
