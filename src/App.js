import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LogIn from './components/LoginIn';
import './styles/styles.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LogIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
