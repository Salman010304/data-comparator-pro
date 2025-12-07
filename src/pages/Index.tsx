import { useState, useEffect } from 'react';
import { StudentApp } from '@/components/StudentApp';
import { STANDARDS } from '@/data/phonicsData';
import { cn } from '@/lib/utils';
import { BookOpen, GraduationCap, Star, Sparkles } from 'lucide-react';

interface StudentData {
  name: string;
  standard: string;
  stars: number;
  maxLevel: number;
}

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<StudentData | null>(null);
  const [name, setName] = useState('');
  const [standard, setStandard] = useState(STANDARDS[0]);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved session
  useEffect(() => {
    const saved = localStorage.getItem('nurani_student');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setUserData(data);
        setIsLoggedIn(true);
      } catch (e) {
        console.error('Failed to parse saved data');
      }
    }
    setIsLoading(false);
  }, []);

  const handleStart = () => {
    if (!name.trim()) return;
    
    const newUserData: StudentData = {
      name: name.trim(),
      standard,
      stars: 0,
      maxLevel: 1,
    };
    
    setUserData(newUserData);
    localStorage.setItem('nurani_student', JSON.stringify(newUserData));
    setIsLoggedIn(true);
  };

  const handleGuestMode = () => {
    const guestData: StudentData = {
      name: 'Guest Student',
      standard: 'Nursery',
      stars: 0,
      maxLevel: 1,
    };
    
    setUserData(guestData);
    setIsLoggedIn(true);
  };

  const handleUpdateProgress = (data: Partial<StudentData>) => {
    if (!userData) return;
    
    const updated = { ...userData, ...data };
    setUserData(updated);
    localStorage.setItem('nurani_student', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem('nurani_student');
    setIsLoggedIn(false);
    setUserData(null);
    setName('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-float">📚</div>
          <p className="text-muted-foreground font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (isLoggedIn && userData) {
    return (
      <StudentApp 
        userData={userData} 
        onUpdateProgress={handleUpdateProgress}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-3xl gradient-hero flex items-center justify-center shadow-glow">
                <BookOpen className="w-12 h-12 text-primary-foreground" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 gradient-secondary rounded-full flex items-center justify-center shadow-button animate-float">
                <Sparkles className="w-4 h-4 text-secondary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-black text-foreground mb-2">
              Nurani Tuition Classes
            </h1>
            <p className="text-muted-foreground font-medium">
              Learn Phonics with Fun! 🌟
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-card rounded-3xl shadow-card p-8">
            <h2 className="text-xl font-bold text-foreground mb-6 text-center">
              Welcome, Student! 👋
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground font-medium focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Standard / Class
                </label>
                <select
                  value={standard}
                  onChange={(e) => setStandard(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground font-medium focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                >
                  {STANDARDS.map((std) => (
                    <option key={std} value={std}>{std}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleStart}
                disabled={!name.trim()}
                className={cn(
                  'w-full py-4 rounded-xl font-bold text-lg transition-all btn-bounce mt-6',
                  'gradient-primary text-primary-foreground shadow-button',
                  !name.trim() && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Start Learning
                </div>
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <button
                onClick={handleGuestMode}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all btn-bounce bg-success/10 text-success hover:bg-success/20"
              >
                <div className="flex items-center justify-center gap-2">
                  <Star className="w-4 h-4" />
                  Quick Try (Guest Mode)
                </div>
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { icon: '🔤', label: 'Alphabets' },
              { icon: '📖', label: 'Words' },
              { icon: '✍️', label: 'Sentences' },
            ].map((item, i) => (
              <div 
                key={i} 
                className="bg-card rounded-2xl p-4 text-center shadow-sm"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-xs font-semibold text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-sm text-muted-foreground">
          Made with ❤️ for young learners
        </p>
      </footer>
    </div>
  );
};

export default Index;
