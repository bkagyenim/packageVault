import React, { useEffect, useState } from "react"; 
import { createFileRoute, Link } from "@tanstack/react-router"; 
import { getFirestore, collection, getDocs } from "firebase/firestore"; 
import { initializeApp } from "firebase/app"; 
import firebaseConfig from "../firebaseConfig"; // Adjust the path if necessary 
import DataTable from "react-data-table-component"; 
 
// Initialize Firebase and Firestore 
const app = initializeApp(firebaseConfig); 
const db = getFirestore(app); 
 
export const Route = createFileRoute("/staffMessage")({ 
  component: RouteComponent, 
}); 
 
type Message = { 
  id: string; 
  name: string; 
  email: string; 
  subject: string; 
  message: string; 
}; 
 
function RouteComponent() { 
  const [messages, setMessages] = useState<Message[]>([]); 
  const [searchText, setSearchText] = useState<string>(""); 
 
  useEffect(() => { 
    const fetchMessages = async () => { 
      try { 
        const contactCollection = collection(db, "contact"); 
        const snapshot = await getDocs(contactCollection); 
        const data = snapshot.docs.map((doc) => ({ 
          id: doc.id, 
          ...doc.data(), 
        })) as Message[]; 
        setMessages(data); 
      } catch (err) { 
        console.error("Error fetching messages:", err); 
      } 
    }; 
 
    fetchMessages(); 
  }, []); 
 
  // Filter messages based on search text 
  const filteredMessages = messages.filter( 
    (message) => 
      message.name.toLowerCase().includes(searchText.toLowerCase()) || 
      message.email.toLowerCase().includes(searchText.toLowerCase()) || 
      message.subject.toLowerCase().includes(searchText.toLowerCase()) || 
      message.message.toLowerCase().includes(searchText.toLowerCase()) 
  ); 
 
  const columns = [ 
    { 
      name: "Name", 
      selector: (row: Message) => row.name, 
      sortable: true, 
    }, 
    { 
      name: "Email", 
      selector: (row: Message) => row.email, 
      sortable: true, 
    }, 
    { 
      name: "Subject", 
      selector: (row: Message) => row.subject, 
      sortable: true, 
    }, 
    { 
      name: "Message", 
      selector: (row: Message) => row.message, 
      sortable: false, 
    }, 
    { 
      name: "Action", 
      cell: (row: Message) => ( 
        <a href={`mailto:${row.email}`} className="btn bi bi-mailbox"> 
          Reply 
        </a> 
      ), 
      ignoreRowClick: true, 
      allowOverflow: true, 
      button: true, 
    }, 
  ]; 
 
  return ( 
    <> 
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
                  <Link 
                    to="/staffDashboard" 
                    className="position-absolute start-0 ms-3" 
                    style={{ fontSize: "24px", textDecoration: "none" }} 
                  > 
                    &#8592; 
                  </Link> 
                  <div className="page-heading text-center"> 
                    <h6 className="mb-0">Messages</h6> 
                  </div> 
                </div> 
              </div> 
            </div> 
          </div> 
        </div> 
      </div> 
 
      <div className="page-content-wrapper py-3"> 
        <div className="container"> 
          <div className="card"> 
            <div className="card-body"> 
              <div className="mb-3"> 
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search messages..." 
                  value={searchText} 
                  onChange={(e) => setSearchText(e.target.value)} 
                /> 
              </div> 
              <DataTable 
                columns={columns} 
                data={filteredMessages} 
                pagination 
                highlightOnHover 
                pointerOnHover 
              /> 
            </div> 
          </div> 
        </div> 
      </div> 
    </> 
  ); 
} 
 
export default RouteComponent; 
