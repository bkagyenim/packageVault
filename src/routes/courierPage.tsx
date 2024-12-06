import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDocs,
  query,
  where,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import Select, { SingleValue } from "react-select";
import Swal from "sweetalert2";

export const Route = createFileRoute("/courierPage")({
  component: RouteComponent,
});

type UserOption = {
  value: string;
  label: string;
};

type CompartmentOption = {
  id: string;
  compartment: string | number; // Handles both string and number
};

function RouteComponent() {
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedUser, setSelectedUser] =
    useState<SingleValue<UserOption>>(null);
  const [compartmentSizes] = useState([
    { value: "Extra Large", label: "Extra Large" },
    { value: "Large", label: "Large" },
    { value: "Medium", label: "Medium" },
    { value: "Small", label: "Small" },
  ]);
  const [selectedSize, setSelectedSize] =
    useState<SingleValue<{ value: string; label: string }>>(null);
  const [availableCompartments, setAvailableCompartments] = useState<
    CompartmentOption[]
  >([]);
  const [selectedCompartment, setSelectedCompartment] = useState<string>("");
  const [selectedCourier, setSelectedCourier] = useState<string>("Amazon");

  const db = getFirestore();

  // Fetch users from Firestore signInMethod collection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const signInMethodCollection = collection(db, "users");
        const userDocs = await getDocs(signInMethodCollection);

        if (userDocs.empty) {
          Swal.fire({
            icon: "warning",
            title: "No Users Found",
            text: "No users available in the 'users' collection.",
          });
          return;
        }

        // Ensure all users are fetched and mapped correctly
        const userList = userDocs.docs.map((doc) => {
          const data = doc.data();
          return {
            value: doc.id,
            label: data.email || "Unknown Email", // Default if email is missing
          };
        });

        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch users. Please try again later.",
        });
      }
    };

    fetchUsers();
  }, [db]);

  // Fetch compartments when a size is selected
  useEffect(() => {
    if (!selectedSize) return;

    const fetchCompartments = async () => {
      try {
        const vaultsCollection = collection(db, "vault");
        const compartmentsQuery = query(
          vaultsCollection,
          where("packsize", "==", selectedSize.value),
          where("status", "==", "available")
        );
        const compartmentDocs = await getDocs(compartmentsQuery);

        const compartments = compartmentDocs.docs.map((doc) => ({
          id: doc.id,
          compartment: doc.data().compartment,
        }));

        setAvailableCompartments(compartments);
      } catch (error) {
        console.error("Error fetching compartments:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch compartments. Please try again later.",
        });
      }
    };

    fetchCompartments();
  }, [selectedSize, db]);

  const handleSubmit = async () => {
    console.log("Selected User:", selectedUser);
    console.log("Selected Size:", selectedSize);
    console.log("Selected Compartment:", selectedCompartment);
    console.log("Selected Courier:", selectedCourier);

    if (
      !selectedUser ||
      !selectedSize ||
      !selectedCompartment ||
      !selectedCourier
    ) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill in all the fields before submitting!",
      });
      return;
    }

    if (availableCompartments.length === 0) {
      Swal.fire({
        icon: "error",
        title: "No Compartments Available",
        text: "Please select a valid compartment size with available compartments.",
      });
      return;
    }

    try {
      const deliveryCollection = collection(db, "delivery");
      const vaultCollection = collection(db, "vault");

      // Query the vault collection for the selected compartment
      const vaultQuery = query(
        vaultCollection,
        where(
          "compartment",
          "==",
          isNaN(Number(selectedCompartment))
            ? selectedCompartment // Treat as string if not a valid number
            : Number(selectedCompartment) // Treat as number if valid
        )
      );
      const vaultSnapshot = await getDocs(vaultQuery);

      if (!vaultSnapshot.empty) {
        const vaultDocId = vaultSnapshot.docs[0].id;
        const vaultDocRef = doc(db, "vault", vaultDocId);

        // Update the status of the compartment to "blocked"
        await updateDoc(vaultDocRef, { status: "blocked" });

        console.log(
          `Compartment ${selectedCompartment} status updated to blocked in the vault table.`
        );
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Compartment ${selectedCompartment} not found in the vault table.`,
        });
        return;
      }

      // Save the data to the delivery table
      const deliveryData = {
        user: selectedUser.value,
        packsize: selectedSize.value,
        compartment: selectedCompartment,
        courier: selectedCourier,
        status: "pending", // Default status
        timestamp: Timestamp.now(), // Use imported Timestamp
      };

      console.log("Attempting to save delivery:", deliveryData);

      await addDoc(deliveryCollection, deliveryData);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Delivery details saved successfully, and compartment status updated!",
      }).then(() => {
        // Refresh the page on success
        window.location.reload();
      });
    } catch (error) {
      console.error("Error saving delivery or updating compartment:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save delivery details or update compartment status. Please try again later.",
      });
    }
  };

  return (
    <>
      {/* Header Area */}
      <div className="header-area" id="headerArea">
        <div className="container">
          <div className="header-content position-relative d-flex align-items-center justify-content-between">
            <div className="back-button">
              <Link to="/">
                <i className="bi bi-arrow-left-short"></i>
              </Link>
            </div>
            <div className="page-heading text-center">
              <h6 className="mb-0">Courier Page</h6>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="page-content-wrapper py-3">
        <div className="container">
          <div className="card">
            <div className="card-body">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label className="form-label">Select Courier</label>
                  <select
                    className="form-select"
                    value={selectedCourier}
                    onChange={(e) => setSelectedCourier(e.target.value)}
                  >
                    <option value="Amazon">Amazon</option>
                    <option value="CanadaPost">CanadaPost</option>
                    <option value="FedEx">FedEx</option>
                    <option value="Purolator">Purolator</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Select User</label>
                  <Select
                    options={users}
                    value={selectedUser}
                    onChange={(option) => setSelectedUser(option)}
                    placeholder="Search and select a user"
                    isSearchable // Enable searchable dropdown
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Select Compartment Size</label>
                  <Select
                    options={compartmentSizes}
                    value={selectedSize}
                    onChange={(option) => setSelectedSize(option)}
                    placeholder="Select a compartment size"
                    isSearchable
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Select Compartment Number</label>
                  <select
                    className="form-select"
                    value={selectedCompartment}
                    onChange={(e) => setSelectedCompartment(e.target.value)}
                  >
                    {availableCompartments.length > 0 ? (
                      availableCompartments.map((compartment) => (
                        <option
                          key={compartment.id}
                          value={compartment.compartment}
                        >
                          {compartment.compartment}
                        </option>
                      ))
                    ) : (
                      <option disabled>No compartments available</option>
                    )}
                  </select>
                </div>

                <button
                  className="btn btn-primary w-100"
                  type="button"
                  onClick={handleSubmit}
                >
                  Submit Delivery
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RouteComponent;
