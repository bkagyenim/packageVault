import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { listenToAuthChanges, saveContactMessage } from "./firebaseService";
import HeaderLogo from "../assets/img/core-img/logo.png";
import Footer from "./footer";
import Swal from "sweetalert2";

export const Route = createFileRoute("/customerSupport")({
  component: RouteComponent,
});

function RouteComponent() {
  const [user, setUser] = useState<{ email: string; uid: string; username: string } | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  useEffect(() => {
    const unsubscribe = listenToAuthChanges((currentUser) => {
      if (currentUser) {
        setUser({
          username: currentUser.displayName || "Anonymous User",
          email: currentUser.email || "",
          uid: currentUser.uid,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await saveContactMessage({ ...formData, timestamp: new Date() });
      Swal.fire({
        icon: "success",
        title: "Message Sent",
        text: "Your message has been sent successfully!",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
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
      <div className="header-area" id="headerArea">
        <div className="container">
          <div className="header-content d-flex align-items-center justify-content-between">
            <div className="logo-wrapper">
              <Link to="/customerDashboard">
                <img src={HeaderLogo} alt="Logo" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="page-content-wrapper py-3">
        <h6>Contact Us</h6>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Your email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleInputChange}
          />
          <textarea
            name="message"
            placeholder="Your message"
            value={formData.message}
            onChange={handleInputChange}
          ></textarea>
          <button type="submit">Send</button>
        </form>
      </div>

      <Footer />
    </>
  );
}

export default RouteComponent;
