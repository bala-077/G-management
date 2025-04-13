import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const GrievanceStatus = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  const getData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/grievancelist", {  // Update the URL
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch grievances");
      }

      const data = await res.json();
      const filteredData = filterServiceProviderGrievances(data);
      setGrievances(filteredData);
    } catch (err) {
      console.error("Error fetching grievances:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update the date display in the table row
  grievances.map((grievance) => (
    <tr key={grievance._id}>
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

  useEffect(() => {
    getData();
  }, []);

  const filterServiceProviderGrievances = (data) => {
    return data
      .flatMap((entry) => entry.grievances)
      .filter((grievance) => grievance.dept === "Service Provider");
  };

  return (
    <>
      <div className="container my-5">
        <h2 className="text-center mb-4">Grievance Status</h2>
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
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
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : grievances.length > 0 ? (
                grievances.map((grievance) => (
                  <tr key={grievance._id}>
                    <td>{grievance._id}</td>
                    <td>{grievance.name}</td>
                    <td>{grievance.email}</td>
                    <td>{grievance.phone}</td>
                    <td>{grievance.dept}</td>
                    <td>{grievance.grievance}</td>
                    <td>{grievance.status}</td>
                    <td>{grievance.feedback}</td>
                    <td>{grievance.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center text-danger">
                    No grievances found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Buttons */}
        <div className="text-center my-4">
          <Link to="/aAbBcC/updatedocs" className="btn btn-primary mx-3">
            Update Documents
          </Link>
          <Link to="/login" className="btn btn-warning mx-3">
            Logout as Admin
          </Link>
        </div>

        <p className="text-muted text-center" style={{ fontStyle: "italic" }}>
          Note: Copy the grievance ID to update.
        </p>
      </div>

      <Footer />
    </>
  );
};

export default GrievanceStatus;
