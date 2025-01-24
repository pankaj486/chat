// src/components/Login.js

import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [role, setRole] = useState('user');

  const handleLogin = () => {
    onLogin(role);
  };

  return (
    <div>
      <h1>Login</h1>
      <div>
        <label>
          Role:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
