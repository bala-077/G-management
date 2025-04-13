import React, { useEffect, useState } from "react";

const About = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const callAboutPage = async () => {
    try {
      const res = await fetch("/about", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await res.json();
      setUserData(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    callAboutPage();
  }, []);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="w-full md:w-2/3 lg:w-1/2 p-6 bg-white shadow-xl rounded-lg">
            <h2 className="text-3xl font-bold text-center mb-6">My Profile</h2>
            <hr className="my-4 border-t-2 border-gray-200" />

            {loading ? (
              <p className="text-center text-lg text-gray-500">Loading...</p>
            ) : userData ? (
              <>
                {/* Personal Information */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-teal-600 uppercase mb-2">
                    Personal Information
                  </h4>
                  <p className="text-gray-700">
                    <strong>Name:</strong> {userData.name}
                  </p>
                  <p className="text-gray-700">
                    <strong>Address:</strong> {userData.address}
                  </p>
                </div>

                <hr className="my-4 border-t-2 border-gray-200" />

                {/* Contact Information */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-teal-600 uppercase mb-2">
                    Contact Information
                  </h4>
                  <p className="text-gray-700">
                    <strong>Phone:</strong> {userData.phone}
                  </p>
                  <p className="text-gray-700">
                    <strong>Email:</strong> {userData.email}
                  </p>
                </div>

                <hr className="my-4 border-t-2 border-gray-200" />

                {/* Grievances Section */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-teal-600 uppercase mb-2">
                    Grievances
                  </h4>
                  {userData.grievances && userData.grievances.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white table-auto border-collapse">
                        <thead className="bg-teal-500 text-white">
                          <tr>
                            <th className="py-2 px-4 border">Date</th>
                            <th className="py-2 px-4 border">Department</th>
                            <th className="py-2 px-4 border">Grievance</th>
                            <th className="py-2 px-4 border">Status</th>
                            <th className="py-2 px-4 border">Feedback</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userData.grievances.map((grievance, index) => (
                            <tr key={index} className="text-gray-700">
                              <td className="py-2 px-4 border">{grievance.date}</td>
                              <td className="py-2 px-4 border">{grievance.dept}</td>
                              <td className="py-2 px-4 border">{grievance.grievance}</td>
                              <td className="py-2 px-4 border">{grievance.status}</td>
                              <td className="py-2 px-4 border">{grievance.feedback}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">No grievances filed yet.</p>
                  )}
                </div>
              </>
            ) : (
              <p className="text-center text-red-600">Unable to load data. Try refreshing or relogging.</p>
            )}
          </div>
        </div>
      </div>

    </>
  );
};

export default About;
