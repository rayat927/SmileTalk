import jwtDecode from 'jwt-decode';
import chatImg from "./../../imgs/chat.png";
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import TherapistChat from './TherapistChat';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { slideInLeft, box, child } from '../../global/Variants';

const Chat = ({ socket }) => {

    const user = jwtDecode(localStorage.getItem("token"))
    const [socketId, setSocketId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [animteWidth, setAnimateWidth] = useState(null)
    const [width, setWidth] = useState("auto")
    const [clientAvailabel, setClientAvailabel] = useState(null)
    const [buttonText, setButtonText] = useState("Create A New Therapy Session")
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const nav = useNavigate()

    socket.on("connect", () => {
        console.clear()
        console.log(`%cJoined with id: ${socket.id}`, "color: lightblue; font-size: 20px")
        setSocketId(socket.id)
        setLoading(false)

        user?.role == "user" && socket.emit("new user", {
            socket: socket.id,
            user: {
                id: user.userId,
                name: user.username,
                email: user.email,
                role: user.role
            }
        })

        user?.role != "user" && socket.emit("new therapist", {
            socket: socket.id,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                busy: false
            }
        })
    })

    socket.on("reconnect", () => {
        console.log("Reconnected!")
    })

    socket.on("connected with server", () => {
        console.log("%cConnection with server established✅", "color: lightgreen; font-size: 15px")
    })

    const CreateSession = (e) => {
        setButtonDisabled(true)
        setButtonText("Finding Therapists...")

        socket.emit("find therapists", user, (data) => {
            
            if(data.completed) {
                setButtonText("Therapist Found!")
                setTimeout(() => {
                    setButtonText("Asking for therapist's perrmission")
                    socket.emit("ask therapist", {
                        therapist: {
                            socket: data.therapist.socket
                        },
                        client: {
                            user
                        },
                        clientSocket: socketId
                    })
                }, 700);
            } else {
                setButtonText(data.error.message)
                setTimeout(() => {
                    setButtonText("Create a new therapy session")
                    setButtonDisabled(false)
                }, 1000);
            }
        })
    }

    socket.on("request accepted", (data) => {
        setButtonText("Therapist Agreed!")
        setTimeout(() => {
            setButtonText("Entering chat...")

            socket.emit("send public message", {
                event: "room code",
                to: data.therapist.socket,
                data: uuidv4()
            }, (room) => {
                window.location.href = `/chat/${room}`
            })

        }, 800);
    })

    socket.on("request rejected", () => {
        setButtonText("Therapist denied")
        setTimeout(() => {
            setButtonText("Create a new therapy session")
            setButtonDisabled(false)
        }, 800);
    })
    

    return (<motion.div>
        <motion.div variants={box} initial="i" animate="a" exit="x" className="auth center" style={{padding: "8px 90px", background: (clientAvailabel && "transparent"), boxShadow: (clientAvailabel && "none"), width: (user.role == "therapist" && animteWidth && width || "auto"), height: (user.role == "therapist" && animteWidth && "320px")}}>
            
            {loading && <>
                {user.role == "user" && <h1>Loading as user</h1>}
                {user.role != "user" && <h1>Loading as therapist</h1>}
                <center>
                    <button onClick={() => {
                        window.location.reload(true)
                    }}>
                        Refresh
                    </button>
                </center>
            </>}

            {!loading && <>
                {user.role == "user" && <>
                    <center>
                        <br />
                        <br />
                        <img src={chatImg} alt="chat" width="300px" />
                        <h1 className="">
                            You have no sessions
                        </h1>
                        <br />
                        <div style={{transform: "translateY(-30px)"}}>
                            <button disabled={buttonDisabled} onClick={CreateSession}>
                                { buttonText }
                            </button>
                            <br />
                            <button onClick={() => {nav("/account")}}>
                                Manage Account
                            </button>
                            <br />
                            <button onClick={() => {
                                localStorage.removeItem("token")
                                nav("/")
                            }}>Log Out</button>

                        </div>
                    </center>
                </>}
                {user.role != "user" && <>
                    <TherapistChat socket={socket} clientAvailable={clientAvailabel} setClientAvalable={setClientAvailabel} mySocket={socketId} width={width} animateWidth={setAnimateWidth} setWidth={setWidth} /> 
                </>}
            </>}

        </motion.div>
    </motion.div>);
}
 
export default Chat;
