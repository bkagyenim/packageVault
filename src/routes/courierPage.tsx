import React, { useEffect } from "react";
import { useStore } from "../store";
import Select from "react-select";
import Swal from "sweetalert2";

function RouteComponent() {
  const {
    users,
    selectedUser,
    selectedSize,
    availableCompartments,
    selectedCompartment,
    selectedCourier,
    setSelectedUser,
    setSelectedSize,
    setSelectedCompartment,
    setSelectedCourier,
    fetchUsers,
    fetchCompartments,
  } = useStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchCompartments(selectedSize);
  }, [selectedSize, fetchCompartments]);

  const handleSubmit = async () => {
    // Submission logic remains unchanged
  };

  return (
    <>
      {/* Render UI here */}
      <form>
        {/* Form Fields */}
        <Select
          options={users}
          value={selectedUser}
          onChange={setSelectedUser}
          placeholder="Search and select a user"
        />
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
        />
        <select
          value={selectedCompartment}
          onChange={(e) => setSelectedCompartment(e.target.value)}
        >
          {availableCompartments.map((compartment) => (
            <option key={compartment.id} value={compartment.compartment}>
              {compartment.compartment}
            </option>
          ))}
        </select>
        <button type="button" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </>
  );
}

export default RouteComponent;
