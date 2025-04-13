import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const GrievanceStatus = () => {
  const [grievances, setGrievances] = useState([]);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Remove this unused state
  // const [category] = useState("Education"); // Future feature: Make this dynamic via dropdown
  
  // Add handleRowClick function
  const handleRowClick = (grievance) => {
    setSelectedGrievance(grievance);
    setIsModalOpen(true);
  };

  // Fetch Grievance Data
  const getData = async () => {
    try {
      // Get token from cookie
      const token = document.cookie
        .split(';')
        .find(cookie => cookie.trim().startsWith('jwtoken='))
        ?.split('=')[1];

      if (!token) {
        window.location.href = '/login';
        return;
      }

      const res = await fetch("/grievancelist", {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/login';
          return;
        }
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      if (data && Array.isArray(data)) {
        console.log("Received data:", data);
        setGrievances(data.flatMap(user => user.grievances || []));
      } else {
        console.error("Invalid data format received:", data);
        setGrievances([]);
      }
    } catch (err) {
      console.error("Error fetching grievances:", err);
      if (err.message.includes('jwt') || err.message.includes('401')) {
        window.location.href = '/login';
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Process & Extract Relevant Grievances
  const formatGrievanceData = (data) => {
    return data.flatMap((entry) => entry.grievances);
  };

  // Pagination calculations
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Add categories array
  const categories = ['All', 'Education', 'Health Ministry', 'Service Provider', 'Others'];
  
  // Filter grievances based on selected category
  const filteredGrievances = selectedCategory === 'All' 
    ? grievances 
    : grievances.filter(g => g.dept === selectedCategory);
  
  // Update pagination calculations to use filtered grievances
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredGrievances.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredGrievances.length / itemsPerPage);

  return (
    <>
      <div className="container mt-4">
        <h2 className="text-center mb-3">Grievance Status</h2>

        {/* Category Filter */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <label className="font-medium">Category:</label>
            <select
              className="px-3 py-2 border rounded"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Existing items per page select */}
          <select
            className="px-3 py-2 border rounded"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredGrievances.length)} of {filteredGrievances.length} entries
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mb-4">
          {/* Remove the duplicate pagination controls */}
          <select
            className="px-3 py-2 border rounded"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
          
          <span className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredGrievances.length)} of {filteredGrievances.length} entries
          </span>
        </div>

        {/* Table with fixed sizes */}
        <div className="overflow-x-auto">
          <table className="table table-bordered table-hover table-striped w-full table-fixed">
            <thead className="table-dark text-center">
              <tr>
                <th className="w-32">ID</th>
                <th className="w-28">Name</th>
                <th className="w-40">Email</th>
                <th className="w-28">Phone</th>
                <th className="w-28">Department</th>
                <th className="w-48">Grievance</th>
                <th className="w-24">Status</th>
                <th className="w-32">Feedback</th>
                <th className="w-28">Date</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((grievance, index) => (
                  <tr 
                    key={index} 
                    onClick={() => handleRowClick(grievance)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <td className="truncate px-2">{grievance._id}</td>
                    <td className="truncate px-2">{grievance.name}</td>
                    <td className="truncate px-2">{grievance.email}</td>
                    <td className="truncate px-2">{grievance.phone}</td>
                    <td className="truncate px-2">{grievance.dept}</td>
                    <td className="truncate px-2">{grievance.grievance}</td>
                    <td className="truncate px-2">{grievance.status}</td>
                    <td className="truncate px-2">{grievance.feedback}</td>
                    <td className="truncate px-2">{new Date(grievance.date).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">No grievances found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Buttons */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? 'bg-blue-500 text-white' : ''
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Detail Modal */}
        {isModalOpen && selectedGrievance && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Grievance Details</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                {Object.entries(selectedGrievance).map(([key, value]) => (
                  <div key={key}>
                    <h4 className="font-semibold capitalize">{key}</h4>
                    <p className="mt-1">
                      {key === 'date' ? new Date(value).toLocaleDateString() : value?.toString() || '-'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="text-center mt-3">
          <Link to="/aAbBcC/updatedocs" className="btn btn-primary mx-2">
            Update Documents
          </Link>
          <Link to="/login" className="btn btn-warning mx-2">
            Logout as Admin
          </Link>
        </div>

        <p className="small text-muted text-center mt-3">
          <em>Note: Copy the grievance ID to update.</em>
        </p>
      </div>

    </>
  );
};

export default GrievanceStatus;
