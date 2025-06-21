import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import api from './services/api';
import './App.css';
import FireworkBg from './components/FireworkBg';
import Walkthrough from './components/Walkthrough';
import Dashboard from './components/Dashboard';
import MainNavbar from './components/MainNavbar';
import Hero from './components/Hero';
import TodosPage from './pages/TodosPage';
import HabitsPage from './pages/HabitsPage';
import CalendarPage from './pages/CalendarPage';
import ScrollRevealSection from './components/ScrollRevealSection';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ScrollProgressBar from './components/ScrollProgressBar';
import todosHero from './assets/todos-hero.png';
import habitsHero from './assets/habits-hero.png';
import calendarHero from './assets/calendar-hero.png';

const SUGGESTIONS = [
  'Drink a glass of water',
  'Take a 5-minute walk',
  'Call a friend',
  'Read a page of a book',
  'Write down one thing you’re grateful for',
  'Stretch your body',
  'Plan tomorrow’s top task',
  'Clean your workspace',
  'Smile at yourself in the mirror',
  'Organize your notes',
];
const QUOTES = [
  'The secret of getting ahead is getting started.',
  'You don’t have to be great to start, but you have to start to be great.',
  'Small deeds done are better than great deeds planned.',
  'Success is the sum of small efforts, repeated day in and day out.',
  'Don’t watch the clock; do what it does. Keep going.',
  'The best way to get something done is to begin.',
  'Dream big. Start small. Act now.',
  'Your future is created by what you do today, not tomorrow.',
  'It always seems impossible until it’s done.',
  'Push yourself, because no one else is going to do it for you.'
];
const MASCOT_TIPS = [
  'Tip: Use the voice button to add tasks hands-free!',
  'Tip: Try the mood tracker to see your trends.',
  'Tip: Use the calendar to plan ahead.',
  'Tip: Share your list with a friend!',
  'Tip: Complete tasks to earn points and level up!'
];

const HERO_TITLE = "Welcome to Life Hub";
const HERO_DESC = "All-in-one productivity: Notion-style todos, Google Calendar, and more. Organize your life, your way.";

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [walkStep, setWalkStep] = useState(0);
  const [showWalk, setShowWalk] = useState(() => {
    return localStorage.getItem('hasSeenWalk') !== 'true';
  });
  const [points, setPoints] = useState(() => Number(localStorage.getItem('points') || 0));
  const [level, setLevel] = useState(() => Number(localStorage.getItem('level') || 1));
  const [moodStats, setMoodStats] = useState(() => {
    const stored = localStorage.getItem('moodStats');
    return stored ? JSON.parse(stored) : {};
  });
  const [currentTheme, setCurrentTheme] = useState('default');
  const [mascotMessage, setMascotMessage] = useState(MASCOT_TIPS[Math.floor(Math.random()*MASCOT_TIPS.length)]);
  const [aiSuggestion, setAiSuggestion] = useState(SUGGESTIONS[Math.floor(Math.random()*SUGGESTIONS.length)]);
  const [quote, setQuote] = useState(QUOTES[Math.floor(Math.random()*QUOTES.length)]);

  // Fetch all todos from the backend
  const fetchTodos = async () => {
    try {
      const response = await api.get('/todos');
      setTodos(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTodos();
    AOS.init({ duration: 900, once: true, offset: 80 });
  }, []);

  // Add todo with mood
  const addTodo = async (title, dueDate, priority, mood) => {
    try {
      const response = await api.post('/todos', { title, dueDate, priority, mood });
      setTodos([...todos, response.data]);
      if (showWalk && walkStep === 2) setWalkStep(3);
      // Award points
      setPoints(p => {
        const newPoints = p + 10;
        localStorage.setItem('points', newPoints);
        if (newPoints >= level * 100) {
          setLevel(l => {
            localStorage.setItem('level', l+1);
            return l+1;
          });
        }
        return newPoints;
      });
      // Mood stats
      if (mood) {
        setMoodStats(stats => {
          const newStats = { ...stats, [mood]: (stats[mood]||0)+1 };
          localStorage.setItem('moodStats', JSON.stringify(newStats));
          return newStats;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Edit a todo
  const editTodo = async (id, title, dueDate, priority) => {
    try {
      const response = await api.put(`/todos/${id}`, { title, dueDate, priority });
      setTodos(todos.map(todo => todo._id === id ? response.data : todo));
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle the completion status of a todo
  const toggleCompletion = async (id) => {
    try {
      const todo = todos.find(todo => todo._id === id);
      if (!todo) return;
      const response = await api.put(`/todos/${id}`, {
        completed: !todo.completed
      });
      setTodos(todos.map(todo => todo._id === id ? response.data : todo));
    } catch (err) {
      console.error(err);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Clear completed todos
  const clearCompleted = async () => {
    const completedIds = todos.filter(t => t.completed).map(t => t._id);
    await Promise.all(completedIds.map(id => api.delete(`/todos/${id}`)));
    setTodos(todos.filter(t => !t.completed));
  };

  // Voice input
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Sorry, your browser does not support speech recognition.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      addTodo(transcript);
    };
    recognition.start();
  };

  // Theme picker
  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    document.body.className = '';
    if (theme === 'pink') document.body.classList.add('theme-pink');
    if (theme === 'blue') document.body.classList.add('theme-blue');
    if (theme === 'dark') document.body.classList.add('dark-mode');
  };

  const handleNextWalk = () => setWalkStep(walkStep + 1);
  const handleCloseWalk = () => {
    setShowWalk(false);
    localStorage.setItem('hasSeenWalk', 'true');
  };

  return (
    <BrowserRouter>
      <MainNavbar />
      <FireworkBg />
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <ScrollRevealSection>
              <Dashboard
                aiSuggestion={aiSuggestion}
                quote={quote}
                points={points}
                level={level}
              >
                <div style={{textAlign:'center',margin:'48px 0'}}>
                  <h1 style={{fontSize:'2.8rem',fontWeight:900,letterSpacing:1.5,color:'#6366f1',marginBottom:18}}>Life Hub</h1>
                  <p style={{fontSize:'1.35rem',color:'#232946',maxWidth:600,margin:'0 auto 32px auto',fontWeight:500}}>
                    All-in-one productivity: Notion-style Todos, Google Calendar, and more. Organize your life, your way.
                  </p>
                  <div style={{display:'flex',justifyContent:'center',gap:40,flexWrap:'wrap'}}>
                    <div style={{textAlign:'center'}}>
                      <img src={todosHero} alt="Todos" style={{width:120,borderRadius:16,boxShadow:'0 2px 12px rgba(99,102,241,0.10)'}} />
                      <div style={{fontWeight:700,fontSize:'1.1rem',marginTop:10}}>Todos</div>
                    </div>
                    <div style={{textAlign:'center'}}>
                      <img src={habitsHero} alt="Habits" style={{width:120,borderRadius:16,boxShadow:'0 2px 12px rgba(99,102,241,0.10)'}} />
                      <div style={{fontWeight:700,fontSize:'1.1rem',marginTop:10}}>Habits</div>
                    </div>
                    <div style={{textAlign:'center'}}>
                      <img src={calendarHero} alt="Calendar" style={{width:120,borderRadius:16,boxShadow:'0 2px 12px rgba(99,102,241,0.10)'}} />
                      <div style={{fontWeight:700,fontSize:'1.1rem',marginTop:10}}>Calendar</div>
                    </div>
                  </div>
                </div>  
              </Dashboard>
            </ScrollRevealSection>
            <ScrollRevealSection><TodosPage
              todos={todos}
              addTodo={addTodo}
              editTodo={editTodo}
              deleteTodo={deleteTodo}
              toggleCompletion={toggleCompletion}
              search={search}
              setSearch={setSearch}
              sort={sort}
              setSort={setSort}
              filter={filter}
              setFilter={setFilter}
              clearCompleted={clearCompleted}
            /></ScrollRevealSection>
            <ScrollRevealSection><HabitsPage habits={null} onHabitCheck={() => alert('Habit tracking coming soon!')} /></ScrollRevealSection>
            <ScrollRevealSection><CalendarPage todos={todos} habits={(() => { try { return JSON.parse(localStorage.getItem('habits')) || []; } catch { return []; } })()} /></ScrollRevealSection>
          </>
        } />
        <Route path="/dashboard" element={<Dashboard
          onThemeChange={handleThemeChange}
          currentTheme={currentTheme}
          mascotMessage={mascotMessage}
          leaderboard={null}
          aiSuggestion={aiSuggestion}
          quote={quote}
          onAddSuggestion={() => addTodo(aiSuggestion)}
          onVoiceInput={handleVoiceInput}
          onMoodSelect={mood => setMascotMessage(`You feel ${mood}!`)}
          moodStats={moodStats && typeof moodStats === 'object' ? Object.entries(moodStats).map(([m, v]) => `${m}: ${v}`).join(', ') : ''}
          calendarTasks={null}
          onReminderSet={() => alert('Reminders coming soon!')}
          onShare={() => alert('Sharing coming soon!')}
          habits={null}
          onHabitCheck={() => alert('Habit tracking coming soon!')}
          points={points}
          level={level}
        />} />
        <Route path="/todos" element={<TodosPage
          todos={todos}
          addTodo={addTodo}
          editTodo={editTodo}
          deleteTodo={deleteTodo}
          toggleCompletion={toggleCompletion}
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          filter={filter}
          setFilter={setFilter}
          clearCompleted={clearCompleted}
        />} />
        <Route path="/habits" element={<HabitsPage habits={null} onHabitCheck={() => alert('Habit tracking coming soon!')} />} />
        <Route path="/calendar" element={<CalendarPage todos={todos} habits={(() => { try { return JSON.parse(localStorage.getItem('habits')) || []; } catch { return []; } })()} />} />
        <Route path="/gamify" element={null} />
        <Route path="/settings" element={null} />
      </Routes>
      <ScrollProgressBar />
      {/* <ScrollFloatingOrb /> */}
    </BrowserRouter>
  );
}

export default App;