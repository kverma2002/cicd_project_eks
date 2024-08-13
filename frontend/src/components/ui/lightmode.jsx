import { useEffect, useState } from "react";

function Lightmode() {

 
    let [dark, setDark] = useState(false)

    useEffect(() => {
        let mode = !dark ? 'dark' : 'light'
        document.documentElement.classList.add(mode)
    }, [dark]);

    return (
        <button
            onClick={() => setDark(!dark)}
            className="absolute right-10 top-10 bg-black text-white px-5 py-3 hover:bg-stone-"
        >
            {dark ? 'Light' : 'Dark'} Mode
        </button>
    )
}

export default Lightmode
