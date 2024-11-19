// components/Header.js
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import AddUser from "./AddUser.jsx";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faVideo,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
import { Login_Context, Personel_context } from "../states/contexs.jsx";

function Header({ roomname, roomid }) {
  const { Login_Show, setLogin } = useContext(Login_Context);
  const { Personel } = useContext(Personel_context);
  const [showAddUser, setshowAddUser] = useState(false);
  const navigatefun = useNavigate();

  const handleAddUserClick = () => {
    setshowAddUser(true);
  };

  const handleCloseModal = () => {
    setshowAddUser(false);
  };

  return (
    <div className="p-4 bg-white border-b flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div>
          <p className="font-semibold text-lg">{roomname}</p>
          <p className="text-xs text-green-500">Online</p>
        </div>
      </div>
      <div className="flex space-x-2 md:space-x-4">
        <Link
          className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center"
          to={`/adduser/${roomid}/${roomname}`}
          onClick={() => {
            // navigatefun(`/adduser/${roomid}`);
            setshowAddUser(true);
          }}
        >
          <AiOutlinePlus className="text-lg" />
        </Link>

        <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 text-blue-700 hover:text-blue-900 transition-all duration-500">
          <FontAwesomeIcon icon={faPhone} />
        </button>
        <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 text-blue-700 hover:text-blue-900 transition-all duration-500">
          <FontAwesomeIcon icon={faVideo} />
        </button>
        <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 text-blue-700 hover:text-blue-900 transition-all duration-500">
          <FontAwesomeIcon icon={faEllipsisH} />
        </button>
        {/* {showAddUser && (
          <AddUser closeModal={handleCloseModal} roomname={roomname} />
        )} */}
      </div>
    </div>
  );
}

export default Header;
