import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AuthStyles.css';
import { useAuth } from './AuthContext';
import { FaGoogle, FaFacebook, FaApple, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import AnimatedLogo from './AnimatedLogo';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  
  const { login, signup, loginWithGoogle, loginWithFacebook, loginWithApple, resetPassword, authError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  // Password strength checker
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordFeedback('');
      return;
    }

    // Simple password strength algorithm
    let strength = 0;
    let feedback = '';

    // Length check
    if (password.length >= 8) {
      strength += 1;
    } else {
      feedback = 'Password should be at least 8 characters';
    }

    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    if (strength === 1) {
      feedback = 'Weak password. Try adding numbers or symbols.';
    } else if (strength === 2) {
      feedback = 'Medium strength. Try adding uppercase letters.';
    } else if (strength === 3) {
      feedback = 'Strong password!';
    } else if (strength === 4) {
      feedback = 'Very strong password!';
    }

    setPasswordStrength(strength);
    setPasswordFeedback(feedback);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password, rememberMe);
        navigate('/');
      } else {
        await signup(email, password, name);
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    }
    
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError('Failed to sign in with Google: ' + err.message);
    }
    setLoading(false);
  };

  const handleFacebookSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithFacebook();
      navigate('/');
    } catch (err) {
      setError('Failed to sign in with Facebook: ' + err.message);
    }
    setLoading(false);
  };

  const handleAppleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithApple();
      navigate('/');
    } catch (err) {
      setError('Failed to sign in with Apple: ' + err.message);
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await resetPassword(resetEmail);
      setResetSent(true);
    } catch (err) {
      setError('Failed to send password reset email: ' + err.message);
    }
    
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (showForgotPassword) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <AnimatedLogo />
            <h2>Reset Password</h2>
            <p>Enter your email to receive a password reset link</p>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          {resetSent && (
            <div className="auth-success">
              Password reset email sent! Check your inbox.
            </div>
          )}
          
          <form onSubmit={handleResetPassword} className="auth-form">
            <div className="form-group">
              <label>
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                />
              </label>
            </div>
            
            <button 
              type="submit" 
              className="auth-button primary-button"
              disabled={loading}
            >
              {loading ? <span className="loading-spinner"></span> : 'Send Reset Link'}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>
              <button 
                type="button"
                className="text-button"
                onClick={() => setShowForgotPassword(false)}
              >
                Back to Sign In
              </button>
            </p>
          </div>
        </div>
        
        <div className="auth-background">
          <div className="property-animation"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <AnimatedLogo />
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{isLogin ? 'Sign in to access your account' : 'Sign up to get started'}</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>
                <FaUser className="input-icon" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  required
                />
              </label>
            </div>
          )}
          
          <div className="form-group">
            <label>
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
              />
            </label>
          </div>
          
          <div className="form-group">
            <label>
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <button 
                type="button" 
                className="password-toggle" 
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </label>
            
            {!isLogin && password && (
              <>
                <div className="password-strength">
                  <div 
                    className={`password-strength-meter ${
                      passwordStrength === 1 ? 'strength-weak' : 
                      passwordStrength === 2 ? 'strength-medium' : 
                      passwordStrength === 3 ? 'strength-strong' : 
                      passwordStrength === 4 ? 'strength-very-strong' : ''
                    }`}
                  ></div>
                </div>
                <div className="password-feedback">{passwordFeedback}</div>
              </>
            )}
          </div>
          
          {isLogin && (
            <div className="auth-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me">Remember me</label>
              </div>
              
              <div className="forgot-password">
                <button 
                  type="button"
                  className="text-button"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot password?
                </button>
              </div>
            </div>
          )}
          
          <button 
            type="submit" 
            className="auth-button primary-button"
            disabled={loading}
          >
            {loading ? <span className="loading-spinner"></span> : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>
        
        <div className="auth-divider">
          <span>or continue with</span>
        </div>
        
        <div className="social-buttons">
          <button 
            onClick={handleGoogleSignIn} 
            className="auth-button social-button google-button"
            disabled={loading}
          >
            <FaGoogle />
            <span>Google</span>
          </button>
          
          <button 
            onClick={handleFacebookSignIn} 
            className="auth-button social-button facebook-button"
            disabled={loading}
          >
            <FaFacebook />
            <span>Facebook</span>
          </button>
          
          <button 
            onClick={handleAppleSignIn} 
            className="auth-button social-button apple-button"
            disabled={loading}
          >
            <FaApple />
            <span>Apple</span>
          </button>
        </div>
        
        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              className="text-button"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
      
      <div className="auth-background">
        <div className="property-animation"></div>
      </div>
    </div>
  );
};

export default AuthPage;
