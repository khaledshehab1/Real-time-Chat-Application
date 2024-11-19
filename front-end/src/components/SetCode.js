import React, { useState, useRef } from 'react';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';  // Import the styles for toastify

const SetCode = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (index < 5 && value !== '') {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (code[index] === '') {
        if (index > 0) {
          inputRefs.current[index - 1].focus();
        }
      } else {
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const navigateFun = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredCode = code.join('');

    if (enteredCode.length === 6) {
      toast.success("Code verified successfully.");
      setTimeout(() => {
        navigateFun("/changepassword");
      }, 1000);

    } else {
      toast.error("Please enter a valid 6-digit code.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-black">
      <div className="absolute top-0 left-0 text-white text-2xl font-bold m-3">
        chat<span className="text-blue-300">app</span>
      </div>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="mt-6 text-2xl font-bold text-center text-gray-900">
          Enter Verification Code
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            ))}
          </div>

          <div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 duration-200"
            >
              Verify Code
            </button>
          </div>
        </form>
      </div>

      {/* Add ToastContainer at the bottom of your component */}
      <ToastContainer />
    </div>
  );
};

export default SetCode;
