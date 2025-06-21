import React, { useState, useEffect } from 'react';

function getMonthDays(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarPage = ({ todos = [], habits = [] }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [reminders, setReminders] = useState(() => {
    const stored = localStorage.getItem('reminders');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [reminders]);

  const daysInMonth = getMonthDays(currentYear, currentMonth);
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const addReminder = (day) => {
    const text = prompt(`Add reminder for ${currentYear}-${currentMonth + 1}-${day}`);
    if (text) {
      setReminders([...reminders, { day, month: currentMonth, year: currentYear, text, id: Date.now() }]);
    }
  };

  const removeReminder = (id) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  const prevMonth = () => {
    setCurrentMonth((m) => (m === 0 ? 11 : m - 1));
    if (currentMonth === 0) setCurrentYear((y) => y - 1);
  };
  const nextMonth = () => {
    setCurrentMonth((m) => (m === 11 ? 0 : m + 1));
    if (currentMonth === 11) setCurrentYear((y) => y + 1);
  };

  // Filter todos/habits for the current month
  const getTodosForDay = (day) =>
    todos.filter((t) => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth && d.getDate() === day;
    });
  const getHabitsForDay = (day) =>
    habits.filter(
      (h) =>
        h.lastChecked &&
        (() => {
          const d = new Date(h.lastChecked);
          return d.getFullYear() === currentYear && d.getMonth() === currentMonth && d.getDate() === day;
        })()
    );

  // Build calendar grid with empty days for alignment
  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(<div key={'empty-' + i} style={{ background: 'none' }} />);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push(
      <div
        key={i}
        className="calendar-day"
        style={{
          border: '1px solid #eee',
          padding: 10,
          borderRadius: 10,
          minHeight: 110,
          background:
            today.getDate() === i &&
            today.getMonth() === currentMonth &&
            today.getFullYear() === currentYear
              ? '#e0e7ff'
              : '#fff',
          boxShadow: '0 2px 8px rgba(99,102,241,0.06)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            fontWeight: 'bold',
            color: '#6366f1',
            fontSize: '1.1rem',
            marginBottom: 4,
          }}
        >
          {i}
        </div>
        <ul style={{ fontSize: 13, paddingLeft: 16, margin: 0 }}>
          {reminders
            .filter((r) => r.day === i && r.month === currentMonth && r.year === currentYear)
            .map((r, idx) => (
              <li key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>🔔 {r.text}</span>
                <button
                  onClick={() => removeReminder(r.id)}
                  style={{
                    marginLeft: 4,
                    background: 'none',
                    border: 'none',
                    color: '#d72660',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: 14,
                  }}
                  title="Remove"
                >
                  ✕
                </button>
              </li>
            ))}
          {getTodosForDay(i).map((t, idx) => (
            <li key={'todo' + idx} style={{ color: '#d72660' }}>
              📝 {t.title}
            </li>
          ))}
          {getHabitsForDay(i).map((h, idx) => (
            <li key={'habit' + idx} style={{ color: '#1e90ff' }}>
              🔥 {h.name}
            </li>
          ))}
        </ul>
        <button
          style={{
            fontSize: 11,
            marginTop: 8,
            background: 'linear-gradient(90deg,#6366f1 60%,#38bdf8 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '4px 10px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
          onClick={() => addReminder(i)}
        >
          + Reminder
        </button>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ maxWidth: 1200 }}>
      <h1
        style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          letterSpacing: 1,
          color: '#232946',
          marginBottom: 18,
        }}
      >
        Calendar
      </h1>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 18,
        }}
      >
        <button
          onClick={prevMonth}
          style={{
            fontSize: 22,
            background: 'none',
            border: 'none',
            color: '#6366f1',
            cursor: 'pointer',
          }}
        >
          {'<'}
        </button>
        <h2
          style={{
            fontWeight: 700,
            fontSize: '1.3rem',
            margin: 0,
          }}
        >
          {currentYear} - {currentMonth + 1}
        </h2>
        <button
          onClick={nextMonth}
          style={{
            fontSize: 22,
            background: 'none',
            border: 'none',
            color: '#6366f1',
            cursor: 'pointer',
          }}
        >
          {'>'}
        </button>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7,1fr)',
          gap: 16,
          background: '#f7f7f8',
          borderRadius: 16,
          padding: 24,
        }}
      >
        {WEEKDAYS.map((d, i) => (
          <div
            key={d}
            style={{
              textAlign: 'center',
              fontWeight: 700,
              color: '#6366f1',
              marginBottom: 8,
              fontSize: 15,
            }}
          >
            {d}
          </div>
        ))}
        {calendarCells}
      </div>
    </div>
  );
};

export default CalendarPage;
