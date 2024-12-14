import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { listenToAuthChanges, fetchPackagesByStatus } from "./firebaseService";
import HeaderLogo from "../assets/img/core-img/logo.png";
import Footer from "./footer";

export const Route = createFileRoute("/customerDashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const [user, setUser] = useState<{ email: string; uid: string; username: string } | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const unsubscribe = listenToAuthChanges(async (currentUser) => {
      if (currentUser) {
        setUser({
          username: currentUser.displayName || "Anonymous User",
          email: currentUser.email || "",
          uid: currentUser.uid,
        });

        if (currentUser.email) {
          const pendingPackages = await fetchPackagesByStatus(currentUser.uid, "pending");
          const completedPackages = await fetchPackagesByStatus(currentUser.uid, "completed");
          setPendingCount(pendingPackages.length);
          setCompletedCount(completedPackages.length);
        }
      } else {
        setUser(null);
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="header-area" id="headerArea">
        <div className="container">
          <div className="header-content d-flex align-items-center justify-content-between">
            <div className="logo-wrapper">
              <Link to="/customerDashboard">
                <img src={HeaderLogo} alt="Logo" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="page-content-wrapper">
        <h6>Welcome, {user.username}</h6>
        <p>Pending Packages: {pendingCount}</p>
        <p>Completed Packages: {completedCount}</p>
      </div>

      <Footer />
    </>
  );
}

export default RouteComponent;
