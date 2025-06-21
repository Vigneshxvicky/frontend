import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import api from './services/api';
import './App.css';
import FireworkBg from './components/FireworkBg';
// import Walkthrough from './components/Walkthrough';
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
import Footer from './components/Footer';
import PlannerPage from './pages/PlannerPage';

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
            {/* Feature Section - outside Dashboard */}
            <div className="feature-section">
              {/* Todos Feature - image left, text right */}
              <div className="feature-row feature-todos">
                <div className="feature-img-col">
                  <img src={todosHero} alt="Todos" className="feature-img todos-img" />
                </div>
                <div className="feature-content">
                  <div className="feature-title todos-title">Todos</div>
                  <div className="feature-desc">
                    Organize your tasks with Notion-style cards, color tags, drag-and-drop, and a beautiful, simple interface.
                  </div>
                </div>
              </div>
              {/* Habits Feature - image right, text left */}
              <div className="feature-row reverse feature-habits">
                <div className="feature-content">
                  <div className="feature-title habits-title">Habits</div>
                  <div className="feature-desc">
                    Build and track habits with streaks, emoji icons, mini-heatmap, and confetti celebrations for your progress.
                  </div>
                </div>
                <div className="feature-img-col">
                  <img src={habitsHero} alt="Habits" className="feature-img habits-img" />
                </div>
              </div>
              {/* Calendar Feature - image left, text right */}
              <div className="feature-row feature-calendar">
                <div className="feature-img-col">
                  <img src={calendarHero} alt="Calendar" className="feature-img calendar-img" />
                </div>
                <div className="feature-content">
                  <div className="feature-title calendar-title">Calendar</div>
                  <div className="feature-desc">
                    Plan your days with a modern calendar, reminders, mini-heatmap, and all your tasks and habits in one view.
                  </div>
                </div>
              </div>
            </div>
            <Footer />
            {/* Dashboard and feature sections below */}
            <ScrollRevealSection>
                {/* <Dashboard
                  aiSuggestion={aiSuggestion}
                  quote={quote}
                  points={points}
                  level={level}
                /> */}
            </ScrollRevealSection>
            {/* <ScrollRevealSection><TodosPage
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
            /></ScrollRevealSection> */}
            {/* <ScrollRevealSection><HabitsPage habits={null} onHabitCheck={() => alert('Habit tracking coming soon!')} /></ScrollRevealSection> */}
            {/* <ScrollRevealSection><CalendarPage todos={todos} habits={(() => { try { return JSON.parse(localStorage.getItem('habits')) || []; } catch { return []; } })()} /></ScrollRevealSection> */}
          </>
        } />
        <Route path="/dashboard" element={
          <>
            <Dashboard
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
            />
            <Footer />
          </>
        } />
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
        <Route
          path="/planner"
          element={
            <PlannerPage
              todos={todos}
              addTodo={addTodo}
              editTodo={editTodo}
              deleteTodo={deleteTodo}
              moveTodo={
                (id, dueDate) => {
                  // You may need to implement this logic if not present
                  const todo = todos.find(t => t._id === id);
                  if (!todo) return;
                  editTodo(id, todo.title, dueDate, todo.priority);
                }
              }
            />
          }
        />
      </Routes>
      <ScrollProgressBar />
      {/* <ScrollFloatingOrb /> */}
    </BrowserRouter>
  );
}

export default App;