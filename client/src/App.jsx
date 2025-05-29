import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { TaskBank } from './TaskBank';

function App() {
  return <>
    <Router>
      <nav>
        <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/task-bank">Task Bank</NavLink>
        <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/schedule">Schedule</NavLink>
      </nav>
      <Routes>
        {/* Redirect from "/" to "/taskbank" */}
        <Route path="/" element={<Navigate to="/task-bank" replace />} />
        <Route path="/task-bank" element={<TaskBank />} />
        <Route path="/schedule" element={<div>
          <h1>About Page</h1>
          <p>This is the about page content.</p>
        </div>} />
      </Routes>
    </Router>
  </>
}

export default App;