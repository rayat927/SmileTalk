import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router';
import userImg from "./../../imgs/user.png"
import { motion } from 'framer-motion';
import { box, child, slideInLeft } from "./../../global/Variants"

const Account = ({ socket }) => {

    const user = jwtDecode(localStorage.getItem("token"))
    const nav = useNavigate()

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (<motion.div >
        <motion.div variants={box} initial="i" animate="a" exit="x" className="center auth" style={{padding: "20px 50px", width: "500px"}}>
            <center>
                <motion.img initial={{rotate: 50}} animate={{rotate: 0}} transition={{delay: 0.1, ease: [2, 2, 1, 1]}} src={userImg} alt="user" width="160px" />

                <motion.h1 variants={child} initial="i" animate="a" transition={{delay: 0.3}} className="rainbow"> { user.username } </motion.h1>
                <motion.p style={{transform: "translateY(-20px)", position: "absolute", left: "26%", bottom: "180px"}} variants={child} initial="i" animate="a" transition={{delay: 0.4}} className="rainbow"> { user.userId } </motion.p>

                <div style={{marginTop: "30px"}}>
                    <motion.button variants={slideInLeft} initial="i" animate="a" exit="x" transition={{delay: 0.3}} style={{width: "100%", textAlign: "left", margin: "none"}} onClick={() => {nav("/account/name")}} > <span className="rainbow bold">{ user.username }</span> </motion.button>
                    <motion.button variants={slideInLeft} initial="i" animate="a" exit="x" transition={{delay: 0.4}} style={{width: "100%", textAlign: "left", margin: "none"}} onClick={() => {nav("/account/email")}} > <span className="rainbow bold">{ capitalizeFirstLetter(user.email) }</span> </motion.button>                                                   <br />
                    <motion.button variants={slideInLeft} initial="i" animate="a" exit="x" transition={{delay: 0.5}} style={{width: "100%", textAlign: "left", margin: "none"}}> Registered as <span className="rainbow bold">{ user.role == "user" && "Client" || "Therapist" }</span> </motion.button> <br />
                    <motion.button variants={slideInLeft} initial="i" animate="a" exit="x" transition={{delay: 0.6}} style={{width: "100%", textAlign: "left", margin: "none"}} onClick={() => {nav("/account/pass")}}> Password </motion.button>
                </div>

            </center>
        </motion.div>
    </motion.div>)
}
 
export default Account;