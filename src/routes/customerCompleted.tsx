import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import HeaderLogo from "../assets/img/core-img/logo.png";
import ProfileImage from "../assets/img/bg-img/2.png";
import { useState, useEffect } from "react";
import Footer from "./footer";
import firebaseConfig from "../firebaseConfig";

// Firebase imports
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
  doc,
} from "firebase/firestore";



// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

// Define the type for the user state
type User = {
  email: string;
  uid: string;
  username: string;
} | null;

export const Route = createFileRoute("/customerCompleted")({
  component: RouteComponent,
});

function RouteComponent() {
  const [user, setUser] = useState<User>(null);
  const [completedPackages, setCompletedPackages] = useState<any[]>([]);

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

  // Fetch completed packages for the logged-in user
  useEffect(() => {
    const fetchCompletedPackages = async () => {
      if (!user) return; // Wait for user to be set

      try {
        console.log("Fetching completed packages for user:", user);

        // Step 1: Query the `delivery` collection to get all packages
        const deliverySnapshot = await getDocs(collection(db, "delivery"));

        if (deliverySnapshot.empty) {
          console.warn("No packages found in the delivery table.");
          setCompletedPackages([]);
          return;
        }

        const packagesForUser: any[] = [];

        // Step 2: For each delivery document, fetch the email from the `users` table
        for (const deliveryDoc of deliverySnapshot.docs) {
          const deliveryData = deliveryDoc.data();

          // Filter by status: Ensure the package status is "completed"
          if (deliveryData.status !== "completed") continue;

          // Get the user ID (document ID in `users` collection)
          const userId = deliveryData.user;

          if (!userId) continue;

          // Fetch the corresponding user document
          const userDocRef = doc(db, "users", userId);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userEmail = userDoc.data().email;

            // Match the email with the logged-in user's email
            if (userEmail === user.email) {
              // Check if the timestamp is a valid Firestore Timestamp
              const isTimestamp = deliveryData.timestamp instanceof Timestamp;

              const formattedTimestamp = isTimestamp
                ? new Intl.DateTimeFormat("en-US", {
                    dateStyle: "long",
                    timeStyle: "long",
                  }).format(deliveryData.timestamp.toDate())
                : "N/A";

              packagesForUser.push({
                id: deliveryDoc.id,
                ...deliveryData,
                timestampFormatted: formattedTimestamp,
              });
            }
          }
        }

        console.log(
          "Fetched completed packages for the logged-in user:",
          packagesForUser
        );
        setCompletedPackages(packagesForUser);
      } catch (error) {
        console.error("Error fetching completed packages:", error);
      }
    };

    fetchCompletedPackages();
  }, [user]);

  if (!user) {
    return (
      <div className="loading-screen">
        <p>Loading...</p>
      </div>
    );
  }

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
                <h6 className="user-name mb-0">{user.username}</h6>
                <span>{user.email}</span>
              </div>
            </div>

            {/* Sidenav Nav */}
            <ul className="sidenav-nav ps-0">
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

      {/* Page Content */}
      <div className="page-content-wrapper py-3">
        <div className="container">
          <div className="element-heading mt-3">
            <h6>Completed Packages</h6>
          </div>
        </div>

        <div className="container">
          {/* Loop through completed packages */}
          {completedPackages.length > 0 ? (
            completedPackages.map((pkg) => (
              <div key={pkg.id} className="card mb-2">
                <div className="card-body">
                  <div
                    className="alert custom-alert-three alert-success alert-dismissible fade show"
                    role="alert"
                  >
                    <i className="bi bi-check-circle"></i>
                    <div className="alert-text">
                      <h6>
                        Courier: {pkg.courier} | Compartment: {pkg.compartment}
                      </h6>
                      <span>
                        {pkg.timestampFormatted} | Pack Size:{" "}
                        {pkg.packsize || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card">
              <div className="card-body">
                <p>No completed packages found.</p>
              </div>
            </div>
          )}
        </div>
      </div>

       {/* Footer Nav */}
       <Footer/>


    </>
  );
}

export default RouteComponent;
