import jwtDecode from 'jwt-decode';
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import Client from './client';
import Therapist from './therapist';

const Room = ({ socket }) => {

    const { room } = useParams()
    const user = jwtDecode(localStorage.getItem("token"))
    const nav = useNavigate()
    
    console.log(`Joining room ${room}`)
    socket.emit("join room", room)

    return (<>
        <div className="auth center chat">
            {user.role == "user" && <Client socket={socket} user={user} room={room} />}
            {user.role != "user" && <Therapist socket={socket} user={user} room={room} />}
        </div>
    </>)
}
 
export default Room;