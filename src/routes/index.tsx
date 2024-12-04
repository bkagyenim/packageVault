import * as React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';

// Import images
import bgImage from '../assets/img/bg-img/31.png';
import courierImage from '../assets/img/bg-img/courier.png';
import contactImage from '../assets/img/bg-img/contact.png';
import customerImage from '../assets/img/bg-img/customer.png';
import staffImage from '../assets/img/bg-img/staff.png';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <>
      {/* Header Area */}
      <div className="header-area" id="headerArea">
        <div className="container">
          {/* Header Content */}
          <div className="header-content position-relative d-flex align-items-center justify-content-between">
            {/* Page Title */}
            <div className="page-heading">
              <h6 className="mb-0 justify-content-center align-items-center">Welcome To PackageVault</h6>
            </div>
          </div>
        </div>
      </div>

      <div className="page-content-wrapper py-3">
        <div className="container">
          <div className="row g-3 justify-content-center">

            {/* Customer Card */}
            <div className="col-12 col-md-8 col-lg-7 col-xl-6">
              <div className="card shadow-sm blog-list-card">
                <div className="d-flex align-items-center">
                  <div className="card-blog-img position-relative" style={{ backgroundImage: `url(${customerImage})`, }}>
                  </div>
                  <div className="card-blog-content">
                    <p className="blog-title d-block mb-3 text-dark">Easily Track and Pick Up Packages</p>
                    <Link className="btn btn-primary btn-sm" to="/login">Login as Customer</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Courier Card */}
            <div className="col-12 col-md-8 col-lg-7 col-xl-6">
              <div className="card shadow-sm blog-list-card">
                <div className="d-flex align-items-center">
                  <div className="card-blog-img position-relative" style={{ backgroundImage: `url(${courierImage})`, }}>
                  </div>
                  <div className="card-blog-content">
                    <p className="blog-title d-block mb-3 text-dark">Efficiently Deliver Packages to Vaults</p>
                    <Link className="btn btn-primary btn-sm " to="/courierPage">Courier Portal</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Staff Card */}
            <div className="col-12 col-md-8 col-lg-7 col-xl-6">
              <div className="card shadow-sm blog-list-card">
                <div className="d-flex align-items-center">
                  <div className="card-blog-img position-relative" style={{ backgroundImage: `url(${staffImage})`, }}>
                  </div>
                  <div className="card-blog-content">
                    <p className="blog-title d-block mb-3 text-dark">Manage Vaults and Monitor Activity</p>
                    <Link className="btn btn-primary btn-sm" to="/staff">Login as Staff</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="col-12 col-md-8 col-lg-7 col-xl-6">
              <div className="card shadow-sm blog-list-card">
                <div className="d-flex align-items-center">
                  <div className="card-blog-img position-relative" style={{ backgroundImage: `url(${contactImage})`, }}>
                  </div>
                  <div className="card-blog-content">
                    <p className="blog-title d-block mb-3 text-dark">Need Assistance? Reach Out to Us</p>
                    <a className="btn btn-primary btn-sm" href="/contact">Contact Us</a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
