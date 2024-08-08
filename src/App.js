import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Make sure Navigate is imported
import Navbar from './Navbar';
import Dashboard from './pages/Dashboard';
import TaskLogging from './pages/TaskLogging';
import Analytics from './pages/Analytics';
import Login from './auth/Login';
import Register from './auth/Register';

// Define PrivateRoute here if it's not imported from another file
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/task-logging" element={<PrivateRoute><TaskLogging /></PrivateRoute>} />
        <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
