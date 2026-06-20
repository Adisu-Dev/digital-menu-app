import React, { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import './Register.css';

/* ── Field is defined OUTSIDE Register so React never remounts inputs on re-render ── */
const Field = ({ label, field, type = 'text', placeholder = '', value, onChange, error }) => (
  <div className="form-group">
    <label>{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={error ? 'input-error' : ''}
    />
    {error && <span className="field-error">{error}</span>}
  </div>
);

const Register = ({ switchToLogin }) => {
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    businessName: '',
    tin: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.phone.trim()) e.phone = 'Phone number is required.';
    else if (!/^\+?[0-9]{7,15}$/.test(form.phone.replace(/\s/g, '')))
      e.phone = 'Enter a valid phone number.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (!form.businessName.trim()) e.businessName = 'Business name is required.';
    if (!form.tin.trim()) e.tin = 'TIN number is required.';
    else if (!/^\d{10}$/.test(form.tin)) e.tin = 'TIN must be exactly 10 digits.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError('');
    setSuccess('');
    if (!validate()) return;
    try {
      register(form);
      setSuccess('Registration successful! You can now log in.');
      setTimeout(() => switchToLogin(), 1500);
    } catch (err) {
      setServerError(err.message);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <span className="auth-logo">🍽️</span>
        <h1>Digital Menu</h1>
        <h2>Create Your Account</h2>
        <p>Register as a service provider</p>
      </div>

      {serverError && <div className="alert alert-error">{serverError}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} noValidate>

        <Field
          label="Full Name"
          field="name"
          placeholder="e.g. Abebe Kebede"
          value={form.name}
          onChange={set('name')}
          error={errors.name}
        />
        <Field
          label="Email Address"
          field="email"
          type="email"
          placeholder="unique@email.com"
          value={form.email}
          onChange={set('email')}
          error={errors.email}
        />
        <Field
          label="Phone Number"
          field="phone"
          placeholder="+251911000000"
          value={form.phone}
          onChange={set('phone')}
          error={errors.phone}
        />

        {/* Password with eye toggle */}
        <div className="form-group">
          <label>Password</label>
          <div className="input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={set('password')}
              placeholder="Min. 6 characters"
              className={errors.password ? 'input-error' : ''}
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        <Field
          label="Business Name"
          field="businessName"
          placeholder="e.g. Kelem Cafe"
          value={form.businessName}
          onChange={set('businessName')}
          error={errors.businessName}
        />
        <Field
          label="TIN Number"
          field="tin"
          placeholder="10-digit TIN"
          value={form.tin}
          onChange={set('tin')}
          error={errors.tin}
        />

        <button type="submit" className="btn-primary btn-block">
          Register Account
        </button>
      </form>

      <p className="auth-switch">
        Already have an account?{' '}
        <button type="button" className="link-btn" onClick={switchToLogin}>
          Sign In
        </button>
      </p>
    </div>
  );
};

export default Register;
