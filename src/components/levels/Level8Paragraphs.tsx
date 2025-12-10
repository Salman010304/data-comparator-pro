import { useState } from 'react';
import { PARAGRAPHS } from '@/data/phonicsData';
import { speakEnglish } from '@/utils/speech';
import { cn } from '@/lib/utils';
import { Volume2, BookOpen } from 'lucide-react';
import { MicButton } from '../MicButton';

interface Level8ParagraphsProps {
  langMode: 'gujarati' | 'hindi';
  onAddStar: () => void;
}

export const Level8Paragraphs = ({ langMode, onAddStar }: Level8ParagraphsProps) => {
  const [activeParagraph, setActiveParagraph] = useState<number | null>(null);

  return (
    <div className="bg-card rounded-3xl shadow-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">📄</span>
        <div>
          <h2 className="text-xl font-bold text-foreground">Level 8: Paragraphs</h2>
          <p className="text-sm text-muted-foreground">Read and understand short stories</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6">
        {PARAGRAPHS.map((para) => (
          <div
            key={para.id}
            className={cn(
              'rounded-3xl transition-all',
              'bg-gradient-to-br from-accent/10 to-accent/5',
              'border-2 border-accent/20',
              activeParagraph === para.id && 'border-accent shadow-glow'
            )}
          >
            {/* Header */}
            <div 
              onClick={() => setActiveParagraph(activeParagraph === para.id ? null : para.id)}
              className="p-5 cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl gradient-accent flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">{para.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {para.text.split(' ').length} words
                  </p>
                </div>
              </div>
              <span className="text-2xl">
                {activeParagraph === para.id ? '📖' : '📕'}
              </span>
            </div>

            {/* Content - Scrollable */}
            {activeParagraph === para.id && (
              <div className="px-5 pb-5 space-y-4 max-h-[500px] overflow-y-auto">
                {/* English Text */}
                <div className="p-4 bg-card rounded-2xl">
                  <p className="text-lg leading-relaxed text-foreground font-medium">
                    {para.text}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => speakEnglish(para.text, 0.75)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground font-medium shadow-button btn-bounce"
                  >
                    <Volume2 className="w-4 h-4" />
                    Listen to Story
                  </button>
                  <MicButton targetText={para.text} onCorrect={onAddStar} size="lg" />
                </div>

                {/* Read Along - Scrollable */}
                <div className="pt-4 border-t border-border">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                    Read Sentence by Sentence:
                  </h4>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {para.text.split('. ').filter(s => s.trim()).map((sentence, i) => (
                      <div 
                        key={i}
                        onClick={() => speakEnglish(sentence)}
                        className="p-3 bg-card rounded-xl cursor-pointer hover:bg-primary/5 transition-colors flex items-center justify-between"
                      >
                        <span className="text-foreground">{sentence}.</span>
                        <Volume2 className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
