import React from 'react';
import './comp_css/footer.css';

const Footer = () => (
  <footer className="main-footer">
    <div className="footer-content">
      <span>© {new Date().getFullYear()} Life Hub. All rights reserved.</span>
    </div>
  </footer>
);

export default Footer;
