import { useState } from 'react';
import { ALPHABET_DATA } from '@/data/phonicsData';
import { speak } from '@/utils/speech';
import { cn } from '@/lib/utils';
import { Volume2 } from 'lucide-react';

interface Level1AlphabetProps {
  langMode: 'gujarati' | 'hindi';
}

interface LetterCardProps {
  item: typeof ALPHABET_DATA[0];
  langMode: 'gujarati' | 'hindi';
  activeCard: string | null;
  onClick: () => void;
}

const LetterCard = ({ item, langMode, activeCard, onClick }: LetterCardProps) => (
  <div
    onClick={onClick}
    className={cn(
      'p-4 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all card-hover',
      'bg-card border-2 border-transparent hover:border-primary/30',
      'shadow-card',
      activeCard === item.letter && 'scale-105 border-primary shadow-glow',
      item.isVowel && 'bg-gradient-to-br from-secondary/20 to-secondary/5'
    )}
  >
    <span className={cn(
      'text-4xl font-bold',
      item.isVowel ? 'text-secondary-foreground' : 'text-primary'
    )}>
      {item.letter}
    </span>
    <span className="text-lg font-semibold text-muted-foreground mt-1">
      ({langMode === 'gujarati' ? item.gujarati : item.hindi})
    </span>
    <span className="text-xs text-muted-foreground/70 mt-1 uppercase tracking-wide">
      {item.example}
    </span>
    <div className="mt-2 opacity-50">
      <Volume2 className="w-4 h-4" />
    </div>
  </div>
);

export const Level1Alphabet = ({ langMode }: Level1AlphabetProps) => {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const vowels = ALPHABET_DATA.filter(a => a.isVowel);
  const consonants = ALPHABET_DATA.filter(a => !a.isVowel);

  const handleCardClick = (letter: string, sound: string) => {
    setActiveCard(letter);
    speak(langMode === 'gujarati' 
      ? ALPHABET_DATA.find(a => a.letter === letter)?.gujarati || sound 
      : ALPHABET_DATA.find(a => a.letter === letter)?.hindi || sound
    );
    setTimeout(() => setActiveCard(null), 500);
  };

  return (
    <div className="bg-card rounded-3xl shadow-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🔤</span>
        <div>
          <h2 className="text-xl font-bold text-foreground">Level 1: Alphabet Sounds</h2>
          <p className="text-sm text-muted-foreground">Tap any letter to hear its sound</p>
        </div>
      </div>

      {/* Vowels Section */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-secondary-foreground mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary" />
          Vowels (A E I O U)
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {vowels.map((item) => (
            <LetterCard 
              key={item.letter} 
              item={item} 
              langMode={langMode}
              activeCard={activeCard}
              onClick={() => handleCardClick(item.letter, item.sound)}
            />
          ))}
        </div>
      </div>

      {/* Consonants Section */}
      <div className="flex-1 scroll-area">
        <h3 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          Consonants
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-3 pb-6">
          {consonants.map((item) => (
            <LetterCard 
              key={item.letter} 
              item={item} 
              langMode={langMode}
              activeCard={activeCard}
              onClick={() => handleCardClick(item.letter, item.sound)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
