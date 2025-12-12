import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { speakEnglish } from '@/utils/speech';
import { Volume2, Check, X, Mic } from 'lucide-react';
import { soundManager } from '@/utils/sounds';

interface MicButtonProps {
  targetText: string;
  onCorrect?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const MicButton = ({ targetText, onCorrect, size = 'md' }: MicButtonProps) => {
  const [status, setStatus] = useState<'idle' | 'listening' | 'success' | 'fail'>('idle');
  const recognitionRef = useRef<any>(null);

  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ')         // Normalize spaces
      .trim();
  };

  const isMatch = (transcript: string, target: string): boolean => {
    const normalizedTranscript = normalizeText(transcript);
    const normalizedTarget = normalizeText(target);
    
    // Check if the target word is contained in the transcript
    if (normalizedTranscript.includes(normalizedTarget)) return true;
    
    // Check if any word matches
    const transcriptWords = normalizedTranscript.split(' ');
    const targetWords = normalizedTarget.split(' ');
    
    for (const targetWord of targetWords) {
      for (const transWord of transcriptWords) {
        // Allow for similar sounding words (Levenshtein-like check)
        if (transWord === targetWord) return true;
        if (transWord.length > 2 && targetWord.length > 2) {
          // Check if first 2-3 characters match (for phonetic similarity)
          if (transWord.slice(0, 3) === targetWord.slice(0, 3)) return true;
          // Check if words are at least 70% similar
          const similarity = calculateSimilarity(transWord, targetWord);
          if (similarity >= 0.7) return true;
        }
      }
    }
    
    return false;
  };

  const calculateSimilarity = (a: string, b: string): number => {
    if (a.length === 0) return b.length === 0 ? 1 : 0;
    if (b.length === 0) return 0;

    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    const maxLen = Math.max(a.length, b.length);
    return (maxLen - matrix[b.length][a.length]) / maxLen;
  };

  const handleMic = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in your browser. Please use Chrome.');
      return;
    }

    // Stop if already listening
    if (status === 'listening' && recognitionRef.current) {
      recognitionRef.current.stop();
      setStatus('idle');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 5; // Get multiple interpretations

    recognition.onstart = () => {
      setStatus('listening');
      soundManager.playClick();
    };

    recognition.onend = () => {
      if (status === 'listening') {
        setStatus('idle');
      }
    };

    recognition.onerror = (event: any) => {
      console.log('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        setStatus('fail');
        setTimeout(() => setStatus('idle'), 1500);
      } else {
        setStatus('idle');
      }
    };

    recognition.onresult = (event: any) => {
      let matched = false;
      
      // Check all alternative results
      for (let i = 0; i < event.results[0].length; i++) {
        const transcript = event.results[0][i].transcript;
        console.log(`Recognition alternative ${i}:`, transcript, 'Target:', targetText);
        
        if (isMatch(transcript, targetText)) {
          matched = true;
          break;
        }
      }
      
      if (matched) {
        setStatus('success');
        soundManager.playSuccess();
        speakEnglish('Excellent!');
        if (onCorrect) onCorrect();
      } else {
        setStatus('fail');
        soundManager.playError();
      }
      
      setTimeout(() => setStatus('idle'), 2000);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      setStatus('idle');
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={handleMic}
      className={cn(
        'rounded-full flex items-center justify-center transition-all btn-bounce shadow-md',
        sizeClasses[size],
        status === 'success' && 'bg-success text-success-foreground scale-110',
        status === 'listening' && 'bg-destructive text-destructive-foreground animate-mic-pulse scale-110',
        status === 'fail' && 'bg-destructive/20 text-destructive',
        status === 'idle' && 'bg-primary/10 text-primary hover:bg-primary/20 hover:scale-105'
      )}
      title={status === 'listening' ? 'Tap to stop' : 'Tap and speak'}
    >
      {status === 'success' ? (
        <Check className={iconSize[size]} />
      ) : status === 'fail' ? (
        <X className={iconSize[size]} />
      ) : (
        <Mic className={cn(iconSize[size], status === 'listening' && 'animate-pulse')} />
      )}
    </button>
  );
};

interface SpeakButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost';
}

export const SpeakButton = ({ text, size = 'md', variant = 'default' }: SpeakButtonProps) => {
  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakEnglish(text);
  };

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  return (
    <button
      onClick={handleSpeak}
      className={cn(
        'rounded-full flex items-center justify-center transition-all btn-bounce',
        sizeClasses[size],
        variant === 'default' && 'bg-primary/10 text-primary hover:bg-primary/20',
        variant === 'ghost' && 'text-muted-foreground hover:text-primary hover:bg-primary/10'
      )}
    >
      <Volume2 className="w-4 h-4" />
    </button>
  );
};
