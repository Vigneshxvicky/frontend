import React from 'react';
import './comp_css/footer.css';

const Footer = () => (
  <footer className="main-footer">
    <div className="footer-content">
      <span>© {new Date().getFullYear()} Life Hub. All rights reserved.</span>
      <span className="footer-links">
        <a href="/" className="footer-link">Home</a>
        <a href="/planner" className="footer-link">Planner</a>
        <a href="/todos" className="footer-link">Todos</a>
        <a href="/habits" className="footer-link">Habits</a>
        <a href="/calendar" className="footer-link">Calendar</a>
      </span>
    </div>
  </footer>
);

export default Footer;
