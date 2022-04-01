import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import {UserContext} from '../../contexts/userContext'
import styles from '../../styles/Home.module.css'

export const getStaticPaths = async () => {
    const res = await axios.get('http://localhost:8000/users')
    const data = await res.data

    const paths = data.map(therapist => {
        return {
            params: {userId: therapist._id.toString()}
        }
    })

    return {
        paths,
        fallback: false
    }
}

export const getStaticProps = async (context) => {
    const id = context.params.userId
    const res = await axios.get('http://localhost:8000/users/' + id)
    const data = await res.data
    
    return {
        props: {therapist: data}
    }
}

function Therapist({therapist}) {
    const[message, setMessage] = useState()
    const [messages, setMessages] = useState([])

    const {user,socket} = useContext(UserContext)

    useEffect(() => {
        socket.current = io('http://localhost:8000/')
        socket.current.on('sendMessage', ({message, from}) => {
                    setMessages(prev => [...prev, message])
                    let newMessage = [{senderId:user._id,message}]
                    axios.put('http://localhost:8000/user/message/' + therapist._id, {
                      messages: newMessage
                    }).then(res => {
                      console.log(res);
                    }).catch(err => {
                      console.log(err);
                    })
                })
    }, [])

    const sendMessage = e => {
        e.preventDefault()
        socket.current.emit('sendMessage', {
            message,
            to: therapist.socketId
          })
        
        
    }

  return (
    <div className={styles.container}>
      <div className={styles.contactList}></div>
      <div className={styles.chat}>
        {
          messages.map(m => (
            <p>{m}</p>
          ))
        }
        <div className={styles.chatInput}>
          <input value={message} onChange={e => setMessage(e.target.value)} placeholder='mention your problem'></input>
          <button onClick={sendMessage}>send</button>
        </div>
      </div>
    </div>
  )
}

export default Therapist