import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

function getPriorityColor(priority) {
  switch ((priority || '').toLowerCase()) {
    case 'high': return '#ff6f91';
    case 'medium': return '#ffd166';
    default: return '#38bdf8';
  }
}

function TodoList({ todos, toggleCompletion, deleteTodo, editTodo, filter, search, sort, notionStyle, onReorder }) {
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDueDate, setEditDueDate] = useState(null);
  const [editPriority, setEditPriority] = useState('Low');

  // Only allow drag-and-drop if no sort/filter/search is active
  const isDraggable = filter === 'all' && sort === 'createdAt' && (!search || search.trim() === '');
  let displayTodos = todos;
  if (!isDraggable) {
    displayTodos = todos
      .filter(todo => {
        if (filter === 'all') return true;
        if (filter === 'completed') return todo.completed;
        if (filter === 'incomplete') return !todo.completed;
        return true;
      })
      .filter(todo => todo.title.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'dueDate') {
      displayTodos = displayTodos.slice().sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0));
    } else if (sort === 'priority') {
      const order = { High: 0, Medium: 1, Low: 2 };
      displayTodos = displayTodos.slice().sort((a, b) => order[a.priority] - order[b.priority]);
    } else if (sort === 'createdAt') {
      displayTodos = displayTodos.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
  }

  const startEdit = (todo) => {
    setEditId(todo._id);
    setEditTitle(todo.title);
    setEditDueDate(todo.dueDate ? new Date(todo.dueDate) : null);
    setEditPriority(todo.priority || 'Low');
  };

  const handleEdit = (e, id) => {
    e.preventDefault();
    editTodo(id, editTitle, editDueDate, editPriority);
    setEditId(null);
  };

  function handleDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(todos);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    if (onReorder) onReorder(items);
  }

  return (
    <DragDropContext onDragEnd={isDraggable ? handleDragEnd : undefined}>
      <Droppable droppableId="todo-list-droppable" isDropDisabled={!isDraggable}>
        {(provided) => (
          <div
            className="todo-cards-grid"
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
              padding: '0.5rem 0',
              width: '100%',
              minHeight: 120,
              position: 'relative',
              opacity: isDraggable ? 1 : 0.7,
              pointerEvents: isDraggable ? 'auto' : 'none',
            }}
          >
            {displayTodos.length === 0 && (
              <div style={{gridColumn:'1/-1',textAlign:'center',color:'#aaa',padding:'2.5em 0',fontSize:'1.15rem',background:'rgba(255,255,255,0.7)',borderRadius:16,boxShadow:'0 2px 12px rgba(60,72,100,0.06)'}}>No todos found.</div>
            )}
            {displayTodos.map((todo, idx) => (
              <Draggable key={todo._id} draggableId={todo._id} index={idx} isDragDisabled={!isDraggable}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`todo-card${todo.completed ? ' completed' : ''}`}
                    style={{
                      background: 'rgba(255,255,255,0.85)',
                      borderRadius: 16,
                      boxShadow: todo.completed ? '0 2px 12px rgba(60,72,100,0.04)' : '0 4px 24px rgba(99,102,241,0.08)',
                      border: `2.5px solid ${getPriorityColor(todo.priority)}`,
                      padding: '1.2em 1.1em 1.1em 1.1em',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                      position: 'relative',
                      minHeight: 120,
                      transition: 'box-shadow 0.25s, border 0.25s, background 0.25s',
                      opacity: todo.completed ? 0.7 : 1,
                      ...provided.draggableProps.style,
                      zIndex: snapshot.isDragging ? 100 : 'auto',
                    }}
                  >
                    {editId === todo._id ? (
                      <form onSubmit={e => handleEdit(e, todo._id)} className="edit-form" style={{display:'flex',flexDirection:'column',gap:10}}>
                        <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="todo-input" style={{padding:'10px',fontSize:'1rem',border:'1px solid #ececf1',borderRadius:8,background:'#f7f7f8'}} />
                        <input type="date" value={editDueDate ? editDueDate.toISOString().slice(0,10) : ''} onChange={e => setEditDueDate(new Date(e.target.value))} style={{padding:'10px',border:'1px solid #ececf1',borderRadius:8,background:'#f7f7f8'}} />
                        <select value={editPriority} onChange={e => setEditPriority(e.target.value)} style={{padding:'10px',border:'1px solid #ececf1',borderRadius:8,background:'#f7f7f8'}}>
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                        <div style={{display:'flex',gap:8,marginTop:4}}>
                          <button type="submit" style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:8,padding:'8px 18px',fontWeight:700,cursor:'pointer',transition:'background 0.2s'}}>Save</button>
                          <button type="button" onClick={() => setEditId(null)} style={{background:'#fff',color:'#d72660',border:'1px solid #ececf1',borderRadius:8,padding:'8px 18px',fontWeight:700,cursor:'pointer',transition:'background 0.2s'}}>Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div style={{display:'flex',alignItems:'center',gap:10}}>
                          <input type="checkbox" checked={todo.completed} onChange={() => toggleCompletion(todo._id)} style={{width:24,height:24,accentColor:'#6366f1',marginRight:2,flexShrink:0,transition:'accent-color 0.2s',boxShadow:'0 0 0 2px #ececf1'}} />
                          <span onClick={() => toggleCompletion(todo._id)} style={{
                            flex:1,
                            fontSize:'1.13rem',
                            color:todo.completed ? '#b6b6b6' : '#232946',
                            textDecoration:todo.completed ? 'line-through' : 'none',
                            fontWeight:todo.completed ? 400 : 700,
                            cursor:'pointer',
                            letterSpacing:0.1,
                            minWidth:0,
                            maxWidth:'100%',
                            wordBreak:'break-word',
                            overflowWrap:'break-word',
                            transition:'color 0.2s',
                          }}>{todo.title}</span>
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:10,marginTop:2}}>
                          {todo.dueDate && <span style={{fontSize:'0.98rem',color:'#888',whiteSpace:'nowrap',transition:'color 0.2s'}}>Due: {new Date(todo.dueDate).toLocaleDateString()}</span>}
                          {todo.priority && <span style={{fontSize:'0.98rem',color:'#fff',background:getPriorityColor(todo.priority),borderRadius:6,padding:'2px 10px',fontWeight:600,letterSpacing:0.5,whiteSpace:'nowrap',boxShadow:'0 1px 4px rgba(60,72,100,0.08)'}}> {todo.priority} </span>}
                        </div>
                        <div style={{display:'flex',gap:8,marginTop:8}}>
                          <button onClick={() => startEdit(todo)} style={{background:'#ececf1',color:'#232946',border:'none',borderRadius:8,padding:'7px 16px',fontWeight:700,cursor:'pointer',transition:'background 0.2s'}}>Edit</button>
                          <button onClick={() => deleteTodo(todo._id)} style={{background:'#fff',color:'#d72660',border:'1px solid #ececf1',borderRadius:8,padding:'7px 16px',fontWeight:700,cursor:'pointer',transition:'background 0.2s'}}>Delete</button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default TodoList;