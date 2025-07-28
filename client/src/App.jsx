import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";

import { TaskBank } from './TaskBank';
import { Schedule } from './Schedule';
import Sticker from "./components/Sticker"

import axios from "axios";
import { Settings } from "./Settings";

function App() {
  // const [goals, setGoals] = useState([{_id:1, color: "#515987ff",goalName: "Do all the tasks", taskBank: [{_id: 1, taskName: "Do the task", objective: "", goalId:1, checked: false, dueDate: 1753329900000}]}
  //   ,{_id:3, color: "#327d46ff",goalName: "Do all the tasks", taskBank: [{_id: 1, taskName: "Do the task", objective: "", goalId:1, checked: false, dueDate: 1753329900000},{_id: 66, taskName: "Do the task", objective: "", goalId:1, checked: false, dueDate: 1753329900000}]},
  //   {_id:4, color: "#c16666ff",goalName: "Do all the tasks", taskBank: [{_id: 2, taskName: "Do the task the professor said", objective: "", goalId:1, checked: false, dueDate: 1753329900000},{_id: 1, taskName: "Do the task", objective: "", goalId:1, checked: false, dueDate: 1753329900000}, {_id: 3, taskName: "Do the task", objective: "", goalId:1, checked: false, dueDate: 1753329900000}]}]);
  const [goals, setGoals] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [scheduleDay, setScheduleDay] = useState(Math.floor(Date.now()/86400000))
  {/* Redirect from "/" to "/taskbank" */}
  const routes = [
    {path: "/", element: <Navigate to="/dashboard" replace />, title: "Home"},
    {path: "/dashboard", element: <TaskBank goals={goals} setGoals={setGoals} reloadGoals={reloadGoals} schedule={schedule} reloadSchedule={reloadSchedule} />, title: "Dashboard"},
    {path: "/schedule", element: <Schedule schedule={schedule} setSchedule={setSchedule} reloadGoals={reloadGoals} goals={goals} reloadSchedule={reloadSchedule} scheduleDay={scheduleDay} setScheduleDay={setScheduleDay} />, title: "Schedule"},
    {path: "/settings", element: <Settings goals={goals} />, title: "Settings"}
  ]

  // element for title setting
  function TitleSetter({ routes }) {
    const location = useLocation();
    
    useEffect(() => {
      const matched = routes.find(r => r.path === location.pathname)
      if (matched?.title) {
        document.title = "Sparky | " + matched.title
      }
    }, [location.pathname])
    return null
  }

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
  async function reloadSchedule(day=Math.floor(Date.now()/86400000)) {
    // let ret = []
    await axios.get("/api/get-schedule/" + day).then((response) => {
      setSchedule(response.data);
      // ret = response.data;
    }).catch((error) => {
      console.error("Error:", error.response?.data || error.message);
    });

    // return ret;
  }
  // async function reloadSchedule(day=Math.floor(Date.now()/86400000)) {
  //   let ret = []
  //   try {
  //     const response = await axios.get("/api/get-schedule/" + day);
  //     setSchedule(response.data);
  //     console.log("response", response.data)
  //     ret = response.data;
  //   } catch (error) {
  //     console.error("Error:", error.response?.data || error.message);
  //   }
  //   return ret;
  // }

  // this just loads the goals and schedule when the app loads
  useEffect(() => {
    (async () => { // async has to be inside the effect (IIFE)
      const ret = await reloadGoals();
    })();
  }, []);
  useEffect(() => {
    (async () => { // async has to be inside the effect (IIFE)
      const ret = await reloadSchedule(scheduleDay);
    })();
    console.log("scheduleDay APP:",scheduleDay)
  }, [scheduleDay]);

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
      <TitleSetter routes={routes} />
      <nav>
        {/* navlinks */}
        {routes.map(route => {
          if (route.path == "/") return
          return <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} key={route.path} to={route.path}>{route.title}</ NavLink>
        })}
      </nav>
      <Routes>
        {/* actual routes */}
        {routes.map(route => {
          return <Route key={route.path} path={route.path} element={route.element}/>
        })}
      </Routes>
    </Router>
  </>
}

export default App;