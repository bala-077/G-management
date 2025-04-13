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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState("");

  const userContact = async () => {
    try {
      const res = await fetch("http://localhost:8000/getdata", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });
  
      const data = await res.json();
      
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

  const handleInputs = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setUserData({ ...userData, file });
    setFileName(file ? file.name : "");
  };

  // Add new state for toast modal
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState(""); // "success" or "error"
  const [showToast, setShowToast] = useState(false);

  // Add custom toast function
  const showCustomToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const { name, email, phone, dept, grievance, file } = userData;

    if (!dept || !grievance) {
      showCustomToast("Please fill all required fields!", "error");
      setIsSubmitting(false);
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
        throw new Error(data.error || "Error submitting grievance");
      }

      showCustomToast("Grievance filed successfully! We'll notify you when there's a response.", "success");
    } catch (error) {
      showCustomToast(error.message || 'Error submitting grievance', "error");
    }
  };

  return (
    <div className=" flex items-center justify-center p-4  mt-12 md:p-8">
      {/* Add Toast Modal */}
      {showToast && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
          toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white z-50 animate-fade-in-down`}>
          <div className="flex items-center">
            {toastType === 'success' ? (
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <p>{toastMessage}</p>
          </div>
        </div>
      )}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header with decorative element */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
          <h2 className="text-3xl font-bold text-white">
            File a Grievance
          </h2>
          <p className="text-blue-100 mt-2">
            We're here to help resolve your concerns
          </p>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-blue-800 mb-1">Name</label>
                  <div className="text-gray-700 font-medium">{userData.name || '-'}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-blue-800 mb-1">Email</label>
                  <div className="text-gray-700 font-medium">{userData.email || '-'}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-blue-800 mb-1">Phone</label>
                  <div className="text-gray-700 font-medium">{userData.phone || '-'}</div>
                </div>
              </div>

              {/* Department Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  name="dept"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={userData.dept}
                  onChange={handleInputs}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Education">Education</option>
                  <option value="Health Ministry">Health Ministry</option>
                  <option value="Service Provider">Service Provider</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {/* Grievance Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grievance Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[150px]"
                  name="grievance"
                  value={userData.grievance}
                  onChange={handleInputs}
                  placeholder="Please describe your grievance in detail..."
                  required
                ></textarea>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supporting Document (Optional)
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex flex-col items-center justify-center w-full max-w-xs px-4 py-6 bg-white text-blue-600 rounded-lg border-2 border-dashed border-blue-300 cursor-pointer hover:bg-blue-50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="mt-2 text-sm font-medium">Choose file</span>
                    <input
                      type="file"
                      id="fileInput"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*,.pdf,.doc,.docx"
                    />
                  </label>
                  <div className="flex-1">
                    {fileName ? (
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-700 truncate max-w-xs">{fileName}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setUserData({ ...userData, file: null });
                            setFileName("");
                            document.getElementById('fileInput').value = '';
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No file selected</p>
                    )}
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Supported formats: JPG, PNG, PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'}`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Submit Grievance"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Grievance;