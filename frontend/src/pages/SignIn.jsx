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

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('operations_lead');
  const [password, setPassword] = useState('demo123');
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
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

        <h2 className="signin-title">Operations Sign In</h2>
        <p className="signin-subtitle">Enter your credentials to access the live command center</p>
        
        <form onSubmit={handleSignIn} className="signin-form">
          <input 
            type="text" 
            placeholder="Username or Work Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="signin-input"
          />
          
          <div className="password-wrapper">
            <input 
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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

          <button type="submit" className="signin-btn-primary">
            SIGN IN TO CONTROL HUB
          </button>

          <div className="options-container">
            <label className="remember-me">
              <input type="checkbox" defaultChecked className="form-checkbox" />
              <span>Remember me</span>
            </label>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">Demo Mode Active</span>
          </div>

          <div className="divider-container">
            <hr className="divider-line" />
            <span className="divider-text">Or Quick Access With</span>
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
            <span>Don&apos;t have an account?</span>
            <Link to="/signup" className="forgot-password-link" style={{ fontWeight: 700 }}>
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
