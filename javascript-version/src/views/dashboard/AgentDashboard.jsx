// src/AgentDashboard.js
import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

const AgentDashboard = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const querySnapshot = await getDocs(collection(db, 'tickets'));
      const ticketList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTickets(ticketList);
    };

    fetchTickets();
  }, []);

  const handleAssignTicket = async (ticketId, agentId) => {
    const ticketRef = doc(db, 'tickets', ticketId);
    await updateDoc(ticketRef, { assignedTo: agentId });
    setTickets(tickets.map(ticket => ticket.id === ticketId ? { ...ticket, assignedTo: agentId } : ticket)); // Update UI
  };

  const handleUpdateStatus = async (ticketId, newStatus) => {
    const ticketRef = doc(db, 'tickets', ticketId);
    await updateDoc(ticketRef, { status: newStatus });
    setTickets(tickets.map(ticket => ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket)); // Update UI
  };

  return (
    <div>
      <h2>Support Agent Dashboard</h2>
      <ul>
        {tickets.map(ticket => (
          <li key={ticket.id}>
            <h3>{ticket.title}</h3>
            <p>{ticket.description}</p>
            <button onClick={() => handleAssignTicket(ticket.id, 'agent-123')}>Assign</button>
            <button onClick={() => handleUpdateStatus(ticket.id, 'Resolved')}>Mark as Resolved</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AgentDashboard;
