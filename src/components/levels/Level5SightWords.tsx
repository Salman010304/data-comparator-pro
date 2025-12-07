import { useState } from 'react';
import { SIGHT_WORDS } from '@/data/phonicsData';
import { speakEnglish } from '@/utils/speech';
import { cn } from '@/lib/utils';
import { Volume2, Star, Eye } from 'lucide-react';
import { MicButton } from '../MicButton';

interface Level5SightWordsProps {
  langMode: 'gujarati' | 'hindi';
  onAddStar: () => void;
}

export const Level5SightWords = ({ langMode, onAddStar }: Level5SightWordsProps) => {
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3>(1);

  const handleWordClick = (word: string) => {
    setActiveWord(word);
    speakEnglish(word);
    setTimeout(() => setActiveWord(null), 500);
  };

  const sightWordsData = {
    1: { words: SIGHT_WORDS.level1, title: 'Most Important', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    2: { words: SIGHT_WORDS.level2, title: 'Common Words', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    3: { words: SIGHT_WORDS.level3, title: 'WH-Family', color: 'bg-red-100 text-red-700 border-red-200' },
  };

  return (
    <div className="bg-card rounded-3xl shadow-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">👁️</span>
        <div>
          <h2 className="text-xl font-bold text-foreground">Level 5: Sight Words</h2>
          <p className="text-sm text-muted-foreground">High-frequency words to recognize instantly</p>
        </div>
      </div>

      {/* Level Tabs */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((level) => (
          <button
            key={level}
            onClick={() => setActiveLevel(level as 1 | 2 | 3)}
            className={cn(
              'flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all btn-bounce',
              activeLevel === level 
                ? 'gradient-secondary text-secondary-foreground shadow-button' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            <div className="flex items-center justify-center gap-2">
              {level === 1 && <Star className="w-4 h-4" />}
              {level === 2 && <Eye className="w-4 h-4" />}
              {level === 3 && <span>❓</span>}
              Level {level}
            </div>
          </button>
        ))}
      </div>

      <div className={cn(
        'text-center py-2 px-4 rounded-xl mb-4',
        sightWordsData[activeLevel].color
      )}>
        <span className="font-semibold">{sightWordsData[activeLevel].title}</span>
        <span className="text-sm ml-2">({sightWordsData[activeLevel].words.length} words)</span>
      </div>

      <div className="flex-1 scroll-area">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {sightWordsData[activeLevel].words.map((item, i) => (
            <div
              key={i}
              onClick={() => handleWordClick(item.word)}
              className={cn(
                'p-4 rounded-2xl cursor-pointer transition-all card-hover',
                'bg-card border-2 border-border hover:border-warning/50',
                'flex flex-col items-center justify-center',
                activeWord === item.word && 'scale-105 border-warning shadow-glow bg-warning/10'
              )}
            >
              <span className="text-2xl font-bold text-foreground">
                {item.word}
              </span>
              <span className="text-sm text-muted-foreground mt-2">
                {langMode === 'gujarati' ? item.gujarati : item.hindi}
              </span>
              <div className="flex items-center gap-2 mt-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); speakEnglish(item.word); }}
                  className="p-1.5 rounded-full bg-warning/10 text-warning hover:bg-warning/20"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
                <MicButton targetText={item.word} onCorrect={onAddStar} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
