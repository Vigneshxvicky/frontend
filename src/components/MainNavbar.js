import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const MainNavbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`main-navbar enhanced-navbar${scrolled ? ' navbar-scrolled' : ''}`}>
      <span className="navbar-brand">Life Hub</span>
      <div className="navbar-links">
        <Link to="/">Dashboard</Link>
        <Link to="/todos">Todos</Link>
        <Link to="/habits">Habits</Link>
        <Link to="/planner">Planner</Link>
        <Link to="/calendar">Calendar</Link>
      </div>
    </nav>
  );
};

export default MainNavbar;
