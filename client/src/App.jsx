import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { TaskBank } from './TaskBank';
import Sticker from "./components/Sticker";

function App() {
  return <>
    <div id="stickers">
      {/* :3 audrey's stickers */}
      {/* <Sticker src="vaportrail.png" size="100px" left="30vw" top="5vh" />
      <Sticker src="hellokitty-strawberry.png" size="100px" left="10vw" top="75vh" />
      <Sticker src="cheetah-heart.png" size="145px" left="89vw" top="35vh" />
      <Sticker src="cherry-blossom.png" size="175px" left="90vw" top="-1.5vh" rotate="180deg" />
      <Sticker src="apple.png" size="100px" left="50vw" top="50vh" rotate="20deg" />
      <Sticker src="cross.png" size="200px" left="70vw" top="50vh" /> */}
    </div>
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
          <h1>Schedule Page</h1>
          <p>This is the schedule page.</p>
        </div>} />
      </Routes>
    </Router>
  </>
}

export default App;