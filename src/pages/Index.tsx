import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentApp } from '@/components/StudentApp';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Sparkles, Loader2 } from 'lucide-react';

const Index = () => {
  const { user, userData, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Redirect teachers to dashboard
    if (!loading && userData?.role === 'teacher') {
      navigate('/teacher');
    }
  }, [userData, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-3xl gradient-hero flex items-center justify-center shadow-glow">
              <BookOpen className="w-12 h-12 text-primary-foreground" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 gradient-secondary rounded-full flex items-center justify-center shadow-button animate-float">
              <Sparkles className="w-4 h-4 text-secondary-foreground" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground font-medium">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (!user || !userData || userData.role !== 'student') {
    return null;
  }

  return <StudentApp />;
};

export default Index;
