import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import Swal from "sweetalert2"; // Import SweetAlert
import { db } from "../firebaseConfig"; // Firebase Firestore import
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

export const Route = createFileRoute("/staffVault")({
  component: RouteComponent,
});

function RouteComponent() {
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get input values
    const packsizeElement = document.querySelector("#packsize") as HTMLSelectElement;
    const compartmentElement = document.querySelector("#compartment") as HTMLInputElement;
    const statusElement = document.querySelector("#status") as HTMLSelectElement;

    const packsize = packsizeElement ? packsizeElement.value.trim() : "";
    const compartment = compartmentElement ? compartmentElement.value.trim() : "";
    const status = statusElement ? statusElement.value.trim() : "";

    // Validate inputs
    if (!packsize || !compartment || !status) {
      Swal.fire({
        icon: "error",
        title: "Missing Input",
        text: "Please fill out all fields before submitting.",
      });
      return;
    }

    try {
      // Check if the compartment and packsize combination already exists
      const vaultsCollection = collection(db, "vault");
      const existingQuery = query(
        vaultsCollection,
        where("packsize", "==", packsize),
        where("compartment", "==", parseInt(compartment, 10))
      );

      const existingDocs = await getDocs(existingQuery);

      if (!existingDocs.empty) {
        // Compartment and packsize already exist
        Swal.fire({
          icon: "error",
          title: "Duplicate Entry",
          text: `The compartment ${compartment} with pack size "${packsize}" already exists. Please choose a different combination.`,
        });
        return;
      }

      // Save to Firestore
      console.log("Preparing to save:", { packsize, compartment, status });

      const docRef = await addDoc(vaultsCollection, {
        packsize,
        compartment: parseInt(compartment, 10), // Ensure it's stored as a number
        status,
      });

      console.log("Document saved successfully:", docRef.id);

      // Success Alert
      Swal.fire({
        icon: "success",
        title: "Saved Successfully",
        text: "The vault has been added.",
      });

      // Clear inputs after successful save
      if (packsizeElement && compartmentElement && statusElement) {
        packsizeElement.value = "Extra Large";
        compartmentElement.value = "";
        statusElement.value = "available";
      }
    } catch (error: any) {
      console.error("Error saving to Firestore:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `An error occurred: ${error.message}`,
      });
    }
  };

  return (
    <>
       {/* Header */}
       <div className="header-area" id="headerArea">
        <div className="container">
          <div className="header-content position-relative d-flex align-items-center justify-content-between">
            {/* Back Button */}
            <div className="back-button">
              <Link to="/staffDashboard">
                <i className="bi bi-arrow-left-short"></i>
              </Link>
            </div>
            {/* Page Title */}
            <div className="header-area" id="headerArea">
              <div className="container">
                <div className="header-content position-relative d-flex align-items-center justify-content-center">
                  <Link to="/staffDashboard" className="position-absolute start-0 ms-3" style={{ fontSize: '24px', textDecoration: 'none' }}>
                    &#8592;
                  </Link>
                  <div className="page-heading text-center">
                    <h6 className="mb-0">Add Vault</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

     

      <div className="page-content-wrapper py-3">
        {/* Element Heading */}
        <div className="container">
          <div className="element-heading">
            <h6>Add Vault</h6>
          </div>
        </div>

        <div className="container">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label className="form-label" htmlFor="packsize">
                    Pack Size
                  </label>
                  <select
                    className="form-select form-select-sm"
                    id="packsize"
                    name="packsize"
                  >
                    <option value="Extra Large" selected>
                      Extra Large
                    </option>
                    <option value="Large">Large</option>
                    <option value="Medium">Medium</option>
                    <option value="Small">Small</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="compartment">
                    Enter Compartment Number
                  </label>
                  <input
                    className="form-control"
                    id="compartment"
                    type="number"
                    placeholder="Enter Compartment Number"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="status">
                    Status
                  </label>
                  <select
                    className="form-select form-select-sm"
                    id="status"
                    name="status"
                  >
                    <option value="available" selected>
                      available
                    </option>
                    <option value="blocked">blocked</option>
                  </select>
                </div>

                <button
                  className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                  type="submit"
                >
                  Save Vault
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
