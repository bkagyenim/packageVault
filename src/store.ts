import { create } from "zustand";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import Swal from "sweetalert2";
import { SingleValue } from "react-select";

type UserOption = {
  value: string;
  label: string;
};

type CompartmentOption = {
  id: string;
  compartment: string | number;
};

type State = {
  users: UserOption[];
  selectedUser: SingleValue<UserOption>;
  selectedSize: SingleValue<{ value: string; label: string }>;
  availableCompartments: CompartmentOption[];
  selectedCompartment: string;
  selectedCourier: string;

  setUsers: (users: UserOption[]) => void;
  setSelectedUser: (user: SingleValue<UserOption>) => void;
  setSelectedSize: (size: SingleValue<{ value: string; label: string }>) => void;
  setAvailableCompartments: (compartments: CompartmentOption[]) => void;
  setSelectedCompartment: (compartment: string) => void;
  setSelectedCourier: (courier: string) => void;

  fetchUsers: () => Promise<void>;
  fetchCompartments: (size: SingleValue<{ value: string; label: string }>) => Promise<void>;
};

export const useStore = create<State>((set, get) => ({
  users: [],
  selectedUser: null,
  selectedSize: null,
  availableCompartments: [],
  selectedCompartment: "",
  selectedCourier: "Amazon",

  setUsers: (users) => set({ users }),
  setSelectedUser: (user) => set({ selectedUser: user }),
  setSelectedSize: (size) => set({ selectedSize: size }),
  setAvailableCompartments: (compartments) => set({ availableCompartments: compartments }),
  setSelectedCompartment: (compartment) => set({ selectedCompartment: compartment }),
  setSelectedCourier: (courier) => set({ selectedCourier: courier }),

  fetchUsers: async () => {
    const db = getFirestore();
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

      set({ users: userList });
    } catch (error) {
      console.error("Error fetching users:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch users. Please try again later.",
      });
    }
  },

  fetchCompartments: async (size) => {
    if (!size) return;
    const db = getFirestore();
    try {
      const vaultCollection = collection(db, "vault");
      const compartmentsQuery = query(
        vaultCollection,
        where("packsize", "==", size.value),
        where("status", "==", "available")
      );
      const compartmentDocs = await getDocs(compartmentsQuery);

      const compartments = compartmentDocs.docs.map((doc) => ({
        id: doc.id,
        compartment: doc.data().compartment,
      }));

      set({ availableCompartments: compartments });
    } catch (error) {
      console.error("Error fetching compartments:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch compartments. Please try again later.",
      });
    }
  },
}));
