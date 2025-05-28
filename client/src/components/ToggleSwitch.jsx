import { useEffect, useRef, useState } from "react";

function ToggleSwitch({ toggled, setToggled, toggledIcon, unToggledIcon }) {

    return <label className="switch" onClick={(e) => {e.preventDefault(); setToggled(toggled => !toggled); }}>
        <input className="checkbox-input" checked={toggled} readOnly type="checkbox" />
        <span className="slider round"></span>
        {/* basicaly when toggled show the right type of icon*/}
        <section className={`cursor-pointer ${toggled?"":"un"}checked-icon`} >{toggled?toggledIcon:unToggledIcon}</section>
    </label>
}

export default ToggleSwitch;