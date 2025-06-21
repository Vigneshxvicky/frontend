import React, { useState } from 'react';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';

const fabStyle = {
  position: 'fixed',
  bottom: 36,
  right: 36,
  width: 64,
  height: 64,
  borderRadius: '50%',
  background: 'linear-gradient(135deg,#6366f1,#ff61a6)',
  color: '#fff',
  fontSize: 36,
  boxShadow: '0 4px 24px rgba(99,102,241,0.18)',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  zIndex: 1000,
  transition: 'background 0.2s, box-shadow 0.2s',
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(60,72,100,0.18)',
  zIndex: 2000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
const modalStyle = {
  background: 'rgba(255,255,255,0.98)',
  borderRadius: 18,
  boxShadow: '0 8px 32px rgba(99,102,241,0.12)',
  padding: '32px 32px 24px 32px',
  minWidth: 320,
  maxWidth: '90vw',
  minHeight: 0,
  position: 'relative',
};

const TodosPage = ({
  todos, addTodo, editTodo, deleteTodo, toggleCompletion,
  search, setSearch, sort, setSort, filter, setFilter, clearCompleted
}) => {
  const [showModal, setShowModal] = useState(false);
  // Maintain a persistent order of todo IDs
  const [order, setOrder] = useState(todos.map(t => t._id));
  React.useEffect(() => {
    // Add new todos to the end, remove missing ones
    setOrder(prev => {
      const currentIds = todos.map(t => t._id);
      return [
        ...prev.filter(id => currentIds.includes(id)),
        ...currentIds.filter(id => !prev.includes(id))
      ];
    });
  }, [todos]);
  // Render todos in the order of the order array
  const orderedTodos = order.map(id => todos.find(t => t._id === id)).filter(Boolean);
  const handleReorder = (newOrder) => setOrder(newOrder.map(t => t._id));

  return (
    <div style={{
      maxWidth: 900,
      margin: '40px auto',
      background: 'rgba(255,255,255,0.82)',
      borderRadius: 24,
      boxShadow: '0 8px 32px rgba(60,72,100,0.12)',
      padding: '38px 0 32px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      alignItems: 'stretch',
      border: '1.5px solid #ececf1',
      position: 'relative',
    }}>
      <h2 style={{textAlign:'center',fontWeight:800,marginBottom:18,color:'#232946',fontFamily:'Inter,Segoe UI,Arial,sans-serif',letterSpacing:0.5}}>My Todos</h2>
      <div style={{maxWidth:700,margin:'0 auto',width:'100%',marginBottom:24}}>
        <TodoList
          todos={orderedTodos}
          toggleCompletion={toggleCompletion}
          deleteTodo={deleteTodo}
          editTodo={editTodo}
          filter={filter}
          search={search}
          sort={sort}
          notionStyle={false}
          onReorder={handleReorder}
        />
        <button onClick={clearCompleted} style={{marginTop:24,background:'#ececf1',color:'#232946',border:'none',borderRadius:8,padding:'10px 0',fontWeight:700,cursor:'pointer',width:'100%',fontSize:'1rem',boxShadow:'0 1px 4px rgba(60,72,100,0.04)'}}>Clear Completed</button>
      </div>
      <button style={fabStyle} onClick={() => setShowModal(true)} title="Add Todo">+
      </button>
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h3 style={{textAlign:'center',fontWeight:800,marginBottom:18,color:'#6366f1'}}>Add New Todo</h3>
            <TodoForm addTodo={addTodo} onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TodosPage;
