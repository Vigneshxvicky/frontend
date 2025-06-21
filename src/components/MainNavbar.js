import React from 'react';
import { Link } from 'react-router-dom';

const MainNavbar = () => (
  <nav className="main-navbar">
    <span style={{fontWeight:800,fontSize:'4rem',color:'#6366f1',marginRight:600,letterSpacing:10}}>Life Hub</span>
    <Link to="/">Dashboard</Link>
    <Link to="/todos">Todos</Link>
    <Link to="/habits">Habits</Link>
    <Link to="/calendar">Calendar</Link>
    {/* <Link to="/gamify">Gamify</Link> */}
    <Link to="/settings">Settings</Link>
  </nav>
);

export default MainNavbar;
