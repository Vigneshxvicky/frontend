import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function TodoForm({ addTodo, onClose }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [priority, setPriority] = useState('Low');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    addTodo(title, dueDate, priority);
    setTitle('');
    setDueDate(null);
    setPriority('Low');
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', padding: '18px 0' }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add new todo"
        style={{ padding: '12px', border: '1.5px solid #ececf1', borderRadius: 10, fontSize: '1.1rem', background: 'rgba(255,255,255,0.85)', boxShadow: '0 1px 4px rgba(60,72,100,0.04)' }}
      />
      <DatePicker
        selected={dueDate}
        onChange={date => setDueDate(date)}
        placeholderText="Due date"
        dateFormat="yyyy-MM-dd"
        className="date-picker"
        style={{ padding: '12px', borderRadius: 10, border: '1.5px solid #ececf1', background: 'rgba(255,255,255,0.85)' }}
      />
      <select value={priority} onChange={e => setPriority(e.target.value)} className={`priority-select priority-${priority.toLowerCase()}`}
        style={{ padding: '12px', borderRadius: 10, border: '1.5px solid #ececf1', background: 'rgba(255,255,255,0.85)', fontSize: '1.05rem' }}>
        <option value="Low">Low Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="High">High Priority</option>
      </select>
      <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
        {onClose && <button type="button" onClick={onClose} style={{background:'#fff',color:'#6366f1',border:'1.5px solid #ececf1',borderRadius:8,padding:'10px 22px',fontWeight:700,cursor:'pointer'}}>Cancel</button>}
        <button type="submit" style={{ background: 'linear-gradient(90deg,#6366f1,#38bdf8)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(99,102,241,0.08)' }}>Add</button>
      </div>
    </form>
  );
}

export default TodoForm;