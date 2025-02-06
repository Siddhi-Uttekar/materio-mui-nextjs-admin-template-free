// External Libraries
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Firebase Libraries
import { auth, db } from '../../../firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';

// Other internal imports (if any)...


const AgentDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [updateFields, setUpdateFields] = useState({ status: '', assignedTo: '' });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const ticketsRef = collection(db, 'tickets');
    const unsubscribe = onSnapshot(ticketsRef, (snapshot) => {
      const ticketsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTickets(ticketsData);
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateTicket = async () => {
    if (!selectedTicket) return;
    try {
      await updateDoc(doc(db, 'tickets', selectedTicket.id), {
        status: updateFields.status || selectedTicket.status,
        assignedTo: updateFields.assignedTo || selectedTicket.assignedTo,
      });
      setSelectedTicket(null);
      alert('Ticket updated successfully');
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-6">Agent Dashboard</h1>
        <ul className="space-y-2">
          <li>
            <button className="w-full text-left p-2 hover:bg-gray-700 rounded">Tickets Page</button>
          </li>
          <li>
            <button onClick={handleLogout} className="w-full text-left p-2 hover:bg-gray-700 rounded">Logout</button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Support Agent Dashboard</h1>
        <div className="mt-6">
          {tickets.length === 0 ? (
            <p className="text-gray-600">No tickets available.</p>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket.id} className="border border-gray-300 p-4 rounded-lg mb-4">
                <h2 className="text-xl font-semibold">{ticket.title}</h2>
                <p className="text-gray-700">{ticket.description}</p>
                <p className="text-gray-600">Priority: {ticket.priority}</p>
                <p className="text-gray-600">Status: {ticket.status}</p>
                <p className="text-gray-600">Created By: {ticket.createdBy}</p>
                <p className="text-gray-600">Assigned To: {ticket.assignedTo || 'Unassigned'}</p>
                <div className="mt-4 flex space-x-2">
                  <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600" onClick={() => setSelectedTicket(ticket)}>Edit</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal for updating tickets */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
              <h2 className="text-2xl font-bold mb-4">Update Ticket</h2>
              <p><strong>Title:</strong> {selectedTicket.title}</p>
              <p><strong>Description:</strong> {selectedTicket.description}</p>
              <label className="block mt-4">
                <span>Status</span>
                <select
                  className="w-full p-2 border border-gray-300 rounded"
                  value={updateFields.status}
                  onChange={(e) => setUpdateFields({ ...updateFields, status: e.target.value })}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </label>
              <label className="block mt-4">
                <span>Assign To</span>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter email"
                  value={updateFields.assignedTo}
                  onChange={(e) => setUpdateFields({ ...updateFields, assignedTo: e.target.value })}
                />
              </label>
              <button onClick={handleUpdateTicket} className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4">Save Changes</button>
              <button onClick={() => setSelectedTicket(null)} className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;
