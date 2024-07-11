// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from './firebase/firebase';
import AuthenticationComponent from './components/AuthenticationComponent';
import DashboardPage from './components/DashboardPage';
import './styles/styles.css';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthenticationComponent auth={auth} />} />
        <Route path="/dashboard" element={<DashboardPage auth={auth} currentUser={currentUser} />} />
      </Routes>
    </Router>
  );
};

export default App;
