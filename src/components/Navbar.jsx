import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../App";

const Navbar = () => {
  const { state } = useContext(UserContext) || { role: "" };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const RenderMenu = () => {
    switch (state.role) {
      case "admin":
        return (
          <>
            <NavLink
              className="text-gray-300 hover:text-white px-3 py-2"
              to="/logout"
            >
              Logout
            </NavLink>
          </>
        );
      case "user":
        return (
          <>
            <NavLink
              className="text-gray-300 hover:text-white px-3 py-2"
              to="/grievance"
            >
              Grievance
            </NavLink>
            <NavLink
              className="text-gray-300 hover:text-white px-3 py-2"
              to="/about"
            >
              About
            </NavLink>
            <NavLink
              className="text-gray-300 hover:text-white px-3 py-2"
              to="/logout"
            >
              Logout
            </NavLink>
          </>
        );
      default:
        return (
          <>
            <NavLink
              className="text-gray-300 hover:text-white px-3 py-2"
              to="/"
            >
              Home
            </NavLink>
            <NavLink
              className="text-gray-300 hover:text-white px-3 py-2"
              to="/login"
            >
              Login
            </NavLink>
            <NavLink
              className="text-gray-300 hover:text-white px-3 py-2"
              to="/AdminLogin"
            >
              Admin Login
            </NavLink>
            <NavLink
              className="text-gray-300 hover:text-white px-3 py-2"
              to="/signup"
            >
              Signup
            </NavLink>
          </>
        );
    }
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <NavLink
          className="text-white text-xl font-semibold"
          to="/"
        >
          Grievance Portal
        </NavLink>

        {/* Mobile Menu Button */}
        <button
          className="text-white lg:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Mobile Sidebar */}
        <div
          className={`lg:hidden fixed top-0 right-0 h-full w-64 bg-gray-800 transform ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          } transition-transform duration-300 ease-in-out z-50`}
        >
          <div className="p-4">
            <button
              className="text-white float-right"
              onClick={() => setIsSidebarOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col space-y-4 mt-8">
              <RenderMenu />
            </div>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex lg:items-center space-x-4">
          <RenderMenu />
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
