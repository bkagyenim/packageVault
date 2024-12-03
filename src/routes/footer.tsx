import React from "react";
import { Link } from "@tanstack/react-router";

const Footer: React.FC = () => {
  return (
    <div className="footer-nav-area" id="footerNav">
      <div className="container px-0">
        <div className="footer-nav position-relative">
          <ul className="h-100 d-flex align-items-center justify-content-between ps-0">
            <li className="active">
              <Link to="/customerDashboard">
                <i className="bi bi-house"></i>
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/customerPending">
                <i className="bi bi-folder2-open"></i>
                <span>Pending</span>
              </Link>
            </li>
            <li>
              <Link to="/customerCompleted">
                <i className="bi bi-folder-check"></i>
                <span>Collected</span>
              </Link>
            </li>
            <li>
              <Link to="/customerSupport">
                <i className="bi bi-chat-dots"></i>
                <span>Support</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export const Route = () => (
  <Footer />
);

export default Footer;
