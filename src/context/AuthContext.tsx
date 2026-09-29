import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase/config';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  role: UserRole;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string, role: UserRole, phone?: string, city?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  switchDemoRole: (newRole: UserRole) => void;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = ['gopushettylikhitha@gmail.com', 'admin@bloodconnect.org'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>('requester');
  const [loading, setLoading] = useState(true);

  // Sync auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setCurrentUser(fbUser);
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);

          let currentRole: UserRole = 'requester';
          if (fbUser.email && ADMIN_EMAILS.includes(fbUser.email.toLowerCase())) {
            currentRole = 'admin';
          }

          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setUserProfile(data);
            setRole(data.role || currentRole);
          } else {
            // First time login for this user
            const newProfile: UserProfile = {
              id: fbUser.uid,
              email: fbUser.email || '',
              displayName: fbUser.displayName || 'BloodConnect User',
              role: currentRole,
              city: 'Seattle',
              area: 'Central',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            try {
              await setDoc(userDocRef, newProfile);
            } catch (err) {
              console.warn('Could not write user doc (offline or permissions):', err);
            }
            setUserProfile(newProfile);
            setRole(currentRole);
          }
        } catch (error) {
          console.error('Failed to load user profile:', error);
          // Fallback minimal profile so the UI remains usable
          const fallbackProfile: UserProfile = {
            id: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || 'User',
            role: fbUser.email && ADMIN_EMAILS.includes(fbUser.email.toLowerCase()) ? 'admin' : 'requester',
            city: 'Seattle',
            area: 'Central',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setUserProfile(fallbackProfile);
          setRole(fallbackProfile.role);
        }
      } else {
        // Default guest / demo profile
        setUserProfile(null);
        setRole('requester');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google Sign In Error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error('Email Sign In Error:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (
    email: string,
    pass: string,
    name: string,
    chosenRole: UserRole,
    phone?: string,
    city?: string
  ) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      const isSystemAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
      const effectiveRole: UserRole = isSystemAdmin ? 'admin' : chosenRole;

      const newProfile: UserProfile = {
        id: res.user.uid,
        email,
        displayName: name,
        role: effectiveRole,
        phone: phone || '',
        city: city || 'Seattle',
        area: 'Central',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        await setDoc(doc(db, 'users', res.user.uid), newProfile);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${res.user.uid}`);
      }
      setUserProfile(newProfile);
      setRole(effectiveRole);
    } catch (error) {
      console.error('Sign Up Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      setRole('requester');
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Reset Password Error:', error);
      throw error;
    }
  };

  const switchDemoRole = (newRole: UserRole) => {
    setRole(newRole);
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        role: newRole,
      });
    } else {
      // Provide a mock user profile for the chosen role for demo evaluation
      setUserProfile({
        id: newRole === 'donor' ? 'user-donor-1' : newRole === 'admin' ? 'admin-1' : 'user-req-1',
        email: newRole === 'donor' ? 'marcus.t@example.com' : newRole === 'admin' ? 'admin@bloodconnect.org' : 'rachel.m@example.com',
        displayName: newRole === 'donor' ? 'Marcus T. (Donor)' : newRole === 'admin' ? 'Admin Officer' : 'Rachel Miller (Requester)',
        role: newRole,
        city: 'Seattle',
        area: 'Capitol Hill',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!userProfile) return;
    const updated = { ...userProfile, ...data, updatedAt: new Date().toISOString() };
    setUserProfile(updated);
    if (currentUser) {
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), data);
      } catch (error) {
        console.warn('Could not sync user profile to firestore:', error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        role,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        resetPassword,
        switchDemoRole,
        updateProfileData,
      }}
    >
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
