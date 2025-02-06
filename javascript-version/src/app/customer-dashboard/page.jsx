
"use client";
import { useRouter } from 'next/navigation';
import { auth, db, storage } from '../../../firebase'; // Import Firebase storage
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'; // Firebase Storage
import { collection, addDoc, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';

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
  const [selectedTicket, setSelectedTicket] = useState(null);
  const router = useRouter();

  // Listen for changes to the authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        router.push('/login'); // Redirect to login if user is not logged in
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Fetch user's tickets from Firestore
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

    // Handle file upload to Firebase Storage if there is an attachment
    let fileURL = '';
    if (newTicket.attachment) {
      const storageRef = ref(storage, `attachments/${newTicket.attachment.name}`);
      const uploadTask = uploadBytesResumable(storageRef, newTicket.attachment);
      await uploadTask;

      fileURL = await getDownloadURL(uploadTask.snapshot.ref); // Get the file URL after upload
    }

    try {
      // Create the ticket in Firestore
      await addDoc(collection(db, 'tickets'), {
        title: newTicket.title,
        description: newTicket.description,
        priority: newTicket.priority,
        category: newTicket.category,
        status: newTicket.status,
        contactEmail: newTicket.contactEmail,
        phone: newTicket.phone,
        dueDate: newTicket.dueDate,
        attachment: fileURL, // Store the file URL if a file is uploaded
        comments: newTicket.comments,
        termsAccepted: newTicket.termsAccepted,
        createdBy: user.email,
        createdAt: new Date(),
      });

      // Reset the form and close the modal
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

  const handleDeleteTicket = async (ticketId, attachmentUrl) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        // Delete the ticket from Firestore
        await deleteDoc(doc(db, 'tickets', ticketId));

        // Delete the attachment from Firebase Storage if it exists
        if (attachmentUrl) {
          const attachmentRef = ref(storage, attachmentUrl);
          await deleteObject(attachmentRef);
        }

        alert('Ticket deleted successfully.');
      } catch (error) {
        console.error('Error deleting ticket:', error);
        alert('Error deleting ticket, please try again.');
      }
    }
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleCloseViewModal = () => {
    setSelectedTicket(null);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setOpenModal(true)}
              className="w-full text-left p-2 hover:bg-gray-700 rounded"
            >
              Tickets Page
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full text-left p-2 hover:bg-gray-700 rounded"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Customer Dashboard</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setOpenModal(true)}
        >
          Create New Ticket
        </button>

        <div className="mt-6">
          {tickets.length === 0 ? (
            <p className="text-gray-600">No tickets found. Create your first ticket!</p>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket.id} className="border border-gray-300 p-4 rounded-lg mb-4">
                <h2 className="text-xl font-semibold">{ticket.title}</h2>
                <p className="text-gray-700">{ticket.description}</p>
                <p className="text-gray-600">Priority: {ticket.priority}</p>
                <p className="text-gray-600">Status: {ticket.status}</p>
                <p className="text-gray-600">Created At: {new Date(ticket.createdAt.seconds * 1000).toLocaleString()}</p>
                {ticket.attachment && (
                  <a
                    href={ticket.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Attachment
                  </a>
                )}
                <div className="mt-4 flex space-x-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    onClick={() => handleViewTicket(ticket)}
                  >
                    View
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDeleteTicket(ticket.id, ticket.attachment)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal for creating new tickets */}
        {openModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Create a New Ticket</h2>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  name="title"
                  value={newTicket.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <textarea
                  placeholder="Description"
                  name="description"
                  value={newTicket.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows={4}
                  required
                />
                <select
                  name="priority"
                  value={newTicket.priority}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <input
                  type="text"
                  placeholder="Category"
                  name="category"
                  value={newTicket.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                  type="email"
                  placeholder="Contact Email"
                  name="contactEmail"
                  value={newTicket.contactEmail}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  name="phone"
                  value={newTicket.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="date"
                  placeholder="Due Date"
                  name="dueDate"
                  value={newTicket.dueDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <select
                  name="status"
                  value={newTicket.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <input type="file" onChange={handleFileUpload} className="w-full p-2 border border-gray-300 rounded" />
                <textarea
                  placeholder="Comments"
                  name="comments"
                  value={newTicket.comments}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows={2}
                />
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newTicket.termsAccepted}
                    onChange={() => setNewTicket({ ...newTicket, termsAccepted: !newTicket.termsAccepted })}
                    className="form-checkbox"
                  />
                  <span>I accept the terms and conditions</span>
                </label>
                <button
                  type="button"
                  onClick={handleCreateTicket}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Submit Ticket
                </button>
              </form>
              <button
                onClick={() => setOpenModal(false)}
                className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Modal for viewing ticket details */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Ticket Details</h2>
              <p><strong>Title:</strong> {selectedTicket.title}</p>
              <p><strong>Description:</strong> {selectedTicket.description}</p>
              <p><strong>Priority:</strong> {selectedTicket.priority}</p>
              <p><strong>Status:</strong> {selectedTicket.status}</p>
              <p><strong>Category:</strong> {selectedTicket.category}</p>
              <p><strong>Contact Email:</strong> {selectedTicket.contactEmail}</p>
              <p><strong>Phone:</strong> {selectedTicket.phone}</p>
              <p><strong>Due Date:</strong> {selectedTicket.dueDate}</p>
              <p><strong>Created At:</strong> {new Date(selectedTicket.createdAt.seconds * 1000).toLocaleString()}</p>
              {selectedTicket.attachment && (
                <a
                  href={selectedTicket.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View Attachment
                </a>
              )}
              <p><strong>Comments:</strong> {selectedTicket.comments}</p>
              <button
                onClick={handleCloseViewModal}
                className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;