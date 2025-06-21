import React from 'react';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';

const TodosPage = ({
  todos, addTodo, editTodo, deleteTodo, toggleCompletion,
  search, setSearch, sort, setSort, filter, setFilter, clearCompleted
}) => (
  <div style={{
    maxWidth: 700,
    margin: '40px auto',
    background: '#f7f7f8',
    borderRadius: 12,
    boxShadow: '0 2px 16px rgba(60,72,100,0.08)',
    padding: '32px 0 24px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    alignItems: 'stretch',
    border: '1.5px solid #ececf1',
  }}>
    <h2 style={{textAlign:'center',fontWeight:800,marginBottom:18,color:'#232946',fontFamily:'Inter,Segoe UI,Arial,sans-serif',letterSpacing:0.5}}>My Todos</h2>
    <div style={{maxWidth:520,margin:'0 auto',width:'100%'}}>
      <TodoForm addTodo={addTodo} />
    </div>
    <div style={{maxWidth:520,margin:'0 auto',width:'100%',marginTop:24}}>
      <TodoList
        todos={todos}
        toggleCompletion={toggleCompletion}
        deleteTodo={deleteTodo}
        editTodo={editTodo}
        filter={filter}
        search={search}
        sort={sort}
        notionStyle
      />
      <button onClick={clearCompleted} style={{marginTop:24,background:'#ececf1',color:'#232946',border:'none',borderRadius:8,padding:'10px 0',fontWeight:700,cursor:'pointer',width:'100%',fontSize:'1rem',boxShadow:'0 1px 4px rgba(60,72,100,0.04)'}}>Clear Completed</button>
    </div>
  </div>
);

export default TodosPage;
