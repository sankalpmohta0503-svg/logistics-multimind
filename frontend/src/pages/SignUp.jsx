import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Radar, ArrowLeft } from 'lucide-react';
import './SignIn.css';

const EyeIcon = ({ visible }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="eye-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {visible ? (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </>
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" />
    )}
  </svg>
);

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    navigate('/command-center');
  };

  return (
    <div className="signin-page">
      <div className="signin-card">
        {/* Brand header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors">
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <Link to="/" className="flex items-center gap-2 group">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Radar size={14} strokeWidth={2.5} />
            </span>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-base text-slate-900 tracking-tight">SC-LogiX</span>
              <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-200/60">AI</span>
            </div>
          </Link>
        </div>

        <h2 className="signin-title">Create Account</h2>
        <p className="signin-subtitle">Join the intelligent supply chain network</p>

        <form onSubmit={handleSignUp} className="signin-form">
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="signin-input"
          />

          <input
            type="email"
            placeholder="Work Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signin-input"
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="signin-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle-btn"
              aria-label="Toggle password visibility"
            >
              <EyeIcon visible={showPassword} />
            </button>
          </div>

          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="signin-input"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="password-toggle-btn"
              aria-label="Toggle confirm password visibility"
            >
              <EyeIcon visible={showConfirmPassword} />
            </button>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2 rounded-xl text-xs font-semibold text-center">
              {error}
            </div>
          )}

          <button type="submit" className="signin-btn-primary">
            REGISTER & ACCESS HUB
          </button>

          <div className="divider-container">
            <hr className="divider-line" />
            <span className="divider-text">Or Quick Register</span>
            <hr className="divider-line" />
          </div>

          <div className="social-buttons-container">
            <button 
              type="button" 
              onClick={() => navigate('/command-center')} 
              className="social-btn"
            >
              Instant Demo
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/command-center')} 
              className="social-btn"
            >
              Enterprise SSO
            </button>
          </div>

          <p className="options-container" style={{ justifyContent: 'center', gap: '0.4rem', marginTop: '0.75rem' }}>
            <span>Already have an account?</span>
            <Link to="/signin" className="forgot-password-link" style={{ fontWeight: 700 }}>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
