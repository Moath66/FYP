import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Benefits.css";

const Benefits = () => {
  const navigate = useNavigate();

  return (
    <div className="benefits-page">
      {/* Top Navigation */}
      <div className="top-nav">
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/help">Help</Link>
          <Link to="/benefits" className="active">
            Benefits
          </Link>
          <Link to="/features">Features</Link>
          <Link to="/about-us">About us</Link>
        </div>
        <button className="login-button" onClick={() => navigate("/login")}>
          <i className="bi bi-box-arrow-in-right"></i> <span>Login</span>
        </button>
      </div>

      {/* Benefits Section */}
      <section className="benefits-section">
        <h1>Why Choose CSS?</h1>
        <div className="benefits-container">
          <div className="benefits-cards">
            <div className="card card-1">
              <h2>01</h2>
              <h4>Faster & More Secure Access</h4>
              <p>No need for paper-based visitor logs.</p>
            </div>
            <div className="card card-2">
              <h2>02</h2>
              <h4>Easy Lost & Found Reporting</h4>
              <p>Reduce frustration by quickly locating misplaced items.</p>
            </div>
            <div className="card card-3">
              <h2>03</h2>
              <h4>Efficient Maintenance Tracking</h4>
              <p>Ensure timely response to maintenance issues.</p>
            </div>
            <div className="card card-4">
              <h2>04</h2>
              <h4>User-Friendly Dashboard</h4>
              <p>
                Simple interface for all user roles (Admin, Resident, Security,
                Staff).
              </p>
            </div>
          </div>
          <div className="benefits-image">
            <img
              src={`${process.env.PUBLIC_URL}/benefits-logo.png`}
              alt="Benefits Icon"
            />
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

export default Benefits;
