import React, { useState } from "react";
import signpic from "../images/signup.gif";
import { NavLink, useHistory } from "react-router-dom";

const Signup = () => {
  const history = useHistory();
  
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
    phone: "",
    address: "",
  });

  const handleInputs = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    if (!user.name) {
      tempErrors.name = "Name is required";
      isValid = false;
    }
    if (!user.email) {
      tempErrors.email = "Email is required";
      isValid = false;
    }
    if (!user.password) {
      tempErrors.password = "Password is required";
      isValid = false;
    }
    if (user.password !== user.cpassword) {
      tempErrors.cpassword = "Passwords do not match";
      isValid = false;
    }
    if (!user.phone) {
      tempErrors.phone = "Phone number is required";
      isValid = false;
    }
    if (!user.address) {
      tempErrors.address = "Address is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const PostData = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return; // Don't submit if validation fails
    }

    const { name, email, password, cpassword, phone, address } = user;

    const res = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ name, email, password, cpassword, phone, address }),
    });

    const data = await res.json();
    if (data.status === 400 || !data) {
      window.alert("Invalid Credentials");
    } else {
      window.alert("Registration Successful");
      history.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-xl shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-lg p-6">
        <h2 className="text-3xl font-normal text-gray-700 text-center mb-8">Create an Account</h2>
        
        <div className="flex flex-row gap-8">
          <div className="w-1/2">
            <form method="POST" onSubmit={PostData} className="space-y-4">
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleInputs}
                placeholder="Enter name"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}

              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleInputs}
                placeholder="Enter email"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handleInputs}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

              <input
                type="password"
                name="cpassword"
                value={user.cpassword}
                onChange={handleInputs}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500"
              />
              {errors.cpassword && <p className="text-red-500 text-sm mt-1">{errors.cpassword}</p>}

              <input
                type="text"
                name="phone"
                value={user.phone}
                onChange={handleInputs}
                placeholder="Enter phone"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}

              <input
                type="text"
                name="address"
                value={user.address}
                onChange={handleInputs}
                placeholder="Enter address"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Register
              </button>

              <p className="text-center text-gray-600 mt-4">
                Already have an account?{" "}
                <NavLink to="/login" className="text-blue-500 hover:text-blue-600">
                  Log in
                </NavLink>
              </p>
            </form>
          </div>

          <div className="w-1/2 flex items-center justify-center">
            <img src={signpic} alt="signup illustration" className="w-full h-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
