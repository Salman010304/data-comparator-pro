import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { STANDARDS } from '@/data/phonicsData';
import { cn } from '@/lib/utils';
import { BookOpen, GraduationCap, UserCog, Eye, EyeOff, ArrowLeft, Sparkles, Mail, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AuthMode = 'choice' | 'student-login' | 'student-signup' | 'teacher-login';

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('choice');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [standard, setStandard] = useState(STANDARDS[0]);
  const [teacherId, setTeacherId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signUp, signIn, teacherSignIn } = useAuth();
  const navigate = useNavigate();

  const handleStudentSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast.error('Please fill all fields');
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password, name, standard);
      toast.success('Welcome to Nurani Classes! 🎉');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, password);
      toast.success('Welcome back! 👋');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setIsLoading(true);
    try {
      await teacherSignIn(email, password);
      toast.success('Welcome, Teacher! 📚');
      navigate('/teacher');
    } catch (error: any) {
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const renderChoice = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-3xl gradient-hero flex items-center justify-center shadow-glow">
            <BookOpen className="w-12 h-12 text-primary-foreground" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 gradient-secondary rounded-full flex items-center justify-center shadow-button animate-float">
            <Sparkles className="w-4 h-4 text-secondary-foreground" />
          </div>
        </div>
        <h1 className="text-3xl font-black text-foreground mb-2">Nurani Tuition</h1>
        <p className="text-muted-foreground">Learn Phonics with Fun! 🌟</p>
      </div>

      <button
        onClick={() => setMode('student-login')}
        className="w-full py-5 rounded-2xl gradient-primary text-primary-foreground font-bold text-lg shadow-button btn-bounce flex items-center justify-center gap-3"
      >
        <GraduationCap className="w-6 h-6" />
        Student Login
      </button>

      <button
        onClick={() => setMode('teacher-login')}
        className="w-full py-5 rounded-2xl bg-foreground text-background font-bold text-lg shadow-lg btn-bounce flex items-center justify-center gap-3"
      >
        <UserCog className="w-6 h-6" />
        Teacher Login
      </button>
    </div>
  );

  const renderStudentLogin = () => (
    <form onSubmit={handleStudentLogin} className="space-y-5">
      <button
        type="button"
        onClick={() => setMode('choice')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-3 shadow-button">
          <GraduationCap className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Student Login</h2>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:border-primary transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          'w-full py-4 rounded-xl font-bold text-lg transition-all btn-bounce gradient-primary text-primary-foreground shadow-button',
          isLoading && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>

      <p className="text-center text-muted-foreground">
        New student?{' '}
        <button
          type="button"
          onClick={() => setMode('student-signup')}
          className="text-primary font-semibold hover:underline"
        >
          Sign Up
        </button>
      </p>
    </form>
  );

  const renderStudentSignUp = () => (
    <form onSubmit={handleStudentSignUp} className="space-y-4">
      <button
        type="button"
        onClick={() => setMode('student-login')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Login
      </button>

      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
        <p className="text-muted-foreground text-sm">Join Nurani Classes today!</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Your Name</label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 6 characters"
            className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:border-primary transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Standard</label>
        <select
          value={standard}
          onChange={(e) => setStandard(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:border-primary transition-colors"
        >
          {STANDARDS.map((std) => (
            <option key={std} value={std}>{std}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          'w-full py-4 rounded-xl font-bold text-lg transition-all btn-bounce gradient-primary text-primary-foreground shadow-button mt-4',
          isLoading && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isLoading ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>
  );

  const renderTeacherLogin = () => (
    <form onSubmit={handleTeacherLogin} className="space-y-5">
      <button
        type="button"
        onClick={() => setMode('choice')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-foreground flex items-center justify-center mx-auto mb-3 shadow-lg">
          <UserCog className="w-8 h-8 text-background" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Teacher Login</h2>
        <p className="text-muted-foreground text-sm">Access dashboard & tracking</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teacher@email.com"
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:border-primary transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          'w-full py-4 rounded-xl font-bold text-lg transition-all btn-bounce bg-foreground text-background shadow-lg',
          isLoading && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isLoading ? 'Logging in...' : 'Access Dashboard'}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md bg-card rounded-3xl shadow-card p-8">
        {mode === 'choice' && renderChoice()}
        {mode === 'student-login' && renderStudentLogin()}
        {mode === 'student-signup' && renderStudentSignUp()}
        {mode === 'teacher-login' && renderTeacherLogin()}
      </div>
    </div>
  );
};

export default AuthPage;
