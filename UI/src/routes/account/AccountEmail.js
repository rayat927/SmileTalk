import userImg from "./../../imgs/user.png"
import jwtDecode from 'jwt-decode';
import { motion } from "framer-motion";
import { box, child } from "./../../global/Variants"

const AccountEmail = () => {

    const user = jwtDecode(localStorage.getItem("token"))   

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (<motion.div>
        <motion.div variants={box} initial="i" animate="a" exit="x" className="center auth" style={{padding: "20px 50px", width: "500px"}}>
            <center>
                <motion.img initial={{rotate: 50}} animate={{rotate: 0}} transition={{delay: 0.1, ease: [2, 2, 1, 1]}}  src={userImg} alt="user" width="160px" />
                    
                <motion.h1 variants={child} initial={{opacity: 0, y: -7}} animate={{opacity: 1, y:0}} transition={{delay: 0.3}} className="rainbow" > { capitalizeFirstLetter(user.email) } </motion.h1>
                <motion.button initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}} transition={{delay: 0.3}}  style={{width: "100%", textAlign: "left"}} > Change Email </motion.button> <br />
                <motion.button initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}} transition={{delay: 0.4}}  style={{width: "100%", textAlign: "left"}} > Verify Email </motion.button> <br />
            </center>
        </motion.div>
    </motion.div>);
}
 
export default AccountEmail;