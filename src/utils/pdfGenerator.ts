import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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

const TEACHER_NAME = 'Master Salman and Tahura Teacher';
const SCHOOL_NAME = 'Nurani Tuition Classes';

// Helper function to add header
const addHeader = (doc: jsPDF, isLandscape = false) => {
  const pageWidth = isLandscape ? 297 : 210;
  
  // Gradient header background
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  // Secondary color stripe
  doc.setFillColor(139, 92, 246);
  doc.rect(0, 45, pageWidth, 8, 'F');
  
  // School name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text(SCHOOL_NAME, pageWidth / 2, 22, { align: 'center' });
  
  // Decorative stars
  doc.setFontSize(16);
  doc.text('⭐ 📚 🎓 📖 ⭐', pageWidth / 2, 35, { align: 'center' });
  
  // Teacher name
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(TEACHER_NAME, pageWidth / 2, 48, { align: 'center' });
};

// Helper function to add footer
const addFooter = (doc: jsPDF, pageNum: number, totalPages: number, isLandscape = false) => {
  const pageWidth = isLandscape ? 297 : 210;
  const pageHeight = isLandscape ? 210 : 297;
  
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Generated on ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })} | Page ${pageNum} of ${totalPages}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );
  doc.text('📞 Contact: 9408097177', pageWidth / 2, pageHeight - 5, { align: 'center' });
};

export const generateStudentReport = (student: StudentData) => {
  const doc = new jsPDF();
  
  addHeader(doc);
  
  // Report Title
  doc.setFillColor(245, 245, 250);
  doc.roundedRect(14, 60, 182, 12, 3, 3, 'F');
  doc.setTextColor(79, 70, 229);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('📋 STUDENT PROGRESS REPORT', 105, 68, { align: 'center' });
  
  // Student Info Card
  doc.setFillColor(250, 250, 255);
  doc.roundedRect(14, 78, 182, 40, 5, 5, 'F');
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(0.5);
  doc.roundedRect(14, 78, 182, 40, 5, 5, 'S');
  
  // Student avatar placeholder
  doc.setFillColor(79, 70, 229);
  doc.circle(35, 98, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(student.name.charAt(0).toUpperCase(), 35, 102, { align: 'center' });
  
  // Student details
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(18);
  doc.text(student.name, 55, 90);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text(`📧 ${student.email}`, 55, 98);
  doc.text(`📚 Standard: ${student.standard}`, 55, 106);
  doc.text(`📅 Joined: ${new Date(student.createdAt).toLocaleDateString('en-IN')}`, 55, 114);
  
  // Stats boxes
  const statsY = 85;
  
  // Stars box
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(140, statsY - 2, 25, 30, 3, 3, 'F');
  doc.setTextColor(180, 130, 0);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`${student.stars}`, 152, statsY + 12, { align: 'center' });
  doc.setFontSize(8);
  doc.text('⭐ Stars', 152, statsY + 22, { align: 'center' });
  
  // Level box
  doc.setFillColor(209, 250, 229);
  doc.roundedRect(168, statsY - 2, 25, 30, 3, 3, 'F');
  doc.setTextColor(22, 101, 52);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`${student.maxLevel}`, 180, statsY + 12, { align: 'center' });
  doc.setFontSize(8);
  doc.text('📊 Level', 180, statsY + 22, { align: 'center' });
  
  let yPos = 128;
  
  // Test Scores Section
  doc.setFillColor(79, 70, 229);
  doc.roundedRect(14, yPos, 182, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('📝 TEST SCORES (100 Marks Each)', 105, yPos + 7, { align: 'center' });
  yPos += 15;
  
  const testData = Object.entries(student.testScores || {}).map(([level, data]) => {
    const percentage = ((data.score / data.total) * 100).toFixed(1);
    const grade = Number(percentage) >= 90 ? 'A+' : Number(percentage) >= 80 ? 'A' : Number(percentage) >= 70 ? 'B' : Number(percentage) >= 60 ? 'C' : 'D';
    return [
      `Level ${level}`,
      `${data.score}`,
      `${data.total}`,
      `${percentage}%`,
      grade,
      new Date(data.date).toLocaleDateString('en-IN')
    ];
  });
  
  if (testData.length > 0) {
    autoTable(doc, {
      startY: yPos,
      head: [['Level', 'Score', 'Total', 'Percentage', 'Grade', 'Date']],
      body: testData,
      theme: 'grid',
      headStyles: { 
        fillColor: [79, 70, 229], 
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: { halign: 'center', fontSize: 10 },
      alternateRowStyles: { fillColor: [245, 245, 250] },
      margin: { left: 14, right: 14 },
      columnStyles: {
        4: { fontStyle: 'bold' }
      },
    });
    yPos = (doc as any).lastAutoTable.finalY + 10;
  } else {
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('No tests taken yet', 105, yPos + 5, { align: 'center' });
    yPos += 15;
  }
  
  // Game Scores Section
  doc.setFillColor(34, 197, 94);
  doc.roundedRect(14, yPos, 182, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('🎮 GAME HIGH SCORES', 105, yPos + 7, { align: 'center' });
  yPos += 15;
  
  const gameData = Object.entries(student.gameScores || {}).map(([game, data]) => [
    game.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    data.score.toString(),
    new Date(data.date).toLocaleDateString('en-IN')
  ]);
  
  if (gameData.length > 0) {
    autoTable(doc, {
      startY: yPos,
      head: [['Game', 'High Score', 'Date']],
      body: gameData,
      theme: 'grid',
      headStyles: { 
        fillColor: [34, 197, 94], 
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: { halign: 'center', fontSize: 10 },
      alternateRowStyles: { fillColor: [240, 253, 244] },
      margin: { left: 14, right: 14 },
    });
    yPos = (doc as any).lastAutoTable.finalY + 10;
  } else {
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('No games played yet', 105, yPos + 5, { align: 'center' });
    yPos += 15;
  }
  
  // Mistakes Record (if any)
  if (student.wrongAnswers && Object.keys(student.wrongAnswers).length > 0) {
    if (yPos > 220) {
      doc.addPage();
      addHeader(doc);
      yPos = 65;
    }
    
    doc.setFillColor(239, 68, 68);
    doc.roundedRect(14, yPos, 182, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('❌ AREAS FOR IMPROVEMENT', 105, yPos + 7, { align: 'center' });
    yPos += 15;
    
    const mistakesData: string[][] = [];
    Object.entries(student.wrongAnswers).forEach(([level, mistakes]) => {
      mistakes.slice(0, 5).forEach(m => {
        mistakesData.push([
          `Level ${level}`,
          m.question.substring(0, 25) + (m.question.length > 25 ? '...' : ''),
          m.wrongAnswer.substring(0, 15),
          m.correctAnswer.substring(0, 15),
        ]);
      });
    });
    
    if (mistakesData.length > 0) {
      autoTable(doc, {
        startY: yPos,
        head: [['Level', 'Question', 'Student Answer', 'Correct Answer']],
        body: mistakesData,
        theme: 'grid',
        headStyles: { 
          fillColor: [239, 68, 68], 
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: { fontSize: 9 },
        alternateRowStyles: { fillColor: [254, 242, 242] },
        margin: { left: 14, right: 14 },
        columnStyles: { 1: { cellWidth: 50 } },
      });
    }
  }
  
  // Add footer to all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addFooter(doc, i, pageCount);
  }
  
  doc.save(`${student.name.replace(/\s+/g, '_')}_Report.pdf`);
};

export const generateAllStudentsReport = (students: StudentData[], stats: { totalStudents: number; totalStars: number; avgLevel: string | number; completedAll: number }) => {
  const doc = new jsPDF('landscape');
  
  addHeader(doc, true);
  
  // Report Title
  doc.setFillColor(245, 245, 250);
  doc.roundedRect(14, 58, 269, 12, 3, 3, 'F');
  doc.setTextColor(79, 70, 229);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('📊 ALL STUDENTS PROGRESS REPORT', 148, 66, { align: 'center' });
  
  // Stats Summary Cards
  const cardWidth = 62;
  const cardY = 76;
  const cards = [
    { label: 'Total Students', value: stats.totalStudents, color: [79, 70, 229], icon: '👨‍🎓' },
    { label: 'Total Stars', value: stats.totalStars, color: [245, 158, 11], icon: '⭐' },
    { label: 'Avg Level', value: stats.avgLevel, color: [34, 197, 94], icon: '📈' },
    { label: 'Completed All', value: stats.completedAll, color: [139, 92, 246], icon: '🏆' },
  ];
  
  cards.forEach((card, index) => {
    const x = 14 + index * (cardWidth + 5);
    doc.setFillColor(card.color[0], card.color[1], card.color[2]);
    doc.roundedRect(x, cardY, cardWidth, 25, 3, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(`${card.icon} ${card.value}`, x + cardWidth / 2, cardY + 12, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(card.label, x + cardWidth / 2, cardY + 21, { align: 'center' });
  });
  
  // Students Table
  const tableData = students.map(student => {
    const testsTaken = Object.keys(student.testScores || {}).length;
    const avgScore = testsTaken > 0
      ? (Object.values(student.testScores).reduce((sum, t) => sum + (t.score / t.total) * 100, 0) / testsTaken).toFixed(1) + '%'
      : 'N/A';
    
    return [
      student.name,
      student.email,
      student.standard,
      `⭐ ${student.stars}`,
      `${student.maxLevel}/8`,
      testsTaken.toString(),
      avgScore,
      new Date(student.createdAt).toLocaleDateString('en-IN')
    ];
  });
  
  autoTable(doc, {
    startY: 108,
    head: [['Name', 'Email', 'Standard', 'Stars', 'Level', 'Tests', 'Avg Score', 'Joined']],
    body: tableData,
    theme: 'grid',
    headStyles: { 
      fillColor: [79, 70, 229], 
      textColor: 255, 
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [245, 245, 250] },
    margin: { left: 14, right: 14 },
    styles: { cellPadding: 3 },
  });
  
  // Add footer to all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addFooter(doc, i, pageCount, true);
  }
  
  doc.save('All_Students_Report.pdf');
};

export const generateCertificate = (student: StudentData, level: number) => {
  const doc = new jsPDF('landscape');
  
  // Decorative border
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(3);
  doc.rect(10, 10, 277, 190, 'S');
  
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(1);
  doc.rect(15, 15, 267, 180, 'S');
  
  // Header decoration
  doc.setFillColor(79, 70, 229);
  doc.rect(20, 20, 257, 35, 'F');
  
  // School name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text(SCHOOL_NAME, 148, 38, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(TEACHER_NAME, 148, 50, { align: 'center' });
  
  // Certificate title
  doc.setTextColor(79, 70, 229);
  doc.setFontSize(40);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFICATE', 148, 80, { align: 'center' });
  
  doc.setFontSize(18);
  doc.setTextColor(100, 100, 100);
  doc.text('OF ACHIEVEMENT', 148, 92, { align: 'center' });
  
  // Decorative line
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(2);
  doc.line(60, 98, 237, 98);
  
  // Certificate text
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('This is to certify that', 148, 115, { align: 'center' });
  
  // Student name
  doc.setTextColor(79, 70, 229);
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text(student.name, 148, 135, { align: 'center' });
  
  // Underline
  const nameWidth = doc.getTextWidth(student.name);
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(1);
  doc.line(148 - nameWidth / 2, 138, 148 + nameWidth / 2, 138);
  
  // Achievement text
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(`has successfully completed`, 148, 152, { align: 'center' });
  
  doc.setTextColor(34, 197, 94);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(`LEVEL ${level}`, 148, 168, { align: 'center' });
  
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('of the Phonics Learning Program', 148, 178, { align: 'center' });
  
  // Date and signature line
  const today = new Date().toLocaleDateString('en-IN', { dateStyle: 'long' });
  doc.setFontSize(10);
  doc.text(`Date: ${today}`, 60, 190);
  
  doc.line(200, 185, 260, 185);
  doc.text('Teacher Signature', 230, 192, { align: 'center' });
  
  // Stars decoration
  doc.setFontSize(24);
  doc.text('⭐ 🎓 📚 🏆 ⭐', 148, 200, { align: 'center' });
  
  doc.save(`${student.name.replace(/\s+/g, '_')}_Certificate_Level${level}.pdf`);
};
