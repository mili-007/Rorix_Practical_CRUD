import React, { useState } from 'react';
import './App.css';
import LoginForm from './LoginForm';
import Swal from 'sweetalert2';


const App = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleLogin = (user) => {
    setCurrentUser(user);
    Swal.fire({
      icon : "success",
      text : `Welcome back, ${user.email}!`
    })
  };

  const handleCreateUser = (userData) => {
    const newUser = {
      ...userData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setUsers(prev => [...prev, newUser]);
     Swal.fire({
      icon : "success",
      text : `User created successfully!`
    })
  };

  const handleUpdateUser = (id, userData) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === id
          ? { ...user, ...userData, updatedAt: new Date() }
          : user
      )
    );
     Swal.fire({
      icon : "success",
      text : `User updated successfully!`
    })
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== id));
      Swal.fire({
      icon : "success",
      text : `User deleted successfully!`
    })
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (currentUser) {
    return (
      <div className="app-container">
        <div className="welcome-screen">
          <h1>Welcome, {currentUser.email}!</h1>
          <p>You have successfully logged in.</p>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <LoginForm
        users={users}
        onLogin={handleLogin}
        onCreateUser={handleCreateUser}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
};

export default App;