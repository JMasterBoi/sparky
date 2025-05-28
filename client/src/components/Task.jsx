import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ContextMenu from "./ContextMenu";
import { formatRelative } from "date-fns";

function Task({_id, taskName, objective, goalId, checked, date }) {
    const [checkedState, setCheckedState] = useState(checked);
    const [relativeDate, setRelativeDate] = useState("");
    const taskOptionsRef = useRef(null);
    
    useEffect(() => {
        // format the date to a relative date
        if (date) {
            const formattedDate = formatRelative(new Date(Number(date)), new Date());
            setRelativeDate(formattedDate);
        }
    }, [date]);

    function clickTask() {
        // change the ui to reflect the task being checked
        setCheckedState(!checkedState);
        // send a request to the server to update the task
        axios.post("/api/check-task", {goalId: goalId, taskId: _id, status: checkedState}).then((result) => {
            // console.log(result);
        }).catch((error) => {
            console.log("Error:", error);
        });
    }

    const empty = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0"/></svg>;
    const filled = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75s9.75-4.365 9.75-9.75S17.385 2.25 12 2.25"/></svg>;

    const menuOptions = [
        {
            name: "Edit Task",
            action: () => {
                // handle edit task
                console.log("Edit Task clicked");
            },
        },
        {
            name: "Duplicate Task",
            action: () => {
                // handle delete task
                console.log("Duplicate Task clicked");
            },
        },
        {
            name: "Delete Task",
            action: () => {
                // handle delete task
                console.log("Delete Task clicked");
            },
            color: "red"
        }
    ] 

    // when the user hovers over the task, show the 3 dots
    return <div className="task-container" onClick={(e) => clickTask()} onMouseEnter={() => {taskOptionsRef.current.style.visibility = "visible";}} onMouseLeave={() => {taskOptionsRef.current.style.visibility = "hidden";}}>
        <ContextMenu openRef={taskOptionsRef} options={menuOptions} />
        {/* 3 dots */}
        <div ref={taskOptionsRef} onClick={(e) => e.stopPropagation()} className="task-options" style={{visibility: "hidden"}} >
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M11 12a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 11 12m0-4a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 11 8m0 8a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 11 16"/></svg>
        </div>
        {/* the actual task */}
        <div className="main-task">
            <li className="task">
                <>{taskName}</>
                {/* clicked or not */}
                <div className="circle">{checkedState?filled:empty}</div>
            </li>
            {/* the due date */}
            {date && <div className="due-date">Due: {relativeDate}</div>}
        </div>
    </div>
}

export default Task;