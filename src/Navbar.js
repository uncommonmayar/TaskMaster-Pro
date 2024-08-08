import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = token ? JSON.parse(atob(token.split('.')[1])).role : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav>
      <ul>
        {!token ? (
          <li><Link to="/login">Login</Link></li>
        ) : (
          <>
            {userRole === 'manager' && <li><Link to="/task-logging">Task Logging</Link></li>}
            {['manager', 'admin'].includes(userRole) && <li><Link to="/analytics">Analytics</Link></li>}
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
