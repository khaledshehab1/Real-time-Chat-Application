// components/AddUser.js
import React, { useState, useContext, useEffect } from "react";
import { Personel_context } from "../states/contexs";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function AddUser({ closeModal }) {
  const { Personel } = useContext(Personel_context);
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState([]);
  const { roomId , roomname } = useParams();
  // const { roomname } = useParams();
  console.log("Room ID:", roomId);
  const navigateFun = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3003/rooms/room/${roomId}`,
          {
            withCredentials: true,
          }
        );
        setRoom(response.data.users);
      } catch (error) {
        console.error("Error fetching room:", error);
      }
    };

    fetchData();
  }, [roomId]);

  const handleAdd = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:3003/rooms/updateRoom/${roomId}/${email}`
      );
      console.log(response);
    } catch (error) {
      console.log(error);
      console.log(roomId);
      console.log(email);
    }
  };

  return (
    <div className="bg-black bg-opacity-80 ">
      <div className="fixed min-w-screen min-h-screen inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-0 m-0">
        <div className="bg-white w-full sm:w-3/4 md:w-1/2 lg:w-1/3 rounded-lg p-6 shadow-lg relative">
          <button
            onClick={() =>
              navigateFun(`/Room/${roomId}/${Personel.email}/${roomname}`)
            }
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
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={() => {
              handleAdd();
            }}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 block mx-auto"
          >
            ADD
          </button>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default AddUser;
