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

export const Route = createFileRoute("/customerDashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const [user, setUser] = useState<{ username: string; email: string; uid: string } | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userData = {
          username: currentUser.displayName || "Anonymous User",
          email: currentUser.email || "",
          uid: currentUser.uid,
        };
        setUser(userData);

        // Fetch data from Firestore
        try {
          const deliveryRef = collection(db, "delivery");
          const pendingQuery = query(
            deliveryRef,
            where("userId", "==", userData.uid),
            where("status", "==", "pending")
          );
          const completedQuery = query(
            deliveryRef,
            where("userId", "==", userData.uid),
            where("status", "==", "completed")
          );

          const [pendingSnapshot, completedSnapshot] = await Promise.all([
            getDocs(pendingQuery),
            getDocs(completedQuery),
          ]);

          setPendingCount(pendingSnapshot.size);
          setCompletedCount(completedSnapshot.size);
        } catch (error) {
          console.error("Error fetching data from Firestore:", error);
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
