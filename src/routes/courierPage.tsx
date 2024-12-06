import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  query,
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

function RouteComponent() {
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedUser, setSelectedUser] =
    useState<SingleValue<UserOption>>(null);

  const db = getFirestore();

  // Fetch all users from the signInMethod collection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const signInMethodCollection = collection(db, "users");
        const userDocs = await getDocs(query(signInMethodCollection));

        const userList = userDocs.docs.map((doc) => ({
          value: doc.id,
          label: doc.data().email, // Fetch email field for display
        }));

        if (userList.length === 0) {
          Swal.fire({
            icon: "warning",
            title: "No Users Found",
            text: "No users available in the signInMethod collection.",
          });
        }

        setUsers(userList);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch users. Please try again later.",
        });
      }
    };

    fetchUsers();
  }, [db]);

  const handleSubmit = () => {
    console.log("Selected User:", selectedUser);
    if (!selectedUser) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please select a user before submitting!",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Success",
      text: `User ${selectedUser.label} selected successfully!`,
    });
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
                  <label className="form-label">Select User</label>
                  <Select
                    options={users}
                    value={selectedUser}
                    onChange={(option) => setSelectedUser(option)}
                    placeholder="Search and select a user"
                    isSearchable // Enable searchable dropdown
                  />
                </div>

                <button
                  className="btn btn-primary w-100"
                  type="button"
                  onClick={handleSubmit}
                >
                  Submit User
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
