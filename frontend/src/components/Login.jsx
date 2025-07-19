import React, { useState } from 'react';

const Login = () => {
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const login = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/donors/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact, password })
      });

      if (!response.ok) throw new Error('Invalid login');

      const data = await response.json();
      localStorage.setItem('loggedInDonor', JSON.stringify(data));
      window.location.href = 'dashboard.html';
    } catch (error) {
      setErrorMsg('❌ Login failed. Check your credentials.');
    }
  };

  return (
    <div className="login-box">
      <h2>🔐 Donor Login</h2>
      <input
        type="text"
        placeholder="📱 Contact Number"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="🔑 Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button onClick={login}>Login</button>
      {errorMsg && <p id="msg">{errorMsg}</p>}
    </div>
  );
};

export default Login;