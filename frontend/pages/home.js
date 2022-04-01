import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import styles from '../styles/Login.module.css'

function home() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const router = useRouter()

    const loginHandler = e => {
        e.preventDefault()
        axios.post('http://localhost:8000/login', {
            email,
            password,
        }).then(data => {
            // console.log(data.data.user);
            window.localStorage.setItem('userToken', data.data.user)
            router.push('/')
        }).catch(err => {
            console.log(err);
        })
    }

  return (
    <div className={styles.loginContainer}>
        <form onSubmit={loginHandler} className={styles.loginForm}>
            <label htmlFor='Email'>Email</label>
            <input type='email' value={email} onChange={e => setEmail(e.target.value)} className={styles.inputField} placeholder='Email'></input>
            <label htmlFor='Password'>Password</label>
            <input type='password' value={password} onChange={e => setPassword(e.target.value)} className={styles.inputField} placeholder='Password'></input>
            <button type='submit'>Create Account</button>
        </form>
    </div>
  )
}

export default home