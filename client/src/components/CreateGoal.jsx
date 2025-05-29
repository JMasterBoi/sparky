import { useEffect, useState } from "react";
import { createGoal } from "./AlertService"


function CreateGoal({ reloadGoals }) {
    return <button id="create-goal-button" onClick={() => {
        createGoal(reloadGoals);
    }}>
        <span>+</span>
    </button>
}

export default CreateGoal;