import React, { useState } from 'react';
import '../components/comp_css/planner.css';

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
            <button className="planner-add-btn" onClick={() => {
              const title = prompt('New task:');
              if (title && addTodo) {
                const dueDate = day.date.toISOString().slice(0, 10);
                addTodo(title, dueDate);
              }
            }}>+ Add Task</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlannerPage;
