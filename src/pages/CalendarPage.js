import React, { useState, useEffect, useRef } from 'react';
import DayCelebration from '../components/DayCelebration';
import MiniHeatmap from '../components/MiniHeatmap';
import '../App-habits-extra.css';

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
  const [selectedDay, setSelectedDay] = useState(null);
  const [quickReminder, setQuickReminder] = useState('');
  const [celebrateDay, setCelebrateDay] = useState(null);
  const celebrateTimeout = useRef();

  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => () => clearTimeout(celebrateTimeout.current), []);

  const daysInMonth = getMonthDays(currentYear, currentMonth);
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const addReminder = (day, text) => {
    if (text && text.trim()) {
      setReminders([...reminders, { day, month: currentMonth, year: currentYear, text: text.trim(), id: Date.now() }]);
    }
  };

  const removeReminder = (id) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  const prevMonth = () => {
    setCurrentMonth((m) => (m === 0 ? 11 : m - 1));
    if (currentMonth === 0) setCurrentYear((y) => y - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    setCurrentMonth((m) => (m === 11 ? 0 : m + 1));
    if (currentMonth === 11) setCurrentYear((y) => y + 1);
    setSelectedDay(null);
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
    const isToday = today.getDate() === i && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
    const isSelected = selectedDay === i;
    const todosForDay = getTodosForDay(i);
    const habitsForDay = getHabitsForDay(i);
    const remindersForDay = reminders.filter((r) => r.day === i && r.month === currentMonth && r.year === currentYear);
    const allDone = todosForDay.length > 0 && todosForDay.every(t => t.completed) && habitsForDay.length > 0 && habitsForDay.every(h => h.completed);
    calendarCells.push(
      <div
        key={i}
        className="calendar-day"
        style={{
          border: isToday ? '2.5px solid #38bdf8' : isSelected ? '2.5px solid #6366f1' : '1.5px solid #ececf1',
          padding: 10,
          borderRadius: 16,
          minHeight: 120,
          background: isToday
            ? 'linear-gradient(120deg,#e0e7ff 60%,#f0fff4 100%)'
            : isSelected
            ? 'rgba(236,236,241,0.7)'
            : 'rgba(255,255,255,0.96)',
          boxShadow: isToday || isSelected ? '0 4px 24px rgba(99,102,241,0.10)' : '0 2px 8px rgba(99,102,241,0.06)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          position: 'relative',
          cursor: 'pointer',
          transition: 'box-shadow 0.22s, border 0.22s, background 0.22s',
        }}
        onClick={() => setSelectedDay(i)}
      >
        <DayCelebration show={celebrateDay === i} />
        <div
          style={{
            fontWeight: 'bold',
            color: isToday ? '#38bdf8' : '#6366f1',
            fontSize: '1.1rem',
            marginBottom: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {i}
          {isToday && <span style={{fontSize:18,marginLeft:2}}>🌟</span>}
        </div>
        <MiniHeatmap history={habitsForDay.map(h=>h.lastChecked ? new Date(h.lastChecked).toISOString().slice(0,10) : '')} />
        <ul style={{ fontSize: 13, paddingLeft: 16, margin: 0, marginTop: 4 }}>
          {remindersForDay.map((r) => (
            <li key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🔔 {r.text}</span>
              <button
                onClick={e => { e.stopPropagation(); removeReminder(r.id); }}
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
          {todosForDay.map((t, idx) => (
            <li key={'todo' + idx} style={{ color: t.completed ? '#38bdf8' : '#d72660', display:'flex',alignItems:'center',gap:4 }}>
              <span>{t.completed ? '✅' : '📝'}</span> {t.title}
            </li>
          ))}
          {habitsForDay.map((h, idx) => (
            <li key={'habit' + idx} style={{ color: h.completed ? '#38bdf8' : '#1e90ff', display:'flex',alignItems:'center',gap:4 }}>
              <span>{h.icon || '🔥'}</span> {h.name}
            </li>
          ))}
        </ul>
        {isSelected && (
          <div style={{marginTop:8,display:'flex',gap:6,alignItems:'center',width:'100%'}}>
            <input
              value={quickReminder}
              onChange={e => setQuickReminder(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  addReminder(i, quickReminder);
                  setQuickReminder('');
                }
              }}
              placeholder="Add reminder..."
              style={{fontSize:13,padding:'6px 10px',border:'1.5px solid #ececf1',borderRadius:8,flex:1,background:'#f7f7f8'}}
              autoFocus
            />
            <button
              onClick={e => { e.stopPropagation(); addReminder(i, quickReminder); setQuickReminder(''); }}
              style={{fontSize:12,background:'linear-gradient(90deg,#6366f1 60%,#38bdf8 100%)',color:'#fff',border:'none',borderRadius:8,padding:'6px 14px',fontWeight:700,cursor:'pointer'}}
            >+ Add</button>
          </div>
        )}
        {allDone && (
          <div style={{marginTop:6,fontWeight:700,color:'#38bdf8',fontSize:13,display:'flex',alignItems:'center',gap:4}}>
            🎉 All done!
          </div>
        )}
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
            transition:'color 0.18s',
          }}
        >
          {'<'}
        </button>
        <h2
          style={{
            fontWeight: 700,
            fontSize: '1.3rem',
            margin: 0,
            letterSpacing:0.5,
            color:'#6366f1',
            background:'rgba(236,236,241,0.5)',
            borderRadius:8,
            padding:'4px 18px',
            boxShadow:'0 1px 4px rgba(60,72,100,0.04)'
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
            transition:'color 0.18s',
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
          background: 'rgba(247,247,248,0.85)',
          borderRadius: 20,
          padding: 24,
          boxShadow:'0 8px 32px rgba(99,102,241,0.10)',
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
              letterSpacing:0.5,
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
