import { useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { X, Trophy, ArrowRight, CheckCircle, XCircle, Clock } from 'lucide-react';
import { 
  ALPHABET_DATA, 
  TWO_LETTER_BLENDING, 
  CVC_WORD_FAMILIES, 
  SIGHT_WORDS, 
  GRAMMAR_WORDS,
  SENTENCES 
} from '@/data/phonicsData';

interface FullTestProps {
  level: number;
  langMode: 'gujarati' | 'hindi';
  onClose: () => void;
  onComplete: (score: number, total: number, wrongAnswers: WrongAnswer[]) => void;
}

interface Question {
  id: number;
  question: string;
  answer: string;
  options: string[];
  type: string;
}

interface WrongAnswer {
  question: string;
  wrongAnswer: string;
  correctAnswer: string;
  date: number;
}

export const FullTest = ({ level, langMode, onClose, onComplete }: FullTestProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [startTime] = useState(Date.now());

  // Generate 100 unique questions based on level - NO HINTS
  const questions = useMemo((): Question[] => {
    const qs: Question[] = [];
    let id = 0;

    const generateOptions = (correct: string, pool: string[], count: number = 3): string[] => {
      const wrong = pool.filter(o => o !== correct).sort(() => Math.random() - 0.5).slice(0, count);
      return [correct, ...wrong].sort(() => Math.random() - 0.5);
    };

    // Language-specific question text
    const qText = langMode === 'hindi' ? {
      letterSound: (letter: string) => `"${letter}" की ध्वनि क्या है?`,
      soundLetter: (sound: string) => `"${sound}" किस अक्षर की ध्वनि है?`,
      startsWord: (letter: string) => `"${letter}" से शुरू होने वाला शब्द?`,
      whatIs: (letter: string) => `"${letter}" क्या है?`,
      vowel: 'स्वर (Vowel)',
      consonant: 'व्यंजन (Consonant)',
    } : {
      letterSound: (letter: string) => `"${letter}" નો અવાજ શું છે?`,
      soundLetter: (sound: string) => `"${sound}" એ કયા અક્ષરનો અવાજ છે?`,
      startsWord: (letter: string) => `"${letter}" થી શરૂ થતો શબ્દ?`,
      whatIs: (letter: string) => `"${letter}" શું છે?`,
      vowel: 'સ્વર (Vowel)',
      consonant: 'વ્યંજન (Consonant)',
    };

    switch (level) {
      case 1: // Alphabet - 100 questions
        // Letter to sound (26)
        ALPHABET_DATA.forEach(item => {
          const meaning = langMode === 'gujarati' ? item.gujarati : item.hindi;
          const pool = ALPHABET_DATA.map(a => langMode === 'gujarati' ? a.gujarati : a.hindi);
          qs.push({
            id: id++,
            question: qText.letterSound(item.letter),
            answer: meaning,
            options: generateOptions(meaning, pool),
            type: 'letter-sound'
          });
        });

        // Sound to letter (26)
        ALPHABET_DATA.forEach(item => {
          const meaning = langMode === 'gujarati' ? item.gujarati : item.hindi;
          const pool = ALPHABET_DATA.map(a => a.letter);
          qs.push({
            id: id++,
            question: qText.soundLetter(meaning),
            answer: item.letter,
            options: generateOptions(item.letter, pool),
            type: 'sound-letter'
          });
        });

        // Example word identification (26)
        ALPHABET_DATA.forEach(item => {
          const pool = ALPHABET_DATA.map(a => a.example);
          qs.push({
            id: id++,
            question: qText.startsWord(item.letter),
            answer: item.example,
            options: generateOptions(item.example, pool),
            type: 'example'
          });
        });

        // Vowel/Consonant identification (22)
        ALPHABET_DATA.slice(0, 22).forEach(item => {
          qs.push({
            id: id++,
            question: qText.whatIs(item.letter),
            answer: item.isVowel ? qText.vowel : qText.consonant,
            options: [qText.vowel, qText.consonant],
            type: 'vowel-consonant'
          });
        });
        break;

      case 2: // Barakhadi - combinations
        ALPHABET_DATA.forEach(item => {
          const meaning = langMode === 'gujarati' ? item.gujarati : item.hindi;
          const pool = ALPHABET_DATA.map(a => langMode === 'gujarati' ? a.gujarati : a.hindi);
          qs.push({
            id: id++,
            question: `"${item.letter}" + "a" = ?`,
            answer: meaning,
            options: generateOptions(meaning, pool),
            type: 'barakhadi'
          });
        });

        // Repeat with variations for 100 questions
        ALPHABET_DATA.forEach(item => {
          qs.push({
            id: id++,
            question: `"${item.letter}" નું ઉદાહરણ?`,
            answer: item.example,
            options: generateOptions(item.example, ALPHABET_DATA.map(a => a.example)),
            type: 'example'
          });
        });

        // Add more variations
        ALPHABET_DATA.slice(0, 22).forEach(item => {
          const meaning = langMode === 'gujarati' ? item.gujarati : item.hindi;
          qs.push({
            id: id++,
            question: `"${meaning}" = ?`,
            answer: item.letter,
            options: generateOptions(item.letter, ALPHABET_DATA.map(a => a.letter)),
            type: 'reverse'
          });
        });

        // Fill remaining
        while (qs.length < 100) {
          const item = ALPHABET_DATA[qs.length % ALPHABET_DATA.length];
          const meaning = langMode === 'gujarati' ? item.gujarati : item.hindi;
          qs.push({
            id: id++,
            question: `"${item.letter}" = "${meaning}" - True or False?`,
            answer: 'True',
            options: ['True', 'False'],
            type: 'true-false'
          });
        }
        break;

      case 3: // Two-letter blending
        Object.entries(TWO_LETTER_BLENDING).forEach(([vowel, words]) => {
          words.forEach(wordData => {
            const meaning = langMode === 'gujarati' ? wordData.gujarati : wordData.hindi;
            const allMeanings = Object.values(TWO_LETTER_BLENDING)
              .flat()
              .map(w => langMode === 'gujarati' ? w.gujarati : w.hindi);
            
            qs.push({
              id: id++,
              question: `"${wordData.word}" = ?`,
              answer: meaning,
              options: generateOptions(meaning, allMeanings),
              type: 'blend-meaning'
            });

            qs.push({
              id: id++,
              question: `${wordData.blend} = ?`,
              answer: wordData.word,
              options: generateOptions(wordData.word, words.map(w => w.word)),
              type: 'blend-word'
            });
          });
        });

        // Fill remaining
        while (qs.length < 100) {
          const vowels = Object.keys(TWO_LETTER_BLENDING);
          const vowel = vowels[qs.length % vowels.length];
          const words = TWO_LETTER_BLENDING[vowel as keyof typeof TWO_LETTER_BLENDING];
          const wordData = words[qs.length % words.length];
          qs.push({
            id: id++,
            question: `"${wordData.word}" starts with?`,
            answer: vowel,
            options: generateOptions(vowel, vowels),
            type: 'starts-with'
          });
        }
        break;

      case 4: // CVC Words
        Object.entries(CVC_WORD_FAMILIES).forEach(([family, data]) => {
          const meaning = langMode === 'gujarati' ? data.gujarati : data.hindi;
          const allFamilies = Object.values(CVC_WORD_FAMILIES)
            .map(f => langMode === 'gujarati' ? f.gujarati : f.hindi);

          data.words.forEach(word => {
            qs.push({
              id: id++,
              question: `"${word}" ends with?`,
              answer: meaning,
              options: generateOptions(meaning, allFamilies),
              type: 'word-family'
            });

            qs.push({
              id: id++,
              question: `"${word}" belongs to -${family} family?`,
              answer: 'True',
              options: ['True', 'False'],
              type: 'true-false'
            });
          });
        });

        // Fill remaining
        while (qs.length < 100) {
          const families = Object.keys(CVC_WORD_FAMILIES);
          const family = families[qs.length % families.length];
          const data = CVC_WORD_FAMILIES[family as keyof typeof CVC_WORD_FAMILIES];
          const word = data.words[qs.length % data.words.length];
          qs.push({
            id: id++,
            question: `Which word belongs to -${family} family?`,
            answer: word,
            options: generateOptions(word, Object.values(CVC_WORD_FAMILIES).flatMap(f => f.words)),
            type: 'family-word'
          });
        }
        break;

      case 5: // Sight Words
        Object.entries(SIGHT_WORDS).forEach(([levelKey, words]) => {
          words.forEach(wordData => {
            const meaning = langMode === 'gujarati' ? wordData.gujarati : wordData.hindi;
            const allMeanings = Object.values(SIGHT_WORDS)
              .flat()
              .map(w => langMode === 'gujarati' ? w.gujarati : w.hindi);

            qs.push({
              id: id++,
              question: `"${wordData.word}" = ?`,
              answer: meaning,
              options: generateOptions(meaning, allMeanings),
              type: 'sight-meaning'
            });

            qs.push({
              id: id++,
              question: `"${meaning}" = ?`,
              answer: wordData.word,
              options: generateOptions(wordData.word, words.map(w => w.word)),
              type: 'meaning-sight'
            });
          });
        });

        // Fill remaining
        while (qs.length < 100) {
          const allWords = Object.values(SIGHT_WORDS).flat();
          const wordData = allWords[qs.length % allWords.length];
          qs.push({
            id: id++,
            question: `Is "${wordData.word}" a sight word?`,
            answer: 'Yes',
            options: ['Yes', 'No'],
            type: 'identification'
          });
        }
        break;

      case 6: // Grammar Words
        GRAMMAR_WORDS.forEach(item => {
          const meaning = langMode === 'gujarati' ? item.meaningGujarati : item.meaningHindi;
          const allMeanings = GRAMMAR_WORDS.map(g => 
            langMode === 'gujarati' ? g.meaningGujarati : g.meaningHindi
          );

          qs.push({
            id: id++,
            question: `"${item.word}" means?`,
            answer: meaning,
            options: generateOptions(meaning, allMeanings),
            type: 'grammar-meaning'
          });

          qs.push({
            id: id++,
            question: `"${meaning}" in English?`,
            answer: item.word,
            options: generateOptions(item.word, GRAMMAR_WORDS.map(g => g.word)),
            type: 'meaning-grammar'
          });

          // Sentence usage
          qs.push({
            id: id++,
            question: `Use "${item.word}" correctly:`,
            answer: `${item.word} ${item.word === 'I' ? 'am' : 'is'} here.`,
            options: [
              `${item.word} ${item.word === 'I' ? 'am' : 'is'} here.`,
              `Here ${item.word}.`,
              `${item.word} here is.`,
              `Is ${item.word} here.`
            ].sort(() => Math.random() - 0.5),
            type: 'usage'
          });
        });

        // Fill remaining
        while (qs.length < 100) {
          const item = GRAMMAR_WORDS[qs.length % GRAMMAR_WORDS.length];
          qs.push({
            id: id++,
            question: `"${item.word}" is a grammar word?`,
            answer: 'True',
            options: ['True', 'False'],
            type: 'true-false'
          });
        }
        break;

      case 7: // Sentences - Reading comprehension
        const allSentences7 = Object.values(SENTENCES).flat();
        allSentences7.forEach(sentence => {
          const words = sentence.english.split(' ');
          
          // First word identification
          if (words.length >= 2) {
            qs.push({
              id: id++,
              question: `First word of: "${sentence.english}"?`,
              answer: words[0],
              options: generateOptions(words[0], allSentences7.flatMap(s => s.english.split(' ').slice(0, 1))),
              type: 'first-word'
            });
          }

          // Last word identification
          if (words.length >= 2) {
            const lastWord = words[words.length - 1].replace(/[.!?]/, '');
            qs.push({
              id: id++,
              question: `Last word of: "${sentence.english}"?`,
              answer: lastWord,
              options: generateOptions(lastWord, allSentences7.flatMap(s => s.english.split(' ').slice(-1).map(w => w.replace(/[.!?]/, '')))),
              type: 'last-word'
            });
          }

          // Word count
          qs.push({
            id: id++,
            question: `How many words in: "${sentence.english}"?`,
            answer: words.length.toString(),
            options: [words.length.toString(), (words.length + 1).toString(), (words.length - 1).toString(), (words.length + 2).toString()].filter((v, i, a) => a.indexOf(v) === i && parseInt(v) > 0).sort(() => Math.random() - 0.5),
            type: 'word-count'
          });
        });

        // Fill remaining
        while (qs.length < 100) {
          const sentence = allSentences7[qs.length % allSentences7.length];
          qs.push({
            id: id++,
            question: `"${sentence.english}" is correct English?`,
            answer: 'True',
            options: ['True', 'False'],
            type: 'true-false'
          });
        }
        break;

      case 8: // Paragraphs - reading comprehension
        const allSentences8 = Object.values(SENTENCES).flat();
        allSentences8.forEach(sentence => {
          const words = sentence.english.split(' ');
          
          // Sentence completion
          if (words.length >= 3) {
            const partial = words.slice(0, -1).join(' ') + ' ___';
            const lastWord = words[words.length - 1].replace(/[.!?]/, '');
            qs.push({
              id: id++,
              question: `Complete: "${partial}"`,
              answer: lastWord,
              options: generateOptions(lastWord, allSentences8.flatMap(s => s.english.split(' ').slice(-1).map(w => w.replace(/[.!?]/, '')))),
              type: 'completion'
            });
          }

          // Word order
          if (words.length >= 2) {
            qs.push({
              id: id++,
              question: `Read aloud: "${sentence.english}" - Can you read this?`,
              answer: 'Yes',
              options: ['Yes', 'Need Practice'],
              type: 'reading-check'
            });
          }
        });

        // Fill remaining
        while (qs.length < 100) {
          const sentence = allSentences8[qs.length % allSentences8.length];
          const words = sentence.english.split(' ');
          if (words.length >= 2) {
            qs.push({
              id: id++,
              question: `Which word comes after "${words[0]}" in: "${sentence.english}"?`,
              answer: words[1],
              options: generateOptions(words[1], words),
              type: 'word-order'
            });
          }
        }
        break;

      default:
        // Default questions
        ALPHABET_DATA.forEach(item => {
          qs.push({
            id: id++,
            question: `"${item.letter}" = ?`,
            answer: langMode === 'gujarati' ? item.gujarati : item.hindi,
            options: generateOptions(
              langMode === 'gujarati' ? item.gujarati : item.hindi,
              ALPHABET_DATA.map(a => langMode === 'gujarati' ? a.gujarati : a.hindi)
            ),
            type: 'default'
          });
        });
    }

    // Ensure exactly 100 unique questions, shuffled
    return qs.slice(0, 100).sort(() => Math.random() - 0.5);
  }, [level, langMode]);

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({ ...prev, [currentIndex]: answer }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
    const correctCount = questions.filter(
      (q, idx) => answers[idx] === q.answer
    ).length;
    
    // Collect wrong answers
    const wrongAnswersList: WrongAnswer[] = questions
      .filter((q, idx) => answers[idx] && answers[idx] !== q.answer)
      .map((q, idx) => ({
        question: q.question,
        wrongAnswer: answers[questions.indexOf(q)] || '',
        correctAnswer: q.answer,
        date: Date.now()
      }));
    
    onComplete(correctCount, 100, wrongAnswersList);
  };

  const correctCount = questions.filter(
    (q, idx) => answers[idx] === q.answer
  ).length;

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = answers[currentIndex];
  const answeredCount = Object.keys(answers).length;

  if (showResults) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 backdrop-blur-sm p-4">
        <div className="bg-card rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-pop-in max-h-[90vh] overflow-y-auto">
          <div className="text-center py-4">
            <div className="text-6xl mb-4">
              {correctCount >= 80 ? '🏆' : correctCount >= 60 ? '🌟' : correctCount >= 40 ? '👍' : '📚'}
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Test Complete!</h2>
            <p className="text-lg text-muted-foreground mb-4">Level {level} - 100 Marks Test</p>
            
            <div className="bg-muted rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Trophy className="w-8 h-8 text-secondary" />
                <span className="text-4xl font-black text-foreground">{correctCount}/100</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {correctCount >= 80 ? 'Excellent! You mastered this level!' :
                 correctCount >= 60 ? 'Good job! Keep practicing!' :
                 correctCount >= 40 ? 'Nice effort! Review and try again!' :
                 'Keep learning! Practice makes perfect!'}
              </p>
            </div>

            <div className="flex gap-3 flex-wrap justify-center mb-4">
              <div className="bg-success/20 text-success px-4 py-2 rounded-xl font-bold">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                Correct: {correctCount}
              </div>
              <div className="bg-destructive/20 text-destructive px-4 py-2 rounded-xl font-bold">
                <XCircle className="w-4 h-4 inline mr-1" />
                Wrong: {100 - correctCount}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-muted font-bold text-foreground hover:bg-muted/80 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 backdrop-blur-sm p-4">
      <div className="bg-card rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-pop-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">📝 Level {level} Test</h2>
            <p className="text-sm text-muted-foreground">
              Question {currentIndex + 1}/100 • Answered: {answeredCount}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-muted rounded-full mb-6 overflow-hidden">
          <div
            className="h-full gradient-primary transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / 100) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">
            {currentQuestion?.type}
          </p>
          <h3 className="text-xl font-bold text-foreground">
            {currentQuestion?.question}
          </h3>
        </div>

        {/* Options - NO HINTS */}
        <div className="space-y-3 mb-6">
          {currentQuestion?.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              className={cn(
                'w-full py-4 px-4 rounded-xl font-medium text-left transition-all',
                selectedAnswer === option
                  ? 'gradient-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80 text-foreground'
              )}
            >
              <span className="inline-block w-8 h-8 rounded-lg bg-background/20 text-center leading-8 mr-3 font-bold">
                {String.fromCharCode(65 + idx)}
              </span>
              {option}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex-1 py-3 rounded-xl bg-muted font-bold text-foreground hover:bg-muted/80 transition-colors disabled:opacity-50"
          >
            Previous
          </button>
          
          {currentIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex-1 py-3 rounded-xl gradient-primary text-primary-foreground font-bold btn-bounce shadow-button flex items-center justify-center gap-2"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={answeredCount < 100}
              className={cn(
                'flex-1 py-3 rounded-xl font-bold btn-bounce shadow-button flex items-center justify-center gap-2',
                answeredCount === 100
                  ? 'gradient-secondary text-secondary-foreground'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              )}
            >
              <Trophy className="w-5 h-5" />
              Submit ({answeredCount}/100)
            </button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-2">Jump to question:</p>
          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
            {Array.from({ length: 100 }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  'w-8 h-8 rounded-lg text-xs font-bold transition-colors',
                  currentIndex === i
                    ? 'gradient-primary text-primary-foreground'
                    : answers[i]
                    ? 'bg-success/20 text-success'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
