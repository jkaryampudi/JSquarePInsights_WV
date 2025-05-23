import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthContext';
import AuthPage from '../auth/AuthPage';
import '@testing-library/jest-dom';

// Mock the navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock Firebase auth functions
jest.mock('../auth/firebase', () => ({
  auth: {}
}));

// Mock the useAuth hook
jest.mock('../auth/AuthContext', () => {
  const originalModule = jest.requireActual('../auth/AuthContext');
  return {
    ...originalModule,
    useAuth: () => ({
      login: jest.fn().mockResolvedValue({}),
      signup: jest.fn().mockResolvedValue({}),
      loginWithGoogle: jest.fn().mockResolvedValue({}),
      loginWithFacebook: jest.fn().mockResolvedValue({}),
      loginWithApple: jest.fn().mockResolvedValue({}),
      resetPassword: jest.fn().mockResolvedValue({}),
      authError: '',
      currentUser: null
    }),
    AuthProvider: ({ children }) => <div>{children}</div>
  };
});

const renderAuthPage = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <AuthPage />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('AuthPage Component', () => {
  test('renders login form by default', () => {
    renderAuthPage();
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });

  test('switches to signup form when "Sign Up" is clicked', () => {
    renderAuthPage();
    fireEvent.click(screen.getByText('Sign Up'));
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  test('shows password strength indicator when creating password', () => {
    renderAuthPage();
    fireEvent.click(screen.getByText('Sign Up'));
    
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    
    expect(screen.getByText(/weak password/i, { exact: false })).toBeInTheDocument();
    
    fireEvent.change(passwordInput, { target: { value: 'StrongerPassword123!' } });
    expect(screen.getByText(/strong password/i, { exact: false })).toBeInTheDocument();
  });

  test('toggles password visibility when eye icon is clicked', () => {
    renderAuthPage();
    
    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Find and click the eye icon button
    const toggleButton = screen.getByRole('button', { name: '' }); // The eye button has no accessible name
    fireEvent.click(toggleButton);
    
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('shows remember me checkbox on login form', () => {
    renderAuthPage();
    expect(screen.getByLabelText('Remember me')).toBeInTheDocument();
  });

  test('shows forgot password link on login form', () => {
    renderAuthPage();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
  });

  test('navigates to forgot password form when link is clicked', () => {
    renderAuthPage();
    fireEvent.click(screen.getByText('Forgot password?'));
    expect(screen.getByText('Reset Password')).toBeInTheDocument();
    expect(screen.getByText('Enter your email to receive a password reset link')).toBeInTheDocument();
  });

  test('shows social login buttons', () => {
    renderAuthPage();
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  test('shows loading spinner when submitting form', async () => {
    renderAuthPage();
    
    fireEvent.change(screen.getByPlaceholderText('Email Address'), { 
      target: { value: 'test@example.com' } 
    });
    
    fireEvent.change(screen.getByPlaceholderText('Password'), { 
      target: { value: 'password123' } 
    });
    
    fireEvent.click(screen.getByText('Sign In'));
    
    // Check for loading spinner
    expect(screen.getByRole('button', { name: '' })).toHaveClass('primary-button');
    
    // Wait for navigation after successful login
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
