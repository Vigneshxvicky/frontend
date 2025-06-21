import React, { useState } from 'react';
import '../components/comp_css/planner.css';
import '../components/comp_css/planner-modal.css';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getStartOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

const PlannerPage = ({ todos = [], addTodo, editTodo, deleteTodo, moveTodo }) => {
  const [weekStart, setWeekStart] = useState(getStartOfWeek());
  const [modalDay, setModalDay] = useState(null);
  const [modalValue, setModalValue] = useState('');

  // Group todos by day
  const days = Array(7).fill().map((_, i) => {
    const day = new Date(weekStart);
    day.setDate(day.getDate() + i);
    const dayStr = day.toISOString().slice(0, 10);
    return {
      date: day,
      todos: todos.filter(t => t.dueDate && t.dueDate.slice(0, 10) === dayStr)
    };
  });

  // Drag and drop handlers
  const [draggedTodo, setDraggedTodo] = useState(null);

  const onDragStart = (todo) => setDraggedTodo(todo);
  const onDrop = (dayIdx) => {
    if (draggedTodo) {
      const newDate = new Date(weekStart);
      newDate.setDate(newDate.getDate() + dayIdx);
      moveTodo && moveTodo(draggedTodo._id, newDate.toISOString().slice(0, 10));
      setDraggedTodo(null);
    }
  };

  const prevWeek = () => {
    const prev = new Date(weekStart);
    prev.setDate(prev.getDate() - 7);
    setWeekStart(prev);
  };
  const nextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + 7);
    setWeekStart(next);
  };

  return (
    <div className="planner-page">
      {/* Modal for adding a task */}
      {modalDay !== null && (
        <div className="planner-modal-bg" onClick={() => setModalDay(null)}>
          <div className="planner-modal" onClick={e => e.stopPropagation()}>
            <h2>Add Task</h2>
            <input
              type="text"
              autoFocus
              placeholder="Task title..."
              value={modalValue}
              onChange={e => setModalValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && modalValue.trim()) {
                  const dueDate = modalDay.date.toISOString().slice(0, 10);
                  addTodo && addTodo(modalValue.trim(), dueDate);
                  setModalDay(null);
                  setModalValue('');
                }
              }}
            />
            <div className="planner-modal-actions">
              <button
                onClick={() => {
                  if (modalValue.trim()) {
                    const dueDate = modalDay.date.toISOString().slice(0, 10);
                    addTodo && addTodo(modalValue.trim(), dueDate);
                    setModalDay(null);
                    setModalValue('');
                  }
                }}
                disabled={!modalValue.trim()}
              >Add</button>
              <button className="cancel" onClick={() => { setModalDay(null); setModalValue(''); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <div className="planner-header">
        <button onClick={prevWeek}>&lt;</button>
        <span>Week of {weekStart.toLocaleDateString()}</span>
        <button onClick={nextWeek}>&gt;</button>
      </div>
      <div className="planner-grid">
        {days.map((day, i) => (
          <div
            key={i}
            className="planner-day"
            onDragOver={e => e.preventDefault()}
            onDrop={() => onDrop(i)}
          >
            <div className="planner-day-header">{daysOfWeek[day.date.getDay()]}<br /><span className="planner-date">{day.date.toLocaleDateString()}</span></div>
            <ul className="planner-todo-list">
              {day.todos.map(todo => (
                <li
                  key={todo._id}
                  className="planner-todo"
                  draggable
                  onDragStart={() => onDragStart(todo)}
                >
                  <span>{todo.title}</span>
                  <button onClick={() => deleteTodo && deleteTodo(todo._id)} title="Delete">🗑️</button>
                </li>
              ))}
            </ul>
            <button className="planner-add-btn" onClick={() => { setModalDay(day); setModalValue(''); }}>+ Add Task</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlannerPage;
