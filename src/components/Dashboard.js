import React from 'react';

const Dashboard = ({
  aiSuggestion,
  quote,
  onAddSuggestion,
  points,
  level,
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
        <h2>Quick Stats</h2>
        <div>Points: {points}</div>
        <div>Level: {level}</div>
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
