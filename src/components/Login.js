// src/components/Login.js

import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [role, setRole] = useState('user');
  const [userId, setUserId] = useState('');

  // const handleLogin = () => {
  //   onLogin(role);
  // };

  const handleLogin = (e) => {
    e.preventDefault();
    if (role && userId) {
      onLogin(role, userId);
    } else if (role === 'admin') {
      onLogin(role, 'admin')
    } else {
      alert('Please enter both role and user ID!');
    }
  };

  return (
    // <div>
    //   <h1>Login</h1>
    //   <div>
    //     <label>
    //       Role:
    //       <select value={role} onChange={(e) => setRole(e.target.value)}>
    //         <option value="user">User</option>
    //         <option value="admin">Admin</option>
    //       </select>
    //     </label>
    //   </div>
    //   <button onClick={handleLogin}>Login</button>
    // </div>
    <form onSubmit={handleLogin}>
      <label>
        Role:
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Select Role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </label>
      {role === 'user' && (
        <label>
          User ID:
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user ID (e.g., user1, user2)"
          />
        </label>
      )}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
