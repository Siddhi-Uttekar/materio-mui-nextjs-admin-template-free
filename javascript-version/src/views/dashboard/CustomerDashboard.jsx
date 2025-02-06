// // import React, { useState, useEffect } from 'react';
// import { db, auth } from './firebase';
// import { collection, addDoc, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';

// const CustomerDashboard = () => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [priority, setPriority] = useState('Low');
//   const [tickets, setTickets] = useState([]);
//   const [error, setError] = useState('');

//   // Fetch tickets created by the logged-in customer
//   useEffect(() => {
//     const fetchTickets = async () => {
//       const user = auth.currentUser;

//       if (!user) {
//         setError("User not logged in");
//         return;
//       }

//       try {
//         const q = query(collection(db, 'tickets'), where('createdBy', '==', user.uid));
//         const querySnapshot = await getDocs(q);
//         const ticketList = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setTickets(ticketList);
//       } catch (error) {
//         console.error("Error fetching tickets:", error);
//         setError("Error fetching tickets, please try again");
//       }
//     };

//     fetchTickets();
//   }, []);

//   // Handle ticket creation
//   const handleCreateTicket = async (e) => {
//     e.preventDefault();

//     const user = auth.currentUser;

//     if (!user) {
//       setError("User not logged in");
//       return;
//     }

//     try {
//       await addDoc(collection(db, 'tickets'), {
//         title,
//         description,
//         priority,
//         createdBy: user.uid,
//         status: 'Open',
//         createdAt: new Date(),
//       });

//       // Clear the form and fetch updated tickets
//       setTitle('');
//       setDescription('');
//       setPriority('Low');
//       setError('');
//       alert("Ticket created successfully!");

//       // Refresh the ticket list
//       const q = query(collection(db, 'tickets'), where('createdBy', '==', user.uid));
//       const querySnapshot = await getDocs(q);
//       const ticketList = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setTickets(ticketList);
//     } catch (error) {
//       console.error("Error creating ticket:", error);
//       setError("Error creating ticket, please try again");
//     }
//   };

//   // Handle ticket deletion
//   const handleDeleteTicket = async (ticketId) => {
//     try {
//       await deleteDoc(doc(db, 'tickets', ticketId));
//       setTickets(tickets.filter((ticket) => ticket.id !== ticketId));
//       alert("Ticket deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting ticket:", error);
//       setError("Error deleting ticket, please try again");
//     }
//   };

//   return (
//     <div>
//       <h2>Customer Dashboard</h2>

//       {/* Create submission Ticket Form */}
//       <div>
//         <h3>Create New Ticket</h3>
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         <form onSubmit={handleCreateTicket}>
//           <div>
//             <label>Title:</label>
//             <input
//               type="text"
//               placeholder="Enter ticket title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               required
//             />
//           </div>
//           <div>
//             <label>Description:</label>
//             <textarea
//               placeholder="Enter ticket description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               required
//             />
//           </div>
//           <div>
//             <label>Priority:</label>
//             <select
//               value={priority}
//               onChange={(e) => setPriority(e.target.value)}
//             >
//               <option value="Low">Low</option>
//               <option value="Medium">Medium</option>
//               <option value="High">High</option>
//             </select>
//           </div>
//           <button type="submit">Create Ticket</button>
//         </form>
//       </div>

//       {/* Display Tickets */}
//       <div>
//         <h3>My Tickets</h3>
//         {tickets.length === 0 ? (
//           <p>No tickets found.</p>
//         ) : (
//           <ul>
//             {tickets.map((ticket) => (
//               <li key={ticket.id}>
//                 <h4>{ticket.title}</h4>
//                 <p>{ticket.description}</p>
//                 <p><strong>Priority:</strong> {ticket.priority}</p>
//                 <p><strong>Status:</strong> {ticket.status}</p>
//                 <p><strong>Created At:</strong> {ticket.createdAt?.toDate().toLocaleString()}</p>
//                 <button onClick={() => handleDeleteTicket(ticket.id)}>Delete</button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CustomerDashboard;
"use client"
import { auth, db, storage } from '../../../firebase';
import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { Button, TextField, Typography, Modal, Box, MenuItem, Checkbox, FormControlLabel } from '@mui/material';

const CustomerDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState(null);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: '',
    contactEmail: '',
    phone: '',
    dueDate: '',
    status: 'Open',
    attachment: null,
    comments: '',
    termsAccepted: false,
  });
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const ticketsRef = collection(db, 'tickets');
    const unsubscribe = onSnapshot(ticketsRef, (snapshot) => {
      const ticketsData = snapshot.docs
        .filter((doc) => doc.data().createdBy === user.email)
        .map((doc) => ({ id: doc.id, ...doc.data() }));
      setTickets(ticketsData);
    });
    return () => unsubscribe();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTicket((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    setNewTicket((prev) => ({ ...prev, attachment: e.target.files[0] }));
  };

  const handleCreateTicket = async () => {
    if (!user) {
      alert('Please log in first.');
      return;
    }
    if (!newTicket.title || !newTicket.description || !newTicket.termsAccepted) {
      alert('Please fill all required fields and accept the terms.');
      return;
    }
    try {
      await addDoc(collection(db, 'tickets'), {
        title: newTicket.title,
        description: newTicket.description,
        priority: newTicket.priority,
        category: newTicket.category,
        status: newTicket.status,
        contactEmail: newTicket.contactEmail,
        phone: newTicket.phone,
        dueDate: newTicket.dueDate,
        attachment: newTicket.attachment,  // Handle file uploads separately
        comments: newTicket.comments,
        termsAccepted: newTicket.termsAccepted,
        createdBy: user.email,
        createdAt: new Date(),
      });


      setNewTicket({
        title: '', description: '', priority: 'Medium', category: '',
        contactEmail: '', phone: '', dueDate: '', status: 'Open',
        attachment: null, comments: '', termsAccepted: false,
      });
      setOpenModal(false);
    } catch (error) {
      console.error('Error adding ticket:', error);
      alert('Error creating ticket, please try again.');
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Customer Dashboard</Typography>
      <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>Create New Ticket</Button>
      <div style={{ marginTop: '20px' }}>
        {tickets.length === 0 ? (
          <Typography>No tickets found. Create your first ticket!</Typography>
        ) : (
          tickets.map((ticket) => (
            <Box key={ticket.id} sx={{ border: '1px solid gray', padding: '10px', margin: '10px 0' }}>
              <Typography variant="h6">{ticket.title}</Typography>
              <Typography>{ticket.description}</Typography>
              <Typography>Priority: {ticket.priority}</Typography>
            </Box>
          ))
        )}
      </div>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" gutterBottom>Create a New Ticket</Typography>
          <form>
            <TextField label="Title" name="title" value={newTicket.title} onChange={handleInputChange} fullWidth margin="normal" required />
            <TextField label="Description" name="description" value={newTicket.description} onChange={handleInputChange} fullWidth margin="normal" multiline rows={4} required />
            <TextField select label="Priority" name="priority" value={newTicket.priority} onChange={handleInputChange} fullWidth margin="normal">
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </TextField>
            <TextField label="Category" name="category" value={newTicket.category} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Contact Email" name="contactEmail" type="email" value={newTicket.contactEmail} onChange={handleInputChange} fullWidth margin="normal" required />
            <TextField label="Phone" name="phone" type="tel" value={newTicket.phone} onChange={handleInputChange} fullWidth margin="normal" required />
            <TextField label="Due Date" name="dueDate" type="date" value={newTicket.dueDate} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField select label="Status" name="status" value={newTicket.status} onChange={handleInputChange} fullWidth margin="normal">
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
            </TextField>
            <input type="file" onChange={handleFileUpload} style={{ marginTop: '10px' }} />
            <TextField label="Comments" name="comments" value={newTicket.comments} onChange={handleInputChange} fullWidth margin="normal" multiline rows={2} />
            <FormControlLabel control={<Checkbox checked={newTicket.termsAccepted} onChange={() => setNewTicket({ ...newTicket, termsAccepted: !newTicket.termsAccepted })} />} label="I accept the terms and conditions" />
            <Button variant="contained" color="primary" onClick={handleCreateTicket} fullWidth sx={{ marginTop: '16px' }}>Submit Ticket</Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
export default CustomerDashboard;
