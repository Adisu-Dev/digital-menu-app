import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  const register = (userData) => {
    if (registeredUsers.some(u => u.email === userData.email)) {
      throw new Error('Email is already registered.');
    }
    if (registeredUsers.some(u => u.tin === userData.tin)) {
      throw new Error('TIN number is already registered.');
    }
    setRegisteredUsers(prev => [...prev, userData]);
  };

  const login = (email, password) => {
    const found = registeredUsers.find(
      u => u.email === email && u.password === password
    );
    if (!found) throw new Error('Invalid email or password.');
    setUser(found);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
