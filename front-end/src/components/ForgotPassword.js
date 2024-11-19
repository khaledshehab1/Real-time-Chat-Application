import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the styles for toastify

const ForgotPassword = () => {
  const navigateFun = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email !== "" && emailPattern.test(email)) {
      toast.success("Password reset link sent to your email."); // Success toast
      setTimeout(() => navigateFun("/SetCode"), 1000); // Navigate back to SetCode after 2 seconds
    } else {
      toast.error("Please enter a valid Email!"); // Error toast
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-black">
      <div className="absolute top-0 left-0 text-white text-2xl font-bold m-3">
        chat<span className="text-blue-300">app</span>
      </div>
      <div className="w-11/12 max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="mt-6 text-2xl font-bold text-center text-gray-900">
          Reset Password
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="font-bold ml-1">
                Email:
              </label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 duration-200"
            >
              Send Reset Link
            </button>
          </div>
        </form>
      </div>

      {/* Add ToastContainer at the bottom of your component */}
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
