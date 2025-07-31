import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Basic mobile number validation (India format)
    if (!/^[6-9]\d{9}$/.test(contact)) {
      setErrorMsg('Invalid contact number format.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/donors/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact, password }),
      });

      if (!response.ok) throw new Error('Invalid login');

      const data = await response.json();
      localStorage.setItem('loggedInDonor', JSON.stringify(data));
      navigate('/dashboard');
    } catch (error) {
      setErrorMsg('❌ Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .form-control::placeholder {
          color: white !important;
          opacity: 1;
        }
      `}</style>

      <div
        style={{ backgroundColor: '#0f0f0f', color: '#f0f0f0', minHeight: '100vh' }}
        className="d-flex justify-content-center align-items-center"
      >
        <div
          className="container"
          style={{
            maxWidth: 400,
            padding: '30px 15px',
            backgroundColor: '#1a1a1a',
            borderRadius: '12px',
            boxShadow: '0 0 15px rgba(255,0,0,0.1)',
          }}
        >
          <h2
            className="text-center mb-4"
            style={{ color: '#e63946', textShadow: '0 0 6px rgba(255,0,0,0.2)' }}
          >
            🔐 Donor Login
          </h2>

          <form onSubmit={login}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control bg-dark border-secondary text-light"
                placeholder="📱 Contact Number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control bg-dark border-secondary text-light"
                placeholder="🔑 Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn w-100"
              style={{
                backgroundColor: '#e63946',
                color: 'white',
                borderRadius: '8px',
                boxShadow: '0 0 10px rgba(255,0,0,0.2)',
              }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {errorMsg && <div className="alert alert-danger mt-3">{errorMsg}</div>}
        </div>
      </div>
    </>
  );
};

export default Login;
