import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Login_Context, Personel_context } from "../states/contexs.jsx";
import React, { useContext, useState } from "react";
import ReactCodeInput from "react-verification-code-input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the styles for toastify

const url = "http://localhost:3003";

const VerificationForm = () => {
  const { Personel, setPersonel } = useContext(Personel_context);
  const [num, setNum] = useState(""); // Use a string to match the expected input
  const navigateFun = useNavigate();

  // Function to handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Validate input (optional)

    try {
      const response = await fetch(`${url}/auth/verification/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: Personel.email,
          num: num,
        }),
        credentials: "include",
      });

      const data = await response.json();
      if (data.showError) {
        toast.error(`${data.title}\n${data.message}`);
        // alert(`${data.title}\n${data.message}`);
        return;
      }
      console.log(data);

      if (data.success) {
        setPersonel(data); // Assuming data contains Personel info
        toast.success(`${data.title}\n${data.message}`);
        // alert(`${data.title}\n${data.message}`);
        navigateFun("/Login"); // Redirect to the desired route after successful verification
      } else {
        toast.error(`${data.title}\n${data.message}`);
        // alert(`${data.title}\n${data.message}`);
      }
    } catch (error) {
      console.error("Error during verification:", error);
      toast.error("An error occurred during verification.");
      // alert("An error occurred during verification.");
    }
  };

  const handleReVertaction = async (e) => {
    e.preventDefault();

    try {
      const endpoint = `${url}/auth/ReVertaction`;
      console.log("Sending request to:", endpoint); // Debugging line
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: Personel.email }),
        credentials: "include",
      });

      const data = await response.json(); // Moved this line below the console log
      console.log("Response data:", data); // Debugging line

      if (data.showError) {
        toast.error(`${data.title}\n${data.message}`);
        // alert(`${data.title}\n${data.message}`);
        return;
      }

      if (data.success) {
        toast.success(`${data.title}\n${data.message}`);
        // alert(`${data.title}\n${data.message}`);
      } else {
        toast.error(`${data.title}\n${data.message}`);
        // alert(`${data.title}\n${data.message}`);
      }
    } catch (error) {
      console.error("Error during resending verification:", error);
      toast.error("An error occurred during resending verification.");
      // alert("An error occurred during resending verification.");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-black">
      <div className="absolute top-0 left-0 text-white text-2xl font-bold m-3">
        chat<span className="text-blue-300">app</span>
      </div>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="mt-6 text-2xl font-bold text-center text-gray-900">
          Enter your code
        </h2>
        <ReactCodeInput
          value={num}
          onChange={(value) => {
            console.log(value);
            setNum(value); // Set the full input code
          }}
        />

        <div className="flex flex-row justify-center w-full my-5">
          <button
            type="submit" // Can be 'button' since you're handling submission
            onClick={handleSubmit}
            className="w-25 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 duration-200"
          >
            Verify
          </button>
        </div>

        <div className="text-lg">
          <span className="text-gray-500">Didn't receive email?</span>
          <a
            onClick={handleReVertaction}
            className="text-blue-600 hover:underline ml-2 font-bold"
          >
            Try again
          </a>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default VerificationForm;
