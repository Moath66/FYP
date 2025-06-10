import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AboutUs.css";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      {/* Top Navigation */}
      <div className="top-nav">
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/help">Help</Link>
          <Link to="/benefits">Benefits</Link>
          <Link to="/features">Features</Link>
          <Link to="/about-us" className="active">
            About us
          </Link>
        </div>
        <button className="login-button" onClick={() => navigate("/login")}>
          <i className="bi bi-box-arrow-in-right"></i> Login
        </button>
      </div>

      {/* Header Section */}
      <section className="about-header">
        <div className="container">
          <div className="text-content">
            <h1>We Help To Get You Well.</h1>
            <p className="highlight">
              "The Community Services System (CSS) is designed to enhance
              residential living by offering seamless management of daily
              operations, ensuring security, efficiency, and convenience for
              all residents, security personnel, and staff."
            </p>
            <h3>Who Can Use It?</h3>
            <ul>
              <li>
                <strong>Residents:</strong> Report lost items, register visitors, submit maintenance requests.
              </li>
              <li>
                <strong>Security Personnel:</strong> Manage visitor check-ins and enhance safety.
              </li>
              <li>
                <strong>Staff:</strong> Handle maintenance and keep everything running smoothly.
              </li>
            </ul>
          </div>
          <div className="image-content">
            <img
              src={`${process.env.PUBLIC_URL}/css-about-logo.png`}
              alt="CSS Illustration"
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
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about-us">About</Link></li>
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h3>Contact</h3>
            <p><i className="bi bi-envelope"></i> info@css-system.com</p>
            <p><i className="bi bi-telephone"></i> +1 (555) 123-4567</p>
            <p><i className="bi bi-geo-alt"></i> 123 Community St, City</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Community Services System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
