import { useState } from 'react';
import { TWO_LETTER_BLENDING } from '@/data/phonicsData';
import { speak, speakEnglish } from '@/utils/speech';
import { cn } from '@/lib/utils';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { MicButton } from '../MicButton';
import { LessonIntro } from '../LessonIntro';

interface Level3BlendingProps {
  langMode: 'gujarati' | 'hindi';
  onAddStar: () => void;
}

export const Level3Blending = ({ langMode, onAddStar }: Level3BlendingProps) => {
  const [activeVowel, setActiveVowel] = useState<string | null>(null);
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [showLesson, setShowLesson] = useState(false);

  const vowels = Object.keys(TWO_LETTER_BLENDING) as (keyof typeof TWO_LETTER_BLENDING)[];

  const handleVowelClick = (vowel: string) => {
    setActiveVowel(vowel);
    speakEnglish(vowel);
  };

  const handleWordClick = (word: typeof TWO_LETTER_BLENDING.A[0]) => {
    setActiveWord(word.word);
    speakEnglish(word.word);
    setTimeout(() => setActiveWord(null), 500);
  };

  const vowelColors: Record<string, string> = {
    A: 'from-red-400/30 to-red-400/10 border-red-400/30',
    E: 'from-blue-400/30 to-blue-400/10 border-blue-400/30',
    I: 'from-green-400/30 to-green-400/10 border-green-400/30',
    O: 'from-orange-400/30 to-orange-400/10 border-orange-400/30',
    U: 'from-purple-400/30 to-purple-400/10 border-purple-400/30',
  };

  const lessonSteps = [
    {
      title: "What is Blending? 🔗",
      content: "Blending is when we connect two letters together to make one smooth sound. It's like mixing two colors to make a new color!",
      contentGujarati: "બ્લેન્ડિંગ એટલે બે અક્ષરોને જોડીને એક સરળ અવાજ બનાવવો. જેમ બે રંગો મિક્સ કરીને નવો રંગ બને છે!",
      contentHindi: "ब्लेंडिंग का मतलब है दो अक्षरों को जोड़कर एक आसान आवाज़ बनाना। जैसे दो रंग मिलाकर नया रंग बनता है!",
      emoji: "🎨"
    },
    {
      title: "2-Letter Sounds 🔤",
      content: "When two letters come together, they create short words or sound chunks. Like 'AT', 'IN', 'UP' - these are building blocks!",
      contentGujarati: "જ્યારે બે અક્ષરો સાથે આવે છે, ત્યારે નાના શબ્દો બને છે. જેમ કે 'AT', 'IN', 'UP' - આ શબ્દોની ઈંટો છે!",
      contentHindi: "जब दो अक्षर साथ आते हैं, तो छोटे शब्द बनते हैं। जैसे 'AT', 'IN', 'UP' - ये शब्दों की ईंटें हैं!",
      example: "A + T = AT",
      emoji: "🧩"
    },
    {
      title: "Vowel Power! ⭐",
      content: "Each vowel (A, E, I, O, U) can blend with different consonants. 'A' can make AT, AN, AM - all with different endings!",
      contentGujarati: "દરેક સ્વર (A, E, I, O, U) અલગ-અલગ વ્યંજનો સાથે મળી શકે છે. 'A' થી AT, AN, AM બને છે!",
      contentHindi: "हर स्वर (A, E, I, O, U) अलग-अलग व्यंजनों के साथ मिल सकता है। 'A' से AT, AN, AM बनते हैं!",
      example: "AT AN AM",
      emoji: "💪"
    },
    {
      title: "Sound It Out 🗣️",
      content: "To read a blended word, say each letter's sound quickly together. 'AT' = 'aaa' + 'tuh' = 'AT'!",
      contentGujarati: "બ્લેન્ડેડ શબ્દ વાંચવા માટે, દરેક અક્ષરનો અવાજ ઝડપથી સાથે બોલો. 'AT' = 'આ' + 'ટ' = 'એટ'!",
      contentHindi: "ब्लेंडेड शब्द पढ़ने के लिए, हर अक्षर की आवाज़ जल्दी-जल्दी बोलो। 'AT' = 'आ' + 'ट' = 'एट'!",
      emoji: "🔊"
    },
    {
      title: "Practice Time! 🎮",
      content: "Pick a vowel, then tap the blended words to hear them. Try saying them yourself with the microphone!",
      contentGujarati: "એક સ્વર પસંદ કરો, પછી શબ્દો પર ટેપ કરીને સાંભળો. માઇક્રોફોનથી જાતે બોલવાનો પ્રયાસ કરો!",
      contentHindi: "एक स्वर चुनो, फिर शब्दों पर टैप करके सुनो। माइक्रोफोन से खुद बोलने की कोशिश करो!",
      emoji: "🎤"
    }
  ];

  if (!showLesson) {
    return (
      <LessonIntro
        levelNumber={3}
        levelTitle="2-Letter Blending"
        levelEmoji="🔗"
        description="Learn to blend vowels with consonants"
        descriptionGujarati="સ્વરોને વ્યંજનો સાથે જોડવાનું શીખો"
        descriptionHindi="स्वरों को व्यंजनों के साथ जोड़ना सीखो"
        objective="Master blending two letters into smooth sounds"
        objectiveGujarati="બે અક્ષરોને જોડીને સરળ અવાજો બનાવવાનું શીખો"
        objectiveHindi="दो अक्षरों को जोड़कर आसान आवाज़ें बनाना सीखो"
        steps={lessonSteps}
        funFact="Blending skills help you read faster! Good readers can blend sounds in their head automatically."
        funFactGujarati="બ્લેન્ડિંગ કૌશલ્ય તમને ઝડપથી વાંચવામાં મદદ કરે છે! સારા વાચકો આપોઆપ મનમાં અવાજો જોડી શકે છે."
        funFactHindi="ब्लेंडिंग कौशल तेज़ पढ़ने में मदद करता है! अच्छे पाठक अपने आप दिमाग में आवाज़ें जोड़ सकते हैं।"
        langMode={langMode}
        onStartLesson={() => setShowLesson(true)}
      />
    );
  }

  return (
    <div className="bg-card rounded-3xl shadow-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🔗</span>
        <div>
          <h2 className="text-xl font-bold text-foreground">Level 3: 2-Letter Blending</h2>
          <p className="text-sm text-muted-foreground">Learn to blend vowel sounds</p>
        </div>
      </div>

      <div className="flex-1 scroll-area">
        {!activeVowel ? (
          <div className="grid grid-cols-5 gap-4">
            {vowels.map((vowel) => (
              <button
                key={vowel}
                onClick={() => handleVowelClick(vowel)}
                className={cn(
                  'p-6 rounded-3xl font-bold transition-all card-hover btn-bounce',
                  'bg-gradient-to-br border-2',
                  vowelColors[vowel],
                  'flex flex-col items-center justify-center aspect-square'
                )}
              >
                <span className="text-5xl text-foreground">{vowel}</span>
                <span className="text-sm text-muted-foreground mt-2">
                  {TWO_LETTER_BLENDING[vowel].length} words
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setActiveVowel(null)}
              className="mb-6 flex items-center gap-2 text-sm font-bold px-4 py-2 bg-muted rounded-xl hover:bg-muted/80 transition-colors btn-bounce"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Vowels
            </button>

            <div className="text-center mb-6">
              <span className={cn(
                'text-5xl font-bold px-6 py-2 rounded-2xl',
                'bg-gradient-to-br',
                vowelColors[activeVowel]
              )}>
                {activeVowel}
              </span>
              <p className="text-muted-foreground mt-3">Vowel Blending Words</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {TWO_LETTER_BLENDING[activeVowel as keyof typeof TWO_LETTER_BLENDING].map((item, i) => (
                <div
                  key={i}
                  onClick={() => handleWordClick(item)}
                  className={cn(
                    'p-4 rounded-2xl cursor-pointer transition-all card-hover',
                    'bg-card border-2 border-border hover:border-primary/50',
                    'flex flex-col items-center justify-center',
                    activeWord === item.word && 'scale-105 border-primary shadow-glow'
                  )}
                >
                  <span className="text-3xl font-bold text-primary">
                    {item.word}
                  </span>
                  <span className="text-xs text-muted-foreground mt-2">
                    {item.blend}
                  </span>
                  <span className="text-sm text-muted-foreground mt-1">
                    {langMode === 'gujarati' ? item.gujarati : item.hindi}
                  </span>
                  <div className="flex items-center gap-2 mt-3">
                    <button 
                      onClick={(e) => { e.stopPropagation(); speakEnglish(item.word); }}
                      className="p-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                    <MicButton targetText={item.word} onCorrect={onAddStar} size="sm" />
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
