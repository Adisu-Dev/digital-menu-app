import React, { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import '../Auth/Register.css';
import './Login.css';

const Login = ({ switchToRegister }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address.';
    if (!password) e.password = 'Password is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    try {
      login(email, password);
    } catch (err) {
      setServerError(err.message);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <span className="auth-logo">🍽️</span>
        <h1>Digital Menu</h1>
        <h2>Welcome Back</h2>
        <p>Sign in to manage your menu</p>
      </div>

      {serverError && <div className="alert alert-error">{serverError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className={errors.password ? 'input-error' : ''}
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(v => !v)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        <button type="submit" className="btn-primary btn-block">
          Sign In
        </button>
      </form>

      <p className="auth-switch">
        Don&apos;t have an account?{' '}
        <button type="button" className="link-btn" onClick={switchToRegister}>
          Register here
        </button>
      </p>
    </div>
  );
};

export default Login;
 