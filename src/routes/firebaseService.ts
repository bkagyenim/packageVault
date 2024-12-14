import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import Swal from "sweetalert2";
import firebaseConfig from "../firebaseConfig";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Firebase Auth Helper
export const listenToAuthChanges = (callback: (user: any) => void): () => void => {
    // Return the unsubscribe function from `onAuthStateChanged`
    return onAuthStateChanged(auth, callback);
  };

export const loginUser = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login error:", error);
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: error.message,
        });
        throw error;
      } else {
        console.error("Unexpected error:", error);
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "An unexpected error occurred.",
        });
        throw new Error("Unexpected error occurred");
      }
    }
  };
  

// Firestore Helper Functions
export const fetchUserData = async (email: string) => {
  const usersRef = collection(db, "users");
  const userQuery = query(usersRef, where("email", "==", email));
  const snapshot = await getDocs(userQuery);
  return snapshot.empty ? null : snapshot.docs[0];
};

export const fetchPackagesByStatus = async (userId: string, status: string) => {
  const deliveryRef = collection(db, "delivery");
  const packageQuery = query(deliveryRef, where("user", "==", userId), where("status", "==", status));
  const snapshot = await getDocs(packageQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const fetchPackageDetails = async (userEmail: string) => {
  const deliverySnapshot = await getDocs(collection(db, "delivery"));
  const packages = [];

  for (const deliveryDoc of deliverySnapshot.docs) {
    const deliveryData = deliveryDoc.data();
    if (deliveryData.user) {
      const userDocRef = doc(db, "users", deliveryData.user);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && userDoc.data().email === userEmail) {
        const formattedTimestamp = deliveryData.timestamp instanceof Timestamp
          ? new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeStyle: "long" }).format(
              deliveryData.timestamp.toDate()
            )
          : "N/A";
        packages.push({ id: deliveryDoc.id, ...deliveryData, timestampFormatted: formattedTimestamp });
      }
    }
  }

  return packages;
};

export const saveContactMessage = async (data: any) => {
  const contactCollection = collection(db, "contact");
  await addDoc(contactCollection, { ...data, timestamp: new Date() });
};

export const updatePackageStatus = async (packageId: string, status: string) => {
  const packageRef = doc(db, "delivery", packageId);
  await updateDoc(packageRef, { status });
};

export const updateVaultStatus = async (compartment: string, status: string) => {
  const vaultQuery = query(collection(db, "vault"), where("compartment", "==", compartment));
  const snapshot = await getDocs(vaultQuery);
  if (!snapshot.empty) {
    const vaultDocId = snapshot.docs[0].id;
    const vaultDocRef = doc(db, "vault", vaultDocId);
    await updateDoc(vaultDocRef, { status });
  }
};

export { auth, db };
