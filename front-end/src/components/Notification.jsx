import React from "react";
import { useState, useEffect } from "react";

import { io } from "socket.io-client";

import NotificationList from "./NotificationList";

const Notification = () => {
  const [text, setText] = useState();
  const [sender, setSender] = useState();
  const [roomid, SetRoomid] = useState();
  const [roomname, setRoomName] = useState();
  const [newNotification, setNewNotification] = useState();
  let socket;
  const endpoint = "http://localhost:3003";

  useEffect(() => {
   socket = io(endpoint);

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    //  const handleTakeData = ({ roomid, roomname, text, sender }) => {
    //    setNewNotification({ roomname, messages: text, sender });
    //    
    //  };

   

    return () => {
      socket.off("takedata"); // Cleanup listener
      socket.disconnect(); // Disconnect socket on unmount
    };
  }, [newNotification]);
  return (
    <div className="notification-page p-6 min-h-screen bg-gradient-to-b from-blue-900 to-black">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">
        Notifications
      </h2>
      {}
      <NotificationList newNotification={newNotification} />
    </div>
  );
};

export default Notification;