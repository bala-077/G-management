import React from 'react';
import { useEffect, useState } from 'react';
import convo from '../images/convo.png'
const Home = () => {
    const [userName, setUserName] = useState();
    const [show, setShow] = useState(false);
  
    const userHome = async () => {
      try {
        const res = await fetch("/getdata", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
  
        const data = await res.json();
        setUserName(data.name);
        setShow(true);
  
        if (!res.status === 200) {
          throw new Error(res.err);
        }
      } catch (err) {
        console.log(err);
      }
    };
  
    useEffect(() => {
      userHome();
    }, []);
  
    return (
      <>
        <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
          <div className="row align-items-center">
            <div className="col-md-5">
              <img src={convo} alt="not found" className="img-fluid" />
            </div>
            <div className="col-md-7 text-center">
              <p className="maintext">
                {userName ? `Hello ${userName}! Welcome Back!!` : "Please login to file a grievance"}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  export default Home;