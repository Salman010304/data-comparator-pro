import { useState } from 'react';
import { GRAMMAR_WORDS } from '@/data/phonicsData';
import { speakEnglish } from '@/utils/speech';
import { cn } from '@/lib/utils';
import { Volume2 } from 'lucide-react';
import { MicButton } from '../MicButton';
import { LessonIntro } from '../LessonIntro';

interface Level6GrammarProps {
  langMode: 'gujarati' | 'hindi';
  onAddStar: () => void;
}

interface WordCardProps {
  item: typeof GRAMMAR_WORDS[0];
  color: string;
  langMode: 'gujarati' | 'hindi';
  activeWord: string | null;
  onClick: () => void;
  onAddStar: () => void;
}

const WordCard = ({ item, color, langMode, activeWord, onClick, onAddStar }: WordCardProps) => (
  <div onClick={onClick} className={cn('p-4 rounded-2xl cursor-pointer transition-all card-hover', 'bg-card border-2 border-border', 'flex items-center justify-between', activeWord === item.word && 'scale-[1.02] border-accent shadow-glow', color)}>
    <div>
      <span className="text-xl font-bold text-foreground">{item.word}</span>
      <p className="text-sm text-muted-foreground mt-1">{langMode === 'gujarati' ? item.meaningGujarati : item.meaningHindi}</p>
    </div>
    <div className="flex items-center gap-2">
      <button onClick={(e) => { e.stopPropagation(); speakEnglish(item.word); }} className="p-2 rounded-full bg-accent/10 text-accent hover:bg-accent/20"><Volume2 className="w-4 h-4" /></button>
      <MicButton targetText={item.word} onCorrect={onAddStar} />
    </div>
  </div>
);

export const Level6Grammar = ({ langMode, onAddStar }: Level6GrammarProps) => {
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [showLesson, setShowLesson] = useState(false);

  const handleWordClick = (word: string) => { setActiveWord(word); speakEnglish(word); setTimeout(() => setActiveWord(null), 500); };

  const pronouns = GRAMMAR_WORDS.filter(w => ['I', 'You', 'He', 'She', 'It', 'We', 'They'].includes(w.word));
  const verbs = GRAMMAR_WORDS.filter(w => ['Is', 'Am', 'Are', 'Was', 'Were', 'Have', 'Has'].includes(w.word));
  const demonstratives = GRAMMAR_WORDS.filter(w => ['This', 'That'].includes(w.word));

  const lessonSteps = [
    { title: "What is Grammar? 📚", content: "Grammar is like the rules of a game! It tells us how to put words together correctly.", contentGujarati: "વ્યાકરણ રમતના નિયમો જેવું છે! તે આપણને શબ્દો યોગ્ય રીતે ગોઠવવાનું શીખવે છે.", contentHindi: "व्याकरण खेल के नियमों जैसा है! यह हमें शब्दों को सही तरीके से जोड़ना सिखाता है।", emoji: "📏" },
    { title: "Pronouns - People Words 👤", content: "Pronouns replace names! Instead of 'Ram is happy', we say 'He is happy'. I, You, He, She, It, We, They are pronouns!", contentGujarati: "સર્વનામ નામોની જગ્યાએ વપરાય છે! 'રામ ખુશ છે' ની જગ્યાએ 'તે ખુશ છે'. I, You, He, She, It, We, They સર્વનામ છે!", contentHindi: "सर्वनाम नामों की जगह आते हैं! 'राम खुश है' की जगह 'वह खुश है'। I, You, He, She, It, We, They सर्वनाम हैं!", example: "I You He She", emoji: "👥" },
    { title: "Helping Verbs 🔄", content: "Verbs like Is, Am, Are, Was, Were help us describe things. 'I am happy', 'She is tall'!", contentGujarati: "Is, Am, Are, Was, Were જેવા ક્રિયાપદો વસ્તુઓનું વર્ણન કરવામાં મદદ કરે છે. 'I am happy', 'She is tall'!", contentHindi: "Is, Am, Are, Was, Were जैसी क्रियाएँ चीज़ों का वर्णन करने में मदद करती हैं। 'I am happy', 'She is tall'!", example: "Is Am Are", emoji: "💪" },
    { title: "This and That 👉", content: "'This' is for things close to you. 'That' is for things far away.", contentGujarati: "'This' નજીકની વસ્તુઓ માટે છે. 'That' દૂરની વસ્તુઓ માટે છે.", contentHindi: "'This' पास की चीज़ों के लिए है। 'That' दूर की चीज़ों के लिए है।", example: "This That", emoji: "🎯" },
    { title: "Practice Time! 🎮", content: "Learn these grammar words well - you'll use them in every sentence!", contentGujarati: "આ વ્યાકરણના શબ્દો સારી રીતે શીખો - તમે દરેક વાક્યમાં તેનો ઉપયોગ કરશો!", contentHindi: "ये व्याकरण के शब्द अच्छी तरह सीखो - हर वाक्य में इस्तेमाल करोगे!", emoji: "✨" }
  ];

  if (!showLesson) {
    return (
      <LessonIntro levelNumber={6} levelTitle="Grammar Words" levelEmoji="📚" description="Learn essential grammar words for building sentences" descriptionGujarati="વાક્યો બનાવવા માટે જરૂરી વ્યાકરણના શબ્દો શીખો" descriptionHindi="वाक्य बनाने के लिए ज़रूरी व्याकरण के शब्द सीखो" objective="Master pronouns, verbs, and demonstratives" objectiveGujarati="સર્વનામ, ક્રિયાપદ અને નિર્દેશકો શીખો" objectiveHindi="सर्वनाम, क्रिया और निर्देशक सीखो" steps={lessonSteps} funFact="The pronoun 'I' is always written with a capital letter!" funFactGujarati="સર્વનામ 'I' હંમેશા મોટા અક્ષરે લખાય છે!" funFactHindi="सर्वनाम 'I' हमेशा बड़े अक्षर में लिखा जाता है!" langMode={langMode} onStartLesson={() => setShowLesson(true)} />
    );
  }

  return (
    <div className="bg-card rounded-3xl shadow-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6"><span className="text-3xl">📚</span><div><h2 className="text-xl font-bold text-foreground">Level 6: Grammar Words</h2><p className="text-sm text-muted-foreground">Learn pronouns, verbs, and more</p></div></div>
      <div className="flex-1 scroll-area space-y-6">
        <div><h3 className="text-sm font-bold mb-3 flex items-center gap-2 px-3 py-1 rounded-full inline-block bg-accent/20 text-accent">👤 Pronouns (સર્વનામ / सर्वनाम)</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{pronouns.map((item, i) => (<WordCard key={i} item={item} color="hover:border-accent/50" langMode={langMode} activeWord={activeWord} onClick={() => handleWordClick(item.word)} onAddStar={onAddStar} />))}</div></div>
        <div><h3 className="text-sm font-bold mb-3 flex items-center gap-2 px-3 py-1 rounded-full inline-block bg-primary/20 text-primary">🔄 Verbs (ક્રિયાપદ / क्रिया)</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{verbs.map((item, i) => (<WordCard key={i} item={item} color="hover:border-primary/50" langMode={langMode} activeWord={activeWord} onClick={() => handleWordClick(item.word)} onAddStar={onAddStar} />))}</div></div>
        <div><h3 className="text-sm font-bold mb-3 flex items-center gap-2 px-3 py-1 rounded-full inline-block bg-success/20 text-success">👉 Demonstratives (નિર્દેશક / निर्देशक)</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{demonstratives.map((item, i) => (<WordCard key={i} item={item} color="hover:border-success/50" langMode={langMode} activeWord={activeWord} onClick={() => handleWordClick(item.word)} onAddStar={onAddStar} />))}</div></div>
      </div>
    </div>
  );
};
