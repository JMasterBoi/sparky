import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { MentionsInput, Mention } from 'react-mentions'
import * as chrono from 'chrono-node';
import { format } from 'date-fns';
import ToggleSwitch from "./ToggleSwitch";
import { successToast } from "./AlertService";

function Input({ goals, reloadGoals, currentGoalId, setCurrentGoalId }) {
    const [rawTask, setRawTask] = useState("");
    const [mentionGoals, setMentionGoals] = useState([{id: "nothing", display: "nothing"}]);
    const [autoAssign, setAutoAssign] = useState(false);
    const inputRef = useRef(null); // used for focusing the input

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (
                document.activeElement.tagName !== "INPUT" &&
                document.activeElement.tagName !== "TEXTAREA" &&
                event.key.length === 1 && event.key[0].match(/[a-z]/i)
            ) {
                inputRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);
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

        // get id from mention
        const [fullGoalMatch, displayGoalMatch, idGoalMatch] = rawTask.match(/#\[(.*?)\]\((.*?)\)/) || []; // if there is no match use empty array to prevent error
        
        // get date from input
        const [fullDateMatch, displayDateMatch, idDateMatch] = rawTask.match(/@\[(.*?)\]\((.*?)\)/) || []; // same as above

        // remove mention and date from rawTask and trim it
        const filteredTask = rawTask.replace(fullGoalMatch, "").replace(fullDateMatch, "").trim()
        
        // check if currentGoalId is empty
        if (filteredTask === "") {
            console.log("Task cannot be empty");
            return;
        }
        // if theres no goal
        if (!currentGoalId || goals.length === 0) {
            console.log("No goal selected, please select/create a goal first.");
            return;
        }

        const data = [
            idGoalMatch?idGoalMatch:currentGoalId, // basically use currentGoal ID only when theres no id mention
            {
                taskName: filteredTask,
                taskDescription: "",
                dueDate: idDateMatch,
                autoAssign: autoAssign,
                priority: 4.5, //! default priority
                difficulty: 4.5, //! default difficulty
            },
        ];

        try {
            const response = await axios.post(`/api/add-task/`, data)
            reloadGoals();
            setRawTask("");
            successToast("Task added successfully!");
        } catch (error) {
            console.log("aww")
            console.error("Error:", error.response?.data || error.message);
        }
    }

    const inputStyle = {
        control: {
            // width: '50%',
            // padding: '12px 16px',
            border: '0px',
            borderRadius: '16px',
            backgroundColor: 'var(--gray)',
        },
        "&singleLine": {
            // display: "inline-block",
            input: {
                // add input-specific styles here
                padding: '12px 16px',
                color: 'var(--text)',
                fontSize: '16px',
                border: '0px',
                borderRadius: '16px',
            },
            highlighter: {
                padding: 1,
                border: '1px inset transparent',
                transform: 'translate(12px, 8px)',
            }

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
    const toggledIcon=<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="currentColor" d="M21.738 16.13a1 1 0 0 1-.19.61a1 1 0 0 1-.52.38l-1.71.57a3.6 3.6 0 0 0-1.4.86a3.5 3.5 0 0 0-.86 1.4l-.6 1.7a1 1 0 0 1-.36.51a1.1 1.1 0 0 1-.62.19a1 1 0 0 1-1-.71l-.57-1.71a3.5 3.5 0 0 0-.86-1.4a3.8 3.8 0 0 0-1.4-.87l-1.71-.56a1.1 1.1 0 0 1-.51-.37a1.1 1.1 0 0 1-.21-.62a1 1 0 0 1 .71-1l1.72-.57a3.54 3.54 0 0 0 2.28-2.28l.57-1.69a1 1 0 0 1 .95-.73c.215 0 .426.059.61.17c.182.125.322.303.4.51l.58 1.74a3.54 3.54 0 0 0 2.28 2.28l1.7.6a1 1 0 0 1 .51.38a1 1 0 0 1 .21.61m-9.999-6.36a1 1 0 0 1-.17.55a1 1 0 0 1-.47.35l-1.26.42c-.353.122-.673.32-.94.58a2.5 2.5 0 0 0-.58.94l-.43 1.24a.9.9 0 0 1-.35.47a1 1 0 0 1-.56.18a1 1 0 0 1-.57-.19a1 1 0 0 1-.34-.47l-.41-1.25a2.44 2.44 0 0 0-.58-.93a2.2 2.2 0 0 0-.93-.58l-1.25-.42a.93.93 0 0 1-.48-.35a1 1 0 0 1 .48-1.47l1.25-.41a2.49 2.49 0 0 0 1.53-1.53l.41-1.23a1 1 0 0 1 .32-.47a1 1 0 0 1 .55-.2a1 1 0 0 1 .57.16a1 1 0 0 1 .37.46l.42 1.28a2.49 2.49 0 0 0 1.53 1.53l1.25.43a.92.92 0 0 1 .46.35a.94.94 0 0 1 .18.56m5.789-5.36a1 1 0 0 1-.17.51a.82.82 0 0 1-.42.3l-.62.21a.84.84 0 0 0-.52.52l-.22.63a.93.93 0 0 1-.29.39a.82.82 0 0 1-.52.18a1.1 1.1 0 0 1-.49-.15a.9.9 0 0 1-.32-.44l-.21-.62a.7.7 0 0 0-.2-.32a.76.76 0 0 0-.32-.2l-.62-.2a1 1 0 0 1-.42-.31a.9.9 0 0 1-.16-.51a.94.94 0 0 1 .17-.51a.9.9 0 0 1 .42-.3l.61-.2a.9.9 0 0 0 .33-.2a.9.9 0 0 0 .2-.33l.21-.62c.06-.155.155-.292.28-.4a1 1 0 0 1 .49-.19a.94.94 0 0 1 .53.16a1 1 0 0 1 .32.41l.21.64a.9.9 0 0 0 .2.33a1 1 0 0 0 .32.2l.63.21a1 1 0 0 1 .41.3a.87.87 0 0 1 .17.51"/></svg>
    const unToggledIcon=<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="currentColor" d="M18.41 3.41L16 4.5l2.41 1.09L19.5 8l1.1-2.41L23 4.5l-2.4-1.09L19.5 1M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10c0-1.47-.33-2.87-.9-4.13l-1.24 2.72c.08.46.14.91.14 1.41c0 4.43-3.57 8-8 8s-8-3.57-8-8v-.13a10 10 0 0 0 5.74-5.56A10 10 0 0 0 17.5 10a10 10 0 0 0 1.33-.09l-1.48-3.26L12.6 4.5l3.53-1.6C14.87 2.33 13.47 2 12 2m-3 9.75A1.25 1.25 0 0 0 7.75 13A1.25 1.25 0 0 0 9 14.25A1.25 1.25 0 0 0 10.25 13A1.25 1.25 0 0 0 9 11.75m6 0A1.25 1.25 0 0 0 13.75 13A1.25 1.25 0 0 0 15 14.25A1.25 1.25 0 0 0 16.25 13A1.25 1.25 0 0 0 15 11.75"/></svg>
    // :3 Audrey's theme
    // const toggledIcon=<svg style={{transform: "translate(-4px, -5px)"}} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M11.75 6.406c-1.48 0-1.628.157-2.394.157C8.718 6.563 6.802 5 5.845 5S3.77 5.563 3.77 7.188v1.875c.002.492.18 2 .88 1.597c-.827.978-.91 2.119-.899 3.223c-.223.064-.45.137-.671.212c-.684.234-1.41.532-1.737.744a.75.75 0 0 0 .814 1.26c.156-.101.721-.35 1.408-.585l.228-.075c.046.433.161.83.332 1.19l-.024.013c-.41.216-.79.465-1.032.623l-.113.074a.75.75 0 1 0 .814 1.26l.131-.086c.245-.16.559-.365.901-.545q.12-.064.231-.116C6.763 19.475 9.87 20 11.75 20s4.987-.525 6.717-2.148q.11.052.231.116c.342.18.656.385.901.545l.131.086a.75.75 0 0 0 .814-1.26l-.113-.074a13 13 0 0 0-1.032-.623l-.024-.013c.171-.36.286-.757.332-1.19l.228.075c.687.235 1.252.484 1.409.585a.75.75 0 0 0 .813-1.26c-.327-.212-1.053-.51-1.736-.744a16 16 0 0 0-.672-.213c.012-1.104-.072-2.244-.9-3.222c.7.403.88-1.105.881-1.598V7.188C19.73 5.563 18.613 5 17.655 5c-.957 0-2.873 1.563-3.51 1.563c-.767 0-.915-.157-2.395-.157m-.675 9.194c.202-.069.441-.1.675-.1s.473.031.676.1c.1.034.22.088.328.174a.62.62 0 0 1 .246.476c0 .23-.139.39-.246.476s-.229.14-.328.174c-.203.069-.442.1-.676.1s-.473-.031-.675-.1a1.1 1.1 0 0 1-.329-.174a.62.62 0 0 1-.246-.476c0-.23.139-.39.246-.476s.23-.14.329-.174m2.845-3.1c.137-.228.406-.5.81-.5s.674.272.81.5c.142.239.21.527.21.813s-.068.573-.21.811c-.136.229-.406.501-.81.501s-.673-.272-.81-.5a1.6 1.6 0 0 1-.21-.812c0-.286.068-.574.21-.812m-5.96 0c.137-.228.406-.5.81-.5s.674.272.81.5c.142.239.21.527.21.813s-.068.573-.21.811c-.136.229-.406.501-.81.501s-.673-.272-.81-.5a1.6 1.6 0 0 1-.21-.812c0-.286.068-.574.21-.812" clip-rule="evenodd"/></svg>
    // const unToggledIcon=<>ʚ♡ɞ</>;

    return <>
        <div className="task-form-container">
            <form id="task-form" onSubmit={submitTask} onClick={(e) => {inputRef?.current.focus();}}>
                <MentionsInput placeholder="How will you achieve your goals today?" inputRef={inputRef} autoComplete="off" id="mentions-input" forceSuggestionsAboveCursor={true} allowSpaceInQuery singleLine autoFocus style={inputStyle} value={rawTask} onChange={(e) => setRawTask(e.target.value)}>
                    <Mention
                        trigger="#"
                        data={mentionGoals}
                        markup='#[__display__](__id__)'
                        displayTransform={(id, display) => display}
                        onAdd={(id, display) => {
                            localStorage.setItem("currentGoalId", id);
                            setCurrentGoalId(id);
                        }}
                        allowSpaceInQuery={false}
                        style={{color: "pink"}}
                    />
                    <Mention
                        trigger="@"
                        data={(search, callback) => {
                            const fallback = [{id: chrono.parseDate("11:59PM").getTime(), display: "---"}] // when there is no match

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
                        style={{color: "lightblue"}}

                    />
                </MentionsInput>
                <div id="form-row-2">
                    <div className="form-buttons">
                        <button type="button">Advanced settings</button>
                    </div>
                    <div className="form-buttons">
                        <ToggleSwitch toggled={autoAssign} setToggled={setAutoAssign} toggledIcon={toggledIcon} unToggledIcon={unToggledIcon} />
                        <button className="circle-button" type="submit" id="task-form-submit"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19.5v-15m0 0l-6 5.625M12 4.5l6 5.625"/></svg></button>                    
                    </div>
                </div>
            </form>
        </div>
    </>;
}

export default Input;