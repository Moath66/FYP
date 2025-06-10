import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Help.css";

const Help = () => {
  const navigate = useNavigate();

  return (
    <div className="help-page">
      {/* Top Navigation */}
      <div className="top-nav">
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/help" className="active">
            Help
          </Link>
          <Link to="/benefits">Benefits</Link>
          <Link to="/features">Features</Link>
          <Link to="/about-us">About us</Link>
        </div>
        <button className="login-button" onClick={() => navigate("/login")}>
          <i className="bi bi-box-arrow-in-right"></i> <span>Login</span>
        </button>
      </div>

      {/* Help Section */}
      <section className="help-section">
        <div className="faq-icon">
          <img src={`${process.env.PUBLIC_URL}/faq-icon.png`} alt="FAQ" />
          <h2 className="faq-title">Frequently Asked Questions</h2>
        </div>
        <div className="faq-list">
          <div className="faq-item">
            <h4>How do I get started?</h4>
            <p>
              Admin adds users to the system as a Resident, Security, or Staff.
            </p>
          </div>
          <div className="faq-item">
            <h4>How do I report a lost item?</h4>
            <p>
              Go to the Lost & Found section, fill in the item details and
              submit. If someone finds it, you’ll get a code match with report
              details.
            </p>
          </div>
          <div className="faq-item">
            <h4>How does visitor registration work?</h4>
            <p>
              Residents can pre-register visitors and Security receives requests
              to approve or deny. The QR code will be generated with details and
              sent to resident. The visitor shows the QR code at security for
              entry.
            </p>
          </div>
          <div className="faq-item">
            <h4>How do I request maintenance services?</h4>
            <p>
              Submit a request through the Maintenance section. Fill the form
              with details and track the status.
            </p>
          </div>
          <div className="faq-item">
            <h4>Who can use the CSS system?</h4>
            <p>
              The system is designed for residents, security personnel, staff,
              and administrators of D'summit Residence.
            </p>
          </div>
          <div className="faq-item">
            <h4>Is the CSS system available on mobile?</h4>
            <p>
              Yes. CSS is a web-based system and can be accessed through any
              browser on your laptop or mobile device.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-about">
            <h3>CSS</h3>
            <p>A comprehensive system for community services management.</p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer">
                <i className="bi bi-github"></i>
              </a>
            </div>
          </div>
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about-us">About</Link>
              </li>
              <li>
                <Link to="/features">Features</Link>
              </li>
              <li>
                <Link to="/help">Help</Link>
              </li>
              <li>
                <Link to="/benefits">Benefits</Link>
              </li>
            </ul>
          </div>
          <div className="footer-contact">
            <h3>Contact</h3>
            <p>
              <i className="bi bi-envelope"></i> mohamed-a2@graduate.utm.my
            </p>
            <p>
              <i className="bi bi-telephone"></i> +60 1129635974
            </p>
            <p>
              <i className="bi bi-geo-alt"></i> D'summit Residence, Johor Bahru
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Community Services System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Help;
