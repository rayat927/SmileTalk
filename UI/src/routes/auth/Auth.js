import { useEffect, useState } from "react";
import { GetId, ValidateEmail } from "../../global/Utils"
import { useNavigate } from "react-router";

const UserAuth = () => {

    const [err, setErr] = useState("")
    const [msg, setMsg] = useState("")
    const [mode, setMode] = useState("signup")
    const navigate = useNavigate()

    useEffect(() => {
        if(localStorage.getItem("token")) {
            navigate("/")
        }
    }, [])

    const SignUp = (e) => {

        e.preventDefault()

        setErr("")
        setMsg("")
        const email = GetId("email").value.toLowerCase();
        const username = GetId("username").value;
        const password = GetId("password").value;
        const confirmPassword = GetId("confirmPassword").value
        const role = GetId("role").value

        if(username.length < 3) {
            setErr("Username must be at least 3 characters");
            return;
        } else if(username.length > 15) {
            setErr("Username must be less than 15 characters");
            return;
        } else {
            if(!ValidateEmail(email)) {
                setErr("Invalid email");
                return;
            } else if(password.length < 6) {
                setErr("Password must be at least 6 characters");
                return;
            } else if(password !== confirmPassword) {
                setErr("Passwords do not match");
                return;
            } else if(!role) {
                setErr("Please select a role");
                return;
            } else {
                setErr("")
                fetch("http://localhost:8000/user/new", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer ",
                        "mode": "no-cors",
                        "email": email,
                        "username": username,
                        "password": password,
                        "role": role
                    }
                }).then(res => {return res.json()})
                .then(data => {
                    console.log(data)
                    if(data.type === "error") {
                        setErr(data.message)
                    } else if(data.type === "success" && data.completed) {
                        setErr("")
                        setMsg("Account Created!")
                        localStorage.setItem("token", data.user.token)
                        navigate("/")
                    } else {
                        setErr("An unknown error occured")
                    }
                })
            }
        }



        
    }

    const SignIn = (e) => {

        e.preventDefault()

        setErr("")
        setMsg("")

        if(GetId("email").value === "") {
            setErr("Email cannot be empty")
        } else if(!ValidateEmail(GetId("email").value)) {
            setErr("Invalid email")
        } else if(GetId("password").value === "") {
            setErr("Password cannot be empty")
        } else {
            setErr("")
            setMsg("")

            console.log("S")

            fetch("http://localhost:8000/user/old", {
            method: "POST",
            headers: {
                    "Content-Type": "application/json",
                    "mode": "no-cors",
                    "email": GetId("email").value.toLowerCase(),
                    "password": GetId("password").value
                }
            }).then(res => {return res.json()})
            .then(data => {
                console.log(data)

                if(data.type == "error") {
                    setErr(data.message)
                } else if(data.type == "success" && data.completed) {
                    setErr("")
                    setMsg("Logged in!")
                    localStorage.setItem("token", data.user.token)
                    navigate("/")
                } else {
                    setErr("An unknown error occured")
                }
            })
        }


        
    }

    return (<>
        <center>
            <div className="auth center" style={{width: "400px"}}>

                {mode == "signin" && <form onSubmit={SignIn}>
                    <h1 className="f-giant">Welcome Back!</h1>  
                    { err ? <p className="f-small red">{err}</p> : null }
                    { msg ? <p className="f-small green">{msg}</p> : null }
                    <input type="text" placeholder="Email"              id="email"           />    <br />
                    <input type="password" placeholder="Password"           id="password"        />    <br />
                        <br />
                    <button onClick={SignIn} className="width">Sign In</button>
                    <button className="transparent width" onClick={() => {
                        setMode("signup")
                        setErr("")
                        setMsg("")
                    }}> Sign up instead </button>  
                </form>}

                {mode == "signup" && <form onSubmit={SignUp}>
                    <h1 className="f-giant">Hello!</h1>
                    { err ? <p className="f-small red">{err}</p> : null }
                    { msg ? <p className="f-small green">{msg}</p> : null }
                    <input type="text" placeholder="Username"               id="username"        />    <br />
                    <input type="text" placeholder="Email"                  id="email"           />    <br />
                    <input type="password" placeholder="Password"           id="password"        />    <br />
                    <input type="password" placeholder="Confirm Password"   id="confirmPassword" />    <br />
                    <select id="role">
                        <option value="user">User</option>
                        <option value="therapist">Therapist</option>
                    </select>
                    <br />
                        <br />
                    <button onClick={SignUp} className="width">Sign Up</button>
                    <button className="transparent width" onClick={() => {
                        setMode("signin")
                        setErr("")
                        setMsg("")
                    }}> Sign In instead </button>
                </form>}

            </div>
        </center>
    </>);
}
 
export default UserAuth;