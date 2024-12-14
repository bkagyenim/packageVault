import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import authImage from "../assets/img/bg-img/auth.png";
import { auth, googleProvider, facebookProvider, db } from "../firebaseConfig";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import Swal from "sweetalert2";

export const Route = createFileRoute("/register")({
  component: RegisterComponent,
});

function RegisterComponent() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");

 

  // **Google Sign-Up**
  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const usersRef = collection(db, "users");
      const userQuery = query(usersRef, where("email", "==", user.email));
      const userSnapshot = await getDocs(userQuery);

      // Check if user already exists
      if (userSnapshot.empty) {
        await addDoc(usersRef, {
          email: user.email,
          username: user.displayName,
          phone: "", // Optional, since Google doesn't provide phone number by default
        });
      }

      Swal.fire("Success", "Google Sign-Up successful!", "success").then(() => {
        navigate({ to: "/login" });
      });
    } catch (error) {
      Swal.fire("Error", "Error during Google Sign-Up", "error");
      console.error("Error during Google Sign-Up:", error);
    }
  };

  // **Facebook Sign-Up**
  const handleFacebookSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;

      const usersRef = collection(db, "users");
      const userQuery = query(usersRef, where("email", "==", user.email));
      const userSnapshot = await getDocs(userQuery);

      // Check if user already exists
      if (userSnapshot.empty) {
        await addDoc(usersRef, {
          email: user.email,
          username: user.displayName,
          phone: "", // Optional, since Facebook doesn't provide phone number by default
        });
      }

      Swal.fire("Success", "Facebook Sign-Up successful!", "success").then(() => {
        navigate({ to: "/login" });
      });
    } catch (error) {
      Swal.fire("Error", "Error during Facebook Sign-Up", "error");
      console.error("Error during Facebook Sign-Up:", error);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="header-area" id="headerArea">
        <div className="container">
          <div className="header-content position-relative d-flex align-items-center justify-content-center">
            <Link to="/" className="position-absolute start-0 ms-3" style={{ fontSize: "24px", textDecoration: "none" }}>
              &#8592;
            </Link>
            <div className="page-heading text-center">
              <h6 className="mb-0">Welcome To PackageVault</h6>
            </div>
          </div>
        </div>
      </div>

      {/* Register Wrapper Area */}
      <div className="login-wrapper d-flex align-items-center justify-content-center">
        <div className="custom-container">
          {/* Image */}
          <div className="text-center px-4">
            <img className="login-intro-img" src={authImage} alt="Register Intro" />
          </div><br/>

          {/* Register Form */}
          

          {/* Social Sign-Up Buttons */}
          <button className="btn btn-primary btn-google mb-3 w-100" onClick={handleGoogleSignUp}>
            <i className="bi bi-google me-1"></i> Sign Up with Google
          </button>
          <button className="btn btn-primary btn-facebook mb-3 w-100" onClick={handleFacebookSignUp}>
            <i className="bi bi-facebook me-1"></i> Sign Up with Facebook
          </button>

          {/* Login Meta */}
          <div className="login-meta-data text-center">
            <p className="mb-0">
              Already Have an account? <Link to="/login">Login Now</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterComponent;
