import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase/firebase';
import Auth from './Auth/Auth';
import ExpenseTracker from './ExpenseTracker';
import LoadingSpinner from './components/LoadingSpinner';
import './index.css';

const AUTH_STORAGE_KEY = 'budget_buddy_pin_verified';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isPinVerified, setIsPinVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setFirebaseUser(user);
        setLoading(false);
        setAuthError(null);

        if (user) {
          // Check if PIN was previously verified for this user
          const wasVerified = localStorage.getItem(AUTH_STORAGE_KEY) === user.uid;
          if (wasVerified) {
            setUser(user);
            setIsPinVerified(true);
          } else {
            // Firebase user exists but PIN not verified yet
            setIsPinVerified(false);
            setUser(null);
          }
        } else {
          // If user logs out from Firebase, reset PIN verification
          setIsPinVerified(false);
          setUser(null);
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      },
      (error) => {
        console.error('Auth state change error:', error);
        setAuthError('Authentication error occurred');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Handle PIN verification - this will be called from Auth component
  const handlePinVerified = (verifiedUser: User | null) => {
    setUser(verifiedUser);
    setIsPinVerified(true);
  };

  // Proper logout handler that clears both Firebase and localStorage
  const handleLogout = async () => {
    try {
      // Clear localStorage first
      localStorage.removeItem(AUTH_STORAGE_KEY);
      
      // Then sign out from Firebase
      await signOut(auth);
      
      // Reset local state
      setIsPinVerified(false);
      setUser(null);
      // The onAuthStateChanged listener will automatically set firebaseUser to null
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback in case of error
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
      setFirebaseUser(null);
      setIsPinVerified(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner text="Loading expenses..." />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 mb-4">{authError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show auth component if no Firebase user OR if Firebase user exists but PIN not verified
  if (!firebaseUser || (firebaseUser && !isPinVerified)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Budget Buddy 💰
            </h1>
            <p className="text-gray-600">
              Track every penny, master your money
            </p>
          </div>
          <Auth setUser={handlePinVerified} />
        </div>
      </div>
    );
  }

  // Only show ExpenseTracker if both Firebase auth AND PIN verification are complete
  return <ExpenseTracker user={user!} onLogout={handleLogout} />;
};

export default App;