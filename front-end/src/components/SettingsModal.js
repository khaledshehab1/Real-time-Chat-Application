import React, { useState, useContext } from "react";
import { FiUser } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";
import { LuPenLine } from "react-icons/lu";
import { ToastContainer, toast } from "react-toastify";
import { Personel_context } from "../states/contexs";
import "react-toastify/dist/ReactToastify.css";

function SettingsModal({ closeSettings, onLogout }) {
  var { Personel, setPersonel } = useContext(Personel_context);
  const [view, setView] = useState("options");
  const [profileImage, setProfileImage] = useState(
    "https://via.placeholder.com/80"
  );
  const [name, setName] = useState("Your Name");
  const [email, setEmail] = useState("yourname@gmail.com");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleSave = () => {
    if (name.trim() === "" || email.trim() === "") {
      toast.error("Both fields are required", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        className:
          "bg-white text-black border-l-4 border-red-500 rounded-lg p-4 shadow-lg",
        icon: "❗",
      });
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid email format.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        className:
          "bg-white text-black border-l-4 border-red-500 rounded-lg p-4 shadow-lg",
        icon: "❗",
      });
    } else if (name.trim().length < 3) {
      toast.error("Name must be at least 3 characters long.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        className:
          "bg-white text-black border-l-4 border-red-500 rounded-lg p-4 shadow-lg",
        icon: "❗",
      });
    } else {
      setView("options");
    }
  };

  const handleLogout = () => {
    toast.success("Logged out successfully!", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      className:
        "bg-white text-black border-l-4 border-green-500 rounded-lg p-4 shadow-lg",
      icon: "✅",
    });
    onLogout(); // Call the onLogout prop to handle the logout action
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
      <div className="bg-white w-full sm:w-3/4 md:w-1/2 lg:w-1/3 rounded-lg p-6 shadow-lg relative">
        <button
          onClick={closeSettings}
          className="absolute top-2 right-4 text-3xl text-gray-700 hover:text-red-500 transition duration-300"
        >
          &times;
        </button>

        {view === "options" && (
          <>
            {/* User info */}
            <div className="flex flex-col sm:flex-row items-center mb-6">
              <img
                src={profileImage}
                alt="Profile"
                className="w-20 h-20 rounded-full mr-0 sm:mr-4 shadow-md border-2 border-gray-300"
              />
              <div className="text-center sm:text-left mt-4 sm:mt-0">
                <h2 className="text-2xl font-semibold text-gray-800">{name}</h2>
                <p className="text-gray-500">{email}</p>
              </div>
            </div>

            <hr className="my-4" />

            {/* Settings list */}
            <ul className="space-y-6 text-lg">
              <li
                className="flex items-center justify-between cursor-pointer hover:text-blue-700 transition duration-300"
                onClick={() => setView("profile")}
              >
                <div className="flex items-center">
                  <FiUser className="text-3xl mr-4" />
                  <span>My Profile</span>
                </div>
                <IoIosArrowForward className="text-3xl" />
              </li>

              <li
                className="flex items-center justify-between cursor-pointer hover:text-blue-700 transition duration-300"
                onClick={() => setView("theme")}
              >
                <div className="flex items-center">
                  <FiUser className="text-3xl mr-4" />
                  <span>Settings</span>
                </div>
                <IoIosArrowForward className="text-3xl" />
              </li>

              <li
                className="flex items-center justify-between cursor-pointer hover:text-red-600 transition duration-300"
                onClick={handleLogout}
              >
                <div className="flex items-center">
                  <IoMdLogOut className="text-3xl mr-4" />
                  <span>Log Out</span>
                </div>
              </li>
            </ul>
          </>
        )}

        {/* Profile Section */}
        {view === "profile" && (
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-6 text-center">Profile</h2>
            <div className="flex flex-col sm:flex-row items-center mb-6">
              <div className="relative">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-20 h-20 rounded-full shadow-lg"
                />
                <label className="absolute bottom-0 right-0 bg-blue-600 p-1 rounded-full cursor-pointer">
                  <LuPenLine className="text-white text-2xl" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <div className="ml-0 sm:ml-4 mt-4 sm:mt-0 text-center sm:text-left">
                <h2 className="text-xl font-semibold">{name}</h2>
                <p className="text-gray-500">{Personel.email}</p>
              </div>
            </div>

            <label className="block mb-2 text-lg">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleSave}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 block mx-auto"
            >
              Save & Back
            </button>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default SettingsModal;
