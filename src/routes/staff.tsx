import * as React from "react"; 
import { createFileRoute, Link } from "@tanstack/react-router"; 
import Swal from "sweetalert2"; // Import SweetAlert 
import authImage from "../assets/img/bg-img/auth.png"; 
 
export const Route = createFileRoute("/staff")({ 
  component: RouteComponent, 
}); 
 
function RouteComponent() { 
  // Default credentials 
  const defaultUsername = "admin"; 
  const defaultPassword = "Admin@1234"; 
 
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault(); // Prevent form submission 
 
    // Get input values 
    const usernameElement = document.getElementById("username") as HTMLInputElement | null; 
    const passwordElement = document.getElementById("psw-input") as HTMLInputElement | null; 
 
    const username = usernameElement?.value.trim() || ""; // Use optional chaining 
    const password = passwordElement?.value.trim() || ""; // Use optional chaining 
 
    // Validation checks 
    if (!username || !password) { 
      Swal.fire({ 
        icon: "error", 
        title: "Oops...", 
        text: "Please fill out all fields.", 
      }); 
      return; 
    } 
 
    if (username !== defaultUsername || password !== defaultPassword) { 
      Swal.fire({ 
        icon: "error", 
        title: "Invalid Credentials", 
        text: "The username or password is incorrect.", 
      }); 
      return; 
    } 
 
    // Successful login 
    Swal.fire({ 
      icon: "success", 
      title: "Login Successful", 
      text: "Redirecting to the dashboard...", 
      timer: 1500, 
      showConfirmButton: false, 
    }).then(() => { 
      // Redirect to staffDashboard 
      window.location.href = "/staffDashboard"; // Update this URL if needed 
    }); 
  }; 
 
  return ( 
    <> 
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
          <div className="text-center px-4"> 
            <img className="login-intro-img" src={authImage} alt="" /> 
          </div> 
 
          {/* Register Form */} 
          <div className="register-form mt-4"> 
            <h6 className="mb-3 text-center">Log in to continue to the PackageVault</h6> 
 
            <form onSubmit={handleLogin}> 
              <div className="form-group"> 
                <input 
                  className="form-control" 
                  type="text" 
                  id="username" 
                  placeholder="Username" 
                /> 
              </div> 
 
              <div className="form-group position-relative"> 
                <input 
                  className="form-control" 
                  id="psw-input" 
                  type="password" 
                  placeholder="Enter Password" 
                /> 
              </div> 
 
              <button className="btn btn-primary w-100" type="submit"> 
                Sign In 
              </button> 
            </form> 
          </div> 
 
          {/* Login Meta */} 
          <div className="login-meta-data text-center"> 
            <p className="stretched-link forgot-password d-block mt-3 mb-1"> 
              Username: admin 
            </p> 
            <p className="stretched-link forgot-password d-block mt-3 mb-1"> 
              Password: Admin@1234 
            </p> 
          </div> 
        </div> 
      </div> 
    </> 
  ); 
} 
 
export default RouteComponent; 
