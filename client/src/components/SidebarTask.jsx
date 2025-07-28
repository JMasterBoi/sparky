import axios from "axios";
import { addDays } from "date-fns";
import { useEffect, useRef, useState } from "react";

export function SidebarTask({ task, goalId, reloadSchedule, schedule, reloadGoals, scheduleDay }) {
    const buttonsRef = useRef(null)
    const [scheduled, setScheduled] = useState(task.scheduled)
    // if this task's _id is found in the schedule then it means the task is scheduled

    async function scheduleTask() {
        console.log("test", addDays(new Date(), scheduleDay-Math.floor(Date.now()/86400000)))
        const data = {
            goalId:goalId,
            taskId:task._id,
            taskName:task.taskName,
            taskStart: addDays(new Date(), scheduleDay-Math.floor(Date.now()/86400000))
            // taskStart: scheduleDay
        }

        try {
            const response = await axios.post(`/api/schedule-task/`, data)
            reloadSchedule(scheduleDay);
            setScheduled(true);
            // successToast("Task added successfully!");
        } catch (error) {
            console.log("aww")
            console.error("Error:", error.response?.data || error.message);
        }
    }
    
    async function unscheduleTask() {
        try {
            const response = await axios.post(`/api/unschedule-task/`, {_id: task._id, goalId: goalId})
            reloadSchedule(scheduleDay);
            setScheduled(false);
            // successToast("Task added successfully!");
        } catch (error) {
            console.log("aww")
            console.error("Error:", error.response?.data || error.message);
        }
    }

    return <div className="sidebar-task" onMouseEnter={(e) => {e.stopPropagation(); buttonsRef.current.style.visibility = "visible";}} onMouseLeave={() => {buttonsRef.current.style.visibility = "hidden";}}>
        <div id="sidebar-task-left" className={scheduled ? "strikethrough" : ""} >
            {task.taskName}
        </div>
        <div id="sidebar-task-right">
            {
                scheduled
                ? <button id="schedule-task-btn" style={{visibility: "hidden"}} ref={buttonsRef} onClick={unscheduleTask}>—</button>
                : <button id="schedule-task-btn" style={{visibility: "hidden"}} ref={buttonsRef} onClick={scheduleTask}>+</button>
            }
        </div>
    </div>
}