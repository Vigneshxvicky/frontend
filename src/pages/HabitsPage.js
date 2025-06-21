import React, { useState, useEffect } from 'react';

const initialHabits = [
  { id: 1, name: 'Drink Water', completed: false, streak: 0, lastChecked: null, history: [] },
  { id: 2, name: 'Read 10 pages', completed: false, streak: 0, lastChecked: null, history: [] },
  { id: 3, name: 'Exercise', completed: false, streak: 0, lastChecked: null, history: [] },
];

function isToday(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}

const HabitsPage = () => {
  const [habits, setHabits] = useState(() => {
    const stored = localStorage.getItem('habits');
    return stored ? JSON.parse(stored) : initialHabits;
  });
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const toggleHabit = (id) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        if (!isToday(habit.lastChecked)) {
          const todayStr = new Date().toISOString().slice(0,10);
          return {
            ...habit,
            completed: true,
            streak: habit.completed && isToday(habit.lastChecked) ? habit.streak : habit.streak + 1,
            lastChecked: new Date().toISOString(),
            history: [...(habit.history || []), todayStr],
          };
        } else {
          return habit;
        }
      }
      return habit;
    }));
  };

  const addHabit = () => {
    const name = prompt('Enter new habit:');
    if (name) {
      setHabits([...habits, { id: Date.now(), name, completed: false, streak: 0, lastChecked: null, history: [] }]);
    }
  };

  const deleteHabit = (id) => {
    if (window.confirm('Delete this habit?')) {
      setHabits(habits.filter(h => h.id !== id));
    }
  };

  const resetHabits = () => {
    setHabits(initialHabits);
  };

  const viewHistory = (habit) => {
    setSelected(habit);
  };

  const closeHistory = () => setSelected(null);

  return (
    <div className="app-container">
      <h1>Habits</h1>
      <div style={{display:'flex',gap:12,marginBottom:18}}>
        <button onClick={addHabit} style={{background:'linear-gradient(90deg,#6366f1 60%,#38bdf8 100%)',color:'#fff',border:'none',borderRadius:8,padding:'10px 22px',fontWeight:700,fontSize:'1rem',cursor:'pointer',boxShadow:'0 2px 8px rgba(99,102,241,0.08)'}}>Add Habit</button>
        <button onClick={resetHabits} style={{background:'#ececf1',color:'#232946',border:'none',borderRadius:8,padding:'10px 22px',fontWeight:700,fontSize:'1rem',cursor:'pointer'}}>Reset</button>
      </div>
      <ul style={{marginTop: 10}}>
        {habits.map(habit => (
          <li key={habit.id} style={{marginBottom: 10,display:'flex',alignItems:'center',gap:8}}>
            <label style={{flex:1}}>
              <input
                type="checkbox"
                checked={isToday(habit.lastChecked)}
                onChange={() => toggleHabit(habit.id)}
                disabled={isToday(habit.lastChecked)}
              />
              <span style={{marginLeft: 8, textDecoration: isToday(habit.lastChecked) ? 'line-through' : 'none'}}>{habit.name}</span>
              <span style={{marginLeft: 16, color:'#888'}}>🔥 {habit.streak} day streak</span>
            </label>
            <button onClick={()=>viewHistory(habit)} style={{fontSize:12,padding:'6px 14px',borderRadius:6,border:'none',background:'#ececf1',color:'#232946',fontWeight:700,cursor:'pointer'}}>History</button>
            <button onClick={()=>deleteHabit(habit.id)} style={{fontSize:12,padding:'6px 14px',borderRadius:6,border:'none',background:'#fff',color:'#d72660',fontWeight:700,cursor:'pointer'}}>Delete</button>
          </li>
        ))}
      </ul>
      <div style={{marginTop:24}}>
        <h3>Stats</h3>
        <div>Total Habits: {habits.length}</div>
        <div>Longest Streak: {Math.max(...habits.map(h=>h.streak),0)}</div>
      </div>
      {selected && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.18)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:12,padding:32,minWidth:320,boxShadow:'0 2px 16px rgba(60,72,100,0.10)'}}>
            <h2 style={{marginBottom:12}}>{selected.name} History</h2>
            <ul style={{fontSize:15}}>
              {selected.history && selected.history.length > 0 ? selected.history.map((d,i)=>(<li key={i}>{d}</li>)) : <li>No history yet.</li>}
            </ul>
            <button onClick={closeHistory} style={{marginTop:16,padding:'8px 18px',borderRadius:8,border:'none',background:'#6366f1',color:'#fff',fontWeight:700,cursor:'pointer'}}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitsPage;
