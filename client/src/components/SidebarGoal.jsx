import { SidebarTask } from "./SidebarTask";
import { Indicator } from "./Indicator";

export function SidebarGoal({ goal, reloadSchedule, schedule, reloadGoals, scheduleDay }) {
    return <div key={goal._id} className="sidebar-goal">
        <b className="header"><Indicator size={"25px"} color={goal.color} margin="0 1rem 0 0" />{goal.goalName}:</b>
        <ul className="sidebar-task-bank">
            {goal.taskBank.map((task) => {
                return <SidebarTask schedule={schedule} reloadGoals={reloadGoals} scheduleDay={scheduleDay} task={task} goalId={goal._id} key={task._id} reloadSchedule={reloadSchedule} />
            })}
        </ul>
    </div>
}