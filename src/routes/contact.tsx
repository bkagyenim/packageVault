import * as React from "react"; 
import { createFileRoute, Link } from "@tanstack/react-router"; 
import { useState } from "react"; 
import Swal from "sweetalert2"; 
 
// Firebase imports 
import { initializeApp } from "firebase/app"; 
import { getFirestore, collection, addDoc } from "firebase/firestore"; 
 
// Firebase Configuration 
const firebaseConfig = { 
  apiKey: "AIzaSyCLmmn_vdUNvCYlhQUCAmpGk0iagD-Is-M", 
  authDomain: "packagevault-67f49.firebaseapp.com", 
  projectId: "packagevault-67f49", 
  storageBucket: "packagevault-67f49.firebasestorage.app", 
  messagingSenderId: "905264502790", 
  appId: "1:905264502790:web:ebf38aa7c313768c21cb87", 
  measurementId: "G-PT52BT3N1D", 
}; 
 
// Initialize Firebase 
initializeApp(firebaseConfig); 
const db = getFirestore(); 
 
export const Route = createFileRoute("/contact")({ 
  component: RouteComponent, 
}); 
 
function RouteComponent() { 
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    subject: "", 
    message: "", 
  }); 
 
  // Handle form input changes 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { 
    const { name, value } = e.target; 
    setFormData((prevData) => ({ 
      ...prevData, 
      [name]: value, 
    })); 
  }; 
 
  // Handle form submission 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault(); 
 
    const { name, email, subject, message } = formData; 
 
    // Validate fields 
    if (!name || !email || !subject || !message) { 
      Swal.fire({ 
        icon: "error", 
        title: "Missing Fields", 
        text: "Please fill in all fields before submitting!", 
      }); 
      return; 
    } 
 
    try { 
      // Add data to the `contact` collection 
      const contactCollection = collection(db, "contact"); 
      await addDoc(contactCollection, { 
        name, 
        email, 
        subject, 
        message, 
        timestamp: new Date(), // Optional: Add a timestamp 
      }); 
 
      // Success alert 
      Swal.fire({ 
        icon: "success", 
        title: "Message Sent", 
        text: "Your message has been sent successfully!", 
      }).then(() => { 
        // Refresh page 
        window.location.reload(); 
      }); 
    } catch (error) { 
      console.error("Error saving contact message:", error); 
      Swal.fire({ 
        icon: "error", 
        title: "Error", 
        text: "Failed to send your message. Please try again later.", 
      }); 
    } 
  }; 
 
  return ( 
    <> 
      {/* Header Area */} 
      <div className="header-area" id="headerArea"> 
        <div className="container"> 
          {/* Header Content */} 
          <div className="header-content position-relative d-flex align-items-center justify-content-between"> 
            {/* Back Button */} 
            <div className="back-button"> 
              <Link to="/"> 
                <i className="bi bi-arrow-left-short"></i> 
              </Link> 
            </div> 
          </div> 
        </div> 
      </div> 
 
      <div className="page-content-wrapper py-3"> 
        <div className="container"> 
          {/* Contact Form */} 
          <div className="card mb-3"> 
            <div className="card-body"> 
              <h5 className="mb-3">Write to us</h5> 
 
              <div className="contact-form"> 
                <form onSubmit={handleSubmit}> 
                  <div className="form-group mb-3"> 
                    <input 
                      className="form-control" 
                      type="text" 
                      name="name" 
                      placeholder="Your name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                    /> 
                  </div> 
 
                  <div className="form-group mb-3"> 
                    <input 
                      className="form-control" 
                      type="email" 
                      name="email" 
                      placeholder="Enter email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                    /> 
                  </div> 
 
                  <div className="form-group mb-3"> 
                    <select 
                      className="form-select" 
                      name="subject" 
                      value={formData.subject} 
                      onChange={handleInputChange} 
                    > 
                      <option value="" disabled> 
                        Select a topic 
                      </option> 
                      <option value="Authors Help">Track Package</option> 
                      <option value="Buyer Help">General Enquiry</option> 
                      <option value="Licenses">Others</option> 
                    </select> 
                  </div> 
 
                  <div className="form-group mb-3"> 
                    <textarea 
                      className="form-control" 
                      name="message" 
                      cols={30} 
                      rows={10} 
                      placeholder="Write details" 
                      value={formData.message} 
                      onChange={handleInputChange} 
                    ></textarea> 
                  </div> 
                  <button className="btn btn-primary w-100">Send Now</button> 
                </form> 
              </div> 
            </div> 
          </div> 
        </div> 
 
        <div className="container"> 
          {/* Google Maps */} 
          <div className="card"> 
            <div className="card-body"> 
              <div className="google-maps"> 
                <h5 className="mb-3">Our office location</h5> 
                <iframe 
                  className="w-100" 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d37902.096510377676!2d101.6393079588335!3d3.103387873464772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc49c701efeae7%3A0xf4d98e5b2f1c287d!2sKuala%20Lumpur%2C%20Federal%20Territory%20of%20Kuala%20Lumpur%2C%20Malaysia!5e0!3m2!1sen!2sbd!4v1591684973931!5m2!1sen!2sbd" 
                  allowFullScreen 
                  aria-hidden="false" 
                  tabIndex={0} 
                ></iframe> 
              </div> 
            </div> 
          </div> 
        </div> 
      </div> 
    </> 
  ); 
} 
 
export default RouteComponent; 
