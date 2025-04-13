import React from 'react';
import { NavLink } from 'react-router-dom';

const Error = () => {
  return (
    <>
      <div className="error-container">
        <h1 className="error-code">404</h1>
        <h2 className="error-message">Oops! Page Not Found</h2>
        <p className="error-description">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <NavLink to="/" className="home-button">
          Back to Home
        </NavLink>
      </div>


      {/* Styling */}
      <style>
        {`
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 80vh;
            text-align: center;
            color: #333;
          }

          .error-code {
            font-size: 6rem;
            font-weight: bold;
            color: #dc3545;
            margin-bottom: 10px;
          }

          .error-message {
            font-size: 2rem;
            font-weight: 600;
          }

          .error-description {
            font-size: 1.2rem;
            color: #6c757d;
            margin-bottom: 20px;
          }

          .home-button {
            display: inline-block;
            text-decoration: none;
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 1.2rem;
            transition: background-color 0.3s ease-in-out;
          }

          .home-button:hover {
            background-color: #0056b3;
          }
        `}
      </style>
    </>
  );
};

export default Error;
