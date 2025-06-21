import React, { useState } from 'react';

const initialLeaderboard = [
  { name: 'You', points: 120, level: 2, badge: '🏅' },
  { name: 'Alex', points: 90, level: 1, badge: '🎖️' },
  { name: 'Sam', points: 60, level: 1, badge: '🎖️' },
];

const achievements = [
  { name: 'First Task', desc: 'Complete your first todo', icon: '✅' },
  { name: 'Habit Streak', desc: '3-day habit streak', icon: '🔥' },
  { name: 'Level Up', desc: 'Reach level 2', icon: '⭐' },
];

const GamifyPage = ({ points, level }) => {
  const [leaderboard] = useState(initialLeaderboard);
  const [earned, setEarned] = useState([achievements[0], achievements[2]]); // Example

  return (
    <div className="app-container">
      <h1>Gamification</h1>
      <div style={{ marginBottom: 16 }}>Points: {points} | Level: {level}</div>
      <h2>Leaderboard</h2>
      <table style={{ width: '100%', maxWidth: 400 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Points</th>
            <th>Level</th>
            <th>Badge</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, i) => (
            <tr key={i} style={{ fontWeight: entry.name === 'You' ? 'bold' : 'normal' }}>
              <td>{entry.name}</td>
              <td>{entry.points}</td>
              <td>{entry.level}</td>
              <td>{entry.badge}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 style={{ marginTop: 32 }}>Achievements</h2>
      <ul style={{ display: 'flex', gap: 24, marginTop: 12 }}>
        {earned.map((a, i) => (
          <li key={i} style={{ listStyle: 'none', textAlign: 'center' }}>
            <div style={{ fontSize: 32 }}>{a.icon}</div>
            <div style={{ fontWeight: 'bold' }}>{a.name}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{a.desc}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GamifyPage;
