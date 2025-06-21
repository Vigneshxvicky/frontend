import React from 'react';

const Hero = () => (
  <div className="hero-section" style={{padding:'60px 0 40px 0',textAlign:'center'}}>
    <h1 className="hero-title" style={{fontSize:'4rem',fontWeight:900,letterSpacing:2,color:'#6366f1',marginBottom:24,lineHeight:1.1}}>Welcome to Life Hub</h1>
    <p className="hero-desc" style={{fontSize:'2rem',fontWeight:600,maxWidth:700,margin:'0 auto 32px auto',color:'#232946'}}>All-in-one productivity: Notion-style todos, Google Calendar, and more. Organize your life, your way.</p>
    <div className="hero-animation" style={{marginTop:32}}>
      <svg width="220" height="220" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="90" cy="90" r="80" fill="#ffe0f7"/>
        <circle cx="90" cy="90" r="60" fill="#e0e7ff"/>
        <circle cx="90" cy="90" r="40" fill="#ffb6d5"/>
        <text x="50%" y="54%" textAnchor="middle" fill="#d72660" fontSize="3.2rem" fontWeight="bold" dy=".3em">🗂️</text>
      </svg>
    </div>
  </div>
);

export default Hero;
