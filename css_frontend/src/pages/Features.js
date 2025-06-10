import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Features.css";

const Features = () => {
  const navigate = useNavigate();

  return (
    <div className="features-page">
      {/* Top Navigation */}
      <div className="top-nav">
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/help">Help</Link>
          <Link to="/benefits">Benefits</Link>
          <Link to="/features" className="active">
            Features
          </Link>
          <Link to="/about-us">About us</Link>
        </div>
        <button className="login-button" onClick={() => navigate("/login")}>
          <i className="bi bi-box-arrow-in-right"></i> <span>Login</span>
        </button>
      </div>

      {/* Features Header Section */}
      <section className="features-header">
        <div className="container">
          <h1>How It Works ?</h1>
          <div className="features-grid">
            <div className="feature-card">
              <img
                src={`${process.env.PUBLIC_URL}/lostfound.png`}
                alt="Lost and Found"
              />
              <h3>Lost & Found (with QR Code)</h3>
              <p>
                Easily report lost items and check if your belongings have been
                found by scanning a QR code.
              </p>
            </div>
            <div className="feature-card">
              <img
                src={`${process.env.PUBLIC_URL}/visitor.png`}
                alt="Pre-Visitor Registration"
              />
              <h3>Pre-Visitor Registration (with QR Code)</h3>
              <p>
                Register your guests in advance and provide them with a secure
                QR code for hassle-free check-ins.
              </p>
            </div>
            <div className="feature-card">
              <img
                src={`${process.env.PUBLIC_URL}/maintenance.png`}
                alt="Maintenance Request"
              />
              <h3>Maintenance Request</h3>
              <p>
                Submit maintenance issues and track request status in real-time.
              </p>
            </div>
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
              <a
                href="https://www.facebook.com/share/16NaJqHkm1/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a
                href="https://x.com/meezo_mo3az"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-twitter"></i>
              </a>
              <a
                href="https://www.linkedin.com/in/moathmorsy-dev/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-linkedin"></i>
              </a>
              <a
                href="https://www.instagram.com/moath_mo.dev/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-instagram"></i>
              </a>
              <a
                href="https://github.com/Moath66"
                target="_blank"
                rel="noopener noreferrer"
              >
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
              <i className="bi bi-geo-alt"></i> D'summit Residence, Jalan
              Kempas, 81300 Johor Bahru
            </p>
          </div>
        </div>
        <div className="footer-copyright">
          <p>© 2025 Community Services System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Features;
