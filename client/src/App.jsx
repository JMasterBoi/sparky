import { useEffect, useState } from "react";
import Input from "./components/Input";
import Goal from "./components/Goal";
import axios from "axios";

function App() {
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
      // add goal to db
      await axios.post("/api/create-goal", { goalName, goalDescription });
      // reload ui and set current goal
      reloadGoals();
      // clear input fields
      setGoalName("");
      setGoalDescription("");
      console.log("Goal created successfully:");
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
          <input id="input" type="text" placeholder="Goal Name" value={goalName} onChange={(event) => {setGoalName(event.target.value)}} />
          <input id="input" type="text" placeholder="Quick Goal Description" value={goalDescription} onChange={(event) => {setGoalDescription(event.target.value)}} />      
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

    <Input reloadGoals={reloadGoals} currentGoalId={currentGoalId} setCurrentGoalId={setCurrentGoalId} goals={goals} />
  </>
}

export default App;