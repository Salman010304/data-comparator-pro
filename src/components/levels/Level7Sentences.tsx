import { useState } from 'react';
import { SENTENCES } from '@/data/phonicsData';
import { speakEnglish } from '@/utils/speech';
import { cn } from '@/lib/utils';
import { Volume2, ChevronRight, ArrowLeft } from 'lucide-react';
import { MicButton } from '../MicButton';

interface Level7SentencesProps {
  langMode: 'gujarati' | 'hindi';
  onAddStar: () => void;
}

export const Level7Sentences = ({ langMode, onAddStar }: Level7SentencesProps) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSentence, setActiveSentence] = useState<string | null>(null);

  const categories = [
    { key: 'theCVC', title: 'The + CVC Word + is', icon: '🔵', color: 'bg-blue-100 border-blue-200 text-blue-700' },
    { key: 'iAmHave', title: 'I am / I have / I can', icon: '🟣', color: 'bg-purple-100 border-purple-200 text-purple-700' },
    { key: 'heShe', title: 'He / She + is', icon: '🟠', color: 'bg-orange-100 border-orange-200 text-orange-700' },
    { key: 'thisThat', title: 'This / That + is', icon: '🟡', color: 'bg-yellow-100 border-yellow-200 text-yellow-700' },
    { key: 'wordFamilySentences', title: 'Word Family Sentences', icon: '🟢', color: 'bg-green-100 border-green-200 text-green-700' },
    { key: 'whSentences', title: 'WH Questions', icon: '❓', color: 'bg-red-100 border-red-200 text-red-700' },
    { key: 'mixedPractice', title: 'Mixed Practice', icon: '🎯', color: 'bg-indigo-100 border-indigo-200 text-indigo-700' },
  ];

  const handleSentenceClick = (sentence: string) => {
    setActiveSentence(sentence);
    speakEnglish(sentence);
    setTimeout(() => setActiveSentence(null), 1000);
  };

  return (
    <div className="bg-card rounded-3xl shadow-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">✍️</span>
        <div>
          <h2 className="text-xl font-bold text-foreground">Level 7: Reading Sentences</h2>
          <p className="text-sm text-muted-foreground">Practice reading complete sentences</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!activeCategory ? (
          <div className="space-y-3">
            {categories.map((cat) => {
              const sentences = SENTENCES[cat.key as keyof typeof SENTENCES];
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={cn(
                    'w-full p-4 rounded-2xl font-semibold transition-all card-hover btn-bounce',
                    'border-2 flex items-center justify-between',
                    cat.color
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <div className="text-left">
                      <span className="block">{cat.title}</span>
                      <span className="text-xs opacity-70">{sentences.length} sentences</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-50" />
                </button>
              );
            })}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setActiveCategory(null)}
              className="mb-6 flex items-center gap-2 text-sm font-bold px-4 py-2 bg-muted rounded-xl hover:bg-muted/80 transition-colors btn-bounce"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Categories
            </button>

            <div className="space-y-4">
              {SENTENCES[activeCategory as keyof typeof SENTENCES].map((item, i) => (
                <div
                  key={i}
                  onClick={() => handleSentenceClick(item.english)}
                  className={cn(
                    'p-5 rounded-2xl cursor-pointer transition-all card-hover',
                    'bg-card border-2 border-border hover:border-primary/30',
                    activeSentence === item.english && 'scale-[1.01] border-primary bg-primary/5'
                  )}
                >
                  <p className="text-xl font-bold text-foreground mb-4">
                    {item.english}
                  </p>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => { e.stopPropagation(); speakEnglish(item.english); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-sm font-medium"
                    >
                      <Volume2 className="w-4 h-4" />
                      Listen
                    </button>
                    <MicButton targetText={item.english} onCorrect={onAddStar} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
