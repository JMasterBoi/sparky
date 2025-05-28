import { useEffect, useRef, useState } from "react";
import MenuOption from "./MenuOption";

function ContextMenu({ openRef, options }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    // const [listenerAdded, setListenerAdded] = useState(false);

    useEffect(() => {
        if (!openRef.current) return;
        const handleClick = (e) => {
            console.log("open the context menu");
            setMenuOpen(prev => !prev);
            e.stopPropagation();
            // setListenerAdded(true);
        }

        const button = openRef.current;
        button.addEventListener("click", handleClick);

        return () => {
            button.removeEventListener("click", handleClick);
        };
    }, [openRef]);

    useEffect(() => {
        console.log("menuOpen", menuOpen);
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);


    return <>
        {menuOpen && <div ref={menuRef} className="context-menu">
            {/* options in the menu */}
            {options.map((option) => {
                return <MenuOption {...option} key={crypto.randomUUID()} setMenuOpen={setMenuOpen} />
            })}
        </div>}
    </>
}

export default ContextMenu;