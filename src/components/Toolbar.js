import React from 'react';

const Toolbar = ({
  search, setSearch, sort, setSort, filter, setFilter, clearCompleted
}) => (
  <div className="toolbar">
    <input
      className="search-bar"
      type="text"
      placeholder="Search todos..."
      value={search}
      onChange={e => setSearch(e.target.value)}
    />
    <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
      <option value="createdAt">Sort by Created</option>
      <option value="dueDate">Sort by Due Date</option>
      <option value="priority">Sort by Priority</option>
    </select>
    <button className={`filter-btn${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>All</button>
    <button className={`filter-btn${filter === 'completed' ? ' active' : ''}`} onClick={() => setFilter('completed')}>Completed</button>
    <button className={`filter-btn${filter === 'incomplete' ? ' active' : ''}`} onClick={() => setFilter('incomplete')}>Incomplete</button>
    <button className="clear-btn" onClick={clearCompleted}>Clear Completed</button>
  </div>
);

export default Toolbar;
