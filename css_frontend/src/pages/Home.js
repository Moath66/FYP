import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="css-app">
      {/* Navigation Bar */}
      <div className="top-nav">
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/help">Help</Link>
          <Link to="/benefits">Benefits</Link>
          <Link to="/features">Features</Link>
          <Link to="/about-us">About us</Link>
        </div>
        <button className="login-button" onClick={() => navigate("/login")}>
          <i className="bi bi-box-arrow-in-right"></i> <span>Login</span>
        </button>{" "}
      </div>

      {/* Header */}
      <header className="app-header">
        <div
          className="header-logo"
          style={{ display: "flex", alignItems: "center", gap: "12px" }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/logo-css.png`}
            alt="CSS Logo"
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "13px",
              objectFit: "cover",
            }}
          />
          <h2 style={{ margin: 0 }}>CSS Community Services System</h2>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Community Services System</h1>
          <button
            className="learn-more-btn"
            onClick={() => navigate("/features")}
          >
            Learn More
          </button>
        </div>
        <div className="hero-image">
          <div className="squares-group">
            <div className="square"></div>
            <div className="square"></div>
            <div className="square"></div>
            <div className="square"></div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="features-section">
        <h2>Key Features</h2>
        <div className="divider"></div>
        <p className="section-description">
          Our system offers three 3 main services to enhance community
          management
        </p>

        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="bi bi-search"></i>
            </div>
            <h3>Lost & Found Items</h3>
            <p>
              Report and track lost or found items with QR code generation for
              easy identification and retrieval.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="bi bi-person-plus"></i>
            </div>
            <h3>Pre-Visitor Registration</h3>
            <p>
              Register visitors in advance with QR codes for streamlined
              check-in and enhanced security.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="bi bi-tools"></i>
            </div>
            <h3>Maintenance Requests</h3>
            <p>
              Submit and track maintenance requests with real-time status
              updates and staff assignment.
            </p>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="roles-section">
        <h2>User Roles</h2>
        <div className="divider"></div>
        <p className="section-description">
          Tailored dashboards for different user types
        </p>

        <div className="roles-container">
          <div className="role-card">
            <div className="role-icon admin-icon">
              <i className="bi bi-shield"></i>
            </div>
            <h3>Admin</h3>
            <ul className="role-tasks">
              <li>Manage user accounts</li>
              <li>System configuration</li>
              <li>Access all modules</li>
            </ul>
          </div>

          <div className="role-card">
            <div className="role-icon resident-icon">
              <i className="bi bi-house"></i>
            </div>
            <h3>Resident</h3>
            <ul className="role-tasks">
              <li>Report lost & found items</li>
              <li>Pre-register visitors</li>
              <li>Submit maintenance requests</li>
            </ul>
          </div>

          <div className="role-card">
            <div className="role-icon security-icon">
              <i className="bi bi-lock"></i>
            </div>
            <h3>Security</h3>
            <ul className="role-tasks">
              <li>Handle lost & found items</li>
              <li>Check visitor registrations</li>
              <li>Report found items</li>
            </ul>
          </div>

          <div className="role-card">
            <div className="role-icon staff-icon">
              <i className="bi bi-people"></i>
            </div>
            <h3>Staff</h3>
            <ul className="role-tasks">
              <li>Process maintenance requests</li>
              <li>Update request status</li>
              <li>Report found items</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Users Say</h2>
        <div className="divider"></div>

        <div className="testimonials-container">
          <div className="testimonial-card">
            <div className="quote-mark">"</div>
            <p className="testimonial-text">
              Maintenance requests get handled much faster with the new tracking
              system.
            </p>
            <p className="testimonial-author">— Resident</p>
          </div>

          <div className="testimonial-card">
            <div className="quote-mark">"</div>
            <p className="testimonial-text">
              The lost and found system has made item recovery so much easier in
              our community.
            </p>
            <p className="testimonial-author">— Community Manager</p>
          </div>

          <div className="testimonial-card">
            <div className="quote-mark">"</div>
            <p className="testimonial-text">
              Pre-visitor registration has significantly improved our security
              protocols.
            </p>
            <p className="testimonial-author">— Security Team Lead</p>
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
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-twitter"></i>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-linkedin"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-instagram"></i>
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
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="footer-contact">
            <h3>Contact</h3>
            <p>
              <i className="bi bi-envelope"></i> info@css-system.com
            </p>
            <p>
              <i className="bi bi-telephone"></i> +1 (555) 123-4567
            </p>
            <p>
              <i className="bi bi-geo-alt"></i> 123 Community St, City
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

export default Home;
