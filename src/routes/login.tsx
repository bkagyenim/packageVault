import * as React from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import authImage from '../assets/img/bg-img/auth.png';
import { auth, firestore, googleProvider } from '../firebaseConfig'; // Import auth and googleProvider
import { signInWithPopup } from 'firebase/auth'; // Import signInWithPopup
import { collection, query, where, getDocs } from 'firebase/firestore'; // Firestore imports
import Swal from 'sweetalert'; // Import SweetAlert for notifications

export const Route = createFileRoute('/login')({
  component: LoginComponent,
});

function LoginComponent() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  // **Manual Sign-In with Username and Password**
  const handleUsernameSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // Reference the Firestore `users` collection
      const usersRef = collection(firestore, 'users');
      const q = query(
        usersRef,
        where('username', '==', username),
        where('password', '==', password) // Match both username and password
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Successful login
        Swal('Success', 'Login successful!', 'success');
        navigate({ to: '/customerDashboard' });
      } else {
        // Invalid credentials
        Swal('Error', 'Invalid username or password. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error during Username Sign-In:', error);
      Swal('Error', 'An unexpected error occurred. Please try again.', 'error');
    }
  };

  // **Google Sign-In**
  const handleGoogleSignIn = async () => {
    try {
      // Use Firebase Authentication for Google Sign-In
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user; // The signed-in user

      console.log('Google Sign-In successful:', user);
      Swal('Success', `Welcome back, ${user.displayName || 'User'}!`, 'success');
      navigate({ to: '/customerDashboard' });
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
      Swal('Error', 'Google Sign-In failed. Please try again.', 'error');
    }
  };

  return (
    <>
      {/* Header */}
      <div className="header-area" id="headerArea">
        <div className="container">
          <div className="header-content position-relative d-flex align-items-center justify-content-center">
            <Link to="/" className="position-absolute start-0 ms-3" style={{ fontSize: '24px', textDecoration: 'none' }}>
              &#8592;
            </Link>
            <div className="page-heading text-center">
              <h6 className="mb-0">Welcome To PackageVault</h6>
            </div>
          </div>
        </div>
      </div>

    

      {/* <!-- Login Wrapper Area --> */}
      <div className="login-wrapper d-flex align-items-center justify-content-center">
        <div className="custom-container">
          {/* <!-- Image -->*/}
          <div className="text-center px-4">
            <img className="login-intro-img" src={authImage} alt=""/>
          </div>

          {/* <!-- Login Form --> */}
          <div className="register-form mt-4">
            <h6 className="mb-3 text-center">Login with</h6>
            <div className="row">
              <div className="col-12">
                <a className="btn btn-primary btn-facebook mb-3 w-100" href="#">
                  <i className="bi bi-facebook me-1"></i> Login with Facebook
                </a>

                <a className="btn btn-primary btn-google mb-3 w-100" href="#">
                  <i className="bi bi-google me-1"></i> Login with Google
                </a>
              </div>
            </div>
          </div>

          {/* <!-- Login Meta --> */}
          <div className="login-meta-data text-center">
            <p className="mb-0">Didn't have an account? <Link className="stretched-link" to="/register">Register Now</Link></p>
          </div>
        </div>
      </div>
    </>
  );
}
