import { useEffect, useState } from "react";


function Task({_id, taskName, objective, goalId }) {
    function clickTask() {
        // change the ui to reflect the task being checked
        setChecked(!checked);
        // send a request to the server to update the task
        axios.post("/api/check-task", [goalId, _id]).then((result) => {
            console.log(result);
        }).catch((error) => {
            console.log("Error:", error);
        });
    }

    const [checked, setChecked] = useState(false);

    const empty = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0"/></svg>;
    const filled = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75s9.75-4.365 9.75-9.75S17.385 2.25 12 2.25"/></svg>;


    return <li className="task" onClick={(e) => clickTask()}>
        <>{taskName}</>
        <span className="circle">{checked?filled:empty}</span>
    </li>
}

export default Task;