// import React, { useState } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function CreateRoomModal({ closeModal, onRoomCreated }) {
//   const [roomName, setRoomName] = useState("");

//   const handleSave = () => {
//     if (roomName.trim() === "") {
//       toast.error("Room name is required", {
//         position: "bottom-right",
//         autoClose: 3000,
//         hideProgressBar: true,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//         className:
//           "bg-white text-black border-l-4 border-red-500 rounded-lg p-4 shadow-lg",
//         icon: "❗",
//       });
//     } else {
//       // هنا يمكنك إضافة المنطق الخاص بإضافة الغرفة الجديدة
//       // يجب استدعاء onRoomCreated لتمرير الغرفة الجديدة
//       onRoomCreated({ _id: Date.now(), name: roomName, users: [] }); // نموذج لتمرير البيانات
//       toast.success("Room created successfully!", {
//         position: "bottom-right",
//         autoClose: 3000,
//         hideProgressBar: true,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//       });

//       // إغلاق النموذج بعد الحفظ
//       closeModal();
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
//       <div className="bg-white w-full md:w-1/2 lg:w-1/3 rounded-lg p-6 shadow-lg relative">
//         <button
//           onClick={closeModal}
//           className="absolute top-2 right-4 text-3xl text-gray-700 hover:text-red-500 transition duration-300"
//         >
//           &times;
//         </button>

//         <h2 className="text-2xl font-semibold mb-4 text-center">Create Room</h2>

//         <label className="block mb-2 text-lg">Room Name</label>
//         <input
//           type="text"
//           placeholder="Enter room name"
//           value={roomName}
//           onChange={(e) => setRoomName(e.target.value)}
//           className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />

//         <button
//           onClick={handleSave}
//           className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 block mx-auto"
//         >
//           Save & Enter Room
//         </button>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// }

// export default CreateRoomModal;

//////////////////////////////////////




// ////////////////////////////////////

// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { FiSettings, FiBell } from "react-icons/fi"; // استيراد ايقونة الإشعارات
// import { AiOutlinePlus } from "react-icons/ai";
// import { Personel_context } from "../states/contexs.jsx";
// import SettingsModal from "./SettingsModal";
// import CreateRoomModal from "./CreateRoomModal";
// import NotificationModal from "./NotificationModal"; // استيراد مودال الإشعارات
// import { useNavigate } from "react-router-dom";

// function Sidebar({ setCurrentRoom }) {
//   const [chats, setChats] = useState();
//   const [showSettingsModal, setShowSettingsModal] = useState(false);
//   const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
//   const [showNotificationModal, setShowNotificationModal] = useState(false); // إضافة حالة للإشعارات
//   const { Personel } = useContext(Personel_context);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.post(
//           "http://localhost:3003/rooms/addRoom",
//           {
//             withCredentials: true,
//           }
//         );
//         setChats(response.data);
//       } catch (error) {
//         console.error("Error fetching chats:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const addNewRoom = (newRoom) => {
//     setChats((prevChats) => ({
//       ...prevChats,
//       data: [...prevChats.data, newRoom],
//     }));
//   };

//   const handleLogout = async () => {
//     try {
//       await axios.post(
//         "http://localhost:3003/logout",
//         {},
//         { withCredentials: true }
//       );

//       navigate("../login");
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

//   return (
//     <div className="w-1/5 bg-gradient-to-b from-blue-900 to-white p-4 relative"> {/* تعديل العرض من w-1/4 إلى w-1/5 */}
//       <h2 className="text-2xl font-bold mb-4 text-white">
//         chat<span className="text-blue-300">app</span>
//       </h2>
//       <div className="flex items-center mb-2">
//         <input
//           type="text"
//           placeholder="Search Rooms, people"
//           className="w-full p-2 border border-gray-300 rounded mr-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
//         />
//         <button
//           className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center"
//           onClick={() => setShowCreateRoomModal(true)}
//         >
//           <AiOutlinePlus className="text-lg" />
//         </button>
//       </div>

//       <h3 className="font-semibold mb-2">Pinned Chats</h3>
//       <div className="space-y-4">
//         {chats ? (
//           chats.data.map((chat) => {
//             const room = chat.users.filter((u) => Personel.email === u);
//             if (room.length > 0) {
//               return (
//                 <div
//                   key={chat._id}
//                   className="flex items-center space-x-4 p-2 bg-white shadow-sm rounded cursor-pointer"
//                   onClick={() =>
//                     setCurrentRoom({ id: chat._id, name: chat.name })
//                   }
//                 >
//                   <img
//                     src={`https://i.pravatar.cc/150?u=${chat._id}`}
//                     className="w-10 h-10 rounded-full"
//                     alt={chat.name}
//                   />
//                   <div>
//                     <p className="font-semibold">{chat.name}</p>
//                     <p className="text-sm text-gray-500">Active</p>
//                   </div>
//                 </div>
//               );
//             }
//             return null;
//           })
//         ) : (
//           <div>No chats available</div>
//         )}
//       </div>

//       {/* قسم النيتفوكيشن */}
//       <div
//         className="absolute bottom-16 left-4 flex items-center space-x-2 cursor-pointer group"
//         onClick={() => setShowNotificationModal(true)}
//       >
//         <FiBell className="text-black text-2xl cursor-pointer group-hover:animate-spinAndMove group-hover:text-blue-600" />
//         <span className="text-black font-semibold group-hover:animate-pushSettings delay-500 group-hover:text-blue-600 ">
//           Notifications
//         </span>
//       </div>

//       {/* قسم الاعدادات */}
//       <div
//         className="absolute bottom-4 left-4 flex items-center space-x-2 cursor-pointer group"
//         onClick={() => setShowSettingsModal(true)}
//       >
//         <FiSettings className="text-black text-2xl cursor-pointer group-hover:animate-spinAndMove group-hover:text-blue-600" />
//         <span className="text-black font-semibold group-hover:animate-pushSettings delay-500 group-hover:text-blue-600 ">
//           Settings
//         </span>
//       </div>

//       {/* عرض مودال الاعدادات */}
//       {showSettingsModal && (
//         <SettingsModal
//           closeSettings={() => setShowSettingsModal(false)}
//           onLogout={handleLogout}
//         />
//       )}

//       {/* عرض مودال الإشعارات */}
//       {showNotificationModal && (
//         <NotificationModal
//           closeNotification={() => setShowNotificationModal(false)}
//         />
//       )}

//       {/* عرض مودال إنشاء الغرف */}
//       {showCreateRoomModal && (
//         <CreateRoomModal
//           closeModal={() => setShowCreateRoomModal(false)}
//           onRoomCreated={addNewRoom}
//         />
//       )}
//     </div>
//   );
// }

// export default Sidebar;

// const handleLogout = async () => {
//   try {
//     await axios.post(
//       "http://localhost:3003/auth/logout",
//       {},
//       { withCredentials: true }
//     );

//     navigate("../login");
//   } catch (error) {
//     console.error("Error logging out:", error);
//   }
// };












// // components/ChatArea.js
// import React, { useEffect, useState, useContext,useRef} from "react";
// import Header from "./Header";
// import { io } from "socket.io-client";
// import { Login_Context, Personel_context } from "../states/contexs.jsx";
// import axios from "axios";

// function ChatArea({ roomname, roomid }) {
//   var { Personel, setPersonel } = useContext(Personel_context);
//   const [text, setText] = useState("");
//   const [sender, setSender] = useState();
//   const [messages, setMessages] = useState();
//   const [message, setTheMessage] = useState();
//   const [recieveMessage, setRecive] = useState();
//   const [change, setChange] = useState(0);
//   const [notification, setNotification] = useState("");
//   const [isAtBottom, setIsAtBottom] = useState(true); // حالة للتحكم في التمرير


//   const endpoint = "http://localhost:3003";
//   let socket;
//   socket = io(endpoint);
//   socket.emit("lets send");
//   console.log("from id", roomid, Personel.email);
//   const chatContainerRef = useRef(null); // مرجع لمنطقة الرسائل
//   const endOfMessagesRef = useRef(null); // مرجع لآخر رسالة


//   useEffect(() => {
//     console.log("roooooooooooooooooooooomid", roomid);
//     const fetch = async () => {
//       const response = await axios.get(`localhost:3003/rooms/room/${roomid}`, {
//         withCredentials: true,
//       });
//       // console.log('reeeessss',response.data.data.messages) //it worked
//       setMessages(response.data.data.messages);
//       // console.log('getr oomid', response.data.data.messages);
//       socket.on("message", ({ text, sender }) => {
//         setTheMessage({ messsage: text, sender: sender });
//         setMessages([...messages, message]);

//         console.log(Personel.email);
//       });

//       socket.on("update", ({ text, sender }) => {
//         setChange(Date.now());
//         // socket.broadcast.emit("update",{text:text, sender:sender});

//         // setNotification(${sender} has send a new message: ${text} At room ${roomname});
//       });

//       if (isAtBottom) {
//         endOfMessagesRef.current?.scrollIntoView({ behavior: "auto" });
//       }
//     };

//     fetch();
//   }, [roomid, text, message, change, isAtBottom]);

//   //  setInterval(()=>{
//   //   setChange(Date.now());
//   //  }, 1000)

//   const sendMessage = () => {
//     // setText('');
//     // console.log("roooooooooooooooooooooomid", roomid);
//     const fetch = async () => {
//       if (text.trim() === "") {
//         console.log("please no empty messages");
//         return;
//       }
//       console.log("click send");
//       await socket.emit("send", {
//         text,
//         sender: Personel.email,
//         roomid: roomid,
//       });
//       setText("");
//       console.log(Personel.email);
//       const response = await axios.get(`localhost:3003/rooms/room/${roomid}`, {
//         withCredentials: true,
//       });
//       console.log("reeeessss", response.data.data.messages);
//       setMessages(response.data.data.messages);
//       console.log("getr oomid", response.data.data.messages);
//       await socket.on("message", ({ sender, message }, change) => {
//         setMessages([...messages, message]);
//       });

//       socket.emit("notify", {
//         roomname: roomname,
//         roomid: roomid,
//         text: text,
//         sender: sender,
//       });
//     };

//     fetch();
//   };
//   if (!messages) {
//     return (
//       <div className="w-3/4 p-4 bg-gradient-to-r from-blue-900 to-black flex items-center justify-center ">
//         <div className="text-white text-center">
//           <div className="text-5xl font-bold text-blue-300 mb-3">
//             chat<span className="text-white">app</span>
//           </div>
//           <div className="text-white text-2xl font-semibold">
//             No chats at the moment
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // رسائل افتراضية

//   return (
//     <div className="w-3/4 flex flex-col bg-gray-100">
//       <Header roomname={roomname} />
//       <div className="flex-1 p-4 overflow-y-auto">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`flex items-start mb-4 ${
//               msg.sender === Personel.email ? "justify-end" : ""
//             }`}
//           >
//             {/* {msg.from !== Personel.email (
//               <img
//                 src={https://i.pravatar.cc/150?img=${currentChat.id}}
//                 className="w-10 h-10 rounded-full mr-2"
//                 alt={currentChat.name}
//               />
//             )} */}
//             <div
//               className={`max-w-sm p-3 rounded-lg ${
//                 msg.sender == Personel.email
//                   ? "bg-blue-500 text-white"
//                   : "bg-white shadow-sm"
//               }`}
//             >
//               <p>{msg.message}</p>
//               <span className="text-xs text-green-800">{msg.time}</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Typing area */}
//       <div className="p-4 bg-white flex items-center space-x-4 border-t">
//         <input
//           type="text"
//           placeholder="Type message..."
//           //   className="w-full p-2 border rounded"
//           className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onChange={(e) => {
//             setText(e.target.value);
//             console.log(e.target.value);
//           }}
//           value={text}
//         />
//         <button
//           className="p-2 rounded-full bg-blue-500 text-white"
//           onClick={() => {
//             sendMessage();
//             // setChange(change+1);
//           }}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ChatArea;

import React, { useState, useContext , useEffect} from "react";
import { Personel_context, Login_Context } from "../states/contexs";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

function AddUser ({ closeModal, onRoomCreated }) {
  var { Personel } = useContext(Personel_context);
  const [email , setEmail] = useState("");

const {roomId} = useParams();

useEffect(() => {
  console.log("Add user in " , roomId); // Debug log
  
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3003/rooms/room/${roomId}`,
        {
          withCredentials: true,
        }
      );
      console.log("the response", response.data);
      console.log("after response", response.data);
    } catch (error) {
      console.error("Error fetching room:", error);
    }
  };

  fetchData();
}, []);




  const handleSave = async () => {
    // const response = await axios.post(
    //   `http://localhost:3003/rooms/addRoom/${roomName}/${users}`,
    //   {
    //     withCredentials: true,
    //   }
    // );
  };

  // Room Number and but it in the params of rooms and then but it in add user

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
      <div className="bg-white w-11/12 md:w-1/2 lg:w-1/3 rounded-lg p-6 shadow-lg relative">
        <button
          onClick={closeModal}
          className="absolute top-2 right-4 text-3xl text-gray-700 hover:text-red-500 transition duration-300"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center">Add User</h2>

        <label className="block mb-2 text-lg">User Email</label>
        <input
          type="text"
          placeholder="Enter your friend Email"
          value={email}
          onChange={(e)=>{setEmail(e.target.value)}}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSave}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 block mx-auto"
        >
          ADD
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AddUser;
