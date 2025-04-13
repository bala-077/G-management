import phone from '../images/telephone.png';
import mail from '../images/email.png';
import address from '../images/address.png';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white mt-auto py-4">
      <div className="container">
        <div className="row text-center text-md-start d-flex align-items-center justify-content-center">
          
          {/* Phone Section */}
          <div className="col-12 col-md-4 d-flex align-items-center mb-3 mb-md-0">
            <img 
              src={phone} 
              alt="Phone" 
              height="40" 
              width="40" 
              className="me-3 icon-hover"
            />
            <div>
              <h6 className="mb-0">Phone</h6>
              <p className="text-muted small">+123 456 7890</p>
            </div>
          </div>

          {/* Email Section */}
          <div className="col-12 col-md-4 d-flex align-items-center mb-3 mb-md-0">
            <img 
              src={mail} 
              alt="Email" 
              height="40" 
              width="40" 
              className="me-3 icon-hover"
            />
            <div>
              <h6 className="mb-0">Email</h6>
              <p className="text-muted small">filemygrievance@gmail.com</p>
            </div>
          </div>

          {/* Address Section */}
          <div className="col-12 col-md-4 d-flex align-items-center">
            <img 
              src={address} 
              alt="Address" 
              height="40" 
              width="40" 
              className="me-3 icon-hover"
            />
            <div>
              <h6 className="mb-0">Address</h6>
              <p className="text-muted small">Coimbatore, India</p>
            </div>
          </div>
        </div>

        <hr className="text-light opacity-25 my-3" />

        {/* Copyright Section */}
        <div className="text-center">
          <p className="small mb-0 text-muted">
            &copy; {new Date().getFullYear()} FileMyGrievance. All rights reserved.
          </p>
        </div>
      </div>

      {/* Styling for Hover Effect */}
      <style>
        {`
          .icon-hover {
            transition: transform 0.3s ease-in-out;
          }
          .icon-hover:hover {
            transform: scale(1.1);
          }
        `}
      </style>
    </footer>
  );
}

export default Footer;
