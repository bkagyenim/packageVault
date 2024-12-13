import * as React from "react";
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

type State = {
  users: UserOption[];
  selectedUser: SingleValue<UserOption>;
  selectedSize: SingleValue<{ value: string; label: string }>;
  availableCompartments: CompartmentOption[];
  selectedCompartment: string;
  selectedCourier: string;
};

type Action =
  | { type: "SET_USERS"; payload: UserOption[] }
  | { type: "SET_SELECTED_USER"; payload: SingleValue<UserOption> }
  | { type: "SET_SELECTED_SIZE"; payload: SingleValue<{ value: string; label: string }> }
  | { type: "SET_AVAILABLE_COMPARTMENTS"; payload: CompartmentOption[] }
  | { type: "SET_SELECTED_COMPARTMENT"; payload: string }
  | { type: "SET_SELECTED_COURIER"; payload: string }
  | { type: "FETCH_USERS" }
  | { type: "FETCH_COMPARTMENTS" };

const initialState: State = {
  users: [],
  selectedUser: null,
  selectedSize: null,
  availableCompartments: [],
  selectedCompartment: "",
  selectedCourier: "Amazon",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_USERS":
      return { ...state, users: action.payload };
    case "SET_SELECTED_USER":
      return { ...state, selectedUser: action.payload };
    case "SET_SELECTED_SIZE":
      return { ...state, selectedSize: action.payload };
    case "SET_AVAILABLE_COMPARTMENTS":
      return { ...state, availableCompartments: action.payload };
    case "SET_SELECTED_COMPARTMENT":
      return { ...state, selectedCompartment: action.payload };
    case "SET_SELECTED_COURIER":
      return { ...state, selectedCourier: action.payload };
    default:
      return state;
  }
}

function useActions(dispatch: React.Dispatch<Action>, db: any) {
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

      const userList = userDocs.docs.map((doc) => {
        const data = doc.data();
        return {
          value: doc.id,
          label: data.email || "Unknown Email",
        };
      });

      dispatch({ type: "SET_USERS", payload: userList });
    } catch (error) {
      console.error("Error fetching users:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch users. Please try again later.",
      });
    }
  };

  const fetchCompartments = async (selectedSize: SingleValue<{ value: string; label: string }>) => {
    if (!selectedSize) return;

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

      dispatch({ type: "SET_AVAILABLE_COMPARTMENTS", payload: compartments });
    } catch (error) {
      console.error("Error fetching compartments:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch compartments. Please try again later.",
      });
    }
  };

  return { fetchUsers, fetchCompartments };
}

function RouteComponent() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { users, selectedUser, selectedSize, availableCompartments, selectedCompartment, selectedCourier } = state;

  const db = getFirestore();
  const { fetchUsers, fetchCompartments } = useActions(dispatch, db);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  React.useEffect(() => {
    fetchCompartments(selectedSize);
  }, [selectedSize]);

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
                    onChange={(e) =>
                      dispatch({ type: "SET_SELECTED_COURIER", payload: e.target.value })
                    }
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
                    onChange={(option) =>
                      dispatch({ type: "SET_SELECTED_USER", payload: option })
                    }
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
                    onChange={(option) =>
                      dispatch({ type: "SET_SELECTED_SIZE", payload: option })
                    }
                    placeholder="Select a compartment size"
                    isSearchable
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Select Compartment Number</label>
                  <select
                    className="form-select"
                    value={selectedCompartment}
                    onChange={(e) =>
                      dispatch({ type: "SET_SELECTED_COMPARTMENT", payload: e.target.value })
                    }
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
