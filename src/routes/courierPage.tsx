import React, { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
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
import Select from "react-select";
import Swal from "sweetalert2";
import { useStore } from "./store";

export const Route = createFileRoute("/courierPage")({
  component: RouteComponent,
});

function RouteComponent() {
  const db = getFirestore();

  // Zustand state and actions
  const {
    users,
    selectedUser,
    selectedSize,
    availableCompartments,
    selectedCompartment,
    selectedCourier,
    setUsers,
    setSelectedUser,
    setSelectedSize,
    setAvailableCompartments,
    setSelectedCompartment,
    setSelectedCourier,
  } = useStore();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userCollection = collection(db, "users");
        const userDocs = await getDocs(userCollection);

        if (userDocs.empty) {
          Swal.fire({
            icon: "warning",
            title: "No Users Found",
            text: "No users available in the 'users' collection.",
          });
          return;
        }

        const userList = userDocs.docs.map((doc) => ({
          value: doc.id,
          label: doc.data().email || "Unknown Email",
        }));

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
  }, [db, setUsers]);

  useEffect(() => {
    const fetchCompartments = async () => {
      if (!selectedSize) return;

      try {
        const vaultCollection = collection(db, "vault");
        const compartmentsQuery = query(
          vaultCollection,
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
  }, [db, selectedSize, setAvailableCompartments]);

  const handleSubmit = async () => {
    if (!selectedUser || !selectedSize || !selectedCompartment || !selectedCourier) {
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

      const vaultQuery = query(
        vaultCollection,
        where(
          "compartment",
          "==",
          isNaN(Number(selectedCompartment))
            ? selectedCompartment
            : Number(selectedCompartment)
        )
      );
      const vaultSnapshot = await getDocs(vaultQuery);

      if (!vaultSnapshot.empty) {
        const vaultDocId = vaultSnapshot.docs[0].id;
        const vaultDocRef = doc(db, "vault", vaultDocId);
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

      const deliveryData = {
        user: selectedUser.value,
        packsize: selectedSize.value,
        compartment: selectedCompartment,
        courier: selectedCourier,
        status: "pending",
        timestamp: Timestamp.now(),
      };

      await addDoc(deliveryCollection, deliveryData);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Delivery details saved successfully, and compartment status updated!",
      }).then(() => {
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
                    onChange={setSelectedUser}
                    placeholder="Search and select a user"
                    isSearchable
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Select Compartment Size</label>
                  <Select
                    options={[
                      { value: "Extra Large", label: "Extra Large" },
                      { value: "Large", label: "Large" },
                      { value: "Medium", label: "Medium" },
                      { value: "Small", label: "Small" },
                    ]}
                    value={selectedSize}
                    onChange={setSelectedSize}
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
                        <option key={compartment.id} value={compartment.compartment}>
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
