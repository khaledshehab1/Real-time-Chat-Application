import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
 import ChatArea from "./ChatArea.js";
 import Sidebar from "./Sidebar.jsx";
 import axios from "axios";

const Room = () => {
    const {roomid} = useParams();
    const {email} = useParams();
    const {roomname} = useParams();
   
   let socket;
   const endpoint = "http://localhost:3003";
    
   useEffect(() => {
     socket = io(endpoint);

     socket.emit("connection");
     socket.emit("join", { roomid, email }, (err) => {
       if (err) {
         console.log(err.message);
       }
     });

    //  const fetch = async ()=>{
    //   const res = await axios.get(`http://localhost:3003/rooms/room/${roomid}`).then((res)=>{console.log(res)});
    //   setRoom(res.data)
    //  }
    //   // fetch();
     return () => {
       socket.disconnect(); // Properly disconnect socket on unmount
     };
   }, []);

   return (
     <>
       <div className="flex h-screen">
         <Sidebar />
         <ChatArea roomname={roomname} roomid = {roomid}/>
       </div>
     </>
   );
};

export default Room;

