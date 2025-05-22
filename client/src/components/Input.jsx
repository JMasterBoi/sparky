import axios from "axios";
import { useEffect, useState } from "react";
import { MentionsInput, Mention } from 'react-mentions'
import * as chrono from 'chrono-node';
import { format } from 'date-fns';

function Input({ goals, reloadGoals, currentGoalId, setCurrentGoalId }) {
    const [rawTask, setRawTask] = useState("");
    const [mentionGoals, setMentionGoals] = useState([{id: "nothing", display: "nothing"}]);

    useEffect(() => {
    if (goals && Array.isArray(goals)) {
            const formattedGoals = goals.map((goal) => ({
                id: goal._id,
                display: goal.goalName,
            }));
            setMentionGoals(formattedGoals);
        }
    }, [goals]);

    async function submitTask(e) {
        e.preventDefault();

        console.log("rawTask", rawTask)

        // get id from mention
        const [fullGoalMatch, displayGoalMatch, idGoalMatch] = rawTask.match(/\/\[(.*?)\]\((.*?)\)/) || []; // if there is no match use empty array to prevent error
        
        // get date from input
        const [fullDateMatch, displayDateMatch, idDateMatch] = rawTask.match(/@\[(.*?)\]\((.*?)\)/) || []; // same as above

        // remove mention and date from rawTask and trim it
        const filteredTask = rawTask.replace(fullGoalMatch, "").replace(fullDateMatch, "").trim()
        
        // check if currentGoalId is empty
        if (filteredTask === "") {
            console.log("Task cannot be empty");
            return;
        }

        const data = [
            idGoalMatch?idGoalMatch:currentGoalId, // basically use currentGoal ID only when theres no id mention
            {
                taskName: filteredTask,
                taskDescription: "",
                date: idDateMatch,
                // objective: "1", //? for when there is an objective
            },
        ];

        try {
            const response = await axios.post(`/api/add-task/`, data)
            reloadGoals();
            setRawTask("");
            console.log("Task added successfully:");
        } catch (error) {
            console.log("aww")
            console.error("Error:", error.response?.data || error.message);
        }
    }

    const inputStyle = {
        control: {
            // width: '50%',
            padding: '12px 16px',
            border: '0px',
            borderRadius: '16px',
            backgroundColor: 'var(--gray)',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        },
        input: {
            // add input-specific styles here
            padding: '12px 16px',
            color: 'var(--text)',
            fontSize: '16px',
            border: '0px',
            borderRadius: '16px',
        },
        highlighter: {
            // add highlighter-specific styles here
            padding: 1,
            border: '1px inset transparent',
            color: 'var(--primary)',
        },
        suggestions: {
            borderRadius: '8px',
            list: {
                backgroundColor: 'var(--gray)',
                borderRadius: '8px',
                // boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
                fontSize: '16px',
                overflow: 'hidden',
                // padding: '4px 0',
                // marginTop: '8px',
            },
            item: {
                padding: '10px 16px',
                cursor: 'pointer',
                color: 'var(--text)',
                '&focused': {
                    backgroundColor: 'var(--gray-highlight)',
                }
            }
        }
    };



    return <>
        {/* <input className="bottom" placeholder="What will you do today?" disabled={!currentGoalId} id="input" type="text" value={rawTask} onChange={(e) => setRawTask(e.target.value)} autoFocus autoComplete="off"/> */}
        <form id="task-form" onSubmit={submitTask}>
            <MentionsInput forceSuggestionsAboveCursor={true} allowSpaceInQuery singleLine style={inputStyle} value={rawTask} onChange={(e) => setRawTask(e.target.value)}>
                <Mention
                    trigger="/"
                    data={mentionGoals}
                    markup='/[__display__](__id__)'
                    displayTransform={(id, display) => display}
                    onAdd={(id, display) => {
                        localStorage.setItem("currentGoalId", id);
                        setCurrentGoalId(id);
                    }}
                    allowSpaceInQuery={false}
                />
                <Mention
                    trigger="@"
                    data={(search, callback) => {
                        console.log('Search query:', rawTask); 

                        const fallback = [{id: chrono.parseDate("11:59PM").getTime(), display: "---"}] // when there is no match
                        console.log(fallback)
                        try {
                            const date = chrono.parseDate(search + " 11:59PM");
                            if (date) {
                                const formatted = format(date, "MMMM d, h:mma");
                                callback([{ id: date.getTime(), display: formatted }]);
                            } else {
                                callback(fallback);
                            }
                        } catch (error) {
                            callback(fallback);
                        }
                    }}
                    markup='@[__display__](__id__)'
                    displayTransform={(id, display) => display}
                    allowSpaceInQuery={true}
                />
            </MentionsInput>
        </form>
    </>;
}

export default Input;