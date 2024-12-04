import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import HeaderLogo from "../assets/img/core-img/logo.png";
import ProfileImage from "../assets/img/bg-img/2.png";
import Footer from "./footer";

export const Route = createFileRoute("/customerDashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("Retrieved user from localStorage:", storedUser);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("Parsed user data:", parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        setUser(null);
      }
    } else {
      console.log("No user data found in localStorage.");
      setUser(null);
    }
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
      <div className="page-content-wrapper">
        <div className="container">
          <div className="user-info text-center mt-4">
            <h6 className="user-name mb-0">{user.username}</h6>
            <span>{user.email}</span>
          </div>
        </div>
        <div className="container mt-5">
          <Footer />
        </div>
      </div>
    </>
  );
}
