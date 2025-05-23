import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../auth/AuthContext';
import '@testing-library/jest-dom';

// Mock Firebase auth
jest.mock('../auth/firebase', () => ({
  auth: {}
}));

// Mock Firebase functions
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  FacebookAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
  OAuthProvider: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  updateProfile: jest.fn(),
  setPersistence: jest.fn().mockResolvedValue({}),
  browserLocalPersistence: 'local',
  browserSessionPersistence: 'session'
}));

// Test component to access auth context
const TestComponent = () => {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="user">{auth.currentUser ? 'User exists' : 'No user'}</div>
      <button onClick={() => auth.login('test@example.com', 'password', true)}>Login</button>
      <button onClick={() => auth.signup('test@example.com', 'password', 'Test User')}>Signup</button>
      <button onClick={() => auth.logout()}>Logout</button>
      <button onClick={() => auth.loginWithGoogle()}>Google</button>
      <button onClick={() => auth.loginWithFacebook()}>Facebook</button>
      <button onClick={() => auth.resetPassword('test@example.com')}>Reset</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('provides auth context to children', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('user')).toHaveTextContent('No user');
  });

  test('handles login with remember me', async () => {
    const mockSignIn = require('firebase/auth').signInWithEmailAndPassword;
    mockSignIn.mockResolvedValueOnce({ user: { email: 'test@example.com' } });
    
    const mockSetPersistence = require('firebase/auth').setPersistence;
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    fireEvent.click(screen.getByText('Login'));
    
    await waitFor(() => {
      expect(mockSetPersistence).toHaveBeenCalledWith(expect.anything(), 'local');
      expect(mockSignIn).toHaveBeenCalledWith(expect.anything(), 'test@example.com', 'password');
    });
  });

  test('handles signup with display name', async () => {
    const mockSignUp = require('firebase/auth').createUserWithEmailAndPassword;
    mockSignUp.mockResolvedValueOnce({ user: { email: 'test@example.com' } });
    
    const mockUpdateProfile = require('firebase/auth').updateProfile;
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    fireEvent.click(screen.getByText('Signup'));
    
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith(expect.anything(), 'test@example.com', 'password');
      expect(mockUpdateProfile).toHaveBeenCalledWith(expect.anything(), { displayName: 'Test User' });
    });
  });

  test('handles social login methods', async () => {
    const mockSignInWithPopup = require('firebase/auth').signInWithPopup;
    mockSignInWithPopup.mockResolvedValueOnce({ user: { email: 'test@example.com' } });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    fireEvent.click(screen.getByText('Google'));
    
    await waitFor(() => {
      expect(mockSignInWithPopup).toHaveBeenCalled();
    });
  });

  test('handles password reset', async () => {
    const mockResetPassword = require('firebase/auth').sendPasswordResetEmail;
    mockResetPassword.mockResolvedValueOnce({});
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    fireEvent.click(screen.getByText('Reset'));
    
    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith(expect.anything(), 'test@example.com');
    });
  });
});
