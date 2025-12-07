import { useState } from 'react';
import { cn } from '@/lib/utils';
import { speakEnglish } from '@/utils/speech';
import { Volume2, Check, X } from 'lucide-react';

interface MicButtonProps {
  targetText: string;
  onCorrect?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const MicButton = ({ targetText, onCorrect, size = 'md' }: MicButtonProps) => {
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState<'idle' | 'listening' | 'success' | 'fail'>('idle');

  const handleMic = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!('webkitSpeechRecognition' in window)) {
      alert('Please use Chrome for voice features.');
      return;
    }

    // @ts-ignore
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setListening(true);
      setStatus('listening');
    };

    recognition.onend = () => {
      setListening(false);
      if (status === 'listening') setStatus('idle');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      const target = targetText.toLowerCase().split(' ')[0];
      
      if (transcript.includes(target)) {
        setStatus('success');
        speakEnglish('Excellent!');
        if (onCorrect) onCorrect();
      } else {
        setStatus('fail');
      }
      
      setTimeout(() => setStatus('idle'), 2000);
    };

    recognition.start();
  };

  const sizeClasses = {
    sm: 'w-7 h-7 text-sm',
    md: 'w-9 h-9 text-base',
    lg: 'w-11 h-11 text-lg',
  };

  return (
    <button
      onClick={handleMic}
      className={cn(
        'rounded-full flex items-center justify-center transition-all btn-bounce',
        sizeClasses[size],
        status === 'success' && 'bg-success text-success-foreground',
        status === 'listening' && 'bg-destructive/20 text-destructive animate-mic-pulse',
        status === 'fail' && 'bg-destructive/20 text-destructive',
        status === 'idle' && 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
      )}
    >
      {status === 'success' ? (
        <Check className="w-4 h-4" />
      ) : status === 'fail' ? (
        <X className="w-4 h-4" />
      ) : (
        '🎤'
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
