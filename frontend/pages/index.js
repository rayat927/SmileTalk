import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useContext, useEffect, useRef, useState } from 'react'
import styles from '../styles/Home.module.css'
import {UserContext} from '../contexts/userContext'
import axios from 'axios'
import {io} from 'socket.io-client'
import Link from 'next/link'

export default function Home() { 
  const [conversation, setConversation] = useState([])
  // const socket = useRef()
  const {user, setUser, socket} = useContext(UserContext)
  // const [therapists, setCurrentTherapists] = useState([])
  const therapists = useRef()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [therapist, setTherapist] = useState()

  const router = useRouter()

  useEffect(() => {
    socket.current = io('http://localhost:8000/')
    socket.current.on('sendProblemMessage', ({message}) => {
      setMessages(prev => [...prev, message])
      console.log(therapists.current);
      axios.post('http://localhost:8000/findTherapist/', {availableTherapists: therapists.current}).then(res => {
        console.log(res.data);
        setTherapist(res.data.therapist)
      }).catch(err => {
        console.log(err);
      })
    })
  }, [true])

  useEffect(() => {
    if(user){
      console.log(user);
      // if(user.role == 'therapist'){
        socket.current.emit("addUser", user._id, user.role)
        socket.current.on("getUsers", users => {
        console.log(users);
        // setCurrentTherapists(users)
        therapists.current = users
      })
      // }
  }
  }, [user?._id])

  useEffect(() => {
    if(!localStorage.getItem('userToken')){
      if(user){
      if(user.role == 'therapist'){
        router.push('/chamber/' + user._id)
      }
      
    }
      router.push('/home')
    }
    
  }, [])

  useEffect(() => {
    const getConversations = () => {
      if(user){
        axios.get("http://localhost:8000/conversation/" + user._id).then(res => {
        console.log(res);
        setConversation(res.data)
      }).catch(err => {
        console.log(err);
      })
      }
      
    }

    getConversations()
  }, [user?._id])

  const sendMessageToBot = e => {
    e.preventDefault()
    socket.current.emit('sendProblemMessage', {
      message,
    })
    // axios.post('http://localhost:8000/message/', {
    //   senderId: user._id,
    //   receiverId: 'global',
    //   text: message
    // }).then(data => {
    //   console.log(data.data);
    //   setMessage('')
    // }).catch(err => {
    //   console.log(err);
    // })
  }
const startSession = e => {
  e.preventDefault()
  router.push(`/therapist/${therapist.user._id}`)
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
        {therapist && 
          <div>
            <p>{therapist.user.name}</p>
            
            <button onClick={startSession}>Start Session</button>
          </div>
          }
        <div className={styles.chatInput}>
          <input value={message} onChange={e => setMessage(e.target.value)} placeholder='mention your problem'></input>
          <button onClick={sendMessageToBot}>send</button>
        </div>
      </div>
    </div>
  )
}
