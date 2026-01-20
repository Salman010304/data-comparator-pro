import { useState } from 'react';
import { CVC_WORD_FAMILIES, ALPHABET_DATA } from '@/data/phonicsData';
import { speakEnglish, speak } from '@/utils/speech';
import { cn } from '@/lib/utils';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { MicButton } from '../MicButton';
import { LessonIntro } from '../LessonIntro';

interface Level4CVCWordsProps {
  langMode: 'gujarati' | 'hindi';
  onAddStar: () => void;
}

const getWordBreakdown = (word: string, family: string, langMode: 'gujarati' | 'hindi') => {
  const consonant = word.charAt(0).toUpperCase();
  const familyUpper = family.toUpperCase();
  
  const letterData = ALPHABET_DATA.find(a => a.letter === consonant);
  const consonantLocal = letterData 
    ? (langMode === 'gujarati' ? letterData.gujarati : letterData.hindi)
    : consonant;
  
  const familyData = CVC_WORD_FAMILIES[family as keyof typeof CVC_WORD_FAMILIES];
  const familyLocal = familyData 
    ? (langMode === 'gujarati' ? familyData.gujarati : familyData.hindi)
    : familyUpper;
  
  return {
    englishBreakdown: `${consonant} + ${familyUpper}`,
    localBreakdown: `${consonantLocal} + ${familyLocal}`,
  };
};

export const Level4CVCWords = ({ langMode, onAddStar }: Level4CVCWordsProps) => {
  const [activeFamily, setActiveFamily] = useState<string | null>(null);
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [showLesson, setShowLesson] = useState(false);

  const families = Object.keys(CVC_WORD_FAMILIES);

  const familyGroups = {
    A: families.filter(f => ['at', 'an', 'ag', 'am', 'ap', 'ad'].includes(f)),
    E: families.filter(f => ['en', 'et', 'ed', 'em'].includes(f)),
    I: families.filter(f => ['in', 'it', 'ig', 'ip'].includes(f)),
    O: families.filter(f => ['ot', 'op', 'og', 'ox'].includes(f)),
    U: families.filter(f => ['ug', 'un', 'um', 'ut'].includes(f)),
  };

  const vowelColors: Record<string, string> = {
    A: 'bg-red-100 text-red-700 border-red-200',
    E: 'bg-blue-100 text-blue-700 border-blue-200',
    I: 'bg-green-100 text-green-700 border-green-200',
    O: 'bg-orange-100 text-orange-700 border-orange-200',
    U: 'bg-purple-100 text-purple-700 border-purple-200',
  };

  const handleFamilyClick = (family: string) => {
    setActiveFamily(family);
    speakEnglish(family);
  };

  const handleWordClick = (word: string) => {
    setActiveWord(word);
    speakEnglish(word);
    setTimeout(() => setActiveWord(null), 500);
  };

  const getVowelForFamily = (family: string): string => {
    for (const [vowel, families] of Object.entries(familyGroups)) {
      if (families.includes(family)) return vowel;
    }
    return 'A';
  };

  const lessonSteps = [
    {
      title: "What are CVC Words? 📖",
      content: "CVC stands for Consonant-Vowel-Consonant. These are simple 3-letter words like CAT, DOG, SUN that follow this pattern!",
      contentGujarati: "CVC એટલે વ્યંજન-સ્વર-વ્યંજન. આ સરળ ૩-અક્ષરના શબ્દો છે જેમ કે CAT, DOG, SUN જે આ પેટર્ન ધરાવે છે!",
      contentHindi: "CVC का मतलब है व्यंजन-स्वर-व्यंजन। ये आसान 3-अक्षर के शब्द हैं जैसे CAT, DOG, SUN जो इस पैटर्न को फॉलो करते हैं!",
      example: "C-A-T",
      emoji: "🐱"
    },
    {
      title: "Word Families 👨‍👩‍👧‍👦",
      content: "Words that end the same are in the same family! CAT, BAT, HAT all belong to the '-AT' family. Learning families helps you read faster!",
      contentGujarati: "જે શબ્દો સમાન રીતે સમાપ્ત થાય છે તે એક જ પરિવારમાં છે! CAT, BAT, HAT બધા '-AT' પરિવારના છે. પરિવારો શીખવાથી ઝડપથી વાંચી શકો છો!",
      contentHindi: "जो शब्द एक जैसे खत्म होते हैं वे एक परिवार में हैं! CAT, BAT, HAT सब '-AT' परिवार के हैं। परिवार सीखने से तेज़ पढ़ सकते हो!",
      example: "CAT BAT HAT",
      emoji: "🏠"
    },
    {
      title: "Breaking Words Apart 🔨",
      content: "To read a CVC word, break it into parts: C + AT = CAT. The first letter changes, but the ending stays the same!",
      contentGujarati: "CVC શબ્દ વાંચવા માટે, તેને ભાગોમાં વહેંચો: C + AT = CAT. પહેલો અક્ષર બદલાય છે, પણ અંત એક જ રહે છે!",
      contentHindi: "CVC शब्द पढ़ने के लिए, इसे हिस्सों में बाँटो: C + AT = CAT। पहला अक्षर बदलता है, लेकिन अंत वही रहता है!",
      example: "B + AT = BAT",
      emoji: "🧩"
    },
    {
      title: "Sound It Out 🔊",
      content: "Say each sound slowly, then blend them together faster. 'cuh' + 'aaa' + 'tuh' = 'CAT'!",
      contentGujarati: "દરેક અવાજ ધીમે-ધીમે બોલો, પછી તેમને ઝડપથી જોડો. 'ક' + 'આ' + 'ટ' = 'કેટ'!",
      contentHindi: "हर आवाज़ धीरे-धीरे बोलो, फिर उन्हें तेज़ी से जोड़ो। 'क' + 'आ' + 'ट' = 'कैट'!",
      emoji: "🗣️"
    },
    {
      title: "Practice Time! 🎮",
      content: "Pick a word family, then tap words to hear them. Use the microphone to practice saying them yourself!",
      contentGujarati: "એક શબ્દ પરિવાર પસંદ કરો, પછી શબ્દો પર ટેપ કરીને સાંભળો. માઇક્રોફોનથી જાતે બોલવાનો અભ્યાસ કરો!",
      contentHindi: "एक शब्द परिवार चुनो, फिर शब्दों पर टैप करके सुनो। माइक्रोफोन से खुद बोलने का अभ्यास करो!",
      emoji: "🎤"
    }
  ];

  if (!showLesson) {
    return (
      <LessonIntro
        levelNumber={4}
        levelTitle="CVC Word Families"
        levelEmoji="📖"
        description="Master 3-letter words grouped by ending sounds"
        descriptionGujarati="અંતના અવાજો પ્રમાણે ગોઠવાયેલા ૩-અક્ષરના શબ્દો શીખો"
        descriptionHindi="अंत की आवाज़ों के हिसाब से 3-अक्षर के शब्द सीखो"
        objective="Read CVC words fluently using word family patterns"
        objectiveGujarati="શબ્દ પરિવારની પેટર્ન વાપરીને CVC શબ્દો સરળતાથી વાંચો"
        objectiveHindi="शब्द परिवार पैटर्न का उपयोग करके CVC शब्द आसानी से पढ़ो"
        steps={lessonSteps}
        funFact="There are over 500 CVC words in English! Once you know the patterns, you can read them all."
        funFactGujarati="અંગ્રેજીમાં ૫૦૦ થી વધુ CVC શબ્દો છે! એકવાર પેટર્ન શીખી લો, તમે બધા વાંચી શકો છો."
        funFactHindi="अंग्रेजी में 500 से ज्यादा CVC शब्द हैं! एक बार पैटर्न सीख लो, सब पढ़ सकते हो।"
        langMode={langMode}
        onStartLesson={() => setShowLesson(true)}
      />
    );
  }

  return (
    <div className="bg-card rounded-3xl shadow-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">📖</span>
        <div>
          <h2 className="text-xl font-bold text-foreground">Level 4: CVC Word Families</h2>
          <p className="text-sm text-muted-foreground">3-letter words grouped by ending sounds</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!activeFamily ? (
          <div className="space-y-6">
            {Object.entries(familyGroups).map(([vowel, familyList]) => (
              <div key={vowel}>
                <h3 className={cn(
                  'text-sm font-bold mb-3 flex items-center gap-2 px-3 py-1 rounded-full inline-block',
                  vowelColors[vowel]
                )}>
                  {vowel}-Vowel Families
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {familyList.map((family) => {
                    const data = CVC_WORD_FAMILIES[family as keyof typeof CVC_WORD_FAMILIES];
                    return (
                      <button
                        key={family}
                        onClick={() => handleFamilyClick(family)}
                        className={cn(
                          'p-4 rounded-2xl font-bold transition-all card-hover btn-bounce',
                          'bg-gradient-to-br from-success/20 to-success/5',
                          'border-2 border-success/20 hover:border-success/50',
                          'flex flex-col items-center justify-center h-24'
                        )}
                      >
                        <span className="text-xl text-success-foreground uppercase">
                          -{family}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          {data.words.length} words
                        </span>
                        <span className="text-xs text-muted-foreground/70">
                          {langMode === 'gujarati' ? data.gujarati : data.hindi}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setActiveFamily(null)}
              className="mb-6 flex items-center gap-2 text-sm font-bold px-4 py-2 bg-muted rounded-xl hover:bg-muted/80 transition-colors btn-bounce"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Families
            </button>

            <div className="text-center mb-6">
              <span className={cn(
                'text-4xl font-bold px-6 py-2 rounded-2xl uppercase',
                vowelColors[getVowelForFamily(activeFamily)]
              )}>
                -{activeFamily}
              </span>
              <p className="text-muted-foreground mt-3">
                {langMode === 'gujarati' 
                  ? CVC_WORD_FAMILIES[activeFamily as keyof typeof CVC_WORD_FAMILIES].gujarati 
                  : CVC_WORD_FAMILIES[activeFamily as keyof typeof CVC_WORD_FAMILIES].hindi
                }
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {CVC_WORD_FAMILIES[activeFamily as keyof typeof CVC_WORD_FAMILIES].words.map((word, i) => {
                const breakdown = getWordBreakdown(word, activeFamily, langMode);
                
                return (
                  <div
                    key={i}
                    onClick={() => handleWordClick(word)}
                    className={cn(
                      'p-5 rounded-2xl cursor-pointer transition-all card-hover',
                      'bg-card border-2 border-border hover:border-primary/50',
                      'flex flex-col items-center justify-center',
                      activeWord === word && 'scale-105 border-primary shadow-glow'
                    )}
                  >
                    <span className="text-3xl font-bold text-foreground capitalize mb-3">
                      {word}
                    </span>
                    
                    <div className="bg-primary/10 px-4 py-2 rounded-xl mb-2">
                      <span className="text-lg font-bold text-primary">
                        {breakdown.englishBreakdown}
                      </span>
                    </div>
                    
                    <div className="bg-secondary/10 px-4 py-2 rounded-xl mb-3">
                      <span className="text-base font-medium text-secondary-foreground">
                        {breakdown.localBreakdown}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); speakEnglish(word); }}
                        className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <MicButton targetText={word} onCorrect={onAddStar} />
                    </div>
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
