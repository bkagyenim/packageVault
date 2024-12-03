import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import HeaderLogo from "../assets/img/core-img/logo.png";
import ProfileImage from "../assets/img/bg-img/2.png";
import Amazon from "../assets/img/partner-img/1.png";
import Puralator from "../assets/img/partner-img/2.png";
import FedEx from "../assets/img/partner-img/3.png";
import { db } from "../firebaseConfig";
import Footer from "./footer";

import firebaseConfig from "../firebaseConfig";

// Initialize Firebase
import { initializeApp } from "firebase/app";



initializeApp(firebaseConfig);

type User = {
  username: string;
  email: string;
  userId: string;
} | null;

export const Route = createFileRoute("/customerDashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [completedCount, setCompletedCount] = useState<number>(0);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const provider = currentUser.providerData[0]?.providerId;
  
        if (provider === "google.com") {
          // Google Sign-In
          setUser({
            username: currentUser.displayName || "Anonymous",
            email: currentUser.email || "No Email Found",
            userId: currentUser.uid,
          });
          setLoading(false);
        } else {
          // Manual Login
          try {
            const usersRef = collection(db, "users");
            const username = currentUser.displayName || ""; // Assuming manual login sets displayName to the username
            const userQuery = query(usersRef, where("username", "==", username));
            const userSnapshot = await getDocs(userQuery);
  
            if (userSnapshot.empty) {
              console.error("No matching user found in the users table.");
              setUser(null);
            } else {
              const userData = userSnapshot.docs[0].data();
              setUser({
                username: userData.username || "Anonymous",
                email: userData.email || "No Email Found",
                userId: userSnapshot.docs[0].id,
              });
            }
          } catch (error) {
            console.error("Error fetching user document:", error);
            setUser(null);
          } finally {
            setLoading(false);
          }
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });
  }, []);
  

  useEffect(() => {
    const fetchPackageCounts = async () => {
      if (!user?.userId) return;

      try {
        const deliveryRef = collection(db, "delivery");

        // Pending query
        const pendingQuery = query(
          deliveryRef,
          where("status", "==", "pending"),
          where("user", "==", user.userId)
        );
        const pendingSnapshot = await getDocs(pendingQuery);

        // Completed query
        const completedQuery = query(
          deliveryRef,
          where("status", "==", "completed"),
          where("user", "==", user.userId)
        );
        const completedSnapshot = await getDocs(completedQuery);

        setPendingCount(pendingSnapshot.size);
        setCompletedCount(completedSnapshot.size);
      } catch (error) {
        console.error("Error fetching package counts:", error);
      }
    };

    fetchPackageCounts();
  }, [user]);

  if (loading) {
    return (
      <div className="loading-screen">
        <p>Loading...</p>
      </div>
    );
  }

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
              <div className="user-info">
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
        <br />
        <div className="container">
          <div className="card card-gradient-bg">
            <div className="card-body p-5 direction-rtl">
              <h2 className="display-3 mb-4">Get free 24 hours Support</h2>
              <Link className="btn btn-light rounded-pill" to="/customerSupport">
                Contact Now
              </Link>
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
