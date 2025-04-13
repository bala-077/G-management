import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const GrievanceStatus = () => {
  const [grievances, setGrievances] = useState([]);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleRowClick = (grievance) => {
    setSelectedGrievance(grievance);
    setIsModalOpen(true);
  };

  const getData = async () => {
    try {
      setLoading(true);
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
        setGrievances(data.flatMap(user => user.grievances || []));
      } else {
        setGrievances([]);
      }
    } catch (err) {
      console.error("Error fetching grievances:", err);
      } finally {
      setLoading(false);
      }
  };

  useEffect(() => {
    getData();
  }, []);

  // Filtering and sorting logic
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortOrder, setSortOrder] = useState('desc');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  const categories = ['All', 'Education', 'Health Ministry', 'Service Provider', 'Others'];
  const statusOptions = ['All', 'Not seen', 'In Process', 'Referred to concerned Authority', 'Closed'];

  const filteredGrievances = grievances
    .filter(g => selectedCategory === 'All' || g.dept === selectedCategory)
    .filter(g => selectedStatus === 'All' || g.status === selectedStatus)
    .filter(g => {
      if (!fromDate && !toDate) return true;
      const grievanceDate = new Date(g.date);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      
      if (from && to) return grievanceDate >= from && grievanceDate <= to;
      if (from) return grievanceDate >= from;
      if (to) return grievanceDate <= to;
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredGrievances.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredGrievances.length / itemsPerPage);

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Not seen': 'bg-gray-100 text-gray-800',
      'In Process': 'bg-blue-100 text-blue-800',
      'Referred to concerned Authority': 'bg-purple-100 text-purple-800',
      'Closed': 'bg-green-100 text-green-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Grievance Management</h1>
            <p className="text-sm text-gray-500">Track and manage submitted grievances</p>
          </div>
          <div className="flex space-x-3">
            <Link 
              to="/aAbBcC/updatedocs" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Update Documents
            </Link>
            <Link 
              to="/login" 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              Logout
            </Link>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <span className="flex items-center">to</span>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z" />
                </svg>
                {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Items per page:</span>
              <select
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500">Total Grievances</div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">{grievances.length}</div>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500">Pending</div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">
              {grievances.filter(g => g.status === 'Not seen').length}
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500">In Process</div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">
              {grievances.filter(g => g.status === 'In Process').length}
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500">Closed</div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">
              {grievances.filter(g => g.status === 'Closed').length}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filteredGrievances.length)}</span> of <span className="font-medium">{filteredGrievances.length}</span> results
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            {selectedStatus !== 'All' && ` with status "${selectedStatus}"`}
          </div>
        </div>

        {/* Grievance Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading grievances...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              <p>Error loading grievances: {error.message}</p>
              <button 
                onClick={getData}
                className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grievance</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.length > 0 ? (
                      currentItems.map((grievance, index) => (
                        <tr 
                          key={index} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleRowClick(grievance)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs">
                            {grievance._id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {grievance.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {grievance.dept}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                            {grievance.grievance}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(grievance.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(grievance.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRowClick(grievance);
                              }}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                          No grievances found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filteredGrievances.length)}</span> of <span className="font-medium">{filteredGrievances.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === i + 1
                              ? 'z-10 bg-indigo-500 border-indigo-500 text-indigo-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Grievance Detail Modal */}
        {isModalOpen && selectedGrievance && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setIsModalOpen(false)}></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Grievance Details
                        </h3>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                          onClick={() => setIsModalOpen(false)}
                        >
                          <span className="sr-only">Close</span>
                          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-4 grid grid-cols-1 gap-y-4 gap-x-8 sm:grid-cols-2">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Grievance ID</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedGrievance._id}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Date Submitted</h4>
                          <p className="mt-1 text-sm text-gray-900">
                            {new Date(selectedGrievance.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Name</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedGrievance.name}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Email</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedGrievance.email}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedGrievance.phone}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Department</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedGrievance.dept}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <h4 className="text-sm font-medium text-gray-500">Grievance Description</h4>
                          <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                            {selectedGrievance.grievance}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Status</h4>
                          <div className="mt-1">
                            {getStatusBadge(selectedGrievance.status)}
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <h4 className="text-sm font-medium text-gray-500">Feedback</h4>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedGrievance.feedback || 'No feedback provided yet'}
                          </p>
                        </div>
                        // Add this inside the modal content, after the feedback section
                        <div className="sm:col-span-2">
                          <h4 className="text-sm font-medium text-gray-500">Supporting Document</h4>
                          {selectedGrievance.fileUrl ? (
                            <div className="mt-2">
                              {selectedGrievance.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                <img 
                                  src={`http://localhost:8000${selectedGrievance.fileUrl}`}
                                  alt="Supporting document"
                                  className="max-w-md rounded-lg shadow-sm"
                                />
                              ) : (
                                <a 
                                  href={`http://localhost:8000${selectedGrievance.fileUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 hover:text-indigo-800 flex items-center"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                  </svg>
                                  View Document
                                </a>
                              )}
                            </div>
                          ) : (
                            <p className="mt-1 text-sm text-gray-500">No supporting document uploaded</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedGrievance._id);
                      alert('Grievance ID copied to clipboard!');
                    }}
                  >
                    Copy ID
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <p className="mt-6 text-sm text-gray-500 text-center">
          <em>Note: Copy the grievance ID to update documents or track status.</em>
        </p>
      </div>
    </div>
  );
};

export default GrievanceStatus;