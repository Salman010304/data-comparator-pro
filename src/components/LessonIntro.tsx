import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Play, Sparkles, BookOpen, Target, Lightbulb, ArrowRight, Volume2 } from 'lucide-react';
import { speakEnglish } from '@/utils/speech';
import { soundManager } from '@/utils/sounds';

interface LessonStep {
  title: string;
  content: string;
  example?: string;
  emoji?: string;
}

interface LessonIntroProps {
  levelNumber: number;
  levelTitle: string;
  levelEmoji: string;
  description: string;
  objective: string;
  steps: LessonStep[];
  funFact?: string;
  onStartLesson: () => void;
}

export const LessonIntro = ({
  levelNumber,
  levelTitle,
  levelEmoji,
  description,
  objective,
  steps,
  funFact,
  onStartLesson,
}: LessonIntroProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSteps, setShowSteps] = useState(false);

  const handleNext = () => {
    soundManager.playClick();
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      soundManager.playGameStart();
      onStartLesson();
    }
  };

  const handleStartIntro = () => {
    soundManager.playClick();
    setShowSteps(true);
  };

  const speakText = (text: string) => {
    speakEnglish(text);
  };

  if (!showSteps) {
    return (
      <div className="bg-card rounded-3xl shadow-card p-6 h-full flex flex-col animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-4 animate-bounce">
            <span className="text-5xl">{levelEmoji}</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Level {levelNumber}: {levelTitle}
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">{description}</p>
        </div>

        {/* Objective Card */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 mb-6 border-2 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/20">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-1">🎯 Learning Objective</h3>
              <p className="text-muted-foreground">{objective}</p>
            </div>
          </div>
        </div>

        {/* What you'll learn */}
        <div className="bg-muted/50 rounded-2xl p-6 mb-6 flex-1">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            What You'll Learn
          </h3>
          <div className="grid gap-3">
            {steps.slice(0, 3).map((step, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-card rounded-xl">
                <span className="text-2xl">{step.emoji || '📌'}</span>
                <span className="text-sm font-medium text-foreground">{step.title}</span>
              </div>
            ))}
            {steps.length > 3 && (
              <div className="text-center text-sm text-muted-foreground">
                + {steps.length - 3} more lessons inside!
              </div>
            )}
          </div>
        </div>

        {/* Fun Fact */}
        {funFact && (
          <div className="bg-gradient-to-r from-secondary/20 to-secondary/10 rounded-xl p-4 mb-6 border border-secondary/30">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-secondary-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-secondary-foreground">
                <span className="font-bold">Fun Fact:</span> {funFact}
              </p>
            </div>
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={handleStartIntro}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold text-lg flex items-center justify-center gap-3 hover:opacity-90 transition-all btn-bounce shadow-lg"
        >
          <Sparkles className="w-6 h-6" />
          Start Learning!
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    );
  }

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="bg-card rounded-3xl shadow-card p-6 h-full flex flex-col animate-fade-in">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="mb-6 animate-bounce">
          <span className="text-7xl">{step.emoji || levelEmoji}</span>
        </div>
        
        <h2 className="text-2xl font-bold text-foreground mb-4">{step.title}</h2>
        
        <p className="text-lg text-muted-foreground mb-6 max-w-lg leading-relaxed">
          {step.content}
        </p>

        {step.example && (
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 mb-6 border-2 border-primary/20">
            <div className="flex items-center justify-center gap-4">
              <span className="text-4xl font-bold text-primary">{step.example}</span>
              <button
                onClick={() => speakText(step.example!)}
                className="p-3 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        {currentStep > 0 && (
          <button
            onClick={() => {
              soundManager.playClick();
              setCurrentStep(prev => prev - 1);
            }}
            className="flex-1 py-4 rounded-2xl bg-muted text-foreground font-bold hover:bg-muted/80 transition-all"
          >
            ← Previous
          </button>
        )}
        <button
          onClick={handleNext}
          className={cn(
            "flex-1 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all btn-bounce",
            currentStep === steps.length - 1
              ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
              : "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
          )}
        >
          {currentStep === steps.length - 1 ? (
            <>
              <Play className="w-5 h-5" />
              Start Practice!
            </>
          ) : (
            <>
              Next
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
