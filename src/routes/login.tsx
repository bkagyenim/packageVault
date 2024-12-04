import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import authImage from "../assets/img/bg-img/auth.png";
import { auth, googleProvider, facebookProvider } from "../firebaseConfig"; // Import auth, googleProvider, facebookProvider
import { signInWithPopup } from "firebase/auth"; // Import signInWithPopup
import Swal from "sweetalert2"; // Import SweetAlert for notifications

export const Route = createFileRoute("/login")({
  component: LoginComponent,
});

function LoginComponent() {
  const navigate = useNavigate();

  // **Google Sign-In**
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user; // The signed-in user

      console.log("Google Sign-In successful:", user);
      Swal.fire("Success", `Welcome back, ${user.displayName || "User"}!`, "success");
      navigate({ to: "/customerDashboard" });
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
      Swal.fire("Error", "Google Sign-In failed. Please try again.", "error");
    }
  };

  // **Facebook Sign-In**
  const handleFacebookSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user; // The signed-in user

      console.log("Facebook Sign-In successful:", user);
      Swal.fire("Success", `Welcome back, ${user.displayName || "User"}!`, "success");
      navigate({ to: "/customerDashboard" });
    } catch (error) {
      console.error("Error during Facebook Sign-In:", error);
      Swal.fire("Error", "Facebook Sign-In failed. Please try again.", "error");
    }
  };

  return (
    <>
      {/* Header */}
      <div className="header-area" id="headerArea">
        <div className="container">
          <div className="header-content position-relative d-flex align-items-center justify-content-center">
            <Link
              to="/"
              className="position-absolute start-0 ms-3"
              style={{ fontSize: "24px", textDecoration: "none" }}
            >
              &#8592;
            </Link>
            <div className="page-heading text-center">
              <h6 className="mb-0">Welcome To PackageVault</h6>
            </div>
          </div>
        </div>
      </div>

      {/* Login Wrapper Area */}
      <div className="login-wrapper d-flex align-items-center justify-content-center">
        <div className="custom-container">
          {/* Image */}
          <div className="text-center px-4">
            <img className="login-intro-img" src={authImage} alt="Login Intro" />
          </div>

          {/* Login Form */}
          <div className="register-form mt-4">
            <h6 className="mb-3 text-center">Login with</h6>
            <div className="row">
              <div className="col-12">
                {/* Facebook Login Button */}
                <button
                  className="btn btn-primary btn-facebook mb-3 w-100"
                  onClick={handleFacebookSignIn}
                >
                  <i className="bi bi-facebook me-1"></i> Login with Facebook
                </button>

                {/* Google Login Button */}
                <button
                  className="btn btn-primary btn-google mb-3 w-100"
                  onClick={handleGoogleSignIn}
                >
                  <i className="bi bi-google me-1"></i> Login with Google
                </button>
              </div>
            </div>
          </div>

          {/* Login Meta */}
          <div className="login-meta-data text-center">
            <p className="mb-0">
              Don't have an account? <Link to="/register">Register Now</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginComponent;
