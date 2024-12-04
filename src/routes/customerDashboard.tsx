import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import HeaderLogo from "../assets/img/core-img/logo.png";
import ProfileImage from "../assets/img/bg-img/2.png";
import Footer from "./footer";
import { auth } from "../firebaseConfig"; // Import Firebase auth
import { onAuthStateChanged } from "firebase/auth";

export const Route = createFileRoute("/customerDashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Update user state with displayName and email from Firebase
        setUser({
          username: currentUser.displayName || "Anonymous User",
          email: currentUser.email || "",
        });
      } else {
        setUser(null); // No user is signed in
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <div className="loading-screen">
        <p>User not found or not logged in.</p>
      </div>
    );
  }

  return (
    <>
      {/* Header Area */}
      <div className="header-area" id="headerArea">
        <div className="container">
          <div className="header-content header-style-five position-relative d-flex align-items-center justify-content-between">
            <div className="logo-wrapper">
              <Link to="/customerDashboard">
                <img src={HeaderLogo} alt="Logo" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* SideBar Info */}
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
            <div className="sidenav-profile bg-gradient">
              <div className="sidenav-style1"></div>
              <div className="user-profile">
                <img src={ProfileImage} alt="User Thumbnail" />
              </div>
              <div className="user-info text-center mt-4">
                <h6 className="user-name mb-0">{user.username}</h6>
                <span>{user.email}</span>
              </div>
            </div>
            <ul className="sidenav-nav ps-0">
              <li>
                <Link to="/login">
                  <i className="bi bi-box-arrow-right"></i> Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="page-content-wrapper">
        <div className="container">

        </div>
        {/* Footer */}
        <div className="container mt-5">
          <Footer />
        </div>
      </div>
    </>
  );
}

export default RouteComponent;
