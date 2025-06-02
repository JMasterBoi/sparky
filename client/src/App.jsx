import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { useEffect, useState } from "react";

import { TaskBank } from './TaskBank';
import { Schedule } from './Schedule';
import Sticker from "./components/Sticker"

import axios from "axios";;

function App() {
  const [goals, setGoals] = useState([]);

  // gets the goals from the server and sets them in state
  async function reloadGoals() {
    let ret = []
    try {
      const response = await axios.get("/api/get-goals");
      setGoals(response.data);
      ret = response.data;
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
    return ret;
  }

  // runs when the app loads
  useEffect(() => {
    (async () => { // async has to be inside the effect (IIFE)
      const ret = await reloadGoals();
    })();
  }, [])

  return <>
    {/* :3 audrey's stickers */}
    {/* <div id="stickers">
      <Sticker src="vaportrail.png" size="100px" left="30vw" top="5vh" />
      <Sticker src="hellokitty-strawberry.png" size="100px" left="10vw" top="75vh" />
      <Sticker src="cheetah-heart.png" size="145px" left="89vw" top="35vh" />
      <Sticker src="cherry-blossom.png" size="175px" left="90vw" top="-1.5vh" rotate="180deg" />
      <Sticker src="apple.png" size="100px" left="50vw" top="50vh" rotate="20deg" />
      <Sticker src="cross.png" size="200px" left="70vw" top="50vh" />
    </div> */}
    <Router>
      <nav>
        <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/task-bank">Task Bank</NavLink>
        <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/schedule">Schedule</NavLink>
      </nav>
      <Routes>
        {/* Redirect from "/" to "/taskbank" */}
        <Route path="/" element={<Navigate to="/task-bank" replace />} />
        <Route path="/task-bank" element={<TaskBank goals={goals} setGoals={setGoals} reloadGoals={reloadGoals} />} />
        <Route path="/schedule" element={<Schedule goals={goals} reloadGoals={reloadGoals} />} />
      </Routes>
    </Router>
  </>
}

export default App;