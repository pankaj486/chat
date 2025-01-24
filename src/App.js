// src/App.js

import React, { useState } from 'react';
import Login from './components/Login';
import UserChat from './components/UserChat';
import AdminChat from './components/AdminChat';

const App = () => {
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);

  const handleLogin = (role, id) => {
    // Static login: user1, user2 are regular users; admin is the admin
    if (role === 'user') {
      setRole('user');
      setUserId(id); // Simulating user1 login
    } else if (role === 'admin') {
      setRole('admin');
      setUserId('admin'); // Simulating admin login
    }
  };

  return (
    <div className="App">
      {!role ? (
        <Login onLogin={handleLogin} />
      ) : role === 'admin' ? (
        <AdminChat />
      ) : (
        <UserChat userId={userId} />
      )}
    </div>
  );
};

export default App;
