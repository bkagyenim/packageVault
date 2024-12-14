import { create } from "zustand";
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
};

export const useStore = create<State>((set: (arg0: { users?: any; selectedUser?: any; selectedSize?: any; availableCompartments?: any; selectedCompartment?: any; selectedCourier?: any; }) => any) => ({
  users: [],
  selectedUser: null,
  selectedSize: null,
  availableCompartments: [],
  selectedCompartment: "",
  selectedCourier: "Amazon",

  setUsers: (users: any) => set({ users }),
  setSelectedUser: (user: any) => set({ selectedUser: user }),
  setSelectedSize: (size: any) => set({ selectedSize: size }),
  setAvailableCompartments: (compartments: any) => set({ availableCompartments: compartments }),
  setSelectedCompartment: (compartment: any) => set({ selectedCompartment: compartment }),
  setSelectedCourier: (courier: any) => set({ selectedCourier: courier }),
}));