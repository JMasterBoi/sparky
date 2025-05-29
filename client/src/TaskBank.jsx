import { useEffect, useState } from "react";
import axios from "axios";
import Input from "./components/Input";
import Goal from "./components/Goal";
import CreateGoal from "./components/CreateGoal";
import { errorToast, successToast } from "./components/AlertService";

export function TaskBank() {
  const [goals, setGoals] = useState([]);
  const [currentGoalId, setCurrentGoalId] = useState(null);

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


  //! CREATE GOAL LOGIC
  const [goalName, setGoalName] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  async function createGoal(e) {
    e.preventDefault();
    try {
      if (!goalName) {
        errorToast("Goal name is required.");
        return;
      }

      // add goal to db
      const response = await axios.post("/api/create-goal", { goalName, goalDescription });
      // clear input fields
      setGoalName("");
      setGoalDescription("");
      successToast("First goal created successfully!");
      setCurrentGoalId(response.data._id); // set the current goal to the newly created goal
      console.log("Goal created:", response.data);
      localStorage.setItem("currentGoalId", response.data._id); // store the current goal id in local storage
      // reload ui and set current goal
      reloadGoals();
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  }
  //! CREATE GOAL LOGIC

  // runs when the app loads
  useEffect(() => {
    (async () => { // async has to be inside the effect (IIFE)
      const ret = await reloadGoals();
    })();
  }, [])
  // runs when goals change
  useEffect(() => {
    // check if there are goals in local storage, if not set the first goal as current
    setCurrentGoalId(localStorage.getItem("currentGoalId")??goals[0]?._id);
  }, [goals]);

  return <>
    {/* goal creator */}
    {goals.length===0 && 
      <div className="create-goal">
        <form onSubmit={createGoal}>
          <h2>No goals created</h2>
          <p>It seems you don't have any goals yet. Let's create one!</p>
          {/*id="input"*/} <input type="text" id="initial-input" autoComplete="off" placeholder="Goal Name" value={goalName} onChange={(event) => {setGoalName(event.target.value)}} />
          {/*id="input"*/} <textarea type="text" rows={3} id="initial-input" autoComplete="off" placeholder="Goal Description" value={goalDescription} onChange={(event) => {setGoalDescription(event.target.value)}} style={{margin: "10px 0"}} />      
          <br />
          <button onClick={createGoal} >Create</button>
        </form>
      </div>
    }

    {/* iterates over each goal */}
    {goals.length !== 0 && <section id="goal-container">
      {goals.map((goal) => {
        return <Goal {...goal} key={goal._id} reloadGoals={reloadGoals} currentGoalId={currentGoalId} />
      })}
    </section>}

    {goals.length!==0 && <CreateGoal reloadGoals={reloadGoals} />}

    <Input reloadGoals={reloadGoals} currentGoalId={currentGoalId} setCurrentGoalId={setCurrentGoalId} goals={goals} />
  </>
}
