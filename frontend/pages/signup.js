import React, { useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Signup.module.css'
import axios from 'axios'

function signup() {
    const[name, setName] = useState('')
    const[username, setUsername] = useState('')
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')
    const[confirmPassword, setConfirmPassword] = useState('')

    const router = useRouter()


    const signupHandler = e => {
        e.preventDefault()
        // console.log(name);
        // if(password != confirmPassword){
        //     console.log('passwords do not match');
        // }
        
        axios.post('http://localhost:8000/signup/user', {
            name,
            username,
            name,
            email,
            password
        }).then(data => {
            console.log(data);
            router.push('/')
        }).catch(err => {
            console.log(err);
        })
    }

  return (
    <div className={styles.formContainer}>
        <form onSubmit={signupHandler} className={styles.signupForm}>
            <label htmlFor='FullName'>Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className={styles.inputField} placeholder='Full Name'></input>
            <label htmlFor='Username'>Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)} className={styles.inputField} placeholder='Username'></input>
            <label htmlFor='Email'>Email</label>
            <input type='email' value={email} onChange={e => setEmail(e.target.value)} className={styles.inputField} placeholder='Email'></input>
            <label htmlFor='Password'>Password</label>
            <input type='password' value={password} onChange={e => setPassword(e.target.value)} className={styles.inputField} placeholder='Password'></input>
            <label htmlFor='ConfirmPassword'>Confirm Password</label>
            <input type='password' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={styles.inputField} placeholder='Confirm Password'></input>
            <button type='submit'>Create Account</button>
        </form>
    </div>
  )
}

export default signup