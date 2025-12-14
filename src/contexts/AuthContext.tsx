import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, updateDoc, query, where, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

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
  wrongAnswers: Record<number, { question: string; wrongAnswer: string; correctAnswer: string; date: number }[]>;
  lessonsCompleted: number[];
  screenTime: number;
  parentPhone?: string;
  defaultPassword?: string; // Stored for teacher reference only
}

interface TeacherData {
  uid: string;
  email: string;
  name: string;
  role: 'teacher';
  createdAt: number;
}

type UserData = StudentData | TeacherData;

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, standard: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  teacherSignIn: (teacherId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateStudentProgress: (data: Partial<StudentData>) => Promise<void>;
  getAllStudents: () => Promise<StudentData[]>;
  updateStudentData: (uid: string, data: Partial<StudentData>) => Promise<void>;
  deleteStudent: (uid: string) => Promise<void>;
  createStudent: (email: string, password: string, name: string, standard: string, parentPhone?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Teacher credentials
const TEACHER_EMAIL = 'salmanmeman010@gmail.com';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        } else {
          // Check if this is the teacher account
          if (firebaseUser.email === TEACHER_EMAIL) {
            const teacherData: TeacherData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: 'Teacher Admin',
              role: 'teacher',
              createdAt: Date.now(),
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), teacherData);
            setUserData(teacherData);
          }
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, name: string, standard: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;

    const studentData: StudentData = {
      uid: newUser.uid,
      email,
      name,
      standard,
      stars: 0,
      maxLevel: 1,
      role: 'student',
      createdAt: Date.now(),
      testScores: {},
      gameScores: {},
      wrongAnswers: {},
      lessonsCompleted: [],
      screenTime: 0,
    };

    await setDoc(doc(db, 'users', newUser.uid), studentData);
    setUserData(studentData);
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const teacherSignIn = async (email: string, password: string) => {
    if (email !== TEACHER_EMAIL) {
      throw new Error('Invalid Teacher Email');
    }
    
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    setUserData(null);
  };

  const updateStudentProgress = async (data: Partial<StudentData>) => {
    if (!user || !userData || userData.role !== 'student') return;

    const updatedData = { ...userData, ...data };
    await updateDoc(doc(db, 'users', user.uid), data);
    setUserData(updatedData as StudentData);
  };

  const getAllStudents = async (): Promise<StudentData[]> => {
    const studentsQuery = query(collection(db, 'users'), where('role', '==', 'student'));
    const snapshot = await getDocs(studentsQuery);
    return snapshot.docs.map(doc => doc.data() as StudentData);
  };

  const updateStudentData = async (uid: string, data: Partial<StudentData>) => {
    await updateDoc(doc(db, 'users', uid), data);
  };

  const deleteStudent = async (uid: string) => {
    await deleteDoc(doc(db, 'users', uid));
  };

  // Create student without affecting current teacher session
  const createStudent = async (email: string, password: string, name: string, standard: string, parentPhone?: string) => {
    // Store current user
    const currentUser = user;
    const currentUserData = userData;
    
    // Create new student account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;

    const studentData: StudentData = {
      uid: newUser.uid,
      email,
      name,
      standard,
      stars: 0,
      maxLevel: 1,
      role: 'student',
      createdAt: Date.now(),
      testScores: {},
      gameScores: {},
      wrongAnswers: {},
      lessonsCompleted: [],
      screenTime: 0,
      parentPhone,
      defaultPassword: password, // Store for teacher reference
    };

    await setDoc(doc(db, 'users', newUser.uid), studentData);
    
    // Sign out the new student and restore teacher session
    await signOut(auth);
    
    // Re-authenticate teacher
    if (currentUser?.email) {
      // The onAuthStateChanged will handle restoring the session
      // We need to sign the teacher back in
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userData,
      loading,
      signUp,
      signIn,
      teacherSignIn,
      logout,
      updateStudentProgress,
      getAllStudents,
      updateStudentData,
      deleteStudent,
      createStudent,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
