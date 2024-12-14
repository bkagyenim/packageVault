import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { handleSave } from "../vaultService"; // Adjust the path as necessary

export const Route = createFileRoute("/staffVault")({
  component: RouteComponent,
});

function RouteComponent() {
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Get input values
    const packsizeElement = document.querySelector("#packsize") as HTMLSelectElement;
    const compartmentElement = document.querySelector("#compartment") as HTMLInputElement;
    const statusElement = document.querySelector("#status") as HTMLSelectElement;

    const packsize = packsizeElement ? packsizeElement.value.trim() : "";
    const compartment = compartmentElement ? compartmentElement.value.trim() : "";
    const status = statusElement ? statusElement.value.trim() : "";

    const clearInputs = () => {
      if (packsizeElement && compartmentElement && statusElement) {
        packsizeElement.value = "Extra Large";
        compartmentElement.value = "";
        statusElement.value = "available";
      }
    };

    // Call the handleSave function from the service
    await handleSave(e, packsize, compartment, status, clearInputs);
  };

  return (
    <>
      {/* Your JSX Code */}
      <form onSubmit={handleFormSubmit}>
        {/* Input Fields */}
        <div className="form-group">
          <label htmlFor="packsize">Pack Size</label>
          <select id="packsize" className="form-select form-select-sm">
            <option value="Extra Large" selected>Extra Large</option>
            <option value="Large">Large</option>
            <option value="Medium">Medium</option>
            <option value="Small">Small</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="compartment">Compartment</label>
          <input id="compartment" type="number" className="form-control" />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" className="form-select form-select-sm">
            <option value="available" selected>available</option>
            <option value="blocked">blocked</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Save Vault</button>
      </form>
    </>
  );
}

export default RouteComponent;
