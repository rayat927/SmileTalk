import { useEffect, useState } from "react";
import userImg from "./../../imgs/user.png"
import mail from "./media/mail.svg"
import { GetId } from "./../../global/Utils"
import { motion } from "framer-motion";
import { slideInRight } from "../../global/Variants";

import $ from "jquery";

const Client = ({ socket, user, room, leave }) => {

    const [therapist, setTherapist] = useState(null)
    const [messages, setMessages] = useState([])
    const [inputDisabled, setInputDisabled] = useState(false)
    const [totalMessages, setTotalMessages] = useState(0)

    useEffect(() => {
        socket.emit("send client data", {
            to: room,
            client: {
                name: user.username,
                email: user.email,
                socket: socket.id
            }
        })
    }, [therapist])

    useEffect(() => {

        socket.on("recive therapist data", (data) => {
            setTherapist(data)
        })

        socket.on("recive message", (message) => {
            const old = messages
    
            if(!old.includes(message)) {
                old.push(message)
                setMessages(old)

                $("#messages").scrollTop($("#messages")[0].scrollHeight)
                setTimeout(() => {
                    $("#messages").scrollTop($("#messages")[0].scrollHeight)
                }, 400);
            }
        })

    }, [socket])

    

    const SendMessage = (e) => {
        const input = GetId("message")
        const message = input.value
        e.preventDefault()

        if(message != "" || null) {
            setInputDisabled(true)
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
                var div = $("#messages");
                div.scrollTop(div.prop('scrollHeight'));
            })
        }
    }

    return (<>
        {therapist && <>

            <div className="title-bar">
                <img src={userImg} alt="user" width="50px" />
                <h1 className="title green">{therapist.name}</h1>

                <div className="buttons">
                    <a href={`https://mail.google.com/mail/u/0/?fs=1&to=${therapist.email}&su=&body=&tf=cm`} target="_blank">
                        <button className="mail">
                            <img src={mail} />
                        </button>
                    </a>
                    <button className="end">
                        End Session
                    </button>
                </div>

            </div>
            
            <div className="messages" id="messages">

                    <center>
                        <div className="info">
                            This is the beggining of your chat with <span className="green">{therapist.name}</span>
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
                    <input autoComplete="off" className={`inl ${inputDisabled && "disabled"}`} disabled={inputDisabled} id="message" type="text" placeholder={`Send a message to ${therapist.name}...`} />
                    <button className="inl">Send</button>
                </form>
            </div>

        </>}

        {!therapist && <>
            <div className="center">
                <center>
                    <h1>Waiting on the <span className="rainbow">therapist</span> to join</h1>
                    <button onClick={() => {
                        window.location.reload()
                    }}>Refresh</button>
                </center>
            </div>
        </>}
    </>);
}

export default Client;