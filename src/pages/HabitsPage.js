import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import HabitProgress from '../components/HabitProgress';
import HabitIconPicker from '../components/HabitIconPicker';
import MiniHeatmap from '../components/MiniHeatmap';
import ConfettiCelebration from '../components/ConfettiCelebration';
import '../App-habits-extra.css';

const initialHabits = [
  { id: 1, name: 'Drink Water', icon: '💧', completed: false, streak: 0, lastChecked: null, history: [] },
  { id: 2, name: 'Read 10 pages', icon: '📖', completed: false, streak: 0, lastChecked: null, history: [] },
  { id: 3, name: 'Exercise', icon: '🏃‍♂️', completed: false, streak: 0, lastChecked: null, history: [] },
];

function isToday(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}

const STREAK_MILESTONES = [3, 7, 14, 21, 30, 50, 100];

const HabitsPage = () => {
  const [habits, setHabits] = useState(() => {
    const stored = localStorage.getItem('habits');
    return stored ? JSON.parse(stored) : initialHabits;
  });
  const [selected, setSelected] = useState(null);
  const [newHabit, setNewHabit] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [confetti, setConfetti] = useState(false);
  const confettiTimeout = useRef();

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => () => clearTimeout(confettiTimeout.current), []);

  const toggleHabit = (id) => {
    setHabits(habits => habits.map(habit => {
      if (habit.id === id) {
        if (!isToday(habit.lastChecked)) {
          const todayStr = new Date().toISOString().slice(0,10);
          const newStreak = habit.completed && isToday(habit.lastChecked) ? habit.streak : habit.streak + 1;
          // Confetti for milestone
          if (STREAK_MILESTONES.includes(newStreak)) {
            setConfetti(true);
            confettiTimeout.current = setTimeout(() => setConfetti(false), 2200);
          }
          return {
            ...habit,
            completed: true,
            streak: newStreak,
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
    if (newHabit.trim()) {
      setHabits([
        ...habits,
        { id: Date.now(), name: newHabit.trim(), icon: '📝', completed: false, streak: 0, lastChecked: null, history: [] }
      ]);
      setNewHabit('');
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

  const startEdit = (habit) => {
    setEditId(habit.id);
    setEditName(habit.name);
    setEditIcon(habit.icon || '📝');
  };

  const saveEdit = (id) => {
    setHabits(habits.map(h => h.id === id ? { ...h, name: editName, icon: editIcon } : h));
    setEditId(null);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(habits);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setHabits(items);
  };

  return (
    <div className="app-container" style={{
      maxWidth: 700,
      margin: '40px auto',
      background: 'rgba(255,255,255,0.88)',
      borderRadius: 24,
      boxShadow: '0 8px 32px rgba(99,102,241,0.10)',
      padding: '38px 0 32px 0',
      border: '1.5px solid #ececf1',
      position: 'relative',
    }}>
      <ConfettiCelebration run={confetti} />
      <h1 style={{textAlign:'center',fontWeight:800,marginBottom:18,color:'#6366f1',fontFamily:'Inter,Segoe UI,Arial,sans-serif',letterSpacing:1.5}}>Habits</h1>
      <div style={{display:'flex',gap:12,marginBottom:18,justifyContent:'center'}}>
        <input
          value={newHabit}
          onChange={e => setNewHabit(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addHabit()}
          placeholder="Add a new habit..."
          style={{
            fontSize:'1rem',padding:'10px 14px',border:'1.5px solid #ececf1',borderRadius:8,minWidth:180,outline:'none',fontWeight:600,background:'#f7f7f8',color:'#232946',boxShadow:'0 1px 4px rgba(60,72,100,0.04)'}}
        />
        <button onClick={addHabit} style={{background:'linear-gradient(90deg,#6366f1 60%,#38bdf8 100%)',color:'#fff',border:'none',borderRadius:8,padding:'10px 22px',fontWeight:700,fontSize:'1rem',cursor:'pointer',boxShadow:'0 2px 8px rgba(99,102,241,0.08)',transition:'background 0.2s'}}>+ Add</button>
        <button onClick={resetHabits} style={{background:'#ececf1',color:'#232946',border:'none',borderRadius:8,padding:'10px 22px',fontWeight:700,fontSize:'1rem',cursor:'pointer',transition:'background 0.2s'}}>Reset</button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="habits-droppable">
          {(provided) => (
            <ul style={{marginTop: 10, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16}} ref={provided.innerRef} {...provided.droppableProps}>
              {habits.map((habit, idx) => (
                <Draggable key={habit.id} draggableId={habit.id.toString()} index={idx}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`habit-card${isToday(habit.lastChecked) ? ' completed' : ''}${snapshot.isDragging ? ' animated' : ''}`}
                      style={{...provided.draggableProps.style, zIndex: snapshot.isDragging ? 100 : 'auto'}}
                    >
                      <HabitProgress value={isToday(habit.lastChecked) ? 1 : 0} max={1} streak={habit.streak} />
                      <span style={{fontSize:28,marginLeft:6}}>{habit.icon || '📝'}</span>
                      {editId === habit.id ? (
                        <>
                          <input
                            className="habit-edit-input"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && saveEdit(habit.id)}
                            autoFocus
                          />
                          <HabitIconPicker value={editIcon} onChange={setEditIcon} />
                          <button onClick={() => saveEdit(habit.id)} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:8,padding:'7px 16px',fontWeight:700,cursor:'pointer',transition:'background 0.2s'}}>Save</button>
                          <button onClick={() => setEditId(null)} style={{background:'#fff',color:'#d72660',border:'1px solid #ececf1',borderRadius:8,padding:'7px 16px',fontWeight:700,cursor:'pointer',transition:'background 0.2s'}}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <label style={{flex:1,display:'flex',alignItems:'center',gap:10,cursor:'pointer'}}>
                            <input
                              type="checkbox"
                              checked={isToday(habit.lastChecked)}
                              onChange={() => toggleHabit(habit.id)}
                              disabled={isToday(habit.lastChecked)}
                              style={{width:22,height:22,accentColor:'#6366f1',marginRight:2,flexShrink:0,transition:'accent-color 0.2s'}}
                            />
                            <span style={{fontSize:'1.13rem',fontWeight:600,marginLeft: 8, textDecoration: isToday(habit.lastChecked) ? 'line-through' : 'none', color: isToday(habit.lastChecked) ? '#b6b6b6' : '#232946', letterSpacing:0.2}}>{habit.name}</span>
                            <span style={{marginLeft: 16, color:'#38bdf8',fontWeight:700,background:'#e0e7ff',borderRadius:6,padding:'2px 10px',fontSize:'0.98rem',display:'flex',alignItems:'center',gap:4}}>🔥 {habit.streak}d</span>
                            <MiniHeatmap history={habit.history} />
                            {STREAK_MILESTONES.includes(habit.streak) && (
                              <span className="habit-badge" title="Milestone!">🏅 {habit.streak}d</span>
                            )}
                          </label>
                          <button onClick={()=>startEdit(habit)} style={{background:'#ececf1',color:'#232946',border:'none',borderRadius:8,padding:'7px 16px',fontWeight:700,cursor:'pointer',transition:'background 0.2s'}}>Edit</button>
                          <button onClick={()=>viewHistory(habit)} style={{fontSize:13,padding:'7px 16px',borderRadius:8,border:'none',background:'#ececf1',color:'#6366f1',fontWeight:700,cursor:'pointer',transition:'background 0.2s'}}>History</button>
                          <button onClick={()=>deleteHabit(habit.id)} style={{fontSize:13,padding:'7px 16px',borderRadius:8,border:'none',background:'#fff',color:'#d72660',fontWeight:700,cursor:'pointer',transition:'background 0.2s'}}>Delete</button>
                        </>
                      )}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <div style={{marginTop:32,background:'rgba(236,236,241,0.5)',borderRadius:12,padding:'18px 24px',boxShadow:'0 1px 4px rgba(60,72,100,0.04)',textAlign:'center'}}>
        <h3 style={{margin:'0 0 8px 0',color:'#6366f1',fontWeight:700,letterSpacing:1}}>Stats</h3>
        <div style={{fontWeight:600}}>Total Habits: <span style={{color:'#6366f1'}}>{habits.length}</span></div>
        <div style={{fontWeight:600}}>Longest Streak: <span style={{color:'#38bdf8'}}>{Math.max(...habits.map(h=>h.streak),0)}</span></div>
      </div>
      {selected && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.18)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:16,padding:36,minWidth:320,boxShadow:'0 4px 24px rgba(99,102,241,0.10)'}}>
            <h2 style={{marginBottom:12,color:'#6366f1',fontWeight:800}}>{selected.name} History</h2>
            <ul style={{fontSize:15,padding:0,listStyle:'none',marginBottom:12}}>
              {selected.history && selected.history.length > 0 ? selected.history.map((d,i)=>(<li key={i}>{d}</li>)) : <li>No history yet.</li>}
            </ul>
            <button onClick={closeHistory} style={{marginTop:16,padding:'10px 24px',borderRadius:8,border:'none',background:'linear-gradient(90deg,#6366f1 60%,#38bdf8 100%)',color:'#fff',fontWeight:700,cursor:'pointer'}}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitsPage;
