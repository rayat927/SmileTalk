import { useEffect, useState } from "react";
import mail from "./media/mail.svg"
import { GetId } from "./../../global/Utils"
import userImg from "./../../imgs/user.png"
import { motion } from "framer-motion";
import { slideInRight } from "../../global/Variants";

const Therapist = ({ socket, user, room, leave }) => {

    const [client, setClient] = useState(null)
    const [messages, setMessages] = useState([])
    const [inputDisabled, setInputDisabled] = useState(false)
    const [totalMessages, setTotalMessages] = useState(0)

    useEffect(() => {
        socket.emit("send therapist data", {
            to: room,
            therapist: {
                name: user.username,
                email: user.email,
                socket: socket.id
            }
        })
    }, [client])

    useEffect(() => {

        socket.on("recive client data", (data) => {
            setClient(data)
        })

        socket.on("recive message", (message) => {
            const old = messages
    
            if(!old.includes(message)) {
                old.push(message)
                setMessages(old)
            }

        })

    }, [socket])

    const SendMessage = (e) => {
        const input = GetId("message")
        const message = input.value

        setInputDisabled(true)
        e.preventDefault()


        if(message != "" || null) {
            console.log(message)
            socket.emit("send message", {
                room: room,
                message: {
                    sender: user.userId,
                    messageId: totalMessages,
                    message: message
                }
            }, () => {
                setInputDisabled(false)
                setTotalMessages(totalMessages + 1)
                input.value = ""
                input.focus()
            })
        }
    }

    return (<>
        {client && <>
            <div className="title-bar">
                <img src={userImg} alt="user" width="50px" />
                <h1 className="title green">{client.name}</h1>

                <div className="buttons">
                    <a href={`https://mail.google.com/mail/u/0/?fs=1&to=${client.email}&su=&body=&tf=cm`} target="_blank">
                        <button className="mail">
                            <img src={mail} />
                        </button>
                    </a>
                    <button className="end">
                        End Session
                    </button>
                </div>

            </div>
            
            <div className="messages">

                    <center>
                        <div className="info">
                            This is the beggining of your chat with <span className="green">{client.name}</span>
                        </div>
                    </center>

                    <center>
                        <div className="info text">
                            {!messages[0] && "No messages have been sent"}
                        </div>
                    </center>

                    {messages && <>
                        {messages.map(message => {
                            return <motion.div variants={slideInRight} initial="i" animate="a" transition={{duration: 0.1}} key={`${message.messageId}${message.sender}`} className={`message-contain ${message.sender == user.userId && "you"}`}>
                                <div className={`message ${message.sender == user.userId && "you"}`}>
                                    {message.message}
                                </div>
                            </motion.div>
                        })}
                    </>}

            </div>

            <div className="text-feild">
                <form onSubmit={SendMessage}>
                    <input autoComplete="off" className={`inl ${inputDisabled && "disabled"}`} disabled={inputDisabled} id="message" type="text" placeholder={`Send a message to ${client.name}...`} />
                    <button className="inl">Send</button>
                </form>
            </div>
        </>}
    
        {!client && <>
            <div className="center">
                <center>
                    <h1>Waiting on the <span className="rainbow">client</span> to join</h1>
                    <button onClick={() => {
                        window.location.reload()
                    }}>Refresh</button>
                </center>
            </div>
        </>}
    </>);
}
 
export default Therapist;