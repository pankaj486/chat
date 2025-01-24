// src/App.js

import React, { useState } from 'react';
import Login from './components/Login';
import UserChat from './components/UserChat';
import AdminChat from './components/AdminChat';

const App = () => {
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);

  const handleLogin = (role, id) => {
    if (role === 'user') {
      setRole('user');
      setUserId(id);
    } else if (role === 'admin') {
      setRole('admin');
      setUserId('admin');
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
