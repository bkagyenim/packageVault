import * as React from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import authImage from '../assets/img/bg-img/auth.png';
import { auth, googleProvider } from '../firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import Swal from 'sweetalert';

export const Route = createFileRoute('/register')({
  component: RegisterComponent,
});

function RegisterComponent() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !username || !phone || !password) {
      Swal('Error', 'All fields are required', 'error');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      Swal('Error', 'Please enter a valid email address', 'error');
      return;
    }

    try {
      Swal('Success', 'User registered successfully!', 'success').then(() => {
        navigate({ to: '/login' });
      });
    } catch (error) {
      Swal('Error', 'An error occurred during registration', 'error');
      console.error('Error during registration:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // User is authenticated with Google
      console.log('Google Sign-In successful:', user);

      Swal('Success', `Welcome, ${user.displayName || 'User'}!`, 'success').then(() => {
        navigate({ to: '/customerDashboard' });
      });
    } catch (error) {
      Swal('Error', 'Error during Google Sign-In', 'error');
      console.error('Error during Google Sign-In:', error);
    }
  };

  return (
    <>
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

      <div className="login-wrapper d-flex align-items-center justify-content-center">
        <div className="custom-container">
          <div className="text-center px-4">
            <img className="login-intro-img" src={authImage} alt="" />
          </div>
          <div className="register-form mt-4">
            <h6 className="mb-3 text-center">Register to continue to PackageVault</h6>
            <form onSubmit={handleSignUp}>
              <div className="form-group text-start mb-3">
                <input className="form-control" type="text" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group text-start mb-3">
                <input className="form-control" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="form-group text-start mb-3">
                <input className="form-control" type="number" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div className="form-group text-start mb-3 position-relative">
                <input className="form-control" type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="d-flex justify-content-between w-100">
                <button className="btn btn-primary w-50 me-2" type="submit">Sign Up</button>
                <button className="btn btn-light w-50" type="button" onClick={handleGoogleSignIn}>
                  <i className="bi bi-google me-2"></i>Google
                </button>
              </div>
            </form>
          </div>
          <div className="login-meta-data text-center">
            <p className="mt-3 mb-0">Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </div>
      </div>
    </>
  );
}
