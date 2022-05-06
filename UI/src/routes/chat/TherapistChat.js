import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import calculateSize from "calculate-size"
import userImg from "./../../imgs/user.png"
import sound from "./ring.mp3"
import { useNavigate } from "react-router"
import jwtDecode from 'jwt-decode';
import { box } from "../../global/Variants"


const TherapistChat = ({ width, setWidth, mySocket, animateWidth, socket }) => {

    const headingList = [
        "No one queing up for therapy",
        "Everyone's fine",
        "Patience",
        "Therapy takes time",
        "Sit back and relax...",
        "Practice makes perfect",
        "Sometime the best therapy is lone time",
        "Therapy is too good to be only for the sick",
        "There is no greater agony than bearing an untold story inside you",
        "Therapy can be a good thing; it can be therapeutic",
        "Sometimes some music is therapy"
    ]
    const user = jwtDecode(localStorage.getItem("token"))
    const [title, setTitle] = useState("No one queing up for therapy")
    const [clientAvailable, setClientAvalable] = useState(false)
    const audio = new Audio(sound)
    audio.loop = true
    const nav = useNavigate()
    
    socket.on("client found", (data) => {
        console.log("client found!!!")
        setClientAvalable(data)
    })

    socket.on("room code", (room) => {
        window.location.href = `/chat/${room}`
    })

    useEffect(() => {
        ChangeTitle()
    }, [])

    function ChangeTitle() {
        setTimeout(() => {
            animateWidth(true)
            if(clientAvailable) {
                setWidth("400px")
                animateWidth(false)
            } else {
                const newTitle = headingList[Math.floor(Math.random() * headingList.length)]
                const newWidth = calculateSize(newTitle, {fontSize: "3rem",fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                sans-serif`}).width
                setTitle(newTitle)
                setWidth(newWidth + 180)
                ChangeTitle()
            }
        }, 6000)
    }

    return (<motion.div>

        {!clientAvailable && <center>
            <h1 className="f-giant">
                <AnimatePresence exitBeforeEnter>
                    <motion.p 
                        key={title}
                        initial={{opacity: 0, y: -20}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: 20}}
                    >{ title }</motion.p>
                </AnimatePresence>
            </h1>
            <motion.p layout>You will be notified when there is a user available</motion.p>

            <button onClick={() => {
                localStorage.removeItem("token")
            }}>Logout</button>
        </center>}

        {clientAvailable && <center>
            <motion.div className="client-found">
                <center>
                    <img src={userImg} alt="user" width="180px" className="img" />
                </center>
                <h1> <span>{ clientAvailable.client.user.username }</span> wants to connect </h1>
                <button className="inl admit" onClick={() => {
                    socket.emit("accept request", clientAvailable)
                    socket.emit("therapist data", {
                        to: clientAvailable.clientSocket,
                        therapist: {
                            name: user.username,
                            mail: user.email,
                            socket: socket.id
                        }
                    })
                }} >Admit</button>
                <button className="inl deny " onClick={() => {
                    socket.emit("reject request", clientAvailable)
                    setClientAvalable(false)
                }} >Deny</button>
            </motion.div>
        </center>}

    </motion.div>);
}
 
export default TherapistChat;