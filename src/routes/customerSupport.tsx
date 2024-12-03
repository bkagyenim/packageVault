import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import HeaderLogo from "../assets/img/core-img/logo.png";
import ProfileImage from "../assets/img/bg-img/2.png";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Footer from "./footer";

import firebaseConfig from "../firebaseConfig";
// Firebase imports
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";



// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

export const Route = createFileRoute("/customerSupport")({
  component: RouteComponent,
});

function RouteComponent() {
  const [user, setUser] = useState<{
    email: string;
    uid: string;
    username: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Fetch the logged-in user
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("Logged-in user:", currentUser);
        setUser({
          email: currentUser.email || "",
          uid: currentUser.uid,
          username: currentUser.displayName || "",
        });
      } else {
        setUser(null);
      }
    });
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, email, subject, message } = formData;

    // Validate fields
    if (!name || !email || !subject || !message) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill in all fields before submitting!",
      });
      return;
    }

    try {
      // Add data to the `contact` collection
      const contactCollection = collection(db, "contact");
      await addDoc(contactCollection, {
        name,
        email,
        subject,
        message,
        timestamp: new Date(), // Optional: Add timestamp
      });

      // Success alert
      Swal.fire({
        icon: "success",
        title: "Message Sent",
        text: "Your message has been sent successfully!",
      }).then(() => {
        // Refresh page
        window.location.reload();
      });
    } catch (error) {
      console.error("Error saving contact message:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to send your message. Please try again later.",
      });
    }
  };

  return (
    <>
      {/* Header Area */}
      <div className="header-area" id="headerArea">
        <div className="container">
          <div className="header-content header-style-five position-relative d-flex align-items-center justify-content-between">
            {/* Logo Wrapper */}
            <div className="logo-wrapper">
              <Link to="/customerDashboard">
                <img src={HeaderLogo} alt="Logo" />
              </Link>
            </div>
            {/* Navbar Toggler */}
            <div
              className="navbar--toggler"
              id="affanNavbarToggler"
              data-bs-toggle="offcanvas"
              data-bs-target="#affanOffcanvas"
              aria-controls="affanOffcanvas"
            >
              <span className="d-block"></span>
              <span className="d-block"></span>
              <span className="d-block"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidenav Left */}
      <div
        className="offcanvas offcanvas-start"
        id="affanOffcanvas"
        data-bs-scroll="true"
        tabIndex={-1}
        aria-labelledby="affanOffcanvsLabel"
      >
        <button
          className="btn-close btn-close-white text-reset"
          type="button"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>

        <div className="offcanvas-body p-0">
          <div className="sidenav-wrapper">
            {/* Sidenav Profile */}
            <div className="sidenav-profile bg-gradient">
              <div className="sidenav-style1"></div>
              {/* User Thumbnail */}
              <div className="user-profile">
                <img src={ProfileImage} alt="User Thumbnail" />
              </div>
              {/* User Info */}
              <div className="user-info">
                <h6 className="user-name mb-0">{user?.username}</h6>
                <span>{user?.email}</span>
              </div>
            </div>

            {/* Sidenav Nav */}
            <ul className="sidenav-nav ps-0">
              <li>
                <Link to="/customerDashboard">
                  <i className="bi bi-house"></i> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/customerPending">
                  <i className="bi bi-folder2-open"></i> Pending
                </Link>
              </li>
              <li>
                <Link to="/customerCompleted">
                  <i className="bi bi-folder-check"></i> Collected
                </Link>
              </li>
              <li>
                <Link to="/customerSupport">
                  <i className="bi bi-chat-dots"></i> Support
                </Link>
              </li>
              <li>
                <Link to="/login">
                  <i className="bi bi-box-arrow-right"></i> Logout
                </Link>
              </li>
            </ul>

            {/* Social Info */}
            <div className="social-info-wrap">
              <a href="#">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>

            {/* Copyright Info */}
            <div className="copyright-info">
              <p>
                <span id="copyrightYear"></span>
                &copy; Made by <a href="#">Kwadwo</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="page-content-wrapper py-3">
        <div className="container">
          {/* Contact Form */}
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="mb-3">Write to us</h5>

              <div className="contact-form">
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <input
                      className="form-control"
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <input
                      className="form-control"
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <select
                      className="form-select"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>
                        Select a topic
                      </option>
                      <option value="Authors Help">Track Package</option>
                      <option value="Buyer Help">General Enquiry</option>
                      <option value="Licenses">Others</option>
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <textarea
                      className="form-control"
                      name="message"
                      cols={30}
                      rows={10}
                      placeholder="Write details"
                      value={formData.message}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  <button className="btn btn-primary w-100">Send Now</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/*Footer*/}
        <Footer/>
    </>
  );
}

export default RouteComponent;
