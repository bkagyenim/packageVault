import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { listenToAuthChanges, fetchPackagesByStatus, updatePackageStatus, updateVaultStatus } from "../firebaseService";
import HeaderLogo from "../assets/img/core-img/logo.png";
import Footer from "./footer";
import Swal from "sweetalert2";

export const Route = createFileRoute("/customerPending")({
  component: RouteComponent,
});

function RouteComponent() {
  const [user, setUser] = useState<{ email: string; uid: string; username: string } | null>(null);
  const [pendingPackages, setPendingPackages] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = listenToAuthChanges(async (currentUser) => {
      if (currentUser) {
        setUser({
          username: currentUser.displayName || "Anonymous User",
          email: currentUser.email || "",
          uid: currentUser.uid,
        });

        if (currentUser.uid) {
          const pendingPackages = await fetchPackagesByStatus(currentUser.uid, "pending");
          setPendingPackages(pendingPackages);
        }
      } else {
        setUser(null);
        setPendingPackages([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handlePickNow = async (packageId: string, compartment: string) => {
    try {
      await updatePackageStatus(packageId, "completed");
      await updateVaultStatus(compartment, "available");

      Swal.fire({
        icon: "success",
        title: "Package Picked",
        text: "Package marked as completed and compartment released!",
      });

      setPendingPackages((prev) => prev.filter((pkg) => pkg.id !== packageId));
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
        <h6>Pending Packages</h6>
        {pendingPackages.length > 0 ? (
          pendingPackages.map((pkg) => (
            <div key={pkg.id}>
              <p>
                Courier: {pkg.courier} | Compartment: {pkg.compartment} | Pack Size: {pkg.packsize}
              </p>
              <button onClick={() => handlePickNow(pkg.id, pkg.compartment)}>Pick Now</button>
            </div>
          ))
        ) : (
          <p>No pending packages found.</p>
        )}
      </div>

      <Footer />
    </>
  );
}

export default RouteComponent;
