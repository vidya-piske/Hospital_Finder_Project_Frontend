import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase';
import LandingPage from './components/LandingPage';
import AuthenticationComponent from './components/AuthenticationComponent';
import DashboardPage from './components/DashboardPage';
import './styles/styles.css';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthenticationComponent auth={auth} />} />
        <Route
          path="/dashboard"
          element={currentUser ? <DashboardPage auth={auth} currentUser={currentUser} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
