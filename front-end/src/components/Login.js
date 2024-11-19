import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Login_Context, Personel_context } from "../states/contexs.jsx";
import React, { useContext, useState } from "react";

const url = "http://localhost:3003";

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

const Login = () => {
  const { Login_Show, setLogin } = useContext(Login_Context);
  const { Personel, setPersonel } = useContext(Personel_context);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const navigateFun = useNavigate();

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to handle login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(loginEmail)) {
      setLoginError("Please enter a valid email address.");
      return;
    }

    // const passwordError = validatePassword(loginPassword);
    // if (passwordError) {
    //   setLoginError(passwordError);
    //   return;
    // }

    try {
      console.log(loginPassword);
      const response = await fetch(`${url}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
        credentials: "include",
      });

      const data = await response.json();
      if (data.verify) {
        navigateFun("/vertaction");
      }
      if (data.showError) {
        setLoginError(`${data.title}\n${data.message}`);
        return;
      }

      if (data.success) {
        setLogin(true);
        setPersonel(data); // Assuming data contains Personel info
        setLoginError(""); // Clear any error messages
        navigateFun("/Chat"); // Redirect to dashboard or another route after successful login
      } else {
        setLoginError("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setLoginError("An error occurred during login.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-black">
      <div className="absolute top-0 left-0 text-white text-2xl font-bold m-3">
        chat<span className="text-blue-300">app</span>
      </div>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="mt-6 text-2xl font-bold text-center text-gray-900">
          Login to your account
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
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
                placeholder="example@gmail.com"
                value={loginEmail}
                onChange={(e) => {
                  setLoginEmail(e.target.value);
                  if (validateEmail(e.target.value)) {
                    setLoginError(""); // Clear error if email is valid
                  }
                }}
              />
            </div>
            <div>
              <label htmlFor="password" className="font-bold ml-1">
                Password:
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => {
                  setLoginPassword(e.target.value);
                  // // const passwordError = validatePassword(e.target.value);
                  // if (passwordError) {
                  //   setLoginError(passwordError);
                  // } else {
                  //   setLoginError(""); // Clear error if password is valid
                  // }
                }}
              />
            </div>
          </div>

          {loginError && (
            <div className="text-red-500 text-sm mb-4">{loginError}</div>
          )}

          <div className="flex items-center justify-between">
            <NavLink
              to="/ForgotPassword"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Forgot Password?
            </NavLink>
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 duration-200"
            >
              Login now
            </button>
          </div>

          <div className="flex justify-center text-sm">
            <span className="text-gray-500">Don't Have An Account?</span>
            <NavLink
              to="/signup"
              className="ml-2 font-medium text-blue-600 hover:text-blue-500"
            >
              Sign Up
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
