import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LEVELS } from '@/data/phonicsData';
import { soundManager } from '@/utils/sounds';
import { generateStudentReport, generateAllStudentsReport, generateCertificate } from '@/utils/pdfGenerator';
import { ProgressChart } from '@/components/teacher/ProgressChart';
import { HomeworkAttendance } from '@/components/teacher/HomeworkAttendance';
import { 
  Users, LogOut, Star, Trophy, BookOpen, BarChart3, 
  Search, Filter, ChevronDown, ChevronUp, Award, Download,
  Upload, FileSpreadsheet, AlertCircle, Check, X, Volume2, VolumeX,
  Eye, Trash2, Edit3, RefreshCw, MessageCircle, GraduationCap,
  CalendarCheck, PieChart
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
  parentPhone?: string;
  screenTime?: number; // Total screen time in minutes
}

type TabType = 'students' | 'homework' | 'reports' | 'charts' | 'mistakes' | 'data-management' | 'add-student';

const TeacherDashboard = () => {
  const { userData, logout, getAllStudents, updateStudentData, deleteStudent, createStudent } = useAuth();
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
  const [chartStudent, setChartStudent] = useState<StudentData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // New student form state
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('');
  const [newStudentStandard, setNewStudentStandard] = useState('1st');
  const [newStudentParentPhone, setNewStudentParentPhone] = useState('');
  const [creatingStudent, setCreatingStudent] = useState(false);

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

  // Handle WhatsApp notification
  const sendWhatsAppMessage = (student: StudentData, message: string) => {
    // Use parent phone or generate notification
    const phone = student.parentPhone || '919408097177'; // Default school number
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    soundManager.playSuccess();
    toast.success(`WhatsApp opened for ${student.name}`);
  };

  // Send progress notification
  const sendProgressNotification = (student: StudentData) => {
    const testCount = Object.keys(student.testScores || {}).length;
    const avgScore = testCount > 0
      ? (Object.values(student.testScores).reduce((sum, t) => sum + (t.score / t.total) * 100, 0) / testCount).toFixed(1)
      : 'N/A';
    
    const message = `🏫 *${student.name}'s Progress Report*\n\n📚 *Nurani Tuition Classes*\n${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}\n\n⭐ Stars Earned: ${student.stars}\n📊 Current Level: ${student.maxLevel}/8\n📝 Tests Taken: ${testCount}\n📈 Average Score: ${avgScore}%\n\n🎯 Keep up the good work!\n\n_${student.name} is making great progress in their phonics learning journey._\n\n📞 For queries: 9408097177\n👨‍🏫 Master Salman and Tahura Teacher`;
    
    sendWhatsAppMessage(student, message);
  };

  // Generate certificate
  const handleGenerateCertificate = (student: StudentData) => {
    generateCertificate(student, student.maxLevel);
    soundManager.playSuccess();
    toast.success(`Certificate generated for ${student.name}!`);
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
        toast.success(`File uploaded! ${lines.length - 1} records found for Level ${selectedLevel}`);
        soundManager.playSuccess();
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

  // Delete student
  const handleDeleteStudent = async (student: StudentData) => {
    if (!confirm(`Are you sure you want to DELETE ${student.name}? This action cannot be undone!`)) return;
    
    try {
      await deleteStudent(student.uid);
      await loadStudents();
      soundManager.playSuccess();
      toast.success(`${student.name} has been removed`);
    } catch (error) {
      toast.error('Failed to delete student');
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

  // Create new student account
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentEmail || !newStudentPassword) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setCreatingStudent(true);
    try {
      await createStudent(
        newStudentEmail,
        newStudentPassword,
        newStudentName,
        newStudentStandard,
        newStudentParentPhone || undefined
      );
      
      // Clear form
      setNewStudentName('');
      setNewStudentEmail('');
      setNewStudentPassword('');
      setNewStudentStandard('1st');
      setNewStudentParentPhone('');
      
      // Reload students list
      await loadStudents();
      
      soundManager.playSuccess();
      toast.success(`Student "${newStudentName}" created successfully!`);
      setActiveTab('students');
    } catch (error: any) {
      console.error('Failed to create student:', error);
      toast.error(error.message || 'Failed to create student');
      soundManager.playError();
    } finally {
      setCreatingStudent(false);
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
                      onClick={() => {
                        generateStudentReport(student);
                        soundManager.playSuccess();
                        toast.success('PDF Report downloaded!');
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Report
                    </button>
                    <button
                      onClick={() => handleGenerateCertificate(student)}
                      className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors"
                    >
                      <GraduationCap className="w-4 h-4" />
                      Certificate
                    </button>
                    <button
                      onClick={() => sendProgressNotification(student)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-lg hover:bg-green-500/20 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </button>
                    <button
                      onClick={() => {
                        setChartStudent(student);
                        setActiveTab('charts');
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors"
                    >
                      <PieChart className="w-4 h-4" />
                      Charts
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
                      className="flex items-center gap-2 px-4 py-2 bg-warning/10 text-warning rounded-lg hover:bg-warning/20 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reset
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student)}
                      className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
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
                    <div className="text-sm">
                      <p className="text-muted-foreground">Screen Time</p>
                      <p className="font-medium text-foreground">
                        {Math.floor((student.screenTime || 0) / 60)}h {(student.screenTime || 0) % 60}m
                      </p>
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
                    <div className="mb-4">
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

                  {/* Wrong Answers from Tests */}
                  {Object.keys(student.wrongAnswers || {}).length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-destructive" />
                        Mistakes in Tests (Review Required)
                      </h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {Object.entries(student.wrongAnswers).map(([level, mistakes]) => (
                          <div key={level} className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
                            <p className="text-sm font-bold text-destructive mb-2">Level {level} - {mistakes.length} mistakes</p>
                            <div className="space-y-1">
                              {mistakes.slice(0, 5).map((m, idx) => (
                                <div key={idx} className="text-xs bg-background/50 rounded p-2">
                                  <p className="text-muted-foreground">{m.question}</p>
                                  <p className="text-destructive">Wrong: {m.wrongAnswer}</p>
                                  <p className="text-success">Correct: {m.correctAnswer}</p>
                                </div>
                              ))}
                              {mistakes.length > 5 && (
                                <p className="text-xs text-muted-foreground">+{mistakes.length - 5} more mistakes</p>
                              )}
                            </div>
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

  const renderHomeworkTab = () => (
    <HomeworkAttendance 
      students={students} 
      onSendWhatsApp={sendWhatsAppMessage}
    />
  );

  const renderChartsTab = () => (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl p-6 shadow-card">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Progress Analytics
        </h3>
        
        {/* Student selector for individual charts */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Select student for individual analysis:
          </label>
          <select
            value={chartStudent?.uid || ''}
            onChange={(e) => {
              const student = students.find(s => s.uid === e.target.value);
              setChartStudent(student || null);
            }}
            className="px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:border-primary transition-colors w-full md:w-auto"
          >
            <option value="">Class Overview Only</option>
            {students.map(s => (
              <option key={s.uid} value={s.uid}>{s.name} ({s.standard})</option>
            ))}
          </select>
        </div>
      </div>
      
      <ProgressChart students={students} selectedStudent={chartStudent} />
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl p-6 shadow-card">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Download className="w-5 h-5" />
          Download Reports & Certificates
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => {
              generateAllStudentsReport(students, stats);
              soundManager.playSuccess();
              toast.success('All Students PDF Report downloaded!');
            }}
            className="p-6 bg-muted/50 rounded-xl text-left hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">All Students Report</h4>
                <p className="text-sm text-muted-foreground">Complete class overview</p>
              </div>
            </div>
          </button>

          <div className="p-6 bg-muted/50 rounded-xl">
            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Individual Report
            </h4>
            <select
              onChange={(e) => {
                const student = students.find(s => s.uid === e.target.value);
                if (student) {
                  generateStudentReport(student);
                  soundManager.playSuccess();
                  toast.success('PDF Report downloaded!');
                }
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

          <div className="p-6 bg-muted/50 rounded-xl">
            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Generate Certificate
            </h4>
            <select
              onChange={(e) => {
                const student = students.find(s => s.uid === e.target.value);
                if (student) {
                  handleGenerateCertificate(student);
                }
              }}
              defaultValue=""
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground"
            >
              <option value="" disabled>Select a student...</option>
              {students.map(s => (
                <option key={s.uid} value={s.uid}>{s.name} (Level {s.maxLevel})</option>
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
            Student personal information & photo avatar
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-success" />
            Stars earned and current level with grades
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-success" />
            All test scores with percentages & grade letters
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-success" />
            Game high scores with dates
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-success" />
            Areas for improvement (mistakes record)
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-success" />
            Beautiful formatted PDF with school branding
          </li>
        </ul>
      </div>
    </div>
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

  const renderAddStudentTab = () => (
    <div className="bg-card rounded-2xl shadow-card p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
          <GraduationCap className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Create New Student Account</h2>
        <p className="text-muted-foreground">Add a new student to Nurani Tuition Classes</p>
      </div>

      <form onSubmit={handleCreateStudent} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Student Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={newStudentName}
            onChange={(e) => setNewStudentName(e.target.value)}
            placeholder="Enter student's full name"
            className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:border-primary transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Address <span className="text-destructive">*</span>
          </label>
          <input
            type="email"
            value={newStudentEmail}
            onChange={(e) => setNewStudentEmail(e.target.value)}
            placeholder="student@example.com"
            className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:border-primary transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Password <span className="text-destructive">*</span>
          </label>
          <input
            type="password"
            value={newStudentPassword}
            onChange={(e) => setNewStudentPassword(e.target.value)}
            placeholder="Create a password (min 6 characters)"
            className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:border-primary transition-colors"
            minLength={6}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Standard/Class <span className="text-destructive">*</span>
          </label>
          <select
            value={newStudentStandard}
            onChange={(e) => setNewStudentStandard(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:border-primary transition-colors"
          >
            <option value="Nursery">Nursery</option>
            <option value="LKG">LKG</option>
            <option value="UKG">UKG</option>
            <option value="1st">1st Standard</option>
            <option value="2nd">2nd Standard</option>
            <option value="3rd">3rd Standard</option>
            <option value="4th">4th Standard</option>
            <option value="5th">5th Standard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Parent's Phone (Optional)
          </label>
          <input
            type="tel"
            value={newStudentParentPhone}
            onChange={(e) => setNewStudentParentPhone(e.target.value)}
            placeholder="e.g., 919876543210"
            className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:border-primary transition-colors"
          />
          <p className="text-xs text-muted-foreground mt-1">Include country code for WhatsApp</p>
        </div>

        <button
          type="submit"
          disabled={creatingStudent}
          className="w-full py-4 gradient-primary text-primary-foreground rounded-xl font-bold text-lg shadow-button btn-bounce disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {creatingStudent ? (
            <span className="flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              Creating Student...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              Create Student Account
            </span>
          )}
        </button>
      </form>
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
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'students', label: 'Students', icon: Users },
            { id: 'add-student', label: 'Add Student', icon: GraduationCap },
            { id: 'homework', label: 'Homework & Attendance', icon: CalendarCheck },
            { id: 'charts', label: 'Charts', icon: PieChart },
            { id: 'reports', label: 'Reports', icon: Download },
            { id: 'mistakes', label: 'Mistakes', icon: AlertCircle },
            { id: 'data-management', label: 'Data', icon: FileSpreadsheet },
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
        {activeTab === 'add-student' && renderAddStudentTab()}
        {activeTab === 'homework' && renderHomeworkTab()}
        {activeTab === 'charts' && renderChartsTab()}
        {activeTab === 'reports' && renderReportsTab()}
        {activeTab === 'data-management' && renderDataManagementTab()}
        {activeTab === 'mistakes' && renderMistakesTab()}
      </div>
    </div>
  );
};

export default TeacherDashboard;
