import React from 'react';

import './comp_css/dashboard.css';

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
        <div className="dashboard-essentials">
          <div className="dashboard-feature">
            <img src={require('../assets/todos-hero.png')} alt="Todos" className="dashboard-feature-img todos" />
            <div>
              <div className="dashboard-feature-title todos">Todos</div>
              <div className="dashboard-feature-desc">Organize your tasks with Notion-style cards, color tags, and drag-and-drop.</div>
            </div>
          </div>
          <div className="dashboard-feature habits">
            {/* Habits: text left, image right */}
            <div>
              <div className="dashboard-feature-title habits">Habits</div>
              <div className="dashboard-feature-desc">Track habits with streaks, emoji icons, and mini-heatmap.</div>
            </div>
            <img src={require('../assets/habits-hero.png')} alt="Habits" className="dashboard-feature-img habits" />
          </div>
          <div className="dashboard-feature">
            <img src={require('../assets/calendar-hero.png')} alt="Calendar" className="dashboard-feature-img calendar" />
            <div>
              <div className="dashboard-feature-title calendar">Calendar</div>
              <div className="dashboard-feature-desc">Plan your days with a modern calendar and reminders.</div>
            </div>
          </div>
        </div>
      </section>
      {/* <Footer /> */}

    </div>
  );
};

export default Dashboard;
