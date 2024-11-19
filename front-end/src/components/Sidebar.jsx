import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiSettings, FiBell } from "react-icons/fi"; // استيراد ايقونة الإشعارات
import { AiOutlinePlus } from "react-icons/ai";
import { Personel_context } from "../states/contexs.jsx";
import SettingsModal from "./SettingsModal";
import CreateRoomModal from "./CreateRoomModal";
import AddUser from "./AddUser.jsx";
import NotificationModal from "./NotificationModal"; // استيراد مودال الإشعارات
import { useNavigate } from "react-router-dom";

function Sidebar({ setCurrentRoom }) {
  const [chats, setChats] = useState(); // تعديل للتأكد أن chats يبدأ كمصفوفة فارغة
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [showAddUser, setshowAddUser] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false); // إضافة حالة للإشعارات
  const { Personel } = useContext(Personel_context);
  const navigate = useNavigate();

  useEffect(() => {
    const savedImage = localStorage.getItem("image");
    const savedName = localStorage.getItem("name");

    // if (savedImage) setProfileImage(savedImage);
    // if (savedName) setProfileName(savedName);
    console.log("useEffect is running"); // Debug log
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3003/rooms/getallrooms",
          {
            withCredentials: true,
          }
        );
        console.log("the response", response.data);
        setChats(response.data);
        console.log("after response", response.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3003/auth/logout",
        {},
        { withCredentials: true }
      );

      navigate("../login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="w-1/5 bg-gradient-to-b from-blue-900 to-white p-4 relative">
      {" "}
      {/* تعديل العرض من w-1/4 إلى w-1/5 */}
      <h2 className="text-2xl font-bold mb-4 text-white">
        chat<span className="text-blue-300">app</span>
      </h2>
      <div className="flex items-center mb-2">
        <input
          type="text"
          placeholder="Search Rooms, people"
          className="w-full p-2 border border-gray-300 rounded mr-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center"
          onClick={() => setShowCreateRoomModal(true)}
        >
          <AiOutlinePlus className="text-lg" />
        </button>
      </div>
      <h3 className="font-semibold mb-2">Pinned Chats</h3>
      <div className="space-y-4">
        {console.log("side", chats)}
        {chats ? ( // Check if pinnedChats is defined and has elements
          <>
            <div className="">
              {chats.data.map((chat) => {
                const room = chat.users.filter((u) => {
                  return Personel.email === u;
                });
                if (room.length > 0) {
                  console.log("from room", room);
                  console.log("from if", chat.name);
                  return (
                    <div
                      className="bg-slate-100 hover:bg-gray-300 text-gray-900 p-3 rounded-lg mb-2 cursor-pointer"
                      key={chat._id}
                    >
                      <Link
                        to={`/Room/${chat._id}/${Personel.email}/${chat.name}`}
                      >
                        <div className="flex justify-between text-xl font-bold">
                          {chat.name}
                        </div>
                      </Link>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </>
        ) : (
          <div>No chats available</div>
        )}
        
      </div>{" "}
      {/* قسم النيتفوكيشن */}
      <div
        className="absolute bottom-16 left-4 flex items-center space-x-2 cursor-pointer group"
        onClick={() => navigate(`/notifications`)}
      >
        <FiBell className="text-black text-2xl cursor-pointer group-hover:animate-spinAndMove group-hover:text-blue-600" />
        <span className="text-black font-semibold group-hover:animate-pushSettings delay-500 group-hover:text-blue-600 ">
          Notifications
        </span>
      </div>
      {/* قسم الاعدادات */}
      <div
        className="absolute bottom-4 left-4 flex items-center space-x-2 cursor-pointer group"
        onClick={() => setShowSettingsModal(true)}
      >
        <FiSettings className="text-black text-2xl cursor-pointer group-hover:animate-spinAndMove group-hover:text-blue-600" />
        <span className="text-black font-semibold group-hover:animate-pushSettings delay-500 group-hover:text-blue-600 ">
          Settings
        </span>
      </div>
      {/* عرض مودال الاعدادات */}
      {showSettingsModal && (
        <SettingsModal
          closeSettings={() => setShowSettingsModal(false)}
          onLogout={handleLogout}
        />
      )}
      {/* عرض مودال الإشعارات */}
      {showNotificationModal && (
        <NotificationModal
          closeNotification={() => setShowNotificationModal(false)}
        />
      )}
      {/* عرض مودال إنشاء الغرف */}
      {showCreateRoomModal && (<CreateRoomModal closeModal={() => setShowCreateRoomModal(false)} />)}
    </div>
  );
}

export default Sidebar;
