import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../App";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch } = useContext(UserContext);
  const history = useHistory();

  const getAccess = () => {
    if (email === "admin@gmail.com" && password === "admin") {
      dispatch({ type: "LOGIN_ADMIN", payload: true });
      window.alert("Login Successful");
      history.push("/aAbBcC");
    } else if (email === "admin.edu@gmail.com" && password === "education") {
      dispatch({ type: "LOGIN_ADMIN", payload: true });
      window.alert("Login Successful");
      history.push("/education");
    } else if (email === "admin.health@gmail.com" && password === "health") {
      dispatch({ type: "LOGIN_ADMIN", payload: true });
      window.alert("Login Successful");
      history.push("/health");
    } else if (email === "admin.service@gmail.com" && password === "service") {
      dispatch({ type: "LOGIN_ADMIN", payload: true });
      window.alert("Login Successful");
      history.push("/service");
    } else {
      window.alert("You don't have this access");
    }
  };

  return (
    <>
      {/* Full-screen gradient background */}
      <section className="h-screen bg-gradient-to-r from-blue-500 to-teal-500 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg max-w-sm w-full shadow-xl border border-gray-300">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
            Admin Login
          </h2>

          {/* Welcome Text */}
          <p className="text-center text-gray-600 mb-4">
            Welcome back! Please log in to continue managing the platform.
          </p>

          <form onSubmit={getAccess}>
            {/* Email Input */}
            <div className="mb-6">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full p-4 bg-gray-100 rounded-lg text-gray-800 placeholder-gray-400 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ease-in-out duration-300"
              />
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full p-4 bg-gray-100 rounded-lg text-gray-800 placeholder-gray-400 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ease-in-out duration-300"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-all ease-in-out duration-300"
            >
              Log In
            </button>
          </form>
        </div>
      </section>

    </>
  );
};

export default AdminLogin;
