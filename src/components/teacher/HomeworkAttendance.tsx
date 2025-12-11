import { useState } from 'react';
import { Check, X, Calendar, BookOpen, Save, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { soundManager } from '@/utils/sounds';

interface StudentData {
  uid: string;
  name: string;
  email: string;
  standard: string;
  parentPhone?: string;
}

interface DailyRecord {
  date: string;
  homework: Record<string, boolean>;
  attendance: Record<string, 'present' | 'absent' | 'late'>;
}

interface HomeworkAttendanceProps {
  students: StudentData[];
  onSendWhatsApp: (student: StudentData, message: string) => void;
}

export const HomeworkAttendance = ({ students, onSendWhatsApp }: HomeworkAttendanceProps) => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [records, setRecords] = useState<Record<string, DailyRecord>>(() => {
    const saved = localStorage.getItem('teacher_daily_records');
    return saved ? JSON.parse(saved) : {};
  });

  const currentRecord = records[selectedDate] || {
    date: selectedDate,
    homework: {},
    attendance: {},
  };

  const updateHomework = (studentId: string, completed: boolean) => {
    const updatedRecord = {
      ...currentRecord,
      homework: { ...currentRecord.homework, [studentId]: completed },
    };
    const updatedRecords = { ...records, [selectedDate]: updatedRecord };
    setRecords(updatedRecords);
    localStorage.setItem('teacher_daily_records', JSON.stringify(updatedRecords));
    soundManager.playClick();
  };

  const updateAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    const updatedRecord = {
      ...currentRecord,
      attendance: { ...currentRecord.attendance, [studentId]: status },
    };
    const updatedRecords = { ...records, [selectedDate]: updatedRecord };
    setRecords(updatedRecords);
    localStorage.setItem('teacher_daily_records', JSON.stringify(updatedRecords));
    soundManager.playClick();
  };

  const getStudentStats = (studentId: string) => {
    const dates = Object.keys(records);
    let presentDays = 0;
    let absentDays = 0;
    let homeworkDone = 0;
    let homeworkMissed = 0;

    dates.forEach(date => {
      const record = records[date];
      if (record.attendance[studentId] === 'present') presentDays++;
      if (record.attendance[studentId] === 'absent') absentDays++;
      if (record.homework[studentId] === true) homeworkDone++;
      if (record.homework[studentId] === false) homeworkMissed++;
    });

    return { presentDays, absentDays, homeworkDone, homeworkMissed };
  };

  const sendHomeworkReminder = (student: StudentData) => {
    const stats = getStudentStats(student.uid);
    const message = `🏫 Nurani Tuition Classes\n\nDear Parent,\n\n${student.name}'s Update:\n📚 Homework: ${currentRecord.homework[student.uid] ? '✅ Completed' : '❌ Not Completed'}\n📅 Attendance Today: ${currentRecord.attendance[student.uid] || 'Not marked'}\n\nOverall Stats:\n✅ Present Days: ${stats.presentDays}\n❌ Absent Days: ${stats.absentDays}\n📖 Homework Done: ${stats.homeworkDone}\n\nThank you,\nMaster Salman and Tahura Teacher`;
    onSendWhatsApp(student, message);
  };

  const markAllPresent = () => {
    const updatedAttendance: Record<string, 'present' | 'absent' | 'late'> = {};
    students.forEach(s => {
      updatedAttendance[s.uid] = 'present';
    });
    const updatedRecord = { ...currentRecord, attendance: updatedAttendance };
    const updatedRecords = { ...records, [selectedDate]: updatedRecord };
    setRecords(updatedRecords);
    localStorage.setItem('teacher_daily_records', JSON.stringify(updatedRecords));
    soundManager.playSuccess();
    toast.success('All students marked present');
  };

  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <div className="bg-card rounded-2xl p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={today}
              className="px-4 py-2 rounded-xl border-2 border-border bg-background text-foreground focus:border-primary transition-colors"
            />
          </div>
          <button
            onClick={markAllPresent}
            className="flex items-center gap-2 px-4 py-2 bg-success/20 text-success rounded-xl font-semibold btn-bounce"
          >
            <Check className="w-4 h-4" />
            Mark All Present
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-success/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-success">
              {Object.values(currentRecord.attendance).filter(a => a === 'present').length}
            </p>
            <p className="text-sm text-muted-foreground">Present</p>
          </div>
          <div className="bg-destructive/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-destructive">
              {Object.values(currentRecord.attendance).filter(a => a === 'absent').length}
            </p>
            <p className="text-sm text-muted-foreground">Absent</p>
          </div>
          <div className="bg-warning/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-warning">
              {Object.values(currentRecord.attendance).filter(a => a === 'late').length}
            </p>
            <p className="text-sm text-muted-foreground">Late</p>
          </div>
          <div className="bg-primary/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {Object.values(currentRecord.homework).filter(h => h === true).length}
            </p>
            <p className="text-sm text-muted-foreground">HW Done</p>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        <div className="p-4 bg-muted/50 border-b border-border">
          <div className="grid grid-cols-12 gap-2 text-sm font-semibold text-muted-foreground">
            <div className="col-span-4">Student</div>
            <div className="col-span-3 text-center">Attendance</div>
            <div className="col-span-3 text-center">Homework</div>
            <div className="col-span-2 text-center">Action</div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {students.map((student) => {
            const stats = getStudentStats(student.uid);
            return (
              <div key={student.uid} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="grid grid-cols-12 gap-2 items-center">
                  {/* Student Info */}
                  <div className="col-span-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.standard}</p>
                      </div>
                    </div>
                  </div>

                  {/* Attendance Buttons */}
                  <div className="col-span-3 flex justify-center gap-1">
                    {(['present', 'late', 'absent'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => updateAttendance(student.uid, status)}
                        className={cn(
                          'px-2 py-1 rounded-lg text-xs font-medium transition-all',
                          currentRecord.attendance[student.uid] === status
                            ? status === 'present'
                              ? 'bg-success text-success-foreground'
                              : status === 'late'
                              ? 'bg-warning text-warning-foreground'
                              : 'bg-destructive text-destructive-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        )}
                      >
                        {status === 'present' ? 'P' : status === 'late' ? 'L' : 'A'}
                      </button>
                    ))}
                  </div>

                  {/* Homework Toggle */}
                  <div className="col-span-3 flex justify-center gap-2">
                    <button
                      onClick={() => updateHomework(student.uid, true)}
                      className={cn(
                        'p-2 rounded-lg transition-all',
                        currentRecord.homework[student.uid] === true
                          ? 'bg-success text-success-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      )}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateHomework(student.uid, false)}
                      className={cn(
                        'p-2 rounded-lg transition-all',
                        currentRecord.homework[student.uid] === false
                          ? 'bg-destructive text-destructive-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      )}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* WhatsApp Action */}
                  <div className="col-span-2 flex justify-center">
                    <button
                      onClick={() => sendHomeworkReminder(student)}
                      className="p-2 rounded-lg bg-success/20 text-success hover:bg-success/30 transition-colors"
                      title="Send WhatsApp Update"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Mini Stats */}
                <div className="mt-2 flex gap-4 text-xs text-muted-foreground ml-13">
                  <span>Present: {stats.presentDays}</span>
                  <span>Absent: {stats.absentDays}</span>
                  <span>HW Done: {stats.homeworkDone}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
