import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <nav className="flex justify-between p-5">
        <div className="text-white text-2xl font-bold">
          chat<span className="text-blue-300">app</span>
        </div>

        <div className="flex items-center">
          <ul className="flex space-x-6 text-white">
            <li>
              <NavLink to="/AboutUs" className="hover:text-blue-300   ">
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className="hover:text-blue-300">
                Contact
              </NavLink>
            </li>
            <li>
              <NavLink to="/login" className="hover:text-blue-300">
                Log In
              </NavLink>
            </li>
          </ul>

          <button className="bg-white text-blue-950 px-4 py-2 rounded hover:bg-blue-100 ml-4">
            Try It Free
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
