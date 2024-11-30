import React, { useEffect, useState } from 'react'; 
import { createFileRoute, Link } from '@tanstack/react-router'; 
import { getFirestore, collection, onSnapshot, deleteDoc, query, where, getDocs } from 'firebase/firestore'; 
import { initializeApp } from 'firebase/app'; 
import Swal from 'sweetalert2'; 
import firebaseConfig from '../firebaseConfig'; // Adjust the path if necessary 
import courierImage from '../assets/img/bg-img/courier.png'; 
 
// Initialize Firebase and Firestore 
const app = initializeApp(firebaseConfig); 
const db = getFirestore(app); 
 
// Define a type for the vault data 
type VaultItem = { 
  id: string; 
  packsize?: string; 
  compartment?: number; 
  status?: string; 
}; 
 
export const Route = createFileRoute('/courierSize')({ 
  component: RouteComponent, 
}); 
 
function RouteComponent() { 
  const [vaultData, setVaultData] = useState<VaultItem[]>([]); 
  const [error, setError] = useState<string | null>(null); 
  const [filterStatus, setFilterStatus] = useState<string | null>(null); 
 
  useEffect(() => { 
    console.log('Attempting to fetch data from Firestore...'); 
    const vaultCollection = collection(db, 'vault'); 
 
    const unsubscribe = onSnapshot( 
      vaultCollection, 
      (snapshot) => { 
        if (!snapshot.empty) { 
          const data = snapshot.docs.map((doc) => ({ 
            id: doc.id, 
            ...doc.data(), 
          })) as VaultItem[]; 
          console.log('Fetched data:', data); 
          setVaultData(data); 
          setError(null); 
        } else { 
          console.log('Vault collection is empty.'); 
          setVaultData([]); 
        } 
      }, 
      (error) => { 
        console.error('Error fetching data:', error); 
        setError(error.message); 
      } 
    ); 
 
    return () => unsubscribe(); 
  }, []); 
 
  // Filter data based on selected status 
  const filteredData = filterStatus 
    ? vaultData.filter((item) => item.status === filterStatus) 
    : vaultData; 
 
  // Handle delete functionality 
  const handleDelete = async (packsize: string, compartment: number, status: string) => { 
    if (status === 'blocked') { 
      Swal.fire({ 
        icon: 'error', 
        title: 'Action Denied', 
        text: 'Cannot delete because the status is blocked.', 
      }); 
      return; 
    } 
 
    try { 
      const vaultCollection = collection(db, 'vault'); 
      const q = query( 
        vaultCollection, 
        where('packsize', '==', packsize), 
        where('compartment', '==', compartment) 
      ); 
 
      const querySnapshot = await getDocs(q); 
      if (!querySnapshot.empty) { 
        const docToDelete = querySnapshot.docs[0]; 
        await deleteDoc(docToDelete.ref); 
        Swal.fire({ 
          icon: 'success', 
          title: 'Deleted', 
          text: 'Successfully deleted the compartment!', 
        }); 
      } else { 
        Swal.fire({ 
          icon: 'error', 
          title: 'Not Found', 
          text: 'No matching record found to delete.', 
        }); 
      } 
    } catch (error) { 
      console.error('Error deleting document:', error); 
      Swal.fire({ 
        icon: 'error', 
        title: 'Error', 
        text: 'An error occurred while deleting the document.', 
      }); 
    } 
  }; 
 
  return ( 
    <> 
      {/* Error Message */} 
      {error && <div className="error-message">Error: {error}</div>} 
       
      {/* Header Area */} 
      <div className="header-area" id="headerArea"> 
        <div className="container"> 
          <div className="header-content position-relative d-flex align-items-center justify-content-between"> 
            {/* Back Button */} 
            <div className="back-button"> 
              <Link to="/staffDashboard"> 
                <i className="bi bi-arrow-left-short"></i> 
              </Link> 
            </div> 
            {/* Page Title */} 
            <div className="header-area" id="headerArea"> 
              <div className="container"> 
                <div className="header-content position-relative d-flex align-items-center justify-content-center"> 
                  <Link to="/staffDashboard" className="position-absolute start-0 ms-3" style={{ fontSize: '24px', textDecoration: 'none' }}> 
                    &#8592; 
                  </Link> 
                  <div className="page-heading text-center"> 
                    <h6 className="mb-0">Compartment</h6> 
                  </div> 
                </div> 
              </div> 
            </div> 
          </div> 
        </div> 
      </div> 
 
      <div className="page-content-wrapper py-3"> 
        {/* Filter Buttons */} 
        <div className="container py-3"> 
          <button onClick={() => setFilterStatus(null)} className="btn btn-secondary me-2"> 
            Show All 
          </button> 
          <button onClick={() => setFilterStatus('available')} className="btn btn-success me-2"> 
            Available 
          </button> 
          <button onClick={() => setFilterStatus('blocked')} className="btn btn-danger"> 
            Blocked 
          </button> 
        </div> 
        <div className="team-member-wrapper direction-rtl"> 
          <div className="container"> 
            <div className="row g-3"> 
              {filteredData.length === 0 && !error && ( 
                <p>No data available in the vault collection.</p> 
              )} 
              {filteredData.map((item) => ( 
                <div className="col-3" key={item.id}> 
                  <div className="card team-member-card shadow"> 
                    <div className="card-body"> 
                      {/* Member Image */} 
                      <div className="team-member-img shadow-sm"> 
                        <img src={courierImage} alt="Pack Size" /> 
                      </div> 
                      {/* Team Info */} 
                      <div className="team-info"> 
                        <h6 className="mb-1 fz-14">{item.packsize || 'Pack Size'}</h6> 
                        <p className="mb-0 fz-12">{item.compartment || 'Compartment'}</p> 
                        <button 
                          className="btn m-1 btn-sm btn-danger" 
                          onClick={() => 
                            handleDelete(item.packsize || '', item.compartment || 0, item.status || '') 
                          } 
                        > 
                          Delete 
                        </button> 
                      </div> 
                    </div> 
                    {/* Contact Info with conditional class based on status */} 
                    <div 
                      className={`contact-info ${ 
                        item.status === 'blocked' ? 'bg-danger' : 'bg-success' 
                      }`} 
                    > 
                      <p className="mb-0 text-truncate">{item.status || 'Status'}</p> 
                    </div> 
                  </div> 
                </div> 
              ))} 
            </div> 
          </div> 
        </div> 
      </div> 
    </> 
  ); 
} 
