import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Login_Context, Personel_context } from "../states/contexs.jsx"; // Make sure these contexts are properly exported
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the styles for toastify

// import Message from "./warning.jsx";
import { verify } from "../states/contexs.jsx";
const url = "http://localhost:3003";

// Function to validate password
const validatePassword = (password) => {
  if (password.length < 8 || password.length > 128) {
    return "Password must be between 8-128 characters.";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must include at least one number.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must include at least one lowercase letter.";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Password must include at least one special character.";
  }
  return ""; // No errors
};

const Signup = () => {
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const { setPersonel } = useContext(Personel_context);
  const { verify_info, set_verify_info } = useContext(verify);

  const navigate = useNavigate(); // Use navigate for redirection

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
    return emailRegex.test(email);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(signupEmail)) {
      toast.error("Please enter a valid Email!"); // Error toast
      // alert("Please enter a valid email address.");
      return;
    }

    const passwordError = validatePassword(signupPassword);
    if (passwordError) {
      setErrorMessage(passwordError);
      return;
    }

    if (signupPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${url}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signupEmail,
          password: signupPassword,
        }),
        credentials: "include",
      });

      const data = await response.json();
      if (data.showError) {
        toast.error(`${data.title}\n${data.message}`);
        // alert(`${data.title}\n${data.message}`);
        return;
      }

      if (data.auth) {
        navigate("/vertaction");
        set_verify_info({ email: signupEmail });
      }

      setPersonel(data);
      console.log(data);
      // Clear form inputs after successful signup
      setSignupEmail("");
      setSignupPassword("");
      setConfirmPassword("");
      setErrorMessage("");
      setConfirmPasswordError("");
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("Signup failed. Please try again.");
      // alert("Signup failed. Please try again.");
    }
  };

  // Real-time validation for confirm password
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (signupPassword !== e.target.value) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left side - Welcome message */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-b from-blue-900 to-black items-center justify-center relative">
        <div className="text-white text-center">
          <div className="absolute top-0 left-0 text-white text-2xl font-bold m-3">
            chat<span className="text-blue-300">app</span>
          </div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400 mb-4">
            Welcome.
          </h1>
          <p className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400 mb-2">
            Start your journey now with our Chat App!
          </p>
        </div>
      </div>

      {/* Right side - Sign up form */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-semibold mb-6">Create an account</h2>
          <form onSubmit={handleSignupSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold ml-1">
                Email:
              </label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                required
                className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-bold ml-1">
                Password:
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                value={signupPassword}
                onChange={(e) => {
                  setSignupPassword(e.target.value);
                  const passwordError = validatePassword(e.target.value);
                  if (passwordError) {
                    setErrorMessage(passwordError);
                  } else {
                    setErrorMessage("");
                  }
                }}
              />
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}

            <div className="mb-6">
              <label className="block text-gray-700 font-bold ml-1">
                Confirm Password:
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              {confirmPasswordError && (
                <p className="text-red-500 text-sm mt-2">
                  {confirmPasswordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Create account
            </button>
          </form>
          <p className="text-gray-600 text-center mt-4">
            Already have an account?
            <NavLink to="/login" className="text-blue-500 hover:underline">
              Log in
            </NavLink>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
