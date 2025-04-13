import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const GrievanceStatus = () => {
  const [grievances, setGrievances] = useState([]);

  // Fetch Data
  const getData = async () => {
    try {
      const res = await fetch("/grievancelist", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      setGrievances(getFilteredList(data)); // Set filtered grievances
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Filter Grievances for Health Ministry
  const getFilteredList = (data) => {
    return data.flatMap((item) =>
      item.grievances.filter((g) => g.dept === "Health Ministry")
    );
  };

  return (
    <>
      <div className="container mt-4">
        <h2 className="text-center mb-3">Grievance Status</h2>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover table-striped">
            <thead className="table-dark text-center">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Grievance</th>
                <th>Status</th>
                <th>Feedback</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {grievances.length > 0 ? (
                grievances.map((grievance, index) => (
                  <tr key={index}>
                    <td>{grievance._id}</td>
                    <td>{grievance.name}</td>
                    <td>{grievance.email}</td>
                    <td>{grievance.phone}</td>
                    <td>{grievance.dept}</td>
                    <td>{grievance.grievance}</td>
                    <td>{grievance.status}</td>
                    <td>{grievance.feedback}</td>
                    <td>{new Date(grievance.date).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No grievances found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
