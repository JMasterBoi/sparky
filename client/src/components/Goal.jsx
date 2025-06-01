import { useEffect, useState } from "react";
import Task from "./Task";


function Goal({ taskBank, reloadGoals, goalName, currentGoalId, _id}) {

    return <section className="goal" id={String(currentGoalId==_id && "current-goal")} onMouseDown={() => {localStorage.setItem("currentGoalId", _id); reloadGoals() }}>
        <p className="header">{goalName}</p>
        <ul onMouseDown={(e) => {e.stopPropagation()}} className="task-list">
            {/* list of tasks */}
            {taskBank && taskBank.map((task) => {
                return <Task {...task} key={task._id} goalId={_id} reloadGoals={reloadGoals} />
            })}
        </ul>
        {/* placeholder */}
        {taskBank?.length === 0 && <p className="no-tasks">All done!</p>}
    </section>
}

export default Goal;