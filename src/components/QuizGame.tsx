import { useState, useMemo } from 'react';
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

export const QuizGame = ({ level, langMode, onClose, onPass }: QuizGameProps) => {
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const generateQuestions = (): QuizQuestion[] => {
    switch (level) {
      case 1:
        return [
          { questionGujarati: "'ક' માટે કયો અક્ષર છે?", questionHindi: "'क' के लिए कौन सा अक्षर है?", answer: "K", options: ["C", "K", "Q", "S"] },
          { questionGujarati: "'મ' માટે કયો અક્ષર છે?", questionHindi: "'म' के लिए कौन सा अक्षर है?", answer: "M", options: ["N", "W", "M", "V"] },
          { questionGujarati: "Apple નો પહેલો અક્ષર?", questionHindi: "Apple का पहला अक्षर?", answer: "A", options: ["E", "A", "I", "O"] },
          { questionGujarati: "'બ' નો અવાજ કયો?", questionHindi: "'ब' की आवाज क्या है?", answer: "B", options: ["D", "V", "B", "P"] },
          { questionGujarati: "Zebra નો પહેલો અક્ષર?", questionHindi: "Zebra का पहला अक्षर?", answer: "Z", options: ["S", "J", "X", "Z"] },
        ];
      case 2:
        return [
          { questionGujarati: "'કા' (Kaa) માટે કયો સ્પેલિંગ છે?", questionHindi: "'का' (Kaa) के लिए कौन सी वर्तनी है?", answer: "Kaa", options: ["Ka", "Kaa", "Ki", "Ku"] },
          { questionGujarati: "'જે' (Je) અક્ષર શોધો", questionHindi: "'जे' (Je) अक्षर खोजें", answer: "Je", options: ["Ja", "Je", "Ji", "Jo"] },
          { questionGujarati: "'મી' (Mee) માટે?", questionHindi: "'मी' (Mee) के लिए?", answer: "Mee", options: ["Me", "Mee", "Mu", "Ma"] },
          { questionGujarati: "'પુ' (Pu) માટે?", questionHindi: "'पु' (Pu) के लिए?", answer: "Pu", options: ["Pa", "Pi", "Pu", "Po"] },
          { questionGujarati: "'રે' (Re) અક્ષર શોધો", questionHindi: "'रे' (Re) अक्षर खोजें", answer: "Re", options: ["Ra", "Ri", "Re", "Ro"] },
        ];
      case 3:
      case 4:
        return [
          { questionGujarati: "'બેટ' (Bat) કયો શબ્દ છે?", questionHindi: "'बैट' (Bat) कौन सा शब्द है?", answer: "Bat", options: ["Cat", "Bat", "Mat", "Rat"] },
          { questionGujarati: "'પિન' (Pin) કયો શબ્દ છે?", questionHindi: "'पिन' (Pin) कौन सा शब्द है?", answer: "Pin", options: ["Pen", "Pin", "Pan", "Pun"] },
          { questionGujarati: "Cat નો સાચો સ્પેલિંગ?", questionHindi: "Cat की सही वर्तनी?", answer: "Cat", options: ["Kat", "Cet", "Cat", "Cot"] },
          { questionGujarati: "'સન' (Sun) એટલે?", questionHindi: "'सन' (Sun) का मतलब?", answer: "Sun", options: ["Run", "Fun", "Sun", "Bun"] },
          { questionGujarati: "'પોટ' (Pot) કયો શબ્દ છે?", questionHindi: "'पॉट' (Pot) कौन सा शब्द है?", answer: "Pot", options: ["Hot", "Lot", "Pot", "Dot"] },
        ];
      case 5:
      case 6:
        return [
          { questionGujarati: "'હું' એટલે?", questionHindi: "'मैं' मतलब?", answer: "I", options: ["I", "You", "He", "She"] },
          { questionGujarati: "'તમે' એટલે?", questionHindi: "'तुम' मतलब?", answer: "You", options: ["I", "You", "It", "We"] },
          { questionGujarati: "'છોકરા' માટે શું વપરાય?", questionHindi: "'लड़के' के लिए क्या उपयोग होता है?", answer: "He", options: ["He", "She", "It", "I"] },
          { questionGujarati: "'છોકરી' માટે શું વપરાય?", questionHindi: "'लड़की' के लिए क्या उपयोग होता है?", answer: "She", options: ["He", "She", "It", "You"] },
          { questionGujarati: "Is નો અર્થ?", questionHindi: "Is का मतलब?", answer: "છે/है", options: ["છે/है", "હું/हूँ", "તમે/तुम", "અમે/हम"] },
        ];
      default:
        return [
          { questionGujarati: "Dog એટલે?", questionHindi: "Dog का मतलब?", answer: "કૂતરો/कुत्ता", options: ["બિલાડી/बिल्ली", "કૂતરો/कुत्ता", "ગાય/गाय", "ભેંસ/भैंस"] },
          { questionGujarati: "Red રંગ કયો?", questionHindi: "Red रंग कौन सा?", answer: "લાલ/लाल", options: ["લીલો/हरा", "પીળો/पीला", "લાલ/લાल", "કાળો/काला"] },
          { questionGujarati: "Sun એટલે?", questionHindi: "Sun का मतलब?", answer: "સૂર્ય/सूरज", options: ["ચંદ્ર/चांद", "તારો/तारा", "સૂર્ય/सूरज", "આકાશ/आकाश"] },
          { questionGujarati: "Pen નો ઉપયોગ?", questionHindi: "Pen का उपयोग?", answer: "લખવા/लिखना", options: ["ખાવા/खाना", "રમવા/खेलना", "લખવા/लिखना", "સુવા/सोना"] },
          { questionGujarati: "Boy એટલે?", questionHindi: "Boy का मतलब?", answer: "છોકરો/लड़का", options: ["છોકરી/लड़की", "છોકરો/लड़का", "માણસ/आदमी", "સ્ત્રી/औरत"] },
        ];
    }
  };

  const questions = useMemo(() => generateQuestions(), [level]);
  const currentQuestion = questions[questionIndex];
  
  // Move useMemo BEFORE any conditional returns to follow React hooks rules
  const shuffledOptions = useMemo(() => 
    currentQuestion ? [...currentQuestion.options].sort(() => Math.random() - 0.5) : [],
    [currentQuestion]
  );

  const handleAnswer = (selected: string) => {
    if (selected === currentQuestion.answer) {
      setScore(s => s + 1);
    }
    
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(i => i + 1);
    } else {
      setShowResult(true);
    }
  };

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
              className={cn(
                'p-4 border-2 border-primary/20 rounded-2xl font-bold text-lg',
                'hover:bg-primary/10 hover:border-primary transition-all',
                'btn-bounce flex items-center justify-center text-center min-h-[60px]'
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