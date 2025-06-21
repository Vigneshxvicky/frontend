import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function TodoForm({ addTodo }) {
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
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', marginBottom: '20px', gap: '10px' }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add new todo"
        style={{ flex: '1', padding: '10px', border: 'none'}}
      />
      <DatePicker
        selected={dueDate}
        onChange={date => setDueDate(date)}
        placeholderText="Due date"
        dateFormat="yyyy-MM-dd"
        className="date-picker"
      />
      <select value={priority} onChange={e => setPriority(e.target.value)} className={`priority-select priority-${priority.toLowerCase()}`}>
        <option value="Low">Low Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="High">High Priority</option>
      </select>
      <button type="submit" style={{ padding: '10px' }}>Add</button>
    </form>
  );
}

export default TodoForm;