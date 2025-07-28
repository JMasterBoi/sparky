import { SidebarGoal } from "./SidebarGoal"

export function ScheduleSidebar({ goals, schedule, scheduleApi, reloadSchedule, reloadGoals, scheduleDay }) {
    return <div className="sidebar-container">
      {goals.length===0 && <i><b>No Goals</b></i>}
      {goals.length !== 0 && <div>
        {goals.map((goal) => {
            return <SidebarGoal reloadSchedule={reloadSchedule} reloadGoals={reloadGoals} scheduleDay={scheduleDay} key={goal._id} goal={goal} schedule={schedule} />
        })}
      </div>}
    </div>
}