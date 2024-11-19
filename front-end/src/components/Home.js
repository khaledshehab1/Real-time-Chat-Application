import React from "react";
import Navbar from "./Navbar";
import logo from "../images/hero.svg";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigateFun = useNavigate();

  return (
    <>
      <div className="bg-gradient-to-b from-blue-900 to-black min-h-screen min-w-screen">
        <Navbar />

        {/* Main Content */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-evenly px-10 mt-16">
          {/* Left Side - Text and Buttons */}
          <div className="text-white flex flex-col text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold">
              Hi there, <br />
              <span className="text-4xl md:text-5xl">Start your best chat today!</span>
            </h1>
            <p className="text-lg md:text-xl mt-4">Fast, easy & unlimited team chat.</p>

            {/* Buttons */}
            <div className="mt-6 space-x-4 flex justify-center md:justify-start">
              <button
                className="bg-white text-blue-950 px-6 py-3 rounded-full hover:bg-blue-200 transition-all duration-200"
                onClick={() => {
                  navigateFun("/Signup");
                }}
              >
                Try it Free
              </button>
              <button
                className="border border-white text-white px-6 py-3 rounded-full hover:bg-blue-800 hover:text-white transition-all duration-200"
                onClick={() => navigateFun("/Login")}
              >
                Login
              </button>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="relative overflow-hidden max-w-lg">
            <img src={logo} alt="Chat 2" className="w-full h-auto" /> {/* إضافة w-full و h-auto لجعل الصورة responsive */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
