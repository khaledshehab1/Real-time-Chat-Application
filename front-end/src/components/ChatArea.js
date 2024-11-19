import React, { useEffect, useState, useContext,useRef} from "react";
import Header from "./Header";
import { io } from "socket.io-client";
import AddUser from "./AddUser.jsx";
import { Login_Context, Personel_context } from "../states/contexs.jsx";
import axios from "axios";

function ChatArea({ roomname, roomid }) {
  var { Personel, setPersonel } = useContext(Personel_context);
  const [text, setText] = useState("");
  const [sender, setSender] = useState();
  const [messages, setMessages] = useState();
  const [message, setTheMessage] = useState();
  const [recieveMessage, setRecive] = useState();
  const [change, setChange] = useState(0);
  const [notification, setNotification] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true); // حالة للتحكم في التمرير
  const [showAddUser, setshowAddUser] = useState(false);


  const endpoint = "http://localhost:3003";
  let socket;
  socket = io(endpoint);
  socket.emit("lets send");
  console.log("from id", roomid, Personel.email);
  const chatContainerRef = useRef(null); // مرجع لمنطقة الرسائل
  const endOfMessagesRef = useRef(null); // مرجع لآخر رسالة


  useEffect(() => {
    console.log("roooooooooooooooooooooomid", roomid);
    const fetch = async () => {
      const response = await axios.get(`http://localhost:3003/rooms/room/${roomid}`, {
        withCredentials: true,
      });
      // console.log('reeeessss',response.data.data.messages) //it worked
      setMessages(response.data.data.messages);
      // console.log('getr oomid', response.data.data.messages);
      socket.on("message", ({ text, sender }) => {
        setTheMessage({ messsage: text, sender: sender });
        setMessages([...messages, message]);

        console.log(Personel.email);
      });

      socket.on("update", ({ text, sender }) => {
        setChange(Date.now());
        // socket.broadcast.emit("update",{text:text, sender:sender});

        // setNotification(${sender} has send a new message: ${text} At room ${roomname});
      });

      if (isAtBottom) {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "auto" });
      }
    };

    fetch();
  }, [roomid, text, message, change, isAtBottom]);

  //  setInterval(()=>{
  //   setChange(Date.now());
  //  }, 1000)

  const sendMessage = () => {
    // setText('');
    // console.log("roooooooooooooooooooooomid", roomid);
    const fetch = async () => {
      if (text.trim() === "") {
        console.log("please no empty messages");
        return;
      }
      console.log("click send");
      await socket.emit("send", {
        text,
        sender: Personel.email,
        roomid: roomid,
      });
      setText("");
      console.log(Personel.email);
      const response = await axios.get(`http://localhost:3003/rooms/room/${roomid}`, {
        withCredentials: true,
      });
      console.log("reeeessss", response.data.data.messages);
      setMessages(response.data.data.messages);
      console.log("getr oomid", response.data.data.messages);
      await socket.on("message", ({ sender, message }, change) => {
        setMessages([...messages, message]);
      });

      socket.emit("notify", {
        roomname: roomname,
        roomid: roomid,
        text: text,
        sender: sender,
      });
    };

    fetch();
  };
  if (!messages) {
    return (
      <div className="w-4/5 p-4 bg-gradient-to-r from-blue-900 to-black flex items-center justify-center ">
        <div className="text-white text-center">
          <div className="text-5xl font-bold text-blue-300 mb-3">
            chat<span className="text-white">app</span>
          </div>
          <div className="text-white text-2xl font-semibold">
            No chats at the moment
          </div>
        </div>
      </div>
    );
  }

  // رسائل افتراضية

  return (
    <div className="w-4/5 flex flex-col bg-gray-100">
      <Header roomname={roomname} roomid={roomid}/>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start mb-4 ${
              msg.sender === Personel.email ? "justify-end" : ""
            }`}
          >
            {/* {msg.from !== Personel.email (
              <img
                src={https://i.pravatar.cc/150?img=${currentChat.id}}
                className="w-10 h-10 rounded-full mr-2"
                alt={currentChat.name}
              />
            )} */}
            <div
              className={`max-w-sm p-3 rounded-lg ${
                msg.sender == Personel.email
                  ? "bg-blue-500 text-white"
                  : "bg-white shadow-sm"
              }`}
            >
              <p>{msg.message}</p>
              <span className="text-xs text-green-800">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Typing area */}
      <div className="p-4 bg-white flex items-center space-x-4 border-t">
        <input
          type="text"
          placeholder="Type message..."
          //   className="w-full p-2 border rounded"
          className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            setText(e.target.value);
            console.log(e.target.value);
          }}
          value={text}
        />
        <button
          className="p-2 rounded-full bg-blue-500 text-white"
          onClick={() => {
            sendMessage();
            // setChange(change+1);
          }}
        >
          Send
        </button>
      </div>
      {showAddUser && <AddUser closeModal={() => setshowAddUser(false)} />}

    </div>
  );
}

export default ChatArea;
