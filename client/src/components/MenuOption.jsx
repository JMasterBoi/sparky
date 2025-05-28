import { useEffect, useRef, useState } from "react";
import axios from "axios";

function MenuOption({ setMenuOpen, name, action, color }) {

    return <div className="menu-option" style={{color: color??"var(--text)"}} onClick={(e) => {e.stopPropagation(); action(); setMenuOpen(false);}}>
        {name}
    </div>
}

export default MenuOption;