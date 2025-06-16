import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';

interface AuthProps {
  setUser: (user: User | null) => void;
}

// Configuration - matches your existing setup
const CORRECT_PIN = '1234';
const ALLOWED_EMAILS = ['sowndharofficial99@gmail.com'];
const AUTH_STORAGE_KEY = 'budget_buddy_pin_verified';

const Auth: React.FC<AuthProps> = ({ setUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempUser, setTempUser] = useState<User | null>(null);
  const [pin, setPin] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);

  // Check for existing auth state on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Check if PIN was previously verified for this user
        const wasVerified = localStorage.getItem(AUTH_STORAGE_KEY) === user.uid;

        if (wasVerified && ALLOWED_EMAILS.includes(user.email || '')) {
          // Auto-login if previously verified and email is allowed
          setUser(user);
        } else if (ALLOWED_EMAILS.length === 0 || ALLOWED_EMAILS.includes(user.email || '')) {
          // Show PIN input for new sessions or allowed users
          setTempUser(user);
          setShowPinInput(true);
        } else {
          // User not in allowed list - sign them out
          signOut(auth);
          setError('Access denied. This email is not authorized to use this application.');
        }
      } else {
        // Clear verification flag when no user
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setUser(null);
        setTempUser(null);
        setShowPinInput(false);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);

      // Optional: Check if the email is in the allowed list
      if (ALLOWED_EMAILS.length > 0 && !ALLOWED_EMAILS.includes(result.user.email || '')) {
        await signOut(auth);
        setError('Access denied. This email is not authorized to use this application.');
        return;
      }

      // Store user temporarily and show PIN input
      setTempUser(result.user);
      setShowPinInput(true);
    } catch (error: unknown) {
      console.error('Login error:', error);
      setError(getErrorMessage(error as { code: string }));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pin === CORRECT_PIN) {
      // Store user's UID in localStorage to mark PIN as verified for this user
      if (tempUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, tempUser.uid);
      }
      
      // Set user as authenticated
      setUser(tempUser);
      setShowPinInput(false);
      setPin('');
      setTempUser(null);
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin('');

      // Sign out the user if PIN is wrong
      if (tempUser) {
        await signOut(auth);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setTempUser(null);
        setShowPinInput(false);
      }
    }
  };

  const handlePinChange = (value: string) => {
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setPin(value);
    }
  };

  const cancelPinEntry = async () => {
    await signOut(auth);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setTempUser(null);
    setShowPinInput(false);
    setPin('');
    setError(null);
  };

  const getErrorMessage = (error: { code: string }): string => {
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled';
      case 'auth/popup-blocked':
        return 'Pop-up was blocked. Please allow pop-ups and try again';
      case 'auth/cancelled-popup-request':
        return 'Sign-in was cancelled';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      default:
        return 'An error occurred during sign-in';
    }
  };

  const clearError = () => setError(null);

  // PIN Input Screen
  if (showPinInput) {
    return (
      <div className="w-full space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-600 ml-2"
                aria-label="Close error message"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Welcome, {tempUser?.displayName}!
          </h3>
          <p className="text-gray-600 text-sm">
            Please enter your 4-digit PIN to continue
          </p>
        </div>

        <form onSubmit={handlePinSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={pin}
              onChange={(e) => handlePinChange(e.target.value)}
              placeholder="Enter 4-digit PIN"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={4}
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={pin.length !== 4}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium
                       hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
            <button
              type="button"
              onClick={cancelPinEntry}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium
                       hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                       transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Login Screen
  return (
    <div className="w-full space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600 ml-2"
              aria-label="Close error message"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-blue-700 text-sm">
          <strong>Secure Access:</strong> After Google sign-in, you'll be asked to enter a 4-digit PIN.
        </p>
      </div>

      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-200 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            Signing in...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </>
        )}
      </button>

      <div className="text-center text-sm text-gray-500">
        <p>
          By signing in, you agree to our{' '}
          <a href="/TermsOfService.md" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/PrivacyPolicy.md" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default Auth;