import { useState } from 'react';
import { PARAGRAPHS } from '@/data/phonicsData';
import { speakEnglish } from '@/utils/speech';
import { cn } from '@/lib/utils';
import { Volume2, BookOpen } from 'lucide-react';
import { MicButton } from '../MicButton';
import { LessonIntro } from '../LessonIntro';

interface Level8ParagraphsProps {
  langMode: 'gujarati' | 'hindi';
  onAddStar: () => void;
}

export const Level8Paragraphs = ({ langMode, onAddStar }: Level8ParagraphsProps) => {
  const [activeParagraph, setActiveParagraph] = useState<number | null>(null);
  const [showLesson, setShowLesson] = useState(false);

  const lessonSteps = [
    { title: "What is a Paragraph? 📄", content: "A paragraph is a group of sentences about one topic! Like a mini-story.", contentGujarati: "ફકરો એ એક વિષય વિશેના વાક્યોનો સમૂહ છે! એક નાની વાર્તા જેવો.", contentHindi: "पैराग्राफ एक विषय के बारे में वाक्यों का समूह है! एक छोटी कहानी जैसा।", emoji: "📑" },
    { title: "Stories and Information 📖", content: "Paragraphs tell stories or share information. They have a beginning, middle, and end!", contentGujarati: "ફકરાઓ વાર્તાઓ કહે છે અથવા માહિતી આપે છે. તેમની શરૂઆત, મધ્ય અને અંત હોય છે!", contentHindi: "पैराग्राफ कहानियाँ बताते हैं या जानकारी देते हैं। इनकी शुरुआत, बीच और अंत होता है!", emoji: "🎭" },
    { title: "Reading Fluently 🏃", content: "Good readers don't stop at every word. They read smoothly, like talking!", contentGujarati: "સારા વાચકો દરેક શબ્દ પર અટકતા નથી. તેઓ સરળતાથી વાંચે છે, બોલવા જેવું!", contentHindi: "अच्छे पाठक हर शब्द पर नहीं रुकते। वे आसानी से पढ़ते हैं, बोलने जैसा!", emoji: "💨" },
    { title: "Understanding What You Read 🧠", content: "It's not just about reading words - it's about understanding them! Ask yourself: What was this about?", contentGujarati: "આ માત્ર શબ્દો વાંચવા વિશે નથી - તેમને સમજવા વિશે છે! પોતાને પૂછો: આ શું વિશે હતું?", contentHindi: "यह सिर्फ शब्द पढ़ने के बारे में नहीं है - उन्हें समझने के बारे में है! खुद से पूछो: यह किस बारे में था?", emoji: "💡" },
    { title: "Practice Time! 🎮", content: "Read short stories and paragraphs. Listen first, then try reading along!", contentGujarati: "ટૂંકી વાર્તાઓ અને ફકરાઓ વાંચો. પહેલા સાંભળો, પછી સાથે વાંચવાનો પ્રયાસ કરો!", contentHindi: "छोटी कहानियाँ और पैराग्राफ पढ़ो। पहले सुनो, फिर साथ पढ़ने की कोशिश करो!", emoji: "🌟" }
  ];

  if (!showLesson) {
    return (
      <LessonIntro levelNumber={8} levelTitle="Reading Paragraphs" levelEmoji="📄" description="Read and understand short stories and paragraphs" descriptionGujarati="ટૂંકી વાર્તાઓ અને ફકરાઓ વાંચો અને સમજો" descriptionHindi="छोटी कहानियाँ और पैराग्राफ पढ़ो और समझो" objective="Read paragraphs fluently with comprehension" objectiveGujarati="સમજણ સાથે ફકરાઓ સરળતાથી વાંચો" objectiveHindi="समझ के साथ पैराग्राफ आसानी से पढ़ो" steps={lessonSteps} funFact="Reading for just 20 minutes a day exposes you to about 1.8 million words per year!" funFactGujarati="દિવસમાં માત્ર ૨૦ મિનિટ વાંચવાથી વર્ષમાં ૧૮ લાખ શબ્દો શીખી શકાય છે!" funFactHindi="दिन में सिर्फ 20 मिनट पढ़ने से साल में 18 लाख शब्द सीख सकते हो!" langMode={langMode} onStartLesson={() => setShowLesson(true)} />
    );
  }

  return (
    <div className="bg-card rounded-3xl shadow-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6"><span className="text-3xl">📄</span><div><h2 className="text-xl font-bold text-foreground">Level 8: Paragraphs</h2><p className="text-sm text-muted-foreground">Read and understand short stories</p></div></div>
      <div className="flex-1 overflow-y-auto space-y-6">
        {PARAGRAPHS.map((para) => (
          <div key={para.id} className={cn('rounded-3xl transition-all', 'bg-gradient-to-br from-accent/10 to-accent/5', 'border-2 border-accent/20', activeParagraph === para.id && 'border-accent shadow-glow')}>
            <div onClick={() => setActiveParagraph(activeParagraph === para.id ? null : para.id)} className="p-5 cursor-pointer flex items-center justify-between">
              <div className="flex items-center gap-3"><div className="w-12 h-12 rounded-2xl gradient-accent flex items-center justify-center"><BookOpen className="w-6 h-6 text-accent-foreground" /></div><div><h3 className="font-bold text-lg text-foreground">{para.title}</h3><p className="text-sm text-muted-foreground">{para.text.split(' ').length} words</p></div></div>
              <span className="text-2xl">{activeParagraph === para.id ? '📖' : '📕'}</span>
            </div>
            {activeParagraph === para.id && (
              <div className="px-5 pb-5 space-y-4 max-h-[500px] overflow-y-auto">
                <div className="p-4 bg-card rounded-2xl"><p className="text-lg leading-relaxed text-foreground font-medium">{para.text}</p></div>
                <div className="flex items-center gap-3"><button onClick={() => speakEnglish(para.text, 0.75)} className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground font-medium shadow-button btn-bounce"><Volume2 className="w-4 h-4" />Listen to Story</button><MicButton targetText={para.text} onCorrect={onAddStar} size="lg" /></div>
                <div className="pt-4 border-t border-border"><h4 className="text-sm font-semibold text-muted-foreground mb-3">Read Sentence by Sentence:</h4><div className="space-y-2 max-h-[200px] overflow-y-auto">{para.text.split('. ').filter(s => s.trim()).map((sentence, i) => (<div key={i} onClick={() => speakEnglish(sentence)} className="p-3 bg-card rounded-xl cursor-pointer hover:bg-primary/5 transition-colors flex items-center justify-between"><span className="text-foreground">{sentence}.</span><Volume2 className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" /></div>))}</div></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
