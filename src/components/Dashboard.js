import React from 'react';

const Dashboard = ({
  mascotMessage,
  aiSuggestion,
  quote,
  onAddSuggestion,
  onVoiceInput,
  onMoodSelect,
  moodStats,
  points,
  level,
  currentTheme,
  onThemeChange,
  children
}) => {
  return (
    <div className="dashboard-long">
      <section className="dashboard-section">
        <h2>AI Smart Suggestion</h2>
        <div>{aiSuggestion || 'Try: “Drink water!”'}</div>
        <button onClick={onAddSuggestion}>Add to my list</button>
      </section>
      <section className="dashboard-section">
        <h2>Motivational Quote</h2>
        <blockquote>{quote || '“The secret of getting ahead is getting started.”'}</blockquote>
      </section>
      <section className="dashboard-section">
        <h2>Voice Input</h2>
        <button onClick={onVoiceInput}>🎤 Speak a task</button>
      </section>
      <section className="dashboard-section">
        <h2>Mood Tracker</h2>
        <div>
          <span role="img" aria-label="happy" onClick={() => onMoodSelect('happy')}>😊</span>
          <span role="img" aria-label="neutral" onClick={() => onMoodSelect('neutral')}>😐</span>
          <span role="img" aria-label="sad" onClick={() => onMoodSelect('sad')}>😢</span>
        </div>
        <div>Mood stats: {moodStats || 'No data yet.'}</div>
      </section>
      <section className="dashboard-section">
        <h2>Theme Picker</h2>
        <select value={currentTheme} onChange={e => onThemeChange(e.target.value)}>
          <option value="default">Default</option>
          <option value="pink">Pink</option>
          <option value="blue">Blue</option>
          <option value="dark">Dark</option>
        </select>
      </section>
      <section className="dashboard-section">
        <h2>Animated Mascot</h2>
        <div>{mascotMessage || 'Hi! I am your productivity buddy!'}</div>
      </section>
      <section className="dashboard-section">
        <h2>Gamification</h2>
        <div>Points: {points || 0} | Level: {level || 1}</div>
      </section>
      <section className="dashboard-section">
        <h2>Quick Stats</h2>
        <div>Theme: {currentTheme}</div>
        <div>Points: {points}</div>
        <div>Level: {level}</div>
        <div>Mood: {moodStats}</div>
      </section>
      <section className="dashboard-section">
        <h2>Essentials</h2>
        <ul style={{display:'flex',gap:24,flexWrap:'wrap',marginTop:12}}>
          <li><a href="/todos">Todos</a></li>
          <li><a href="/habits">Habits</a></li>
          <li><a href="/calendar">Calendar</a></li>
          <li><a href="/gamify">Gamify</a></li>
          <li><a href="/settings">Settings</a></li>
        </ul>
      </section>
      <section className="dashboard-section">
        <h2>Your Todos</h2>
        {children}
      </section>
    </div>
  );
};

export default Dashboard;
