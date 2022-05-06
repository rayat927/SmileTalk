import jwtDecode from 'jwt-decode';
import { child, box, slideInLeft } from '../../global/Variants';
import { motion } from 'framer-motion';
import userImg from "./../../imgs/user.png"

const AccountPass = () => {

    const user = jwtDecode(localStorage.getItem("token"))

    return (<motion.div>
    <motion.div  variants={box} initial="i" animate="a" exit="x" className="center auth" style={{padding: "20px 50px", width: "500px"}}>
        <center>
            <motion.img initial={{rotate: 50}} animate={{rotate: 0}} transition={{delay: 0.1, ease: [2, 2, 1, 1]}} src={userImg} alt="user" width="160px" />

            <motion.h1 variants={child} initial="i" animate="a" transition={{delay: 0.3}} className="rainbow"> Password </motion.h1>

            <div>
                <motion.button variants={slideInLeft} initial="i" animate="a" exit="x" transition={{delay: 0.3}} style={{width: "100%", textAlign: "left", margin: "none"}} > Set up <span className="rainbow bold">Passwordless</span> login </motion.button>
                <motion.button variants={slideInLeft} initial="i" animate="a" exit="x" transition={{delay: 0.4}} style={{width: "100%", textAlign: "left", margin: "none"}} > Enable <span className="rainbow bold">2FA</span> </motion.button>
                <motion.button variants={slideInLeft} initial="i" animate="a" exit="x" transition={{delay: 0.5}} style={{width: "100%", textAlign: "left", margin: "none"}} > Change Password </motion.button>
            </div>
            
        </center>
    </motion.div>
</motion.div>);
}
 
export default AccountPass;