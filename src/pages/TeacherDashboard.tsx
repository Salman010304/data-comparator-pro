import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LEVELS } from '@/data/phonicsData';
import { soundManager } from '@/utils/sounds';
import { 
  Users, LogOut, Star, Trophy, BookOpen, BarChart3, 
  Search, Filter, ChevronDown, ChevronUp, Award, Download,
  Upload, FileSpreadsheet, AlertCircle, Check, X, Volume2, VolumeX,
  Eye, Trash2, Edit3, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

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
  wrongAnswers?: Record<number, { question: string; wrongAnswer: string; correctAnswer: string; date: number }[]>;
  lessonsCompleted?: number[];
}

type TabType = 'students' | 'data-management' | 'reports' | 'mistakes';

const TeacherDashboard = () => {
  const { userData, logout, getAllStudents, updateStudentData } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'stars' | 'level' | 'recent'>('recent');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('students');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      soundManager.playClick();
    } catch (error) {
      console.error('Failed to load students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundManager.setEnabled(newState);
    if (newState) soundManager.playClick();
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

  // Generate CSV report for a student
  const generateStudentReport = (student: StudentData) => {
    const rows = [
      ['Student Report - Nurani Tuition Classes'],
      [''],
      ['Name', student.name],
      ['Email', student.email],
      ['Standard', student.standard],
      ['Stars Earned', student.stars.toString()],
      ['Current Level', `${student.maxLevel}/8`],
      ['Joined Date', new Date(student.createdAt).toLocaleDateString()],
      [''],
      ['Test Scores'],
      ['Level', 'Score', 'Total', 'Percentage', 'Date'],
    ];

    Object.entries(student.testScores || {}).forEach(([level, data]) => {
      rows.push([
        `Level ${level}`,
        data.score.toString(),
        data.total.toString(),
        `${((data.score / data.total) * 100).toFixed(1)}%`,
        new Date(data.date).toLocaleDateString()
      ]);
    });

    rows.push(['']);
    rows.push(['Game Scores']);
    rows.push(['Game', 'High Score', 'Date']);

    Object.entries(student.gameScores || {}).forEach(([game, data]) => {
      rows.push([
        game.replace(/-/g, ' '),
        data.score.toString(),
        new Date(data.date).toLocaleDateString()
      ]);
    });

    if (student.lessonsCompleted && student.lessonsCompleted.length > 0) {
      rows.push(['']);
      rows.push(['Lessons Completed']);
      rows.push([student.lessonsCompleted.map(l => `Level ${l}`).join(', ')]);
    }

    if (student.wrongAnswers && Object.keys(student.wrongAnswers).length > 0) {
      rows.push(['']);
      rows.push(['Mistakes Record']);
      rows.push(['Level', 'Question', 'Wrong Answer', 'Correct Answer', 'Date']);
      
      Object.entries(student.wrongAnswers).forEach(([level, mistakes]) => {
        mistakes.forEach(m => {
          rows.push([
            `Level ${level}`,
            m.question,
            m.wrongAnswer,
            m.correctAnswer,
            new Date(m.date).toLocaleDateString()
          ]);
        });
      });
    }

    const csvContent = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${student.name.replace(/\s+/g, '_')}_report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    soundManager.playSuccess();
    toast.success('Report downloaded!');
  };

  // Generate all students report
  const generateAllStudentsReport = () => {
    const rows = [
      ['All Students Report - Nurani Tuition Classes'],
      ['Generated on', new Date().toLocaleDateString()],
      [''],
      ['Name', 'Email', 'Standard', 'Stars', 'Level', 'Tests Taken', 'Avg Score', 'Joined Date'],
    ];

    students.forEach(student => {
      const testsTaken = Object.keys(student.testScores || {}).length;
      const avgScore = testsTaken > 0
        ? (Object.values(student.testScores).reduce((sum, t) => sum + (t.score / t.total) * 100, 0) / testsTaken).toFixed(1)
        : 'N/A';

      rows.push([
        student.name,
        student.email,
        student.standard,
        student.stars.toString(),
        `${student.maxLevel}/8`,
        testsTaken.toString(),
        avgScore === 'N/A' ? avgScore : `${avgScore}%`,
        new Date(student.createdAt).toLocaleDateString()
      ]);
    });

    const csvContent = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all_students_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    soundManager.playSuccess();
    toast.success('All students report downloaded!');
  };

  // Handle CSV file upload for level data
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        // Parse CSV and show preview
        toast.success(`File uploaded! ${lines.length - 1} records found for Level ${selectedLevel}`);
        soundManager.playSuccess();
        
        // In a real app, you would save this data to Firebase
        console.log('Parsed data for level', selectedLevel, lines);
      } catch (error) {
        toast.error('Failed to parse file');
        soundManager.playError();
      }
    };
    reader.readAsText(file);
  };

  // Reset student progress
  const handleResetStudent = async (student: StudentData) => {
    if (!confirm(`Are you sure you want to reset ${student.name}'s progress?`)) return;
    
    try {
      await updateStudentData(student.uid, {
        stars: 0,
        maxLevel: 1,
        testScores: {},
        gameScores: {},
        wrongAnswers: {},
        lessonsCompleted: [],
      });
      await loadStudents();
      soundManager.playSuccess();
      toast.success(`${student.name}'s progress has been reset`);
    } catch (error) {
      toast.error('Failed to reset student');
      soundManager.playError();
    }
  };

  // Update student level
  const handleUpdateLevel = async (student: StudentData, newLevel: number) => {
    try {
      await updateStudentData(student.uid, { maxLevel: newLevel });
      await loadStudents();
      soundManager.playSuccess();
      toast.success(`${student.name}'s level updated to ${newLevel}`);
    } catch (error) {
      toast.error('Failed to update level');
      soundManager.playError();
    }
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

  const renderStudentsTab = () => (
    <>
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
                onClick={() => {
                  setExpandedStudent(expandedStudent === student.uid ? null : student.uid);
                  soundManager.playClick();
                }}
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
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button
                      onClick={() => generateStudentReport(student)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Report
                    </button>
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Mistakes
                    </button>
                    <select
                      value={student.maxLevel}
                      onChange={(e) => handleUpdateLevel(student, Number(e.target.value))}
                      className="px-4 py-2 bg-muted text-foreground rounded-lg border-0"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(l => (
                        <option key={l} value={l}>Level {l}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleResetStudent(student)}
                      className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reset Progress
                    </button>
                  </div>

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
                    <div className="text-sm">
                      <p className="text-muted-foreground">Lessons Done</p>
                      <p className="font-medium text-foreground">{student.lessonsCompleted?.length || 0}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground">Tests Taken</p>
                      <p className="font-medium text-foreground">{Object.keys(student.testScores || {}).length}</p>
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
                        Test Scores (100 marks each)
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {Object.entries(student.testScores).map(([level, data]) => (
                          <div key={level} className="bg-muted/50 rounded-lg p-3 text-center">
                            <p className="text-xs text-muted-foreground">Level {level}</p>
                            <p className="font-bold text-foreground">{data.score}/{data.total}</p>
                            <p className={cn(
                              'text-xs font-medium',
                              (data.score / data.total) >= 0.7 ? 'text-success' : 'text-destructive'
                            )}>
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
    </>
  );

  const renderDataManagementTab = () => (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl p-6 shadow-card">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5" />
          Import Level Data
        </h3>
        <p className="text-muted-foreground mb-4">
          Upload CSV or Excel files to add/update content for each level. 
          The file should contain columns for the phonics data specific to that level.
        </p>

        <div className="flex flex-wrap gap-4 mb-4">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(Number(e.target.value))}
            className="px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:border-primary transition-colors"
          >
            {LEVELS.map((level) => (
              <option key={level.id} value={level.id}>
                Level {level.id}: {level.name}
              </option>
            ))}
          </select>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,.xlsx,.xls"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-6 py-3 gradient-primary text-primary-foreground rounded-xl font-semibold shadow-button btn-bounce"
          >
            <Upload className="w-5 h-5" />
            Upload File
          </button>
        </div>

        <div className="bg-muted/50 rounded-xl p-4">
          <h4 className="font-semibold text-foreground mb-2">Expected CSV Format for Level {selectedLevel}:</h4>
          <code className="text-sm text-muted-foreground block">
            {selectedLevel === 1 && 'letter,sound,word,hindi,gujarati'}
            {selectedLevel === 2 && 'consonant,vowel,combination,example_word'}
            {selectedLevel === 3 && 'blend_type,letters,example_words'}
            {selectedLevel === 4 && 'family,words,meaning'}
            {selectedLevel === 5 && 'word,category,sentence'}
            {selectedLevel === 6 && 'grammar_type,word,usage'}
            {selectedLevel === 7 && 'sentence,translation_hindi,translation_gujarati'}
            {selectedLevel === 8 && 'paragraph,title,translation'}
          </code>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-card">
        <h3 className="text-xl font-bold text-foreground mb-4">Level Data Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {LEVELS.map((level) => (
            <div key={level.id} className="bg-muted/50 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{level.icon}</div>
              <p className="font-semibold text-foreground">Level {level.id}</p>
              <p className="text-xs text-muted-foreground">{level.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl p-6 shadow-card">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Download className="w-5 h-5" />
          Download Reports
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={generateAllStudentsReport}
            className="p-6 bg-muted/50 rounded-xl text-left hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">All Students Report</h4>
                <p className="text-sm text-muted-foreground">Complete overview of all students</p>
              </div>
            </div>
          </button>

          <div className="p-6 bg-muted/50 rounded-xl">
            <h4 className="font-bold text-foreground mb-3">Individual Student Report</h4>
            <select
              onChange={(e) => {
                const student = students.find(s => s.uid === e.target.value);
                if (student) generateStudentReport(student);
              }}
              defaultValue=""
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground"
            >
              <option value="" disabled>Select a student...</option>
              {students.map(s => (
                <option key={s.uid} value={s.uid}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-card">
        <h3 className="text-xl font-bold text-foreground mb-4">Report Contents</h3>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-success" />
            Student personal information
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-success" />
            Stars earned and current level
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-success" />
            All test scores with percentages
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-success" />
            Game high scores
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-success" />
            Completed lessons list
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-success" />
            Wrong answers and mistakes record
          </li>
        </ul>
      </div>
    </div>
  );

  const renderMistakesTab = () => (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl p-6 shadow-card">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Student Mistakes & Wrong Answers
        </h3>

        <div className="space-y-4">
          {students.map((student) => {
            const wrongAnswers = student.wrongAnswers || {};
            const totalMistakes = Object.values(wrongAnswers).reduce((sum, arr) => sum + arr.length, 0);
            
            if (totalMistakes === 0) return null;

            return (
              <div key={student.uid} className="bg-muted/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{student.name}</h4>
                      <p className="text-sm text-muted-foreground">{totalMistakes} mistakes recorded</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStudent(selectedStudent?.uid === student.uid ? null : student)}
                    className="text-primary hover:underline text-sm"
                  >
                    {selectedStudent?.uid === student.uid ? 'Hide' : 'View Details'}
                  </button>
                </div>

                {selectedStudent?.uid === student.uid && (
                  <div className="mt-4 space-y-3">
                    {Object.entries(wrongAnswers).map(([level, mistakes]) => (
                      <div key={level} className="bg-background rounded-lg p-3">
                        <h5 className="font-semibold text-foreground mb-2">Level {level}</h5>
                        <div className="space-y-2">
                          {mistakes.map((m, i) => (
                            <div key={i} className="flex items-start gap-3 text-sm">
                              <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-foreground"><strong>Q:</strong> {m.question}</p>
                                <p className="text-destructive"><strong>Wrong:</strong> {m.wrongAnswer}</p>
                                <p className="text-success"><strong>Correct:</strong> {m.correctAnswer}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {students.every(s => !s.wrongAnswers || Object.keys(s.wrongAnswers).length === 0) && (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">✨</div>
              <p className="text-muted-foreground">No mistakes recorded yet!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-foreground text-background sticky top-0 z-40 px-4 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
            <p className="text-sm opacity-70">Nurani Tuition Classes - Admin Panel</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSound}
              className="p-2 rounded-lg bg-background/10 hover:bg-background/20 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-background/10 rounded-xl hover:bg-background/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
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

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'students', label: 'Students', icon: Users },
            { id: 'data-management', label: 'Data Management', icon: FileSpreadsheet },
            { id: 'reports', label: 'Reports', icon: Download },
            { id: 'mistakes', label: 'Mistakes', icon: AlertCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as TabType);
                soundManager.playClick();
              }}
              className={cn(
                'flex items-center gap-2 px-5 py-3 rounded-xl font-semibold whitespace-nowrap transition-all',
                activeTab === tab.id
                  ? 'gradient-primary text-primary-foreground shadow-button'
                  : 'bg-card text-muted-foreground hover:bg-muted'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'students' && renderStudentsTab()}
        {activeTab === 'data-management' && renderDataManagementTab()}
        {activeTab === 'reports' && renderReportsTab()}
        {activeTab === 'mistakes' && renderMistakesTab()}
      </div>
    </div>
  );
};

export default TeacherDashboard;