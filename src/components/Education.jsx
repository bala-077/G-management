import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const GrievanceStatus = () => {
  const [grievances, setGrievances] = useState([]);

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

      const data = await res.json();
      console.log(data);

      const filteredData = getList(data);
      setGrievances(filteredData);

      if (!res.status === 200) {
        throw new Error(res.err);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getList = (data) => {
    let grievanceList = [];

    data.forEach((entry) => {
      entry.grievances.forEach((grievance) => {
        if (grievance.dept === "Education") {
          grievanceList.push(grievance);
        }
      });
    });

    return grievanceList;
  };

  return (
    <>
      <div className="container my-5">
        <h2 className="text-center mb-4">Grievance Status</h2>
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-hover text-center">
            <thead className="table-dark">
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
                grievances.map((grievance) => (
                  <tr key={grievance._id}>
                    <td>{grievance._id}</td>
                    <td>{grievance.name}</td>
                    <td>{grievance.email}</td>
                    <td>{grievance.phone}</td>
                    <td>{grievance.dept}</td>
                    <td>{grievance.grievance}</td>
                    <td>
                      <span
                        className={`badge ${
                          grievance.status === "Resolved"
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {grievance.status}
                      </span>
                    </td>
                    <td>{grievance.feedback}</td>
                    <td>{grievance.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-muted">
                    No grievances found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="text-center my-4">
          <Link to="/aAbBcC/updatedocs" className="btn btn-primary mx-2">
            Update Documents
          </Link>
          <Link to="/login" className="btn btn-warning mx-2">
            Logout as Admin
          </Link>
        </div>

        <p className="text-muted text-center fst-italic">
          Note: Copy the grievance ID to update.
        </p>
      </div>


      {/* Styling */}
      <style>
        {`
          .table {
            border-radius: 10px;
            overflow: hidden;
          }

          .table th, .table td {
            padding: 12px;
          }

          .table-hover tbody tr:hover {
            background-color: #f1f1f1;
          }

          .btn {
            padding: 10px 20px;
            font-size: 1rem;
            transition: all 0.3s ease;
          }

          .btn-primary:hover {
            background-color: #0056b3;
          }

          .btn-warning:hover {
            background-color: #e0a800;
          }
        `}
      </style>
    </>
  );
};

export default GrievanceStatus;
