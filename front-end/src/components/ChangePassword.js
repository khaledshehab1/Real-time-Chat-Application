import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigateFun = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
    } else {
      setErrorMessage("");
      toast.success("Password successfully changed! Redirecting to login...");
      
      // After a short delay for the user to see the toast, navigate to the login page
      setTimeout(() => {
        navigateFun("/login");
      }, 1000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-black px-4">
      <div className="absolute top-0 left-0 text-white text-2xl font-bold m-3">
        chat<span className="text-blue-300">app</span>
      </div>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="mt-6 text-2xl font-bold text-center text-gray-900">
          Change Password
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="mb-6">
              <label className="block text-gray-700 font-bold ml-1">
                New Password:
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-bold ml-1">
                Confirm New Password:
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {errorMessage && (
              <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Add ToastContainer for displaying toasts */}
      <ToastContainer />
    </div>
  );
}

export default ChangePassword;
