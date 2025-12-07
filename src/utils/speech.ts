// Speech synthesis utility

export const speak = (text: string, rate: number = 0.85): void => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  
  const voices = window.speechSynthesis.getVoices();
  const indianVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN'));
  
  if (indianVoice) {
    utterance.voice = indianVoice;
  }
  
  utterance.lang = 'hi-IN';
  window.speechSynthesis.speak(utterance);
};

export const speakEnglish = (text: string, rate: number = 0.85): void => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.lang = 'en-US';
  
  window.speechSynthesis.speak(utterance);
};
