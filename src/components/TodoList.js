import React, { useState } from 'react';

function TodoList({ todos, toggleCompletion, deleteTodo, editTodo, filter, search, sort, notionStyle }) {
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDueDate, setEditDueDate] = useState(null);
  const [editPriority, setEditPriority] = useState('Low');

  let filtered = todos
    .filter(todo => {
      if (filter === 'all') return true;
      if (filter === 'completed') return todo.completed;
      if (filter === 'incomplete') return !todo.completed;
      return true;
    })
    .filter(todo => todo.title.toLowerCase().includes(search.toLowerCase()));

  if (sort === 'dueDate') {
    filtered = filtered.sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0));
  } else if (sort === 'priority') {
    const order = { High: 0, Medium: 1, Low: 2 };
    filtered = filtered.sort((a, b) => order[a.priority] - order[b.priority]);
  } else if (sort === 'createdAt') {
    filtered = filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
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

  return (
    <ul className={notionStyle ? 'todo-list notion-todo-list' : 'todo-list'} style={notionStyle ? {
      background:'#fff',
      borderRadius:12,
      boxShadow:'0 1px 4px rgba(60,72,100,0.04)',
      padding:'8px 0',
      margin:0,
      border:'1px solid #ececf1',
      width:'100%',
      minWidth:0,
      maxWidth:'100%',
      wordBreak:'break-word',
    } : {}}>
      {filtered.map(todo => (
        <li key={todo._id} className={notionStyle ? `notion-todo-item${todo.completed ? ' completed' : ''}` : `todo-item priority-${(todo.priority || 'Low').toLowerCase()}`}
          style={notionStyle ? {
            display:'flex',alignItems:'center',gap:12,padding:'0.7em 1em',borderBottom:'1px solid #f0f0f0',background:'none',boxShadow:'none',borderRadius:0,minHeight:0,width:'100%',minWidth:0,maxWidth:'100%',wordBreak:'break-word',flexWrap:'wrap'
          } : {}}>
          {editId === todo._id ? (
            <form onSubmit={e => handleEdit(e, todo._id)} className="edit-form" style={notionStyle ? {display:'flex',gap:8,alignItems:'center',width:'100%',flexWrap:'wrap'} : {}}>
              <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="todo-input" style={notionStyle ? {flex:1,padding:'8px',fontSize:'1rem',minWidth:0,maxWidth:'100%'} : {}} />
              <input type="date" value={editDueDate ? editDueDate.toISOString().slice(0,10) : ''} onChange={e => setEditDueDate(new Date(e.target.value))} style={notionStyle ? {padding:'8px',minWidth:0,maxWidth:'100%'} : {}} />
              <select value={editPriority} onChange={e => setEditPriority(e.target.value)} style={notionStyle ? {padding:'8px',minWidth:0,maxWidth:'100%'} : {}}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <button type="submit" style={notionStyle ? {background:'#ececf1',color:'#232946',border:'none',borderRadius:6,padding:'8px 12px',fontWeight:700,cursor:'pointer',minWidth:0,maxWidth:'100%'} : {}}>Save</button>
              <button type="button" onClick={() => setEditId(null)} style={notionStyle ? {background:'#fff',color:'#d72660',border:'none',borderRadius:6,padding:'8px 12px',fontWeight:700,cursor:'pointer',minWidth:0,maxWidth:'100%'} : {}}>Cancel</button>
            </form>
          ) : (
            <>
              <input type="checkbox" checked={todo.completed} onChange={() => toggleCompletion(todo._id)} style={notionStyle ? {width:22,height:22,accentColor:'#6366f1',marginRight:10,flexShrink:0} : {}} />
              <span onClick={() => toggleCompletion(todo._id)} style={notionStyle ? {
                flex:1,
                fontSize:'1.08rem',
                color:todo.completed ? '#b6b6b6' : '#232946',
                textDecoration:todo.completed ? 'line-through' : 'none',
                fontWeight:todo.completed ? 400 : 600,
                cursor:'pointer',
                letterSpacing:0.1,
                minWidth:0,
                maxWidth:'100%',
                wordBreak:'break-word',
                overflowWrap:'break-word',
              } : {}}>{todo.title}</span>
              {todo.dueDate && <span style={notionStyle ? {fontSize:'0.98rem',color:'#888',marginLeft:8,whiteSpace:'nowrap'} : {}}>{new Date(todo.dueDate).toLocaleDateString()}</span>}
              {todo.priority && <span style={notionStyle ? {fontSize:'0.98rem',color:'#6366f1',marginLeft:8,whiteSpace:'nowrap'} : {}}>{todo.priority}</span>}
              <button onClick={() => startEdit(todo)} style={notionStyle ? {background:'#ececf1',color:'#232946',border:'none',borderRadius:6,padding:'6px 10px',fontWeight:700,cursor:'pointer',marginLeft:8,whiteSpace:'nowrap'} : {}} className="edit-btn">Edit</button>
              <button onClick={() => deleteTodo(todo._id)} style={notionStyle ? {background:'#fff',color:'#d72660',border:'none',borderRadius:6,padding:'6px 10px',fontWeight:700,cursor:'pointer',marginLeft:4,whiteSpace:'nowrap'} : {}} className="delete-btn">Delete</button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

export default TodoList;