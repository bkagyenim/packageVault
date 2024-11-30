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
 
      {/* Login Form */} 
      <div className="login-wrapper d-flex align-items-center justify-content-center"> 
        <div className="custom-container"> 
          <div className="text-center px-4"> 
            <img className="login-intro-img" src={authImage} alt="Login Intro" /> 
          </div> 
          <div className="register-form mt-4"> 
            <h6 className="mb-3 text-center">Log in to continue to PackageVault</h6> 
            <form onSubmit={handleUsernameSignIn}> 
              {/* Username Input */} 
              <div className="form-group"> 
                <input 
                  className="form-control" 
                  type="text" 
                  placeholder="Username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                /> 
              </div> 
              {/* Password Input */} 
              <div className="form-group position-relative"> 
                <input 
                  className="form-control" 
                  type="password" 
                  placeholder="Enter Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                /> 
              </div> 
              {/* Normal Sign-In Button */} 
              <button className="btn btn-primary w-100" type="submit">Sign In</button> 
 
              {/* Google Sign-In Button */} 
              <div className="d-flex justify-content-between w-100 mt-3"> 
                <button className="btn btn-light w-100" type="button" onClick={handleGoogleSignIn}> 
                  <i className="bi bi-google me-2"></i>Google 
                </button> 
              </div> 
            </form> 
          </div> 
          {/* Redirect to Register */} 
          <div className="login-meta-data text-center"> 
            <p className="mb-0">Don't have an account? <Link to="/register">Register Now</Link></p> 
          </div> 
        </div> 
      </div> 
    </> 
  ); 
} 
