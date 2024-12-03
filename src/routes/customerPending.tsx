import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import HeaderLogo from "../assets/img/core-img/logo.png";
import ProfileImage from "../assets/img/bg-img/2.png";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
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
  updateDoc,
  doc,
  Timestamp,
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

export const Route = createFileRoute("/customerPending")({
  component: RouteComponent,
});

function RouteComponent() {
  const [user, setUser] = useState<User>(null);
  const [pendingPackages, setPendingPackages] = useState<any[]>([]);

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

  // Fetch pending packages for the logged-in user
  useEffect(() => {
    const fetchPendingPackages = async () => {
      if (!user) return; // Wait for user to be set

      try {
        console.log("Fetching pending packages for user:", user);

        // Step 1: Query the `delivery` collection to get all packages
        const deliverySnapshot = await getDocs(collection(db, "delivery"));

        if (deliverySnapshot.empty) {
          console.warn("No packages found in the delivery table.");
          setPendingPackages([]);
          return;
        }

        const packagesForUser: any[] = [];

        // Step 2: For each delivery document, fetch the email from the `users` table
        for (const deliveryDoc of deliverySnapshot.docs) {
          const deliveryData = deliveryDoc.data();

          // Filter by status: Ensure the package status is "pending"
          if (deliveryData.status !== "pending") continue;

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
          "Fetched pending packages for the logged-in user:",
          packagesForUser
        );
        setPendingPackages(packagesForUser);
      } catch (error) {
        console.error("Error fetching pending packages:", error);
      }
    };

    fetchPendingPackages();
  }, [user]);

  // Handle "Pick Now" button click
  const handlePickNow = async (packageId: string, compartment: string) => {
    try {
      const deliveryDocRef = doc(db, "delivery", packageId);

      // Update the delivery status to "completed"
      await updateDoc(deliveryDocRef, { status: "completed" });

      // Update the corresponding compartment status to "available"
      const vaultQuery = query(
        collection(db, "vault"),
        where("compartment", "==", compartment)
      );
      const vaultSnapshot = await getDocs(vaultQuery);

      if (!vaultSnapshot.empty) {
        const vaultDocId = vaultSnapshot.docs[0].id;
        const vaultDocRef = doc(db, "vault", vaultDocId);
        await updateDoc(vaultDocRef, { status: "available" });
      }

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Package picked successfully, and compartment released!",
      });

      // Refresh the list of pending packages
      setPendingPackages((prevPackages) =>
        prevPackages.filter((pkg) => pkg.id !== packageId)
      );
    } catch (error) {
      console.error("Error updating package status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to pick the package. Please try again later.",
      });
    }
  };

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
          <div className="element-heading mt-3">
            <h6>Pending Packages</h6>
          </div>
        </div>

        <div className="container">
          {pendingPackages.length > 0 ? (
            pendingPackages.map((pkg) => (
              <div key={pkg.id} className="card mb-2">
                <div className="card-body">
                  <div
                    className="alert custom-alert-three alert-info alert-dismissible fade show"
                    role="alert"
                  >
                    <i className="bi bi-arrow-repeat"></i>
                    <div className="alert-text">
                      <h6>
                        Courier: {pkg.courier} | Compartment: {pkg.compartment}
                      </h6>
                      <span>
                        {pkg.timestampFormatted} | Pack Size:{" "}
                        {pkg.packsize || "N/A"}
                      </span>
                      <button
                        className="btn btn-sm btn-creative btn-info mt-2"
                        onClick={() => handlePickNow(pkg.id, pkg.compartment)}
                      >
                        Pick Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card">
              <div className="card-body">
                <p>No pending packages found.</p>
              </div>
            </div>
          )}
        </div>
      </div>

       {/* Footer Nav */}
       <div className="footer-nav-area" id="footerNav">
        <div className="container px-0">
          <div className="footer-nav position-relative">
            <ul className="h-100 d-flex align-items-center justify-content-between ps-0">
              <li className="active">
                <Link to="/customerDashboard">
                  <i className="bi bi-house"></i>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/customerPending">
                  <i className="bi bi-folder2-open"></i>
                  <span>Pending</span>
                </Link>
              </li>
              <li>
                <Link to="/customerCompleted">
                  <i className="bi bi-folder-check"></i>
                  <span>Collected</span>
                </Link>
              </li>
              <li>
              <Link to="/customerSupport">
                  <i className="bi bi-chat-dots"></i>
                  <span>Support</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>


    </>
  );
}

export default RouteComponent;
