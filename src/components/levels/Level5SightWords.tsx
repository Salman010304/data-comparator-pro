import { useState } from 'react';
import { SIGHT_WORDS } from '@/data/phonicsData';
import { speakEnglish } from '@/utils/speech';
import { cn } from '@/lib/utils';
import { Volume2, Star, Eye } from 'lucide-react';
import { MicButton } from '../MicButton';
import { LessonIntro } from '../LessonIntro';

interface Level5SightWordsProps {
  langMode: 'gujarati' | 'hindi';
  onAddStar: () => void;
}

export const Level5SightWords = ({ langMode, onAddStar }: Level5SightWordsProps) => {
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3>(1);
  const [showLesson, setShowLesson] = useState(false);

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

  const lessonSteps = [
    {
      title: "What are Sight Words? 👁️",
      content: "Sight words are common words that appear everywhere! Words like 'the', 'is', 'and' appear in almost every sentence.",
      contentGujarati: "સાઇટ વર્ડ્સ એ સામાન્ય શબ્દો છે જે દરેક જગ્યાએ દેખાય છે! 'the', 'is', 'and' જેવા શબ્દો લગભગ દરેક વાક્યમાં આવે છે.",
      contentHindi: "साइट वर्ड्स वे आम शब्द हैं जो हर जगह दिखते हैं! 'the', 'is', 'and' जैसे शब्द लगभग हर वाक्य में आते हैं।",
      example: "the is and",
      emoji: "📚"
    },
    {
      title: "Why Learn Them? 🤔",
      content: "Some words don't follow normal spelling rules, so we need to recognize them by sight. Like 'the' - you can't sound it out easily!",
      contentGujarati: "કેટલાક શબ્દો સામાન્ય જોડણી નિયમો અનુસરતા નથી, તેથી આપણે તેમને જોઈને ઓળખવા જોઈએ. જેમ કે 'the' - તમે તેને સરળતાથી બોલી શકતા નથી!",
      contentHindi: "कुछ शब्द सामान्य स्पेलिंग नियमों का पालन नहीं करते, इसलिए हमें उन्हें देखकर पहचानना होता है। जैसे 'the' - इसे आसानी से बोला नहीं जा सकता!",
      example: "the one was",
      emoji: "🧠"
    },
    {
      title: "High Frequency Words 📊",
      content: "Just 100 sight words make up about 50% of all written text! Learning these words makes reading much faster.",
      contentGujarati: "માત્ર ૧૦૦ સાઇટ વર્ડ્સ બધા લખાણના ૫૦% બનાવે છે! આ શબ્દો શીખવાથી વાંચન ઘણું ઝડપી થાય છે.",
      contentHindi: "सिर्फ 100 साइट वर्ड्स सभी लिखावट का 50% बनाते हैं! ये शब्द सीखने से पढ़ना बहुत तेज़ हो जाता है।",
      emoji: "🚀"
    },
    {
      title: "The WH-Family ❓",
      content: "Special question words all start with 'WH': What, Where, When, Why, Who, Which. These help us ask questions!",
      contentGujarati: "ખાસ પ્રશ્ન શબ્દો 'WH' થી શરૂ થાય છે: What, Where, When, Why, Who, Which. આ પ્રશ્નો પૂછવામાં મદદ કરે છે!",
      contentHindi: "खास सवाल वाले शब्द 'WH' से शुरू होते हैं: What, Where, When, Why, Who, Which। ये सवाल पूछने में मदद करते हैं!",
      example: "What? Where?",
      emoji: "🔍"
    },
    {
      title: "Practice Time! 🎮",
      content: "Tap words to hear them, then try to say them yourself! The more you practice, the faster you'll recognize them.",
      contentGujarati: "શબ્દો પર ટેપ કરીને સાંભળો, પછી જાતે બોલવાનો પ્રયાસ કરો! જેટલો વધુ અભ્યાસ, તેટલી ઝડપથી ઓળખશો.",
      contentHindi: "शब्दों पर टैप करके सुनो, फिर खुद बोलने की कोशिश करो! जितना ज्यादा अभ्यास, उतनी जल्दी पहचानोगे।",
      emoji: "⚡"
    }
  ];

  if (!showLesson) {
    return (
      <LessonIntro
        levelNumber={5}
        levelTitle="Sight Words"
        levelEmoji="👁️"
        description="Learn high-frequency words you'll see everywhere"
        descriptionGujarati="એવા શબ્દો શીખો જે તમે દરેક જગ્યાએ જોશો"
        descriptionHindi="वे शब्द सीखो जो तुम हर जगह देखोगे"
        objective="Instantly recognize common words without sounding them out"
        objectiveGujarati="સામાન્ય શબ્દોને તરત ઓળખો, બોલ્યા વિના"
        objectiveHindi="आम शब्दों को तुरंत पहचानो, बोले बिना"
        steps={lessonSteps}
        funFact="The word 'the' is the most common word in English!"
        funFactGujarati="'the' શબ્દ અંગ્રેજીમાં સૌથી સામાન્ય શબ્દ છે!"
        funFactHindi="'the' शब्द अंग्रेजी में सबसे आम शब्द है!"
        langMode={langMode}
        onStartLesson={() => setShowLesson(true)}
      />
    );
  }

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

      <div className={cn('text-center py-2 px-4 rounded-xl mb-4', sightWordsData[activeLevel].color)}>
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
              <span className="text-2xl font-bold text-foreground">{item.word}</span>
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
