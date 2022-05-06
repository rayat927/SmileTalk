import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";

const Home = () => {

    const nav = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("token")) {
            nav("/chat")
        } else {
            nav("/auth")
        }
    }, [])

    return (<div className="auth center" style={{width: "500px"}}>
        <center>
            <h1 className="f-humungous">Hello!</h1>
            <br />
            <h1>I dont't have time</h1>
            <p>Click one of the button below to do something</p>
            <br />
            <br />
            <Link to="/auth">
                <button>SignUp</button>
                <button onClick={() => {
                    localStorage.removeItem("token")
                }}>Log Out</button>
                <br />
                {localStorage.getItem("token") && <button className="transparent">
                    Message
                </button>}
            </Link>
        </center>
    </div>);
}
 
export default Home;