function Sticker({ src, size, left="none", right="none", top, rotate = "0deg" }) {

    return <>
        <img src={`/src/assets/Audrey 💖/${src}`} alt="sticker" style={{zIndex:-1, position: "absolute", left: left, right: right, top: top, width: size, transform: `rotate(${rotate})`}} />
    </>
}

export default Sticker;