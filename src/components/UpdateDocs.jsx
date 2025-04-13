import React, { useState } from "react";

const UpdateDocs = () => {
  const [gId, setGId] = useState("");
  const [_id, setMId] = useState("");
  const [email, setEmail] = useState("");
  const [dept, setDept] = useState("");
  const [status, setStatus] = useState("");
  const [feedback, setFeedback] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch grievance data
  const getGrievance = async (e) => {
    e.preventDefault();
    setLoading(true);
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
        throw new Error("Failed to fetch grievances");
      }

      const grievances = await res.json();
      const selectedGrievance = findGrievance(grievances);
      
      if (selectedGrievance) {
        setData(selectedGrievance);
        setEmail(selectedGrievance.email);
        setDept(selectedGrievance.dept);
      } else {
        setData(null);
      }
    } catch (err) {
      console.error("Error fetching grievances:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update grievance data
  const updateData = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/updateGrievanceStatus", {  // Correct endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ grievanceId: gId, status, feedback }),  // Correct request body
      });

      if (!res.ok) {
        window.alert("Could not connect to backend");
      } else {
        window.alert("Grievance Updated Successfully");
      }
    } catch (err) {
      console.error("Error updating grievance:", err);
    }
  };

  // Find the specific grievance by ID
  const findGrievance = (grievances) => {
    for (let record of grievances) {
      for (let grievance of record.grievances) {
        if (grievance._id === gId) {
          setMId(record._id);
          return grievance;
        }
      }
    }
    return null;
  };

  return (
    <>
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg p-4">
              <h2 className="text-center mb-4">Update Grievances</h2>
              <hr />

              {/* Search Grievance Form */}
              <form onSubmit={getGrievance}>
                <label htmlFor="GId" className="form-label">
                  Enter the Grievance ID:
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    id="GId"
                    name="GId"
                    value={gId}
                    onChange={(e) => setGId(e.target.value)}
                    className="form-control"
                    required
                  />
                  <button type="submit" className="btn btn-primary">
                    Get Data
                  </button>
                </div>
              </form>

              <hr />

              {/* Display Grievance Details */}
              {loading ? (
                <p className="text-center">Loading...</p>
              ) : data ? (
                <form onSubmit={updateData}>
                  <h4 className="text-primary text-uppercase">Grievance Information</h4>
                  
                  <div className="mb-3">
                    <label className="form-label"><strong>Name:</strong></label>
                    <p>{data.name}</p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label"><strong>Phone:</strong></label>
                    <p>{data.phone}</p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label"><strong>Grievance:</strong></label>
                    <p>{data.grievance}</p>
                  </div>

                  <h4 className="text-primary text-uppercase">Update Information</h4>

                  <div className="mb-3">
                    <label className="form-label"><strong>Email:</strong></label>
                    <p>{email}</p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label"><strong>Department:</strong></label>
                    <p>{dept}</p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label"><strong>Status:</strong></label>
                    <select
                      name="status"
                      id="status"
                      className="form-control"
                      onChange={(e) => setStatus(e.target.value)}
                      required
                    >
                      <option value="Not Seen">Not Seen</option>
                      <option value="In Process">In Process</option>
                      <option value="Referred to concerned Authority">
                        Referred to concerned Authority
                      </option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label"><strong>Feedback:</strong></label>
                    <input
                      type="text"
                      name="feedback"
                      className="form-control"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label"><strong>Date of Filing:</strong></label>
                    <p>{data.date}</p>
                  </div>

                  <button type="submit" className="btn btn-success w-100">
                    Update Status
                  </button>
                </form>
              ) : (
                <p className="text-danger text-center">No data found. Please check the ID.</p>
              )}
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default UpdateDocs;
