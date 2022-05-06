import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import UserAuth from "./routes/auth/Auth";
import Chat from './routes/chat/chat';
import Home from './routes/home/Home';
import { io } from "socket.io-client"
import Room from './routes/room/Room';
import Account from './routes/account/Account';
import AccountEmail from './routes/account/AccountEmail';
import AccountPass from './routes/account/AccountPass';
import { AnimatePresence } from 'framer-motion';

function App() {

  const location = useLocation();
  const socket = io.connect("http://localhost:4000")

  socket.on("connect", () => {
    // console.clear()
    console.log(`%cJoined with id: ${socket.id}`, "color: lightblue; font-size: 20px")
  })

  socket.on("test123", () => {
    console.log("test123 recived")
  })

  return (
    <AnimatePresence exitBeforeEnter>
      <Routes location={location} key={location.key}>

          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<UserAuth />} />
          <Route path="/account" element={<Account socket={socket} />} />
          <Route path="/account/email" element={<AccountEmail />} />
          <Route path="/account/pass" element={<AccountPass />} />
          <Route path="/chat" element={<Chat socket={socket} />} />
          <Route path="/chat/:room" element={<Room socket={socket} />} />

      </Routes>
    </AnimatePresence>
  );
}

export default App;
