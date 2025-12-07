import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LEVELS } from '@/data/phonicsData';
import { 
  Users, LogOut, Star, Trophy, BookOpen, BarChart3, 
  Search, Filter, ChevronDown, ChevronUp, Clock, Award
} from 'lucide-react';

interface StudentData {
  uid: string;
  email: string;
  name: string;
  standard: string;
  stars: number;
  maxLevel: number;
  role: 'student';
  createdAt: number;
  testScores: Record<number, { score: number; total: number; date: number }>;
  gameScores: Record<string, { score: number; date: number }>;
}

const TeacherDashboard = () => {
  const { userData, logout, getAllStudents } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'stars' | 'level' | 'recent'>('recent');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  useEffect(() => {
    if (!userData || userData.role !== 'teacher') {
      navigate('/auth');
      return;
    }

    loadStudents();
  }, [userData, navigate]);

  const loadStudents = async () => {
    try {
      const allStudents = await getAllStudents();
      setStudents(allStudents);
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const filteredStudents = students
    .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 s.standard.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'stars': return b.stars - a.stars;
        case 'level': return b.maxLevel - a.maxLevel;
        case 'name': return a.name.localeCompare(b.name);
        case 'recent': return b.createdAt - a.createdAt;
        default: return 0;
      }
    });

  const stats = {
    totalStudents: students.length,
    totalStars: students.reduce((sum, s) => sum + s.stars, 0),
    avgLevel: students.length ? (students.reduce((sum, s) => sum + s.maxLevel, 0) / students.length).toFixed(1) : 0,
    completedAll: students.filter(s => s.maxLevel === 8).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-float">📊</div>
          <p className="text-muted-foreground font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-foreground text-background sticky top-0 z-40 px-4 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
            <p className="text-sm opacity-70">Nurani Tuition Classes</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-background/10 rounded-xl hover:bg-background/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground font-medium">Students</span>
            </div>
            <p className="text-3xl font-black text-foreground">{stats.totalStudents}</p>
          </div>

          <div className="bg-card rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl gradient-secondary flex items-center justify-center">
                <Star className="w-5 h-5 text-secondary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground font-medium">Total Stars</span>
            </div>
            <p className="text-3xl font-black text-foreground">{stats.totalStars}</p>
          </div>

          <div className="bg-card rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground font-medium">Avg Level</span>
            </div>
            <p className="text-3xl font-black text-foreground">{stats.avgLevel}</p>
          </div>

          <div className="bg-card rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-warning" />
              </div>
              <span className="text-sm text-muted-foreground font-medium">Completed All</span>
            </div>
            <p className="text-3xl font-black text-foreground">{stats.completedAll}</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-border bg-card text-foreground focus:border-primary transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 rounded-xl border-2 border-border bg-card text-foreground focus:border-primary transition-colors"
            >
              <option value="recent">Most Recent</option>
              <option value="name">Name (A-Z)</option>
              <option value="stars">Most Stars</option>
              <option value="level">Highest Level</option>
            </select>
          </div>
        </div>

        {/* Students List */}
        <div className="space-y-4">
          {filteredStudents.length === 0 ? (
            <div className="bg-card rounded-2xl p-8 text-center">
              <div className="text-4xl mb-3">👨‍🎓</div>
              <p className="text-muted-foreground">No students found</p>
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div key={student.uid} className="bg-card rounded-2xl shadow-card overflow-hidden">
                <button
                  onClick={() => setExpandedStudent(expandedStudent === student.uid ? null : student.uid)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center hidden sm:block">
                      <p className="text-xs text-muted-foreground">Standard</p>
                      <p className="font-semibold text-foreground">{student.standard}</p>
                    </div>
                    <div className="text-center hidden sm:block">
                      <p className="text-xs text-muted-foreground">Level</p>
                      <p className="font-semibold text-primary">{student.maxLevel}/8</p>
                    </div>
                    <div className="flex items-center gap-1 bg-secondary/20 px-3 py-1.5 rounded-full">
                      <Star className="w-4 h-4 fill-secondary text-secondary" />
                      <span className="font-bold text-secondary-foreground">{student.stars}</span>
                    </div>
                    {expandedStudent === student.uid ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {expandedStudent === student.uid && (
                  <div className="px-5 pb-5 border-t border-border pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-sm">
                        <p className="text-muted-foreground">Joined</p>
                        <p className="font-medium text-foreground">
                          {new Date(student.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Standard</p>
                        <p className="font-medium text-foreground">{student.standard}</p>
                      </div>
                    </div>

                    {/* Level Progress */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Level Progress
                      </h4>
                      <div className="flex gap-2 flex-wrap">
                        {LEVELS.map((level) => (
                          <div
                            key={level.id}
                            className={cn(
                              'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-colors',
                              level.id <= student.maxLevel
                                ? 'gradient-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                            )}
                          >
                            {level.id <= student.maxLevel ? level.icon : '🔒'}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Test Scores */}
                    {Object.keys(student.testScores || {}).length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Test Scores
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {Object.entries(student.testScores).map(([level, data]) => (
                            <div key={level} className="bg-muted/50 rounded-lg p-3 text-center">
                              <p className="text-xs text-muted-foreground">Level {level}</p>
                              <p className="font-bold text-foreground">{data.score}/{data.total}</p>
                              <p className="text-xs text-muted-foreground">
                                {((data.score / data.total) * 100).toFixed(0)}%
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Game Scores */}
                    {Object.keys(student.gameScores || {}).length > 0 && (
                      <div>
                        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <Trophy className="w-4 h-4" />
                          Game High Scores
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {Object.entries(student.gameScores).map(([game, data]) => (
                            <div key={game} className="bg-muted/50 rounded-lg p-3 text-center">
                              <p className="text-xs text-muted-foreground capitalize">{game.replace(/-/g, ' ')}</p>
                              <p className="font-bold text-foreground">{data.score}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
