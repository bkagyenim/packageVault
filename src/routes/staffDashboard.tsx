import * as React from "react"; 
import { createFileRoute, Link } from "@tanstack/react-router"; 
import HeaderLogo from "../assets/img/core-img/logo.png"; 
import ProfileImage from "../assets/img/bg-img/2.png"; 
import customerImage from "../assets/img/bg-img/customer.png"; 
import staffImage from "../assets/img/bg-img/staff.png"; 
import { db } from "../firebaseConfig"; // Firestore database import 
import { collection, getDocs } from "firebase/firestore"; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"; 
import { Pie } from "react-chartjs-2"; 
 
ChartJS.register(ArcElement, Tooltip, Legend); 
 
export const Route = createFileRoute("/staffDashboard")({ 
  component: RouteComponent, 
}); 
 
function RouteComponent() { 
  const [chartData, setChartData] = React.useState({ 
    labels: ["Available", "Blocked"], 
    datasets: [ 
      { 
        label: "Compartments Status", 
        data: [0, 0], 
        backgroundColor: ["#36A2EB", "#FF6384"], 
        hoverBackgroundColor: ["#36A2EB", "#FF6384"], 
      }, 
    ], 
  }); 
 
  React.useEffect(() => { 
    const fetchData = async () => { 
      try { 
        const vaultCollection = collection(db, "vault"); 
        const querySnapshot = await getDocs(vaultCollection); 
 
        let availableCount = 0; 
        let blockedCount = 0; 
 
        querySnapshot.forEach((doc) => { 
          const data = doc.data(); 
          if (data.status === "available") { 
            availableCount++; 
          } else if (data.status === "blocked") { 
            blockedCount++; 
          } 
        }); 
 
        // Update chart data 
        setChartData((prevData) => ({ 
          ...prevData, 
          datasets: [ 
            { 
              ...prevData.datasets[0], 
              data: [availableCount, blockedCount], 
            }, 
          ], 
        })); 
      } catch (error) { 
        console.error("Error fetching data:", error); 
      } 
    }; 
 
    fetchData(); 
  }, []); 
 
  return ( 
    <> 
      <div className="header-area" id="headerArea"> 
        <div className="container"> 
          <div className="header-content header-style-five position-relative d-flex align-items-center justify-content-between"> 
            <div className="logo-wrapper"> 
              <Link to="/staffDashboard"> 
                <img src={HeaderLogo} alt="Logo" /> 
              </Link> 
            </div> 
            <div 
              className="navbar--toggler" 
              id="affanNavbarToggler" 
              data-bs-toggle="offcanvas" 
              data-bs-target="#affanOffcanvas" 
              aria-controls="affanOffcanvas" 
            > 
              <span className="d-block"></span> 
              <span className="d-block"></span> 
              <span className="d-block"></span> 
            </div> 
          </div> 
        </div> 
      </div> 
 
      <div 
        className="offcanvas offcanvas-start" 
        id="affanOffcanvas" 
        data-bs-scroll="true" 
        tabIndex={-1} 
        aria-labelledby="affanOffcanvsLabel" 
      > 
        <button 
          className="btn-close btn-close-white text-reset" 
          type="button" 
          data-bs-dismiss="offcanvas" 
          aria-label="Close" 
        ></button> 
        <div className="offcanvas-body p-0"> 
          <div className="sidenav-wrapper"> 
            <div className="sidenav-profile bg-gradient"> 
              <div className="sidenav-style1"></div> 
              <div className="user-profile"> 
                <img src={ProfileImage} alt="User Thumbnail" /> 
              </div> 
              <div className="user-info"> 
                <h6 className="user-name mb-0">Admin</h6> 
                <span>Admin@email.com</span> 
              </div> 
            </div> 
            <ul className="sidenav-nav ps-0"> 
              <li> 
                <Link to="/staff"> 
                  <i className="bi bi-box-arrow-right"></i> Logout 
                </Link> 
              </li> 
            </ul> 
          </div> 
        </div> 
      </div> 
 
      <div className="page-content-wrapper py-3"> 
        {/* Pagination */} 
        <div className="shop-pagination pb-3"> 
          <div className="container"> 
            <div className="card"> 
              <div className="card-body p-2"> 
                <div className="d-flex align-items-center justify-content-between"> 
                  <small className="ms-1">Welcome Staff Member</small> 
                </div> 
              </div> 
            </div> 
          </div> 
        </div> 
 
        {/* Top Products */} 
        <div className="top-products-area"> 
          <div className="container"> 
            <div className="row g-12"> 
              {/* Single Top Product Card */} 
              <div className="col-6 col-sm-4 col-lg-6"> 
                <div className="card single-product-card"> 
                  <div className="card-body p-3"> 
                    {/* Product Thumbnail */} 
                    <Link className="product-thumbnail d-block" to="/staffDashboard"> 
                      <img src={customerImage} alt="" /> 
                    </Link> 
                    <br /> 
                    <Link className="btn btn-primary me-3" to="/staffVault"> 
                      Add Vault 
                    </Link> 
 
                    <Link className="btn btn-primary" to="/courierSize"> 
                      View Vaults 
                    </Link> 
                  </div> 
                </div> 
              </div> 
 
              <div className="col-6 col-sm-4 col-lg-6"> 
                <div className="card single-product-card"> 
                  <div className="card-body p-3"> 
                    {/* Product Thumbnail */} 
                    <Link className="product-thumbnail d-block" to="/staffMessage"> 
                      <img src={staffImage} alt="" /> 
                    </Link> 
                    <br /> 
                    <Link className="btn btn-primary btn-block " to="/staffMessage"> 
                      View Message 
                    </Link> 
                  </div> 
                </div> 
              </div> 
            </div> 
          </div> 
        </div> 
        <br /> 
        <div className="shop-pagination pb-3"> 
          <div className="container"> 
            <div className="card"> 
              <div className="card-body p-2"> 
                <div className="d-flex align-items-center justify-content-between"> 
                  <small className="ms-1">Chart</small> 
                </div> 
              </div> 
            </div> 
          </div> 
        </div> 
 
        {/* Pie Chart Section */} 
        <div className="container"> 
          <div className="card mb-3"> 
            <div className="card-body"> 
              <h6 className="mb-3">Vault Status Distribution</h6> 
              <div style={{ width: "300px", height: "300px", margin: "0 auto" }}> 
                <Pie data={chartData} /> 
              </div> 
            </div> 
          </div> 
        </div> 
 
 
 
      </div> 
    </> 
  ); 
} 
 
export default RouteComponent; 
