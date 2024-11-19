import React, { useState, useContext } from "react";
import { Personel_context, Login_Context } from "../states/contexs";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateRoomModal({ closeModal, onRoomCreated }) {
  var { Personel } = useContext(Personel_context);
  const [roomName, setRoomName] = useState("");
  const [users, setUsers] = useState([Personel.email]);
  const [messsages, setMesssages] = useState([]);

  const handleSave = async () => {
    const response = await axios.post(
      `http://localhost:3003/rooms/addRoom/${roomName}/${users}`,
      {
        withCredentials: true,
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
      <div className="bg-white w-11/12 md:w-1/2 lg:w-1/3 rounded-lg p-6 shadow-lg relative">
        <button
          onClick={closeModal}
          className="absolute top-2 right-4 text-3xl text-gray-700 hover:text-red-500 transition duration-300"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center">Create Room</h2>

        <label className="block mb-2 text-lg">Room Name</label>
        <input
          type="text"
          placeholder="Enter room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSave}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 block mx-auto"
        >
          Save & Enter Room
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default CreateRoomModal;
