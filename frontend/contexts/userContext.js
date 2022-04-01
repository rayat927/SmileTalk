import React, {createContext, useEffect, useLayoutEffect, useRef, useState} from 'react'
import jwt_decode from 'jwt-decode'
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = (props) => {
    const [user, setUser] = useState()
    const socket = useRef()

    useLayoutEffect(() => {
        if(window.localStorage.getItem('userToken')){
            const token = window.localStorage.getItem('userToken')
            const decoded = jwt_decode(token)
            axios.get('http://localhost:8000/user/' + decoded.email).then(data => {
                setUser({
                    _id: data.data._id,
                    name: data.data.name,
                    username: data.data.username,
                    email: data.data.email,
                    role: data.data.role
                })
            })
        }
    }, [])



    return(
        <UserContext.Provider value={{user, setUser, socket}}>
            {props.children}
        </UserContext.Provider>
    )
}