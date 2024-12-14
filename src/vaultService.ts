import Swal from "sweetalert2";
import { db } from "./firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";



// Export the handleSave function
export const handleSave = async (
  e: React.FormEvent<HTMLFormElement>,
  packsize: string,
  compartment: string,
  status: string,
  clearInputs: () => void
) => {
  e.preventDefault();

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
    clearInputs();
  } catch (error: any) {
    console.error("Error saving to Firestore:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `An error occurred: ${error.message}`,
    });
  }
};

