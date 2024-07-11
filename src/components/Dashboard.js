// src/components/Dashboard.js

import React from 'react';
import { Button } from 'antd';
import { signOut } from 'firebase/auth'; // Assuming you have imported the necessary Firebase functions
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const Dashboard = ({ auth, currentUser }) => {
  const navigate = useNavigate(); // Initialize navigate function from useNavigate hook

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Redirect to login screen after sign-out
      navigate('/login'); // Navigate to the login page
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div>
      <h1>Welcome to Dashboard</h1>
      {currentUser && (
        <div>
          <p>Hello, {currentUser.email}</p>
          <Button onClick={handleSignOut}>Sign Out</Button>
        </div>
      )}
      {!currentUser && <p>Please log in to access the dashboard.</p>}
    </div>
  );
};

export default Dashboard;
