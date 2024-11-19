import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";

function Chat() {
  const [currentRoom, setCurrentRoom] = useState(null);

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* مرر setCurrentRoom كـ prop إلى Sidebar */}
      <Sidebar setCurrentRoom={setCurrentRoom} />
      {/* تحقق إذا كان currentRoom موجود وإلا اعرض الرسالة الافتراضية */}
      <ChatArea
        roomname={currentRoom ? currentRoom.name : "Select a room to start chatting"}
        roomid={currentRoom ? currentRoom.id : null}
      />
    </div>
  );
}

export default Chat;
