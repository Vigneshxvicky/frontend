import React from 'react';

const SettingsPage = ({ currentTheme, onThemeChange }) => {
  const resetData = () => {
    if (window.confirm('Reset all app data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="app-container" style={{maxWidth:500,margin:'40px auto',background:'#fff',borderRadius:16,boxShadow:'0 2px 16px rgba(60,72,100,0.10)',padding:32}}>
      <h1 style={{fontSize:'2.2rem',fontWeight:800,letterSpacing:1,color:'#232946',marginBottom:18}}>Settings</h1>
      <div className="settings-section">
        <h2>Theme Picker</h2>
        <select value={currentTheme} onChange={e => onThemeChange(e.target.value)} style={{padding:12,borderRadius:8,fontSize:'1.1rem',marginTop:8}}>
          <option value="default">Default</option>
          <option value="pink">Pink</option>
          <option value="blue">Blue</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div className="settings-section">
        <h2>Data</h2>
        <button onClick={resetData}>Reset All Data</button>
      </div>
      <div className="settings-section">
        <h2>About</h2>
        <div style={{fontSize:15,color:'#888'}}>
          <p><b>Life Hub</b> v1.0</p>
          <p>Made with ❤️ for productivity, fun, and self-improvement.</p>
          <p>Features: Notion-style Todos, Google Calendar, Habits, Gamification, and more!</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
