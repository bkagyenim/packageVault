import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { listenToAuthChanges, fetchPackagesByStatus } from "../firebaseService";
import HeaderLogo from "../assets/img/core-img/logo.png";
import Footer from "./footer";

export const Route = createFileRoute("/customerCompleted")({
  component: RouteComponent,
});

function RouteComponent() {
  const [user, setUser] = useState<{ email: string; uid: string; username: string } | null>(null);
  const [completedPackages, setCompletedPackages] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = listenToAuthChanges(async (currentUser) => {
      if (currentUser) {
        setUser({
          username: currentUser.displayName || "Anonymous User",
          email: currentUser.email || "",
          uid: currentUser.uid,
        });

        if (currentUser.uid) {
          const completedPackages = await fetchPackagesByStatus(currentUser.uid, "completed");
          setCompletedPackages(completedPackages);
        }
      } else {
        setUser(null);
        setCompletedPackages([]);
      }
    });

    return () => unsubscribe();
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

      <div className="page-content-wrapper py-3">
        <h6>Completed Packages</h6>
        {completedPackages.length > 0 ? (
          completedPackages.map((pkg) => (
            <div key={pkg.id}>
              <p>
                Courier: {pkg.courier} | Compartment: {pkg.compartment} | Pack Size: {pkg.packsize}
              </p>
            </div>
          ))
        ) : (
          <p>No completed packages found.</p>
        )}
      </div>

      <Footer />
    </>
  );
}

export default RouteComponent;
