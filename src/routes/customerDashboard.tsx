import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import HeaderLogo from "../assets/img/core-img/logo.png";
import ProfileImage from "../assets/img/bg-img/2.png";
import Footer from "./footer";
import { auth, db } from "../firebaseConfig"; // Import Firebase auth and Firestore
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import Amazon from "../assets/img/partner-img/1.png";
import Puralator from "../assets/img/partner-img/2.png";
import FedEx from "../assets/img/partner-img/3.png";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export const Route = createFileRoute("/customerDashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const [user, setUser] = useState<{ username: string; email: string; uid: string } | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const fetchData = async (email: string) => {
      try {
        // Step 1: Fetch user's document ID from `users` collection
        const usersRef = collection(db, "users");
        const userQuery = query(usersRef, where("email", "==", email));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0]; // Assume email is unique
          const userId = userDoc.id;

          // Step 2: Use the userId to fetch data from the `delivery` collection
          const deliveryRef = collection(db, "delivery");
          const pendingQuery = query(
            deliveryRef,
            where("user", "==", userId),
            where("status", "==", "pending")
          );
          const completedQuery = query(
            deliveryRef,
            where("user", "==", userId),
            where("status", "==", "completed")
          );

          const [pendingSnapshot, completedSnapshot] = await Promise.all([
            getDocs(pendingQuery),
            getDocs(completedQuery),
          ]);

          // Update state with counts
          setPendingCount(pendingSnapshot.size);
          setCompletedCount(completedSnapshot.size);
        } else {
          console.error("User document not found.");
        }
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const userData = {
          username: currentUser.displayName || "Anonymous User",
          email: currentUser.email || "",
          uid: currentUser.uid,
        };
        setUser(userData);

        if (userData.email) {
          fetchData(userData.email); // Fetch delivery data
        }
      } else {
        setUser(null); // No user is signed in
        setPendingCount(0);
        setCompletedCount(0);
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

  // Prepare data for the pie chart
  const chartData = {
    labels: ["Pending", "Completed"],
    datasets: [
      {
        data: [pendingCount, completedCount],
        backgroundColor: ["#FF6384", "#36A2EB"], // Colors for Pending and Completed
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

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


      {/* User Info */}
      <div className="page-content-wrapper">
        <div className="container">
          <div className="element-heading">
            <h6>Statistics</h6>
          </div>
        </div>

        <div className="container">
          <div className="card">
            <div className="card-body">
              <div className="standard-tab">
                <ul className="nav rounded-lg mb-2 p-2 shadow-sm" id="affanTabs1" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="btn active"
                      id="bootstrap-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#bootstrap"
                      type="button"
                      role="tab"
                      aria-controls="bootstrap"
                      aria-selected="true"
                    >
                      Pending
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="btn"
                      id="pwa-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#pwa"
                      type="button"
                      role="tab"
                      aria-controls="pwa"
                      aria-selected="false"
                    >
                      Collected
                    </button>
                  </li>
                </ul>

                <div className="tab-content rounded-lg p-3 shadow-sm" id="affanTabs1Content">
                  <div
                    className="tab-pane fade show active"
                    id="bootstrap"
                    role="tabpanel"
                    aria-labelledby="bootstrap-tab"
                  >
                    <h6>You have {pendingCount} Pending Packages</h6>
                  </div>

                  <div className="tab-pane fade" id="pwa" role="tabpanel" aria-labelledby="pwa-tab">
                    <h6>You have {completedCount} Completed Packages</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="container mt-4">
          <div className="card">
          <div className="card-body">
          <h6 className="mb-3">Package Distribution</h6>
          <div style={{ width: "300px", height: "300px", margin: "0 auto" }}>
            <Pie data={chartData} />
            </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="element-heading mt-3">
            <h6>Couriers</h6>
          </div>
        </div>

        <div className="container">
          <div className="card">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-4">
                  <div className="card partner-slide-card border bg-gray">
                    <div className="card-body p-3">
                      <a href="#">
                        <img src={Amazon} alt="Amazon" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="card partner-slide-card border bg-gray">
                    <div className="card-body p-3">
                      <a href="#">
                        <img src={Puralator} alt="Puralator" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="card partner-slide-card border bg-gray">
                    <div className="card-body p-3">
                      <a href="#">
                        <img src={FedEx} alt="FedEx" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
