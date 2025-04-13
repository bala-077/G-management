import React, { useEffect, useState } from "react";

const Grievance = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    dept: "",
    grievance: "",
    file: null
  });

  const [loading, setLoading] = useState(true);

  const userContact = async () => {
    try {
      const res = await fetch("http://localhost:8000/getdata", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include" // Add this to include cookies
      });
  
      const data = await res.json();
      
      // Update this part to correctly access the user data
      setUserData({
        ...userData,
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || ""
      });
  
      setLoading(false);
  
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    userContact();
  }, []);

  // Handle form inputs
  const handleInputs = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  // Handle file input
  const handleFileChange = (event) => {
    setUserData({ ...userData, file: event.target.files[0] });
  };

  // Submit grievance
  const handleSubmit = async (event) => {
    event.preventDefault();

    const { name, email, phone, dept, grievance, file } = userData;

    if (!dept || !grievance) {
      alert("Please fill all required fields!");
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('dept', dept);
    formData.append('grievance', grievance);
    if (file) {
      formData.append('file', file);
    }

    try {
      const res = await fetch("/grievance", {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error submitting grievance");
        return;
      }

      alert("Grievance Filed Successfully! We'll inform you when there's a response.");
      setUserData({ ...userData, dept: "", grievance: "", file: null });
      // Reset file input
      document.getElementById('fileInput').value = '';
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting grievance');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-2xl shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-lg p-8">
        <h2 className="text-3xl font-normal text-blue-500 text-center mb-8">
          File a Grievance
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : (
          <form method="POST" className="space-y-6" onSubmit={handleSubmit}>
            {/* Name, Email, Phone Row */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200"
                  name="name"
                  value={userData.name}
                  placeholder="Your Name"
                  readOnly
                />
              </div>
              <div>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200"
                  name="email"
                  value={userData.email}
                  placeholder="Your Email"
                  readOnly
                />
              </div>
              <div>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200"
                  name="phone"
                  value={userData.phone}
                  placeholder="Your Phone"
                  readOnly
                />
              </div>
            </div>

            {/* Department Selection */}
            <div>
              <select
                name="dept"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200"
                value={userData.dept}
                onChange={handleInputs}
                required
              >
                <option value="">-- Select Department --</option>
                <option value="Education">Education</option>
                <option value="Health Ministry">Health Ministry</option>
                <option value="Service Provider">Service Provider</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Message Area */}
            <div>
              <textarea
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 min-h-[150px]"
                name="grievance"
                value={userData.grievance}
                onChange={handleInputs}
                placeholder="Describe your grievance here..."
                required
              ></textarea>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-gray-600 mb-2">
                Upload Supporting Document (Optional)
              </label>
              <input
                type="file"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200"
                id="fileInput"
                name="file"
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx"
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="px-8 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                Submit Grievance
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Grievance;
