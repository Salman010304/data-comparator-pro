import { useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface QuizQuestion {
  questionGujarati: string;
  questionHindi: string;
  answer: string;
  options: string[];
}

interface QuizGameProps {
  level: number;
  langMode: 'gujarati' | 'hindi';
  onClose: () => void;
  onPass: () => void;
}

// Question bank for each level - many more questions, no hints
const QUESTION_BANK: Record<number, QuizQuestion[]> = {
  1: [
    { questionGujarati: "'ક' માટે કયો અક્ષર છે?", questionHindi: "'क' के लिए कौन सा अक्षर है?", answer: "K", options: ["C", "K", "Q", "S"] },
    { questionGujarati: "'મ' માટે કયો અક્ષર છે?", questionHindi: "'म' के लिए कौन सा अक्षर है?", answer: "M", options: ["N", "W", "M", "V"] },
    { questionGujarati: "Apple નો પહેલો અક્ષર?", questionHindi: "Apple का पहला अक्षर?", answer: "A", options: ["E", "A", "I", "O"] },
    { questionGujarati: "'બ' નો અવાજ કયો?", questionHindi: "'ब' की आवाज क्या है?", answer: "B", options: ["D", "V", "B", "P"] },
    { questionGujarati: "Zebra નો પહેલો અક્ષર?", questionHindi: "Zebra का पहला अक्षर?", answer: "Z", options: ["S", "J", "X", "Z"] },
    { questionGujarati: "Dog નો પહેલો અક્ષર?", questionHindi: "Dog का पहला अक्षर?", answer: "D", options: ["B", "D", "G", "P"] },
    { questionGujarati: "'ન' માટે કયો અક્ષર છે?", questionHindi: "'न' के लिए कौन सा अक्षर है?", answer: "N", options: ["N", "M", "W", "U"] },
    { questionGujarati: "Cat નો પહેલો અક્ષર?", questionHindi: "Cat का पहला अक्षर?", answer: "C", options: ["K", "C", "S", "G"] },
    { questionGujarati: "'પ' નો અવાજ કયો?", questionHindi: "'प' की आवाज क्या है?", answer: "P", options: ["B", "D", "P", "T"] },
    { questionGujarati: "Sun નો પહેલો અક્ષર?", questionHindi: "Sun का पहला अक्षर?", answer: "S", options: ["C", "Z", "X", "S"] },
    { questionGujarati: "'ટ' માટે કયો અક્ષર છે?", questionHindi: "'ट' के लिए कौन सा अक्षर है?", answer: "T", options: ["T", "D", "P", "B"] },
    { questionGujarati: "Fish નો પહેલો અક્ષર?", questionHindi: "Fish का पहला अक्षर?", answer: "F", options: ["V", "F", "P", "H"] },
    { questionGujarati: "'ગ' નો અવાજ કયો?", questionHindi: "'ग' की आवाज क्या है?", answer: "G", options: ["J", "G", "K", "C"] },
    { questionGujarati: "Hat નો પહેલો અક્ષર?", questionHindi: "Hat का पहला अक्षर?", answer: "H", options: ["N", "H", "A", "M"] },
    { questionGujarati: "'જ' માટે કયો અક્ષર છે?", questionHindi: "'ज' के लिए कौन सा अक्षर है?", answer: "J", options: ["G", "J", "Y", "I"] },
  ],
  2: [
    { questionGujarati: "'કા' (Kaa) માટે કયો સ્પેલિંગ છે?", questionHindi: "'का' (Kaa) के लिए कौन सी वर्तनी है?", answer: "Kaa", options: ["Ka", "Kaa", "Ki", "Ku"] },
    { questionGujarati: "'જે' (Je) અક્ષર શોધો", questionHindi: "'जे' (Je) अक्षर खोजें", answer: "Je", options: ["Ja", "Je", "Ji", "Jo"] },
    { questionGujarati: "'મી' (Mee) માટે?", questionHindi: "'मी' (Mee) के लिए?", answer: "Mee", options: ["Me", "Mee", "Mu", "Ma"] },
    { questionGujarati: "'પુ' (Pu) માટે?", questionHindi: "'पु' (Pu) के लिए?", answer: "Pu", options: ["Pa", "Pi", "Pu", "Po"] },
    { questionGujarati: "'રે' (Re) અક્ષર શોધો", questionHindi: "'रे' (Re) अक्षर खोजें", answer: "Re", options: ["Ra", "Ri", "Re", "Ro"] },
    { questionGujarati: "'ગો' (Go) માટે?", questionHindi: "'गो' (Go) के लिए?", answer: "Go", options: ["Ga", "Gi", "Gu", "Go"] },
    { questionGujarati: "'ચી' (Chee) અક્ષર શોધો", questionHindi: "'ची' (Chee) अक्षर खोजें", answer: "Chee", options: ["Cha", "Chi", "Chee", "Chu"] },
    { questionGujarati: "'ના' (Naa) માટે?", questionHindi: "'ना' (Naa) के लिए?", answer: "Naa", options: ["Na", "Naa", "Ni", "Nu"] },
    { questionGujarati: "'બો' (Bo) અક્ષર શોધો", questionHindi: "'बो' (Bo) अक्षर खोजें", answer: "Bo", options: ["Ba", "Bi", "Bu", "Bo"] },
    { questionGujarati: "'લી' (Lee) માટે?", questionHindi: "'ली' (Lee) के लिए?", answer: "Lee", options: ["La", "Li", "Lee", "Lu"] },
    { questionGujarati: "'સા' (Saa) અક્ષર શોધો", questionHindi: "'सा' (Saa) अक्षर खोजें", answer: "Saa", options: ["Sa", "Saa", "Si", "Su"] },
    { questionGujarati: "'હુ' (Hu) માટે?", questionHindi: "'हु' (Hu) के लिए?", answer: "Hu", options: ["Ha", "Hi", "Hu", "Ho"] },
  ],
  3: [
    { questionGujarati: "'at' શબ્દ વાંચો", questionHindi: "'at' शब्द पढ़ें", answer: "at", options: ["at", "it", "an", "am"] },
    { questionGujarati: "'in' શબ્દ વાંચો", questionHindi: "'in' शब्द पढ़ें", answer: "in", options: ["on", "an", "in", "en"] },
    { questionGujarati: "'up' શબ્દ વાંચો", questionHindi: "'up' शब्द पढ़ें", answer: "up", options: ["up", "op", "ap", "ip"] },
    { questionGujarati: "'on' શબ્દ વાંચો", questionHindi: "'on' शब्द पढ़ें", answer: "on", options: ["an", "in", "on", "un"] },
    { questionGujarati: "'am' શબ્દ વાંચો", questionHindi: "'am' शब्द पढ़ें", answer: "am", options: ["am", "im", "em", "um"] },
    { questionGujarati: "'is' શબ્દ વાંચો", questionHindi: "'is' शब्द पढ़ें", answer: "is", options: ["as", "is", "us", "os"] },
    { questionGujarati: "'it' શબ્દ વાંચો", questionHindi: "'it' शब्द पढ़ें", answer: "it", options: ["at", "et", "it", "ut"] },
    { questionGujarati: "'us' શબ્દ વાંચો", questionHindi: "'us' शब्द पढ़ें", answer: "us", options: ["as", "is", "os", "us"] },
    { questionGujarati: "'an' શબ્દ વાંચો", questionHindi: "'an' शब्द पढ़ें", answer: "an", options: ["an", "in", "on", "en"] },
    { questionGujarati: "'or' શબ્દ વાંચો", questionHindi: "'or' शब्द पढ़ें", answer: "or", options: ["ar", "er", "ir", "or"] },
  ],
  4: [
    { questionGujarati: "'બેટ' (Bat) કયો શબ્દ છે?", questionHindi: "'बैट' (Bat) कौन सा शब्द है?", answer: "Bat", options: ["Cat", "Bat", "Mat", "Rat"] },
    { questionGujarati: "'પિન' (Pin) કયો શબ્દ છે?", questionHindi: "'पिन' (Pin) कौन सा शब्द है?", answer: "Pin", options: ["Pen", "Pin", "Pan", "Pun"] },
    { questionGujarati: "Cat નો સાચો સ્પેલિંગ?", questionHindi: "Cat की सही वर्तनी?", answer: "Cat", options: ["Kat", "Cet", "Cat", "Cot"] },
    { questionGujarati: "'સન' (Sun) એટલે?", questionHindi: "'सन' (Sun) का मतलब?", answer: "Sun", options: ["Run", "Fun", "Sun", "Bun"] },
    { questionGujarati: "'પોટ' (Pot) કયો શબ્દ છે?", questionHindi: "'पॉट' (Pot) कौन सा शब्द है?", answer: "Pot", options: ["Hot", "Lot", "Pot", "Dot"] },
    { questionGujarati: "'ડોગ' (Dog) કયો શબ્દ છે?", questionHindi: "'डॉग' (Dog) कौन सा शब्द है?", answer: "Dog", options: ["Dog", "Fog", "Log", "Hog"] },
    { questionGujarati: "'હેટ' (Hat) કયો શબ્દ છે?", questionHindi: "'हैट' (Hat) कौन सा शब्द है?", answer: "Hat", options: ["Cat", "Bat", "Hat", "Sat"] },
    { questionGujarati: "'કપ' (Cup) કયો શબ્દ છે?", questionHindi: "'कप' (Cup) कौन सा शब्द है?", answer: "Cup", options: ["Cup", "Cap", "Cop", "Cut"] },
    { questionGujarati: "'બેગ' (Bag) કયો શબ્દ છે?", questionHindi: "'बैग' (Bag) कौन सा शब्द है?", answer: "Bag", options: ["Bag", "Bug", "Big", "Beg"] },
    { questionGujarati: "'રેડ' (Red) કયો શબ્દ છે?", questionHindi: "'रेड' (Red) कौन सा शब्द है?", answer: "Red", options: ["Red", "Bed", "Fed", "Led"] },
    { questionGujarati: "'ફેન' (Fan) કયો શબ્દ છે?", questionHindi: "'फैन' (Fan) कौन सा शब्द है?", answer: "Fan", options: ["Man", "Can", "Fan", "Pan"] },
    { questionGujarati: "'મેટ' (Mat) કયો શબ્દ છે?", questionHindi: "'मैट' (Mat) कौन सा शब्द है?", answer: "Mat", options: ["Mat", "Bat", "Cat", "Sat"] },
  ],
  5: [
    { questionGujarati: "'the' શબ્દ વાંચો", questionHindi: "'the' शब्द पढ़ें", answer: "the", options: ["the", "a", "an", "is"] },
    { questionGujarati: "'is' શબ્દ વાંચો", questionHindi: "'is' शब्द पढ़ें", answer: "is", options: ["is", "as", "it", "in"] },
    { questionGujarati: "'are' શબ્દ વાંચો", questionHindi: "'are' शब्द पढ़ें", answer: "are", options: ["are", "or", "our", "ear"] },
    { questionGujarati: "'you' શબ્દ વાંચો", questionHindi: "'you' शब्द पढ़ें", answer: "you", options: ["you", "your", "yes", "yet"] },
    { questionGujarati: "'we' શબ્દ વાંચો", questionHindi: "'we' शब्द पढ़ें", answer: "we", options: ["we", "me", "he", "be"] },
    { questionGujarati: "'he' શબ્દ વાંચો", questionHindi: "'he' शब्द पढ़ें", answer: "he", options: ["he", "she", "we", "me"] },
    { questionGujarati: "'she' શબ્દ વાંચો", questionHindi: "'she' शब्द पढ़ें", answer: "she", options: ["she", "he", "the", "we"] },
    { questionGujarati: "'they' શબ્દ વાંચો", questionHindi: "'they' शब्द पढ़ें", answer: "they", options: ["they", "the", "this", "that"] },
    { questionGujarati: "'have' શબ્દ વાંચો", questionHindi: "'have' शब्द पढ़ें", answer: "have", options: ["have", "has", "had", "hav"] },
    { questionGujarati: "'can' શબ્દ વાંચો", questionHindi: "'can' शब्द पढ़ें", answer: "can", options: ["can", "car", "cat", "cap"] },
    { questionGujarati: "'for' શબ્દ વાંચો", questionHindi: "'for' शब्द पढ़ें", answer: "for", options: ["for", "from", "four", "far"] },
    { questionGujarati: "'with' શબ્દ વાંચો", questionHindi: "'with' शब्द पढ़ें", answer: "with", options: ["with", "will", "what", "when"] },
  ],
  6: [
    { questionGujarati: "'હું' એટલે?", questionHindi: "'मैं' मतलब?", answer: "I", options: ["I", "You", "He", "She"] },
    { questionGujarati: "'તમે' એટલે?", questionHindi: "'तुम' मतलब?", answer: "You", options: ["I", "You", "It", "We"] },
    { questionGujarati: "'છોકરા' માટે શું વપરાય?", questionHindi: "'लड़के' के लिए क्या उपयोग होता है?", answer: "He", options: ["He", "She", "It", "I"] },
    { questionGujarati: "'છોકરી' માટે શું વપરાય?", questionHindi: "'लड़की' के लिए क्या उपयोग होता है?", answer: "She", options: ["He", "She", "It", "You"] },
    { questionGujarati: "Is નો અર્થ?", questionHindi: "Is का मतलब?", answer: "છે/है", options: ["છે/है", "હું/हूँ", "તમે/तुम", "અમે/हम"] },
    { questionGujarati: "'અમે' એટલે?", questionHindi: "'हम' मतलब?", answer: "We", options: ["We", "You", "They", "I"] },
    { questionGujarati: "'તેઓ' એટલે?", questionHindi: "'वे' मतलब?", answer: "They", options: ["We", "You", "They", "He"] },
    { questionGujarati: "'આ' એટલે?", questionHindi: "'यह' मतलब?", answer: "This", options: ["This", "That", "These", "Those"] },
    { questionGujarati: "'તે' એટલે?", questionHindi: "'वह' मतलब?", answer: "That", options: ["This", "That", "These", "Those"] },
    { questionGujarati: "Am નો અર્થ?", questionHindi: "Am का मतलब?", answer: "છું/हूँ", options: ["છે/है", "છું/हूँ", "છો/हो", "છીએ/हैं"] },
    { questionGujarati: "Are નો અર્થ?", questionHindi: "Are का मतलब?", answer: "છો/हो", options: ["છે/है", "છું/हूँ", "છો/हो", "હતા/थे"] },
    { questionGujarati: "Was નો અર્થ?", questionHindi: "Was का मतलब?", answer: "હતો/था", options: ["છે/है", "હતો/था", "હશે/होगा", "છું/हूँ"] },
  ],
  7: [
    { questionGujarati: "The cat is ___.", questionHindi: "The cat is ___.", answer: "big", options: ["big", "is", "the", "cat"] },
    { questionGujarati: "I ___ a boy.", questionHindi: "I ___ a boy.", answer: "am", options: ["is", "am", "are", "was"] },
    { questionGujarati: "She ___ happy.", questionHindi: "She ___ happy.", answer: "is", options: ["am", "is", "are", "were"] },
    { questionGujarati: "They ___ on the mat.", questionHindi: "They ___ on the mat.", answer: "are", options: ["is", "am", "are", "was"] },
    { questionGujarati: "I ___ run fast.", questionHindi: "I ___ run fast.", answer: "can", options: ["is", "am", "can", "are"] },
    { questionGujarati: "___ is a cat.", questionHindi: "___ is a cat.", answer: "This", options: ["This", "Is", "A", "Cat"] },
    { questionGujarati: "He ___ a pen.", questionHindi: "He ___ a pen.", answer: "has", options: ["have", "has", "is", "am"] },
    { questionGujarati: "The dog is ___.", questionHindi: "The dog is ___.", answer: "sad", options: ["is", "the", "dog", "sad"] },
    { questionGujarati: "We ___ in the van.", questionHindi: "We ___ in the van.", answer: "are", options: ["is", "am", "are", "was"] },
    { questionGujarati: "I ___ a bag.", questionHindi: "I ___ a bag.", answer: "have", options: ["have", "has", "is", "am"] },
  ],
  8: [
    { questionGujarati: "My pet is a ___.", questionHindi: "My pet is a ___.", answer: "dog", options: ["cat", "dog", "rat", "hen"] },
    { questionGujarati: "I go to ___.", questionHindi: "I go to ___.", answer: "school", options: ["home", "school", "shop", "park"] },
    { questionGujarati: "The sun is in the ___.", questionHindi: "The sun is in the ___.", answer: "sky", options: ["sky", "sea", "land", "tree"] },
    { questionGujarati: "The sun gives us ___.", questionHindi: "The sun gives us ___.", answer: "light", options: ["water", "food", "light", "air"] },
    { questionGujarati: "I love my ___.", questionHindi: "I love my ___.", answer: "pet", options: ["pet", "pen", "pot", "pit"] },
    { questionGujarati: "My school is ___.", questionHindi: "My school is ___.", answer: "big", options: ["small", "big", "old", "new"] },
    { questionGujarati: "We ___ and write.", questionHindi: "We ___ and write.", answer: "read", options: ["read", "run", "play", "eat"] },
    { questionGujarati: "The sun is big and ___.", questionHindi: "The sun is big and ___.", answer: "hot", options: ["cold", "hot", "wet", "dry"] },
    { questionGujarati: "He can run ___.", questionHindi: "He can run ___.", answer: "fast", options: ["slow", "fast", "up", "down"] },
    { questionGujarati: "I have many ___.", questionHindi: "I have many ___.", answer: "friends", options: ["friends", "books", "toys", "pets"] },
  ],
};

export const QuizGame = ({ level, langMode, onClose, onPass }: QuizGameProps) => {
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  // Get random questions without repeating - 10 questions per quiz
  const questions = useMemo(() => {
    const allQuestions = QUESTION_BANK[level] || QUESTION_BANK[1];
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(10, shuffled.length));
  }, [level]);

  const currentQuestion = questions[questionIndex];
  
  // Shuffle options without providing hints (no highlighting correct answer)
  const shuffledOptions = useMemo(() => 
    currentQuestion ? [...currentQuestion.options].sort(() => Math.random() - 0.5) : [],
    [currentQuestion]
  );

  const handleAnswer = useCallback((selected: string) => {
    // Prevent answering same question twice
    if (answeredQuestions.has(questionIndex)) return;
    
    setAnsweredQuestions(prev => new Set(prev).add(questionIndex));
    
    if (selected === currentQuestion.answer) {
      setScore(s => s + 1);
    }
    
    // Move to next question after a brief delay
    setTimeout(() => {
      if (questionIndex < questions.length - 1) {
        setQuestionIndex(i => i + 1);
      } else {
        setShowResult(true);
      }
    }, 300);
  }, [questionIndex, currentQuestion, questions.length, answeredQuestions]);

  if (showResult) {
    const marksPerQuestion = 100 / questions.length;
    const totalMarks = Math.round(score * marksPerQuestion);
    const passed = totalMarks >= 50;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 backdrop-blur-sm p-4">
        <div className="bg-card rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-pop-in">
          <div className="text-6xl mb-4">{passed ? '🏆' : '😢'}</div>
          <h2 className={cn(
            'text-2xl font-black mb-2',
            passed ? 'text-success' : 'text-destructive'
          )}>
            {passed ? 'Test Passed!' : 'Try Again'}
          </h2>
          <div className="text-5xl font-bold text-foreground mb-2">{totalMarks}/100</div>
          <p className="text-muted-foreground mb-6">
            You got {score} out of {questions.length} questions correct.
          </p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={onClose} 
              className="px-6 py-3 border-2 border-border rounded-xl font-bold text-foreground hover:bg-muted transition-colors btn-bounce"
            >
              Close
            </button>
            {passed && (
              <button 
                onClick={onPass} 
                className="px-6 py-3 gradient-success text-success-foreground rounded-xl font-bold shadow-button btn-bounce"
              >
                Level Up! 🚀
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 backdrop-blur-sm p-4">
      <div className="bg-card rounded-3xl p-6 max-w-md w-full shadow-2xl animate-pop-in">
        <div className="flex justify-between items-center mb-6">
          <span className="font-bold text-muted-foreground">
            Question {questionIndex + 1}/{questions.length}
          </span>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-destructive/10 text-destructive transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="h-28 flex items-center justify-center mb-8">
          <h3 className="text-xl font-bold text-foreground text-center leading-relaxed px-4">
            {langMode === 'hindi' ? currentQuestion.questionHindi : currentQuestion.questionGujarati}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {shuffledOptions.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              disabled={answeredQuestions.has(questionIndex)}
              className={cn(
                'p-4 border-2 border-primary/20 rounded-2xl font-bold text-lg',
                'hover:bg-primary/10 hover:border-primary transition-all',
                'btn-bounce flex items-center justify-center text-center min-h-[60px]',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-6 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full gradient-primary transition-all duration-300"
            style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
